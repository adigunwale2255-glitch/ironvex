import React, { useState } from 'react';
import { MembershipPlan, MemberRecord } from '../types';
import { ironAudio } from '../lib/ironAudio';
import { saveMember } from '../lib/storage';
import confetti from 'canvas-confetti';
import { 
  X, Check, Sparkles, ShieldCheck, Calendar, User, Mail, Phone, 
  ArrowRight, Download, CreditCard, Award, CheckCircle2 
} from 'lucide-react';

interface MembershipModalProps {
  plan: MembershipPlan;
  billingCycle: 'monthly' | 'annual';
  onClose: () => void;
  onSuccess: (member: MemberRecord) => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  plan,
  billingCycle: initialBilling,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(initialBilling);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdMember, setCreatedMember] = useState<MemberRecord | null>(null);

  const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const annualTotal = plan.priceAnnual * 12;

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal name';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Valid email address is required';
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Valid phone number is required';
    }
    if (!emergencyContact.trim()) {
      errs.emergencyContact = 'Emergency contact person & phone required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextFromStep1 = () => {
    ironAudio.playClick();
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      ironAudio.playClick();
      setStep(3);
    } else {
      ironAudio.playClank();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    ironAudio.playClank();

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const memberNum = `IV-MEM-${randomSuffix}`;

    const newMember: MemberRecord = {
      id: `mem-${Date.now()}`,
      role: 'member',
      fitnessGoal: 'strength',
      memberNumber: memberNum,
      qrCode: `${memberNum}-GOLD`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      emergencyContact: emergencyContact.trim(),
      planId: plan.id,
      planName: plan.name,
      billingCycle,
      amountPaid: billingCycle === 'annual' ? annualTotal : price,
      startDate,
      status: 'Active',
      completedWorkoutsCount: 0,
      joinedAt: new Date().toISOString()
    };

    setTimeout(async () => {
      await saveMember(newMember);
      setIsSubmitting(false);
      setCreatedMember(newMember);
      setStep(4);
      ironAudio.playSuccess();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffd700', '#ffffff', '#e5c058']
      });

      onSuccess(newMember);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-iron-900 border border-gold-500/40 rounded-2xl shadow-2xl shadow-gold-500/10 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-iron-950 px-6 py-4 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse"></span>
            <div>
              <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                IRONVEX VIP MEMBERSHIP REGISTRATION
              </h3>
              <p className="text-xs text-gold-400/80 uppercase tracking-widest font-mono">
                {plan.name} Package Tier
              </p>
            </div>
          </div>
          <button 
            onClick={() => { ironAudio.playClick(); onClose(); }}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-iron-800 transition-colors"
            aria-label="Close registration dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="bg-iron-900/90 px-6 py-3 border-b border-gold-500/10">
          <div className="flex items-center justify-between text-xs font-mono">
            {[
              { num: 1, label: 'Plan Review' },
              { num: 2, label: 'Personal Info' },
              { num: 3, label: 'Start Date & Pay' },
              { num: 4, label: 'Digital VIP Pass' }
            ].map((s) => (
              <div key={s.num} className="flex items-center space-x-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-gradient-gold text-black shadow-gold-glow'
                    : step > s.num
                    ? 'bg-gold-500/30 text-gold-400 border border-gold-500/50'
                    : 'bg-iron-800 text-gray-400'
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </span>
                <span className={`hidden sm:inline ${step >= s.num ? 'text-white' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Contents */}
        <div className="p-6 md:p-8 space-y-6">
          {/* STEP 1: PLAN REVIEW */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-iron-950 p-6 rounded-xl border border-gold-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-28 h-28 bg-gold-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-gold-400 font-semibold px-2 py-0.5 bg-gold-500/10 rounded border border-gold-500/20">
                      Tier Selected
                    </span>
                    <h4 className="text-2xl font-heading font-black text-white mt-1">{plan.name}</h4>
                    <p className="text-sm text-gray-400 mt-0.5">{plan.tagline}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-heading font-black text-gold-400">
                      ${price}
                      <span className="text-xs text-gray-400 font-sans font-normal"> / month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <span className="text-xs text-emerald-400 font-mono">Billed annually (${annualTotal}/yr)</span>
                    )}
                  </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="mt-6 pt-5 border-t border-iron-800 flex items-center justify-between">
                  <span className="text-sm text-gray-300">Choose Billing Term:</span>
                  <div className="flex bg-iron-900 p-1 rounded-lg border border-iron-700">
                    <button
                      type="button"
                      onClick={() => { ironAudio.playClick(); setBillingCycle('monthly'); }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        billingCycle === 'monthly'
                          ? 'bg-gold-500 text-black font-bold shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => { ironAudio.playClick(); setBillingCycle('annual'); }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1 ${
                        billingCycle === 'annual'
                          ? 'bg-gold-500 text-black font-bold shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>Annual</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/30">
                        SAVE 20%
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Plan Benefits Checklist */}
              <div>
                <h5 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-3">
                  Included Privileges & Amenities:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-gray-300 bg-iron-950/60 p-2.5 rounded-lg border border-iron-800">
                      <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-iron-800">
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="px-6 py-3 rounded-lg bg-gradient-gold text-black font-heading font-black text-sm tracking-wider uppercase flex items-center space-x-2 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Continue to Personal Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL INFORMATION */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gold-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alexander Vance"
                      className="w-full bg-iron-950 border border-iron-700 focus:border-gold-400 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.fullName && <p className="text-rose-400 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@ironvex.com"
                      className="w-full bg-iron-950 border border-iron-700 focus:border-gold-400 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gold-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-iron-950 border border-iron-700 focus:border-gold-400 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1">
                    Emergency Contact Name & Phone *
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-gold-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Name + (+1 555-999-9999)"
                      className="w-full bg-iron-950 border border-iron-700 focus:border-gold-400 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.emergencyContact && <p className="text-rose-400 text-xs mt-1">{errors.emergencyContact}</p>}
                </div>
              </div>

              <div className="bg-iron-950/80 p-4 rounded-lg border border-iron-800 text-xs text-gray-400 space-y-1">
                <p className="flex items-center text-gold-400 font-semibold space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>IRONVEX Privacy & Health Guarantee</span>
                </p>
                <p>Your biometric and contact records are encrypted under 256-bit zero-knowledge security standards. We never sell or share your athletic records.</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-iron-800">
                <button
                  type="button"
                  onClick={() => { ironAudio.playClick(); setStep(1); }}
                  className="px-4 py-2.5 rounded-lg text-gray-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  ← Back to Plan
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="px-6 py-3 rounded-lg bg-gradient-gold text-black font-heading font-black text-sm tracking-wider uppercase flex items-center space-x-2 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Select Start Date</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: START DATE & PAYMENT AUTHORIZATION */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                    Preferred Membership Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gold-400 absolute left-3 top-3.5" />
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-iron-950 border border-iron-700 focus:border-gold-400 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Your keycard and locker access will activate at 05:00 AM on the selected date.
                  </p>
                </div>

                <div className="bg-iron-950 p-4 rounded-xl border border-iron-800 space-y-3">
                  <h6 className="text-xs font-mono uppercase text-gold-400 tracking-wider">
                    Registration Summary
                  </h6>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-300">
                      <span>Package:</span>
                      <span className="font-semibold text-white">{plan.name}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Member:</span>
                      <span className="font-semibold text-white">{fullName}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Term:</span>
                      <span className="capitalize text-white">{billingCycle}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Initiation Fee:</span>
                      <span className="text-emerald-400 font-mono">$0 (Waived VIP Promo)</span>
                    </div>
                    <div className="pt-2 border-t border-iron-800 flex justify-between text-sm font-bold">
                      <span className="text-white">Total Due Today:</span>
                      <span className="text-gold-400 font-heading text-lg">
                        ${billingCycle === 'annual' ? annualTotal : price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment simulation security notice */}
              <div className="bg-gold-500/10 border border-gold-500/30 p-4 rounded-lg flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-300 space-y-1">
                  <p className="font-semibold text-gold-400">Secure Direct Club Activation</p>
                  <p>
                    By clicking Confirm Registration, your digital VIP membership pass is immediately minted in the IRONVEX secure registry with 100% money-back 30-day trial protection.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-iron-800">
                <button
                  type="button"
                  onClick={() => { ironAudio.playClick(); setStep(2); }}
                  className="px-4 py-2.5 rounded-lg text-gray-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-8 py-3.5 rounded-lg bg-gradient-gold text-black font-heading font-black text-sm tracking-wider uppercase flex items-center space-x-2 shadow-gold-glow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Minting Digital Pass...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Confirm & Activate VIP Pass</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DIGITAL VIP PASS CONFIRMATION */}
          {step === 4 && createdMember && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-500/20 text-gold-400 border border-gold-400/40 mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-heading font-black text-white">
                  WELCOME TO IRONVEX, {createdMember.fullName.toUpperCase()}
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  Your VIP membership credential is now active in the IRONVEX central registry.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-iron-900 via-iron-950 to-black p-6 rounded-2xl border-2 border-gold-500/50 shadow-2xl shadow-gold-500/20 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-black tracking-widest text-lg text-white">IRONVEX</span>
                      <span className="text-[10px] font-mono text-gold-400 px-1.5 py-0.5 rounded border border-gold-400/30">
                        {createdMember.planName.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                      Club Access Card
                    </span>
                  </div>
                  <Award className="w-8 h-8 text-gold-400" />
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Member Name</span>
                    <span className="font-heading font-bold text-white text-base tracking-wide">{createdMember.fullName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Member ID</span>
                      <span className="font-mono text-gold-400 text-sm font-bold">{createdMember.memberNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-mono">Activation Date</span>
                      <span className="font-mono text-gray-300 text-sm">{createdMember.startDate}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="bg-black/80 p-3 rounded-lg border border-gold-500/20 text-center">
                  <div className="flex justify-center items-center space-x-1.5 h-10 overflow-hidden opacity-80">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-gold-400" 
                        style={{ 
                          width: `${(i % 3) + 1}px`, 
                          height: `${28 + (i % 4) * 3}px` 
                        }} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-gold-400/80 tracking-widest mt-1 block">
                    {createdMember.qrCode}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    window.print();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-iron-800 hover:bg-iron-700 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-iron-700 transition-colors"
                >
                  <Download className="w-4 h-4 text-gold-400" />
                  <span>Print VIP Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playSuccess();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-lg bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 transition-all"
                >
                  Enter Member Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
