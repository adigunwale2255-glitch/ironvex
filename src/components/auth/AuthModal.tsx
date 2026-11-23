import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { FitnessGoal } from '../../types';
import { ironAudio } from '../../lib/ironAudio';
import { 
  X, Lock, Mail, User, Phone, Calendar, Dumbbell, 
  ArrowRight, ShieldCheck, CheckCircle2, Sparkles, KeyRound 
} from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'register' | 'forgot_password';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const { login, register, quickSwitchRole } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1996-06-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>('male');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('strength');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password flow
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetComplete, setResetComplete] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Valid corporate or personal email is required.';
    }
    if (mode !== 'forgot_password' && (!password || password.length < 6)) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (mode === 'register') {
      if (!fullName.trim() || fullName.trim().length < 3) {
        errs.fullName = 'Full legal name is required.';
      }
      if (!phone.trim() || phone.length < 8) {
        errs.phone = 'Valid phone number is required.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else if (res.error) {
      setErrors({ form: res.error });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const res = await register({
      email: email.trim().toLowerCase(),
      role: 'member',
      fullName: fullName.trim(),
      phone: phone.trim(),
      dateOfBirth,
      gender,
      fitnessGoal
    }, password);

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else if (res.error) {
      setErrors({ form: res.error });
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: 'Enter your account email to receive the reset PIN.' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setResetSent(true);
      ironAudio.playSuccess();
    }, 600);
  };

  const handleResetConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode !== '8821' && resetCode.length < 4) {
      setErrors({ resetCode: 'Enter the 4-digit token sent to your email (Demo Code: 8821)' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrors({ newPassword: 'New password must be at least 6 characters.' });
      return;
    }
    setResetComplete(true);
    ironAudio.playSuccess();
    setTimeout(() => {
      setMode('login');
      setResetSent(false);
      setResetComplete(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-iron-900 border border-gold-500/40 rounded-2xl shadow-2xl shadow-gold-500/10 overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-iron-950 px-6 py-4 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-gold-500/40 flex items-center justify-center p-1 shadow-gold-glow">
              <img src="/ironvex-logo.png" alt="IRONVEX" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-white tracking-wide">
                IRON<span className="text-gold-400">VEX</span> ATHLETIC ACCESS
              </h3>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                {mode === 'login' ? 'Member & Admin Login' : mode === 'register' ? 'New Member Enrollment' : 'Security Verification'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              ironAudio.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-iron-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {errors.form && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs text-rose-300">
              {errors.form}
            </div>
          )}

          {/* Quick Demo Switcher */}
          <div className="bg-iron-950 p-3 rounded-xl border border-iron-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-gray-400 block tracking-wider">
              1-Click Fast Preview Sign-In:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('member');
                  if (onSuccess) onSuccess();
                  onClose();
                }}
                className="py-1.5 px-2 bg-iron-900 hover:bg-gold-500/20 text-gold-300 hover:text-gold-200 border border-gold-500/30 rounded text-[11px] font-mono font-bold transition-all text-center"
              >
                Sign in as Member
              </button>
              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('admin');
                  if (onSuccess) onSuccess();
                  onClose();
                }}
                className="py-1.5 px-2 bg-iron-900 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 rounded text-[11px] font-mono font-bold transition-all text-center"
              >
                Sign in as Admin
              </button>
            </div>
          </div>

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@ironvex.com"
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-mono uppercase text-gray-300">
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      ironAudio.playClick();
                      setMode('forgot_password');
                    }}
                    className="text-[10px] font-mono text-gold-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
                {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-400">Not an IRONVEX member yet? </span>
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    setMode('register');
                  }}
                  className="text-xs font-mono font-bold text-gold-400 hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gold-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Julian Sterling"
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-rose-400 mt-0.5">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@athletics.io"
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg px-2.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                  {errors.email && <p className="text-[10px] text-rose-400 mt-0.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-000-0000"
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg px-2.5 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                  {errors.phone && <p className="text-[10px] text-rose-400 mt-0.5">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg px-2 py-2 text-xs text-white focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg px-2 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer Not To Say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1">Primary Fitness Goal *</label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as any)}
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                >
                  <option value="strength">Strength & Powerlifting (Raw Strength)</option>
                  <option value="muscle_building">Muscle Building & Hypertrophy</option>
                  <option value="weight_loss">Weight Loss & Body Fat Shred</option>
                  <option value="endurance">Cardiovascular Endurance & Stamina</option>
                  <option value="general_fitness">General Health & Longevity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                />
                {errors.password && <p className="text-[10px] text-rose-400 mt-0.5">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration'}</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-gray-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    setMode('login');
                  }}
                  className="text-xs font-mono font-bold text-gold-400 hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <div className="space-y-4">
              {!resetSent ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Enter the email registered with your IRONVEX membership. We will transmit a 4-digit security code to reset your password.
                  </p>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@ironvex.com"
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow"
                  >
                    {isSubmitting ? 'Transmitting Code...' : 'Send Recovery Token'}
                  </button>
                </form>
              ) : !resetComplete ? (
                <form onSubmit={handleResetConfirm} className="space-y-3.5">
                  <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-lg text-xs text-gold-300">
                    A recovery token was dispatched. (Use Demo PIN: <strong className="font-mono text-white">8821</strong>)
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      4-Digit Token *
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="8821"
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white font-mono tracking-widest text-center"
                    />
                    {errors.resetCode && <p className="text-[10px] text-rose-400 mt-0.5">{errors.resetCode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 characters)"
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white"
                    />
                    {errors.newPassword && <p className="text-[10px] text-rose-400 mt-0.5">{errors.newPassword}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase rounded-xl shadow-gold-glow"
                  >
                    Confirm & Update Password
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-heading font-bold text-white text-sm">PASSWORD SUCCESSFULLY RESET</h4>
                  <p className="text-xs text-gray-400">Redirecting to sign-in...</p>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    setMode('login');
                  }}
                  className="text-xs font-mono text-gray-400 hover:text-white"
                >
                  ← Return to Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
