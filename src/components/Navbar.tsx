import React, { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, Shield, User, Volume2, VolumeX, ChevronRight, Lock, Award, LayoutDashboard } from 'lucide-react';
import { ironAudio } from '../lib/ironAudio';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenMembershipModal: (planId?: string) => void;
  onOpenMemberDashboard: () => void;
  onOpenAdminDashboard: () => void;
  registeredMemberCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenMembershipModal,
  onOpenMemberDashboard,
  onOpenAdminDashboard,
  registeredMemberCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(ironAudio.isMuted);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const muted = ironAudio.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { id: 'hero', label: 'Overview' },
    { id: 'memberships', label: 'Memberships' },
    { id: 'bmi', label: 'BMI Calculator' },
    { id: 'planner', label: 'Workout Planner' },
    { id: 'trainers', label: 'Coaches' },
    { id: 'gallery', label: 'Club Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    ironAudio.playClick(900);
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
        isScrolled
          ? 'bg-iron-950/95 backdrop-blur-md border-b border-gold-500/20 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-iron-950/95 via-iron-950/70 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative w-11 h-11 rounded-sm overflow-hidden border border-gold-500/40 bg-iron-900 group-hover:border-gold-400 transition-colors shadow-lg shadow-black/80 flex items-center justify-center">
              <img
                src="/ironvex-logo.png"
                alt="IRONVEX Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-wider text-white font-display uppercase">
                  IRON<span className="text-gold-gradient">VEX</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
              </div>
              <p className="text-[10px] tracking-widest text-gold-400/80 font-mono uppercase hidden sm:block">
                ELITE PERFORMANCE & GYM CLUB
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-3 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 font-mono ${
                    isActive
                      ? 'text-gold-300 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-iron-900/60'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 shadow-gold-glow-sm" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded border transition-all ${
                !isMuted
                  ? 'border-gold-500/40 bg-gold-500/10 text-gold-400 hover:text-gold-200 shadow-gold-glow-sm'
                  : 'border-iron-800 bg-iron-900 text-zinc-500 hover:text-zinc-300'
              }`}
              title={isMuted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Member Dashboard Button */}
            <button
              onClick={() => {
                ironAudio.playClick(1100);
                onOpenMemberDashboard();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-iron-900 hover:bg-iron-800 border border-gold-500/30 text-gold-400 hover:text-gold-300 rounded text-xs font-mono font-bold tracking-wider uppercase transition-colors"
              title="Access Member Portal"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal</span>
              {registeredMemberCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-gold-400" />
              )}
            </button>

            {/* Admin Dashboard Button */}
            <button
              onClick={() => {
                ironAudio.playClick(1000);
                onOpenAdminDashboard();
              }}
              className="p-2 bg-iron-900 hover:bg-iron-800 border border-iron-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded transition-colors"
              title="Club Admin Console"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            {/* PRIMARY CTA: JOIN IRONVEX */}
            <button
              onClick={() => {
                ironAudio.playClank();
                onOpenMembershipModal();
              }}
              className="px-4 py-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-iron-950 font-black text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-200 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 flex items-center gap-1.5"
            >
              <span>Join Club</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>

          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                ironAudio.playClank();
                onOpenMembershipModal();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-iron-950 font-black text-[11px] font-mono uppercase tracking-wider rounded-sm"
            >
              Join
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gold-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-iron-950 border-b border-gold-500/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded font-mono text-xs uppercase tracking-wider ${
                  isActive
                    ? 'bg-gold-500/20 text-gold-300 font-bold border-l-2 border-gold-400'
                    : 'text-zinc-400 hover:bg-iron-900 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-iron-800 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenMemberDashboard();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-mono text-gold-400 flex items-center gap-2 py-2"
            >
              <User className="w-4 h-4" />
              <span>Member Portal</span>
            </button>

            <button
              onClick={() => {
                onOpenAdminDashboard();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-mono text-zinc-400 flex items-center gap-2 py-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
