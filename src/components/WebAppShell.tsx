import React, { useState } from 'react';
import { 
  LayoutDashboard, Dumbbell, Scale, Calendar, Award, 
  ShieldAlert, MessageSquare, Camera, Volume2, VolumeX, 
  Sparkles, User, ChevronRight, Globe, Layers, ArrowRight,
  TrendingUp, Clock, CheckCircle2, QrCode, Plus, LogOut, Flame
} from 'lucide-react';
import { ironAudio } from '../lib/ironAudio';
import { MemberRecord, BookingRequest, MembershipPlan } from '../types';
import { getCurrentMember, getMembers, getBookings, getPRRecords } from '../lib/storage';
import { MEMBERSHIP_PLANS } from '../lib/supabase';

// App Subsystem Views
import { BMICalculator } from './BMICalculator';
import { WorkoutPlanner } from './WorkoutPlanner';
import { TrainerBooking } from './TrainerBooking';
import { FitnessGallery } from './FitnessGallery';
import { ContactSystem } from './ContactSystem';
import { MembershipSection } from './MembershipSection';
import { AdminDashboard } from './AdminDashboard';
import { MemberDashboard } from './MemberDashboard';

interface WebAppShellProps {
  onSwitchToWebsite: () => void;
  onOpenMembershipModal: (plan?: MembershipPlan) => void;
}

