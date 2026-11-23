import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { 
  LayoutDashboard, User, Award, Dumbbell, Scale, Calendar, 
  CreditCard, Bell, Settings, LogOut, Sparkles, Volume2, 
  VolumeX, CheckCircle2, Clock, QrCode, ArrowRight, ShieldCheck,
  TrendingUp, Flame, Plus, ChevronRight, X, ExternalLink
} from 'lucide-react';
import { ironAudio } from '../../lib/ironAudio';
import { 
  getStoredSubscriptions, getStoredPayments, getStoredBookings, 
  getStoredPlans, getStoredNotifications, markNotificationRead, 
  markAllNotificationsRead, getGymSettings 
} from '../../lib/storage';
import { MembershipPlan, SubscriptionRecord, PaymentTransaction } from '../../types';

// Subcomponents
import { FitnessTracker } from '../tracker/FitnessTracker';
import { WorkoutPlanner } from '../WorkoutPlanner';
import { TrainerBooking } from '../TrainerBooking';
import { PaymentModal } from '../payments/PaymentModal';

interface MemberPortalProps {
  onSwitchToAdmin?: () => void;
  onSwitchToWebsite?: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  onSwitchToAdmin,
  onSwitchToWebsite
}) => {
  const { user, logout, updateCurrentUserProfile } = useAuth();
  const settings = getGymSettings();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'membership' | 'workouts' | 'tracker' | 
    'trainers' | 'payments' | 'notifications' | 'settings'
  >('overview');

  const [isMuted, setIsMuted] = useState(ironAudio.isMuted);

  // Data states
  const subscriptions = getStoredSubscriptions().filter(s => s.memberId === user?.id);
  const payments = getStoredPayments().filter(p => p.memberId === user?.id);
  const bookings = getStoredBookings().filter(b => b.memberId === user?.id);
  const notifications = getStoredNotifications(user?.id);
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const plans = getStoredPlans();

  // Selected plan for checkout modal
  const [checkoutPlan, setCheckoutPlan] = useState<MembershipPlan | null>(null);
  const [checkoutCycle, setCheckoutCycle] = useState<'monthly' | 'annual'>('monthly');

  // Profile Edit State
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editGoal, setEditGoal] = useState(user?.fitnessGoal || 'strength');
  const [editEmergency, setEditEmergency] = useState(user?.emergencyContact || '');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Settings State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passChangedToast, setPassChangedToast] = useState(false);

  const activeSub = subscriptions.find(s => s.status === 'active') || subscriptions[0];

  const handleTabChange = (tab: any) => {
    ironAudio.playClick(900);
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const muted = ironAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      fullName: editFullName,
      phone: editPhone,
      fitnessGoal: editGoal as any,
      emergencyContact: editEmergency
    });
    ironAudio.playSuccess();
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) return;
    ironAudio.playSuccess();
    setPassChangedToast(true);
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setPassChangedToast(false), 3000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'membership', label: 'My Membership', icon: Award, badge: activeSub ? activeSub.planName : 'Tiers' },
    { id: 'workouts', label: 'Workout Planner', icon: Dumbbell },
    { id: 'tracker', label: 'Fitness Tracker', icon: Scale },
    { id: 'trainers', label: 'Trainer Booking', icon: Calendar, badge: bookings.length > 0 ? `${bookings.length}` : undefined },
    { id: 'payments', label: 'Billing & Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-iron-950 text-white flex flex-col md:flex-row font-sans selection:bg-gold-500 selection:text-black">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-iron-950 border-r border-gold-500/20 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-iron-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-black border border-gold-500/40 p-1 shadow-gold-glow flex items-center justify-center">
                <img src="/ironvex-logo.png" alt="IRONVEX" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-heading font-black text-lg tracking-wider text-white">
                    IRON<span className="text-gold-400">VEX</span>
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                  MEMBER PORTAL
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                !isMuted ? 'border-gold-500/40 bg-gold-500/10 text-gold-400' : 'border-iron-800 text-gray-500'
              }`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Member Card in Sidebar */}
          <div className="p-3 mx-3 my-3 bg-gradient-to-r from-iron-900 to-iron-950 rounded-xl border border-gold-500/20 shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center font-bold font-mono text-gold-400 text-xs shrink-0">
                {user?.fullName?.charAt(0) || 'M'}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-heading font-bold text-white block truncate">
                  {user?.fullName || 'Active Member'}
                </span>
                <span className="text-[10px] text-gold-400 font-mono block truncate">
                  {activeSub ? `${activeSub.planName} Tier` : 'Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-gradient-gold text-black font-black shadow-gold-glow'
                      : 'text-gray-400 hover:bg-iron-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive 
                        ? 'bg-black/30 text-black' 
                        : 'bg-iron-900 text-gold-400 border border-iron-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="p-3 border-t border-iron-900 space-y-2">
          {onSwitchToAdmin && (
            <button
              onClick={() => {
                ironAudio.playClick(1000);
                onSwitchToAdmin();
              }}
              className="w-full py-2 px-3 rounded-xl bg-iron-900 hover:bg-iron-800 border border-iron-800 hover:border-gold-500/40 text-gray-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors"
            >
              <span>Switch to Admin HQ</span>
              <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
            </button>
          )}

          {onSwitchToWebsite && (
            <button
              onClick={() => {
                ironAudio.playClick(900);
                onSwitchToWebsite();
              }}
              className="w-full py-2 px-3 rounded-xl bg-iron-950 hover:bg-iron-900 border border-iron-800 text-gray-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}

          <button
            onClick={() => {
              ironAudio.playClick(600);
              logout();
            }}
            className="w-full py-2 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-400 hover:text-rose-300 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 bg-iron-950/80 backdrop-blur-md border-b border-gold-500/20 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-3">
            <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="text-xs font-mono text-gold-400 hidden sm:inline">
              MEMBER OS
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications Shortcut */}
            <button
              onClick={() => handleTabChange('notifications')}
              className="relative p-2 rounded-xl bg-iron-900 border border-iron-800 text-gray-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-gold-400" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Quick Upgrade CTA */}
            <button
              onClick={() => {
                ironAudio.playClank();
                setCheckoutPlan(plans.find(p => p.id === 'plan-elite') || plans[0]);
              }}
              className="px-4 py-1.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-lg shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade Tier</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW (DASHBOARD) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
              
              {/* Welcome Banner */}
              <div className="relative bg-gradient-to-r from-iron-900 via-iron-950 to-black p-6 sm:p-8 rounded-2xl border border-gold-500/30 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{settings.slogan}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-heading font-black text-white">
                      WELCOME BACK, {user?.fullName?.toUpperCase() || 'ATHLETE'}
                    </h1>
                    <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
                      Your biological recovery is high (94%). All Olympic platforms and infrared sauna recovery suites are ready.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleTabChange('membership')}
                      className="px-4 py-2.5 bg-iron-900 hover:bg-iron-800 border border-gold-500/40 text-gold-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2"
                    >
                      <QrCode className="w-4 h-4 text-gold-400" />
                      <span>My Pass & Tier</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('workouts')}
                      className="px-5 py-2.5 bg-gradient-gold text-black rounded-xl text-xs font-heading font-black uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
                    >
                      <Flame className="w-4 h-4 text-black" />
                      <span>Start Workout</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Membership Status</span>
                    <Award className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-2xl font-heading font-black text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{activeSub ? 'ACTIVE' : 'NO PLAN'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 block">
                    {activeSub ? `Renews on ${activeSub.expiresAt}` : 'Select a package to activate'}
                  </span>
                </div>

                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Weekly Streak</span>
                    <Flame className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-heading font-black text-white">5 Days</div>
                  <span className="text-[11px] font-mono text-emerald-400 block">Optimal training frequency</span>
                </div>

                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Upcoming Booking</span>
                    <Calendar className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-xl font-heading font-black text-gold-400 truncate">
                    {bookings[0]?.trainerName?.split(' ')[0] || 'None Scheduled'}
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 block">
                    {bookings[0]?.date ? `${bookings[0].date} at ${bookings[0].timeSlot}` : 'Tap to book 1-on-1'}
                  </span>
                </div>

                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Active Package</span>
                    <CreditCard className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-2xl font-heading font-black text-white truncate">
                    {activeSub ? activeSub.planName : 'Basic'}
                  </div>
                  <span className="text-[11px] font-mono text-gold-400 block">
                    {activeSub ? `$${activeSub.amount}/mo (${activeSub.billingCycle})` : 'Free Tier'}
                  </span>
                </div>

              </div>

              {/* Digital Pass & Upcoming Bookings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Digital Keycard Card */}
                <div className="lg:col-span-7 bg-gradient-to-r from-iron-900 via-iron-950 to-black p-6 rounded-2xl border-2 border-gold-500/50 shadow-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold block">
                        DIGITAL BIOMETRIC KEYCARD
                      </span>
                      <h4 className="font-heading font-black text-xl text-white mt-0.5">
                        IRONVEX VIP ACCESS PASS
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        ironAudio.playClick();
                        window.print();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-iron-800 hover:bg-iron-700 text-xs font-mono text-gold-400 border border-gold-500/30"
                    >
                      Print Pass
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs font-mono pt-2 border-t border-iron-800">
                    <div>
                      <span className="text-gray-400 block text-[10px]">ATHLETE NAME</span>
                      <strong className="text-white text-sm">{user?.fullName || 'Alexander Wright'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">CURRENT TIER</span>
                      <strong className="text-gold-400 text-sm">{activeSub?.planName || 'Pro Athlete'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">VALID UNTIL</span>
                      <strong className="text-emerald-400 text-sm">{activeSub?.expiresAt || '2026-12-01'}</strong>
                    </div>
                  </div>

                  {/* Simulated Barcode */}
                  <div className="bg-black/80 p-3 rounded-lg border border-gold-500/20 text-center">
                    <div className="flex justify-center items-center space-x-1.5 h-10 overflow-hidden opacity-85">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-gold-400"
                          style={{ width: `${(i % 3) + 1.2}px`, height: `${25 + (i % 4) * 3}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-gold-400 tracking-widest block mt-1">
                      IV-PASS-{(user?.id || '9821').toUpperCase()}-SECURE
                    </span>
                  </div>
                </div>

                {/* Upcoming Trainer Appointments */}
                <div className="lg:col-span-5 bg-iron-950 p-6 rounded-2xl border border-iron-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-iron-800 pb-3">
                    <h4 className="font-heading font-bold text-sm text-white flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gold-400" />
                      <span>COACH APPOINTMENTS</span>
                    </h4>
                    <button
                      onClick={() => handleTabChange('trainers')}
                      className="text-xs font-mono text-gold-400 hover:text-gold-300"
                    >
                      + Book Session
                    </button>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-6 space-y-2">
                      <Calendar className="w-8 h-8 text-gray-600 mx-auto" />
                      <p className="text-xs text-gray-400">No appointments scheduled.</p>
                      <button
                        onClick={() => handleTabChange('trainers')}
                        className="text-xs font-mono text-gold-400 underline font-bold"
                      >
                        Browse coaches
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 2).map((b) => (
                        <div key={b.id} className="p-3 bg-iron-900/60 rounded-xl border border-iron-800 space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <strong className="text-white font-heading">{b.trainerName}</strong>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {b.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-[11px] truncate">{b.serviceType}</p>
                          <div className="flex justify-between items-center pt-1 text-[11px] font-mono text-gold-400">
                            <span>{b.date} • {b.timeSlot}</span>
                            <span>Ref: {b.bookingCode}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MY PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto bg-iron-950 p-6 sm:p-8 rounded-2xl border border-gold-500/30 space-y-6 animate-fadeIn shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase text-gold-400 font-bold tracking-widest">
                  ACCOUNT CONFIGURATION
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-1">
                  ATHLETE PROFILE & BIOMETRIC DETAILS
                </h3>
                <p className="text-xs text-gray-400">
                  Manage your personal credentials, contact points, and primary training goals.
                </p>
              </div>

              {profileSavedToast && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your profile changes have been saved to the central registry.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-mono uppercase mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white font-semibold focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-mono uppercase mb-1">Registered Email (Read-Only)</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-iron-900/50 border border-iron-800 rounded-lg p-2.5 text-gray-400 font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-mono uppercase mb-1">Primary Mobile Phone</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white font-mono focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-mono uppercase mb-1">Emergency Contact (Name + Phone)</label>
                    <input
                      type="text"
                      value={editEmergency}
                      onChange={(e) => setEditEmergency(e.target.value)}
                      placeholder="Sarah Wright (+1 555-891-2345)"
                      className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Primary Fitness Goal</label>
                  <select
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value as any)}
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white focus:border-gold-400 focus:outline-none"
                  >
                    <option value="strength">Strength & Powerlifting (Raw Strength)</option>
                    <option value="muscle_building">Muscle Building & Hypertrophy</option>
                    <option value="weight_loss">Weight Loss & Body Fat Shred</option>
                    <option value="endurance">Cardiovascular Endurance & Stamina</option>
                    <option value="general_fitness">General Health & Longevity</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-iron-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MY MEMBERSHIP & PLANS */}
          {activeTab === 'membership' && (
            <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
              <div>
                <span className="text-xs font-mono uppercase text-gold-400 font-bold tracking-widest">
                  SUBSCRIPTION & TIERS
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-1">
                  MANAGE MEMBERSHIP SUBSCRIPTION
                </h3>
                <p className="text-xs text-gray-400">
                  Compare plans, renew your active subscription, or upgrade tiers with Paystack or Flutterwave.
                </p>
              </div>

              {/* Current Active Subscription Banner */}
              <div className="bg-gradient-to-r from-iron-900 to-iron-950 p-6 rounded-2xl border border-gold-500/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase block">
                    CURRENTLY ACTIVE
                  </span>
                  <h4 className="text-2xl font-heading font-black text-white mt-0.5">
                    {activeSub ? `${activeSub.planName} Tier Membership` : 'No Active Membership'}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {activeSub 
                      ? `Valid until ${activeSub.expiresAt}. Billed ${activeSub.billingCycle} ($${activeSub.amount}/term).` 
                      : 'Enroll in an athletic tier below to activate your digital VIP keycard.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      ironAudio.playClank();
                      const currentPlan = plans.find(p => p.id === activeSub?.planId) || plans[1];
                      setCheckoutPlan(currentPlan);
                    }}
                    className="px-4 py-2.5 bg-iron-800 hover:bg-iron-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-iron-700"
                  >
                    Renew Term
                  </button>
                  <button
                    onClick={() => {
                      ironAudio.playClank();
                      const elitePlan = plans.find(p => p.id === 'plan-elite') || plans[2];
                      setCheckoutPlan(elitePlan);
                    }}
                    className="px-5 py-2.5 bg-gradient-gold text-black rounded-xl text-xs font-heading font-black uppercase tracking-wider shadow-gold-glow hover:brightness-110"
                  >
                    Upgrade Tier
                  </button>
                </div>
              </div>

              {/* Plan Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {plans.map((p) => {
                  const isCurrent = activeSub?.planId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                        isCurrent
                          ? 'bg-iron-900 border-2 border-gold-500 shadow-xl shadow-gold-500/10'
                          : 'bg-iron-950 border-iron-800 hover:border-gold-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-heading font-black text-white">{p.name}</h4>
                          {p.badge && (
                            <span className="text-[10px] font-heading font-black bg-gold-500 text-black px-2 py-0.5 rounded">
                              {p.badge}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <span className="text-3xl font-heading font-black text-white">${p.priceMonthly}</span>
                          <span className="text-xs text-gray-400 font-mono"> / month</span>
                          <p className="text-xs text-emerald-400 font-mono mt-0.5">${p.priceAnnual}/mo billed annually</p>
                        </div>

                        <p className="text-xs text-gray-400 mb-4">{p.tagline}</p>

                        <div className="space-y-2 border-t border-iron-800 pt-4 mb-6">
                          {p.features.map((f, i) => (
                            <div key={i} className="flex items-start space-x-2 text-xs text-gray-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          ironAudio.playClank();
                          setCheckoutPlan(p);
                        }}
                        className={`w-full py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all ${
                          isCurrent
                            ? 'bg-iron-800 text-gold-400 border border-gold-500/30 hover:bg-gold-500 hover:text-black'
                            : 'bg-gradient-gold text-black shadow-gold-glow hover:brightness-110'
                        }`}
                      >
                        {isCurrent ? 'Renew Current Plan' : `Select ${p.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: WORKOUT PLANNER */}
          {activeTab === 'workouts' && (
            <div className="animate-fadeIn">
              <WorkoutPlanner />
            </div>
          )}

          {/* TAB 5: FITNESS TRACKER */}
          {activeTab === 'tracker' && (
            <div className="animate-fadeIn">
              <FitnessTracker />
            </div>
          )}

          {/* TAB 6: TRAINER BOOKINGS */}
          {activeTab === 'trainers' && (
            <div className="animate-fadeIn">
              <TrainerBooking />
            </div>
          )}

          {/* TAB 7: PAYMENTS & BILLING */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-xs font-mono uppercase text-gold-400 font-bold tracking-widest">
                    FINANCIAL LEDGER
                  </span>
                  <h3 className="text-2xl font-heading font-black text-white mt-1">
                    TRANSACTION HISTORY & INVOICES
                  </h3>
                  <p className="text-xs text-gray-400">
                    Verified Paystack and Flutterwave subscription transactions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-iron-900 border border-iron-700 text-gray-300 hover:text-white rounded-lg text-xs font-mono uppercase"
                >
                  Print Statements
                </button>
              </div>

              {/* Transactions Table */}
              <div className="bg-iron-950 rounded-2xl border border-iron-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-iron-900 text-gray-400 border-b border-iron-800">
                    <tr>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Package</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Gateway</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-iron-800/60">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-500">
                          No transactions recorded on this account.
                        </td>
                      </tr>
                    ) : (
                      payments.map((tx) => (
                        <tr key={tx.id} className="hover:bg-iron-900/40">
                          <td className="p-3.5 text-gold-400 font-bold">{tx.reference}</td>
                          <td className="p-3.5 text-white font-sans">{tx.planName}</td>
                          <td className="p-3.5 text-emerald-400 font-bold">${tx.amount}.00 {tx.currency}</td>
                          <td className="p-3.5 uppercase text-gray-300 font-bold">{tx.gateway}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {tx.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3.5 text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono uppercase text-gold-400 font-bold tracking-widest">
                    SYSTEM DISPATCH
                  </span>
                  <h3 className="text-2xl font-heading font-black text-white mt-1">
                    IN-APP NOTIFICATION CENTER
                  </h3>
                </div>

                {unreadNotifsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      ironAudio.playClick();
                      markAllNotificationsRead(user?.id);
                    }}
                    className="text-xs font-mono text-gold-400 hover:underline"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="bg-iron-950 p-8 rounded-2xl border border-iron-800 text-center text-gray-500 text-xs">
                    No new notifications in your inbox.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        !n.isRead
                          ? 'bg-iron-900 border-gold-500/40 shadow-md'
                          : 'bg-iron-950 border-iron-800 text-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center space-x-2">
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                          <strong className="text-white font-heading text-sm">{n.title}</strong>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-iron-950 p-6 sm:p-8 rounded-2xl border border-iron-800 space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono uppercase text-gold-400 font-bold tracking-widest">
                  PREFERENCES & CREDENTIALS
                </span>
                <h3 className="text-2xl font-heading font-black text-white mt-1">
                  SECURITY & APPLICATION SETTINGS
                </h3>
              </div>

              {passChangedToast && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300">
                  Your security password has been updated.
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs border-b border-iron-800 pb-6">
                <h4 className="font-heading font-bold text-white text-sm">CHANGE PASSWORD</h4>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-gold text-black font-heading font-black text-xs uppercase rounded-lg shadow-gold-glow"
                >
                  Update Password
                </button>
              </form>

              {/* Notification Toggles */}
              <div className="space-y-3 text-xs">
                <h4 className="font-heading font-bold text-white text-sm">COMMUNICATION PREFERENCES</h4>
                <div className="flex items-center justify-between p-3 bg-iron-900 rounded-xl border border-iron-800">
                  <div>
                    <strong className="text-white block">Email Workout Reminders</strong>
                    <span className="text-gray-400 text-[11px]">Receive session notices 2 hours prior to scheduled lifts.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-gold-400 w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-3 bg-iron-900 rounded-xl border border-iron-800">
                  <div>
                    <strong className="text-white block">Coach Appointment SMS</strong>
                    <span className="text-gray-400 text-[11px]">Receive booking confirmations on your registered phone.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-gold-400 w-4 h-4" />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Payment Modal */}
      {checkoutPlan && (
        <PaymentModal
          plan={checkoutPlan}
          billingCycle={checkoutCycle}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={() => {
            setCheckoutPlan(null);
            setActiveTab('overview');
          }}
        />
      )}

    </div>
  );
};
