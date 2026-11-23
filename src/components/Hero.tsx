import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Dumbbell, 
  ShieldCheck, 
  Flame, 
  Award, 
  ChevronDown, 
  Zap, 
  Activity,
  Play
} from 'lucide-react';
import { ironAudio } from '../lib/ironAudio';

interface HeroProps {
  onJoinClick: () => void;
  onBMIClick: () => void;
  onPlannerClick: () => void;
  onTrainersClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onJoinClick,
  onBMIClick,
  onPlannerClick,
  onTrainersClick,
}) => {
  // Animated Counters
  const [membersCount, setMembersCount] = useState(0);
  const [coachesCount, setCoachesCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    let currentM = 0;
    const interval = setInterval(() => {
      currentM += 450;
      if (currentM >= 18500) {
        setMembersCount(18500);
        clearInterval(interval);
      } else {
        setMembersCount(currentM);
      }
    }, 30);

    const coachInterval = setInterval(() => {
      setCoachesCount(prev => (prev < 45 ? prev + 1 : 45));
    }, 40);

    const successInterval = setInterval(() => {
      setSuccessRate(prev => (prev < 99 ? prev + 2 : 99.2));
    }, 35);

    return () => {
      clearInterval(interval);
      clearInterval(coachInterval);
      clearInterval(successInterval);
    };
  }, []);

  return (
    <section 
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 bg-gradient-to-b from-iron-950 via-iron-900 to-iron-950 text-white select-none overflow-hidden"
    >
      
      {/* Background Ambience & Gold Lasers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-black" />
        
        {/* Subtle Gold Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#d4af37_1px,transparent_1px),linear-gradient(to_bottom,#d4af37_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Golden Radial Beam from Center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-500/15 blur-[160px] pointer-events-none" />
      </div>

      {/* Main Content Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 w-full">
        
        {/* Top Elite Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-iron-900/90 border border-gold-500/40 rounded-sm clip-badge shadow-gold-glow-sm">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-gold-300 uppercase">
              IRONVEX LUXURY ATHLETIC PERFORMANCE CLUB
            </span>
          </div>

          <button
            onClick={() => ironAudio.playClank()}
            className="text-[10px] font-mono text-gold-400/80 hover:text-gold-200 border border-gold-500/20 bg-iron-950 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors"
            title="Hear Iron Clank"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Heavy Iron FX</span>
          </button>
        </div>

        {/* Primary Punchy Headline */}
        <div className="max-w-4xl space-y-5">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-display leading-[0.95]">
            FORGE YOUR <br />
            <span className="text-gold-gradient drop-shadow-[0_4px_35px_rgba(212,175,55,0.3)]">
              SUPREMACY.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-sans leading-relaxed">
            Step into the arena where science meets raw steel. Precision biomechanics, Olympic calibrated platforms, infrared recovery suites, and world-class coaches engineered to transform your body into an unstoppable force.
          </p>
        </div>

        {/* Primary Interactive Hero CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-6 pb-12">
          <button
            onClick={() => {
              ironAudio.playClank();
              onJoinClick();
            }}
            className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-iron-950 font-black text-xs font-mono uppercase tracking-widest rounded-sm transition-all duration-200 shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 group"
          >
            <Award className="w-4 h-4 stroke-[2.5]" />
            <span>Join Ironvex Today</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </button>

          <button
            onClick={() => {
              ironAudio.playClick(1000);
              onBMIClick();
            }}
            className="flex items-center gap-2 px-6 py-4 bg-iron-900/90 hover:bg-iron-800 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded-sm transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>Calculate Your BMI</span>
          </button>

          <button
            onClick={() => {
              ironAudio.playClick(900);
              onPlannerClick();
            }}
            className="flex items-center gap-2 px-6 py-4 bg-iron-950/80 hover:bg-iron-900 border border-iron-800 text-zinc-400 hover:text-zinc-200 font-mono text-xs uppercase tracking-wider rounded-sm transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Interactive Workout Generator</span>
          </button>
        </div>

        {/* Centerpiece Showcase: Interactive Live Performance HUD */}
        <div className="relative mt-4 bg-iron-900/60 border border-gold-500/20 rounded-sm p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            <div className="space-y-1 border-l-2 border-gold-500/60 pl-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400/80 block font-bold">
                ACTIVE ATHLETES
              </span>
              <div className="text-3xl sm:text-4xl font-black font-display text-white">
                {membersCount.toLocaleString()}+
              </div>
              <p className="text-xs text-zinc-400">Lifters transforming their bodies worldwide</p>
            </div>

            <div className="space-y-1 border-l-2 border-gold-500/60 pl-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400/80 block font-bold">
                MASTER COACHES
              </span>
              <div className="text-3xl sm:text-4xl font-black font-display text-white">
                {coachesCount}+
              </div>
              <p className="text-xs text-zinc-400">CSCS, Olympic & DPT certified trainers</p>
            </div>

            <div className="space-y-1 border-l-2 border-gold-500/60 pl-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400/80 block font-bold">
                GOAL SUCCESS
              </span>
              <div className="text-3xl sm:text-4xl font-black font-display text-gold-300">
                {successRate}%
              </div>
              <p className="text-xs text-zinc-400">Verified strength & shred milestones</p>
            </div>

            <div className="space-y-1 border-l-2 border-gold-500/60 pl-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400/80 block font-bold">
                ACCESS TIER
              </span>
              <div className="text-3xl sm:text-4xl font-black font-display text-white">
                24/7 VIP
              </div>
              <p className="text-xs text-zinc-400">Keycard access & sauna recovery suites</p>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Sub-Ribbon */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500 border-t border-iron-800 pt-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>ELEIKO IPF-CALIBRATED PLATES & OLYMPIC BARS</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Flame className="w-4 h-4 text-gold-400" />
            <span>NORDIC INFRARED SAUNA & COLD PLUNGE SUITES</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Zap className="w-4 h-4 text-gold-400" />
            <span>CUSTOM MACRO & NUTRITION ENGINEERING</span>
          </div>
        </div>
      </div>

    </section>
  );
};