export const WebAppShell: React.FC<WebAppShellProps> = ({
  onSwitchToWebsite,
  onOpenMembershipModal
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workouts' | 'bmi' | 'trainers' | 'memberships' | 'gallery' | 'contact' | 'admin'>('dashboard');
  const [isMuted, setIsMuted] = useState(ironAudio.isMuted);
  const [currentMember, setCurrentMember] = useState<MemberRecord>(getCurrentMember);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const bookings = getBookings();
  const prs = getPRRecords();
  const members = getMembers();

  const toggleSound = () => {
    const muted = ironAudio.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'dashboard', label: 'Athlete HUD', icon: LayoutDashboard, badge: 'Live' },
    { id: 'workouts', label: 'Workout Engine', icon: Dumbbell, badge: 'Split' },
    { id: 'bmi', label: 'Biometrics Lab', icon: Scale, badge: 'Metric' },
    { id: 'trainers', label: 'Coach Booking', icon: Calendar, badge: `${bookings.length}` },
    { id: 'memberships', label: 'VIP Pass Wallet', icon: Award, badge: 'Tiers' },
    { id: 'gallery', label: 'Arena Showcase', icon: Camera, badge: '6' },
    { id: 'contact', label: 'VIP Concierge', icon: MessageSquare, badge: '24/7' },
    { id: 'admin', label: 'Admin Console', icon: ShieldAlert, badge: 'PIN: 8888' },
  ];

  const handleTabChange = (tabId: any) => {
    ironAudio.playClick(900);
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-iron-950 text-white flex flex-col md:flex-row font-sans selection:bg-gold-500 selection:text-black">
      
      {/* LEFT APP SIDEBAR */}
      <aside className="w-full md:w-64 bg-iron-950 border-r border-gold-500/20 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-iron-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-black border border-gold-500/40 p-1 shadow-gold-glow flex items-center justify-center">
                <img
                  src="/ironvex-logo.png"
                  alt="IRONVEX"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-heading font-black text-lg tracking-wider text-white">
                    IRON<span className="text-gold-400">VEX</span>
                  </span>
                  <span className="text-[9px] bg-gold-500/20 text-gold-400 px-1 py-0.2 rounded font-mono font-bold">
                    APP
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                  ATHLETIC CLOUD OS
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

          {/* Member Quick Card */}
          <div className="p-3 mx-3 my-3 bg-gradient-to-r from-iron-900 to-iron-950 rounded-xl border border-gold-500/20 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center font-bold font-mono text-gold-400 text-xs">
                  {currentMember?.fullName ? currentMember.fullName.charAt(0) : 'A'}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-heading font-bold text-white block truncate">
                    {currentMember?.fullName || 'Alexander Wright'}
                  </span>
                  <span className="text-[10px] text-gold-400 font-mono block truncate">
                    {currentMember?.planName || 'Black Gold VIP'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  ironAudio.playClick();
                  setShowMemberModal(true);
                }}
                className="text-[10px] font-mono text-gray-400 hover:text-gold-400 p-1"
                title="View Pass & PRs"
              >
                <QrCode className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
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

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-iron-900 space-y-2">
          {/* Website Toggle Button */}
          <button
            onClick={() => {
              ironAudio.playClick(1000);
              onSwitchToWebsite();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-iron-900 hover:bg-iron-800 border border-iron-800 hover:border-gold-500/40 text-gray-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-gold-400" />
              <span>Website Mode</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 px-1 pt-1">
            <span>IRONVEX v2.4</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ONLINE</span>
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* TOP APPLICATION APPBAR */}
        <header className="h-16 bg-iron-950/80 backdrop-blur-md border-b border-gold-500/20 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-3">
            <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="text-xs font-mono text-gold-400 hidden sm:inline">
              IRONVEX ATHLETIC SYSTEM
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <button
              onClick={() => {
                ironAudio.playClick();
                handleTabChange('workouts');
              }}
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 bg-iron-900 hover:bg-iron-800 border border-iron-700 text-xs font-mono text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              <Dumbbell className="w-3.5 h-3.5 text-gold-400" />
              <span>Today's Lift</span>
            </button>

            <button
              onClick={() => {
                ironAudio.playClank();
                onOpenMembershipModal();
              }}
              className="px-4 py-1.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-lg shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Membership</span>
            </button>

            {/* View Mode Switcher Pill */}
            <div className="hidden sm:flex bg-iron-900 p-0.5 rounded-lg border border-iron-800 text-xs font-mono">
              <button
                className="px-2.5 py-1 rounded bg-gold-500 text-black font-bold"
                title="Current: Web Application Mode"
              >
                App
              </button>
              <button
                onClick={onSwitchToWebsite}
                className="px-2.5 py-1 text-gray-400 hover:text-white"
                title="Switch to scrollable marketing website"
              >
                Site
              </button>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* TAB 1: ATHLETE DASHBOARD / HUD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
              
              {/* Welcome Banner */}
              <div className="relative bg-gradient-to-r from-iron-900 via-iron-950 to-black p-6 sm:p-8 rounded-2xl border border-gold-500/30 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ATHLETE COMMAND CENTER</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-heading font-black text-white">
                      WELCOME BACK, {currentMember?.fullName?.toUpperCase() || 'ALEXANDER'}
                    </h1>
                    <p className="text-sm text-gray-300 max-w-2xl">
                      Your biological recovery is high (94%). Olympic platforms and infrared suites are active. Ready for your scheduled heavy power session today.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        ironAudio.playClick();
                        setShowMemberModal(true);
                      }}
                      className="px-4 py-2.5 bg-iron-900 hover:bg-iron-800 border border-gold-500/40 text-gold-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 shadow-sm"
                    >
                      <QrCode className="w-4 h-4 text-gold-400" />
                      <span>Show Digital Pass</span>
                    </button>

                    <button
                      onClick={() => {
                        ironAudio.playClank();
                        handleTabChange('workouts');
                      }}
                      className="px-5 py-2.5 bg-gradient-gold text-black rounded-xl text-xs font-heading font-black uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
                    >
                      <Flame className="w-4 h-4 text-black" />
                      <span>Launch Workout Engine</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Active Streak</span>
                    <Flame className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-heading font-black text-white">5 Days</div>
                  <span className="text-[11px] font-mono text-emerald-400 block">Personal record: 14 days</span>
                </div>

                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Workouts Logged</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-heading font-black text-white">45 Lifts</div>
                  <span className="text-[11px] font-mono text-gray-400 block">+4 logged this week</span>
                </div>

                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Upcoming Coach</span>
                    <Calendar className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-2xl font-heading font-black text-gold-400 truncate">
                    {bookings[0]?.trainerName?.split(' ')[0] || 'Marcus'}
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 block">
                    {bookings[0]?.date || 'This Thursday'} • {bookings[0]?.timeSlot || '09:00 AM'}
                  </span>
                </div>

                <div className="bg-iron-900/80 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-gray-400 text-xs font-mono uppercase">
                    <span>Club Tier</span>
                    <Award className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-xl font-heading font-black text-white truncate">
                    {currentMember?.planName || 'Black Gold VIP'}
                  </div>
                  <span className="text-[11px] font-mono text-gold-400 block">All-Access Active 24/7</span>
                </div>
              </div>

              {/* Personal Records & Today's Schedule Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* PR Leaderboard & Logger */}
                <div className="lg:col-span-6 bg-iron-900/60 p-6 rounded-2xl border border-iron-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-iron-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-gold-400" />
                      <h3 className="font-heading font-bold text-white text-base">
                        VERIFIED PERSONAL RECORDS (PR)
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        ironAudio.playClick();
                        setShowMemberModal(true);
                      }}
                      className="text-xs font-mono text-gold-400 hover:text-gold-300"
                    >
                      + Update PRs
                    </button>
                  </div>

                  <div className="space-y-3">
                    {prs.map((pr, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-iron-950 border border-iron-800">
                        <div>
                          <strong className="text-white text-sm block">{pr.exercise}</strong>
                          <span className="text-[10px] text-gray-400 font-mono">Date verified: {pr.date}</span>
                        </div>
                        <span className="font-heading font-black text-gold-400 text-lg">
                          {pr.weightLbs} lbs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Interactive Tool Cards */}
                <div className="lg:col-span-6 space-y-4">
                  <div 
                    onClick={() => handleTabChange('bmi')}
                    className="p-6 bg-gradient-to-r from-iron-900 to-iron-950 rounded-2xl border border-iron-800 hover:border-gold-500/50 cursor-pointer transition-all group shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs font-mono uppercase text-gold-400 font-bold">Biometric Precision</span>
                        <h4 className="text-xl font-heading font-bold text-white group-hover:text-gold-300 transition-colors">
                          BMI & Body Composition Lab
                        </h4>
                        <p className="text-xs text-gray-400 max-w-md">
                          Recalculate your body composition, lean tissue mass, and personalized calorie surplus/deficit macros.
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div 
                    onClick={() => handleTabChange('trainers')}
                    className="p-6 bg-gradient-to-r from-iron-900 to-iron-950 rounded-2xl border border-iron-800 hover:border-gold-500/50 cursor-pointer transition-all group shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs font-mono uppercase text-gold-400 font-bold">1-on-1 Coaching</span>
                        <h4 className="text-xl font-heading font-bold text-white group-hover:text-gold-300 transition-colors">
                          Book Master Trainer Session
                        </h4>
                        <p className="text-xs text-gray-400 max-w-md">
                          Select from CSCS strength coaches, Olympic weightlifters, and physical therapists for form analysis.
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gold-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WORKOUT ENGINE */}
          {activeTab === 'workouts' && (
            <div className="space-y-4 animate-fadeIn">
              <WorkoutPlanner />
            </div>
          )}

          {/* TAB 3: BIOMETRICS LAB */}
          {activeTab === 'bmi' && (
            <div className="space-y-4 animate-fadeIn">
              <BMICalculator />
            </div>
          )}

          {/* TAB 4: TRAINER BOOKINGS */}
          {activeTab === 'trainers' && (
            <div className="space-y-4 animate-fadeIn">
              <TrainerBooking />
            </div>
          )}

          {/* TAB 5: MEMBERSHIPS & VIP PASSES */}
          {activeTab === 'memberships' && (
            <div className="space-y-4 animate-fadeIn">
              <MembershipSection onMemberRegistered={(m) => setCurrentMember(m)} />
            </div>
          )}

          {/* TAB 6: ARENA GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-fadeIn">
              <FitnessGallery />
            </div>
          )}

          {/* TAB 7: CONCIERGE & INQUIRIES */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <ContactSystem />
            </div>
          )}

          {/* TAB 8: ADMIN CONSOLE */}
          {activeTab === 'admin' && (
            <div className="space-y-4 animate-fadeIn">
              <AdminDashboard onClose={() => setActiveTab('dashboard')} />
            </div>
          )}

        </main>
      </div>

      {/* Member Modal Dialog */}
      {showMemberModal && (
        <MemberDashboard
          onClose={() => setShowMemberModal(false)}
          onOpenMembership={() => {
            setShowMemberModal(false);
            setActiveTab('memberships');
          }}
        />
      )}

      {/* Admin Modal Dialog */}
      {showAdminModal && (
        <AdminDashboard onClose={() => setShowAdminModal(false)} />
      )}
    </div>
  );
};
