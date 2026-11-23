import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { MemberPortal } from './components/portal/MemberPortal';
import { AdminPortal } from './components/portal/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';

// Public Website Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MembershipSection } from './components/MembershipSection';
import { MembershipModal } from './components/MembershipModal';
import { BMICalculator } from './components/BMICalculator';
import { WorkoutPlanner } from './components/WorkoutPlanner';
import { TrainerBooking } from './components/TrainerBooking';
import { FitnessGallery } from './components/FitnessGallery';
import { TestimonialSlider } from './components/TestimonialSlider';
import { ContactSystem } from './components/ContactSystem';
import { Footer } from './components/Footer';

import { MEMBERSHIP_PLANS } from './lib/supabase';
import { MembershipPlan, MemberRecord } from './types';
import { ironAudio } from './lib/ironAudio';
import { Sparkles, User, ShieldAlert, Globe, ArrowRight } from 'lucide-react';

const MainApplication: React.FC = () => {
  const { user, role, isAuthenticated, quickSwitchRole } = useAuth();
  
  // View mode: 'portal' (Member or Admin Portal) vs 'website' (Public Landing Site)
  const [viewMode, setViewMode] = useState<'portal' | 'website'>('portal');
  
  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Direct checkout modal from landing site
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<MembershipPlan | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    ironAudio.playClick();
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // 1. PORTAL VIEW (When user is logged in or previewing Member / Admin portals)
  if (viewMode === 'portal' && isAuthenticated) {
    if (role === 'admin') {
      return (
        <AdminPortal
          onSwitchToMember={() => quickSwitchRole('member')}
          onSwitchToWebsite={() => setViewMode('website')}
        />
      );
    }
    return (
      <MemberPortal
        onSwitchToAdmin={() => quickSwitchRole('admin')}
        onSwitchToWebsite={() => setViewMode('website')}
      />
    );
  }

  // 2. PUBLIC MARKETING & SHOWCASE WEBSITE
  return (
    <div className="min-h-screen bg-iron-950 text-white selection:bg-gold-500 selection:text-black">
      
      {/* Top Banner Ribbon with Direct Portal Switcher */}
      <div className="bg-iron-950 border-b border-gold-500/20 py-2.5 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold">IRONVEX PLATFORM ONLINE</span>
            <span className="text-gray-600">|</span>
            <span>TRAIN HARDER. GET STRONGER. LIVE BETTER.</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                quickSwitchRole('member');
                setViewMode('portal');
              }}
              className="px-2.5 py-1 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/40 rounded text-[11px] font-bold flex items-center space-x-1"
            >
              <User className="w-3 h-3" />
              <span>Launch Member Portal</span>
            </button>

            <button
              onClick={() => {
                quickSwitchRole('admin');
                setViewMode('portal');
              }}
              className="px-2.5 py-1 bg-iron-900 hover:bg-iron-800 text-gray-300 border border-iron-700 rounded text-[11px] font-bold flex items-center space-x-1"
            >
              <ShieldAlert className="w-3 h-3 text-gold-400" />
              <span>Launch Admin HQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Navbar */}
      <Navbar
        activeSection="hero"
        onNavigate={(id) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenMembershipModal={() => setSelectedPlanForCheckout(MEMBERSHIP_PLANS[1])}
        onOpenMemberDashboard={() => {
          quickSwitchRole('member');
          setViewMode('portal');
        }}
        onOpenAdminDashboard={() => {
          quickSwitchRole('admin');
          setViewMode('portal');
        }}
        onSwitchToApp={() => {
          quickSwitchRole('member');
          setViewMode('portal');
        }}
        registeredMemberCount={24}
      />

      <main>
        <Hero
          onJoinClick={() => setSelectedPlanForCheckout(MEMBERSHIP_PLANS[1])}
          onBMIClick={() => {
            const el = document.getElementById('bmi');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onPlannerClick={() => {
            const el = document.getElementById('planner');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onTrainersClick={() => {
            const el = document.getElementById('trainers');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <MembershipSection 
          onMemberRegistered={() => {
            quickSwitchRole('member');
            setViewMode('portal');
          }} 
        />

        <BMICalculator />

        <WorkoutPlanner />

        <TrainerBooking />

        <FitnessGallery />

        <TestimonialSlider />

        <ContactSystem />
      </main>

      <Footer />

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => setViewMode('portal')}
        />
      )}

      {/* Membership Modal */}
      {selectedPlanForCheckout && (
        <MembershipModal
          plan={selectedPlanForCheckout}
          billingCycle="annual"
          onClose={() => setSelectedPlanForCheckout(null)}
          onSuccess={() => {
            setSelectedPlanForCheckout(null);
            quickSwitchRole('member');
            setViewMode('portal');
          }}
        />
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApplication />
    </AuthProvider>
  );
};

export default App;
