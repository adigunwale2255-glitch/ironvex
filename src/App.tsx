import React, { useState, useEffect } from 'react';
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
import { MemberDashboard } from './components/MemberDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import { getMembers, saveMember } from './lib/storage';
import { MEMBERSHIP_PLANS } from './lib/supabase';
import { MembershipPlan, MemberRecord, BookingRequest } from './types';
import { ironAudio } from './lib/ironAudio';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMemberDashboardOpen, setIsMemberDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<MembershipPlan | null>(null);
  const [members, setMembers] = useState<MemberRecord[]>(getMembers);

  // Floating Toast Notification
  const [toast, setToast] = useState<{ id: string; title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ id: `${Date.now()}`, title, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Section Observer for Active Navigation
  useEffect(() => {
    const sectionIds = ['hero', 'memberships', 'bmi', 'planner', 'trainers', 'gallery', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenJoinModal = (planId?: string) => {
    const foundPlan = planId 
      ? MEMBERSHIP_PLANS.find(p => p.id === planId)
      : MEMBERSHIP_PLANS.find(p => p.isPopular) || MEMBERSHIP_PLANS[1];
    setModalPlan(foundPlan || MEMBERSHIP_PLANS[0]);
  };

  const handleMemberRegistered = (newMember: MemberRecord) => {
    setMembers(getMembers());
    showToast(
      'VIP Credential Minted!',
      `Welcome to IRONVEX, ${newMember.fullName}. Member ID: ${newMember.memberNumber}`
    );
  };

  const handleBookingCreated = (booking: BookingRequest) => {
    showToast(
      'Session Reserved!',
      `Booked with ${booking.trainerName} for ${booking.date} at ${booking.timeSlot}. Code: ${booking.bookingCode}`
    );
  };

  return (
    <div className="min-h-screen bg-iron-950 text-white selection:bg-gold-500 selection:text-black">
      {/* Sticky Premium Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenMembershipModal={handleOpenJoinModal}
        onOpenMemberDashboard={() => setIsMemberDashboardOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        registeredMemberCount={members.length}
      />

      {/* Main Interactive Sections */}
      <main>
        <Hero
          onJoinClick={() => handleOpenJoinModal()}
          onBMIClick={() => handleNavigate('bmi')}
          onPlannerClick={() => handleNavigate('planner')}
          onTrainersClick={() => handleNavigate('trainers')}
        />

        <MembershipSection onMemberRegistered={handleMemberRegistered} />

        <BMICalculator />

        <WorkoutPlanner />

        <TrainerBooking onBookingCreated={handleBookingCreated} />

        <FitnessGallery />

        <TestimonialSlider />

        <ContactSystem />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal: Direct Membership Registration from Header/Hero */}
      {modalPlan && (
        <MembershipModal
          plan={modalPlan}
          billingCycle="annual"
          onClose={() => setModalPlan(null)}
          onSuccess={(newMember) => {
            handleMemberRegistered(newMember);
            setModalPlan(null);
          }}
        />
      )}

      {/* Modal: Member Athlete Dashboard */}
      {isMemberDashboardOpen && (
        <MemberDashboard
          onClose={() => setIsMemberDashboardOpen(false)}
          onOpenMembership={() => {
            setIsMemberDashboardOpen(false);
            handleOpenJoinModal();
          }}
        />
      )}

      {/* Modal: Executive Admin Command Center */}
      {isAdminDashboardOpen && (
        <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
      )}

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-iron-900 border-2 border-gold-500 rounded-xl p-4 shadow-2xl shadow-gold-500/20 animate-slideUp flex items-start space-x-3">
          <div className="p-1 rounded-full bg-gold-500/20 text-gold-400 shrink-0">
            <Sparkles className="w-5 h-5 text-gold-400" />
          </div>
          <div className="flex-1">
            <h5 className="font-heading font-black text-xs uppercase tracking-wider text-white">
              {toast.title}
            </h5>
            <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-white p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
