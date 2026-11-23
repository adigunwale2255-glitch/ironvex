import React from 'react';
import { ironAudio } from '../lib/ironAudio';
import { ChevronUp, Shield, Award, MapPin, Phone, Mail, Globe, Share2, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    ironAudio.playClick(1000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-gold-500/20 text-white relative overflow-hidden">
      {/* Top Banner Ribbon */}
      <div className="bg-iron-950 border-b border-iron-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-white font-bold">24/7 BIOMETRIC ACCESS ACTIVE</span>
            <span className="text-gray-400">|</span>
            <span>AIR PURIFICATION: HEPA 99.97%</span>
          </div>
          <div className="flex items-center space-x-4 text-gold-400">
            <span>OFFICIAL IPF/IWF SPECIFICATION FACILITY</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-black border border-gold-500/50 flex items-center justify-center p-1 shadow-gold-glow">
                <img
                  src="/ironvex-logo.png"
                  alt="IRONVEX"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-heading font-black text-2xl tracking-widest text-white">
                IRON<span className="text-gold-400">VEX</span>
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              The premier athletic sanctum combining high-performance strength training, Olympic weightlifting platforms, biomechanical coaching, and infrared recovery protocols.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#contact"
                onClick={() => ironAudio.playClick()}
                className="w-8 h-8 rounded-lg bg-iron-900 border border-iron-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
                aria-label="Global Network"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                onClick={() => ironAudio.playClick()}
                className="w-8 h-8 rounded-lg bg-iron-900 border border-iron-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
                aria-label="Social Channels"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                onClick={() => ironAudio.playClick()}
                className="w-8 h-8 rounded-lg bg-iron-900 border border-iron-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500 transition-colors"
                aria-label="Live Broadcasts"
              >
                <Radio className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-gold-400">
              PLATFORM TIERS
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-mono">
              <li><a href="#memberships" className="hover:text-gold-300 transition-colors">Iron Access Tier</a></li>
              <li><a href="#memberships" className="hover:text-gold-300 transition-colors">Pro Athlete Tier</a></li>
              <li><a href="#memberships" className="hover:text-gold-300 transition-colors">Black Gold VIP</a></li>
              <li><a href="#memberships" className="hover:text-gold-300 transition-colors">Corporate Wellness</a></li>
            </ul>
          </div>

          {/* Training Systems */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-gold-400">
              SYSTEMS & TOOLS
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-mono">
              <li><a href="#bmi-calculator" className="hover:text-gold-300 transition-colors">Biometric BMI Tool</a></li>
              <li><a href="#workout-planner" className="hover:text-gold-300 transition-colors">Dynamic Workout Splits</a></li>
              <li><a href="#trainers" className="hover:text-gold-300 transition-colors">Master Coach Booking</a></li>
              <li><a href="#gallery" className="hover:text-gold-300 transition-colors">Apparatus Gallery</a></li>
            </ul>
          </div>

          {/* Concierge & Hours */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-gold-400">
              FLAGSHIP LOCATION
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>840 Ironworks Blvd, Suite 100</span>
              </p>
              <p className="flex items-center space-x-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>+1 (800) 847-6683</span>
              </p>
              <p className="flex items-center space-x-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>concierge@ironvexgym.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-iron-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-mono">
          <p>© {new Date().getFullYear()} IRONVEX FITNESS & GYM INC. ALL RIGHTS RESERVED.</p>

          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Athletic Facility</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-iron-900 border border-iron-800 text-gold-400 hover:text-white hover:border-gold-500 transition-all active:scale-95 flex items-center space-x-1"
              title="Return to Top"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="text-[10px] uppercase">TOP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
