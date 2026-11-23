import React, { useState } from 'react';
import { MembershipPlan, MemberRecord } from '../types';
import { MEMBERSHIP_PLANS } from '../lib/supabase';
import { MembershipModal } from './MembershipModal';
import { ironAudio } from '../lib/ironAudio';
import { Check, Sparkles, Shield, Flame, Zap } from 'lucide-react';

interface MembershipSectionProps {
  onMemberRegistered: (member: MemberRecord) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onMemberRegistered }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  const handlePlanSelect = (plan: MembershipPlan) => {
    ironAudio.playClank();
    setSelectedPlan(plan);
  };

  return (
    <section id="memberships" className="relative py-28 bg-iron-950 text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.08),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -left-48 top-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-48 bottom-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ELITE ATHLETIC TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-4">
            FORGED FOR THE UNCOMPROMISING
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Choose your membership tier. Every plan includes calibrated Olympic platforms, full biometric tracking, and world-class recovery amenities.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center bg-iron-900 p-1.5 rounded-xl border border-iron-800 shadow-inner">
            <button
              type="button"
              onClick={() => {
                ironAudio.playClick();
                setBillingCycle('monthly');
              }}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-gold text-black shadow-gold-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => {
                ironAudio.playClick();
                setBillingCycle('annual');
              }}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                billingCycle === 'annual'
                  ? 'bg-gradient-gold text-black shadow-gold-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-sans">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
            const isHighlight = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isHighlight
                    ? 'bg-gradient-to-b from-iron-900 via-iron-950 to-black border-2 border-gold-500 shadow-2xl shadow-gold-500/20 md:-translate-y-3'
                    : 'bg-iron-900/80 border border-iron-800 hover:border-gold-500/40 hover:shadow-xl'
                }`}
              >
                {/* Popular / VIP Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-gradient-gold text-black text-[11px] font-heading font-black tracking-widest px-4 py-1 rounded-full uppercase shadow-gold-glow">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Tier Title & Tagline */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-heading font-black text-white">{plan.name}</h3>
                    <p className="text-xs text-gray-400 mt-2 min-h-[32px]">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-iron-800">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-mono text-gold-400">$</span>
                      <span className="text-5xl font-heading font-black text-white">{price}</span>
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                        / month
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-xs text-emerald-400 font-mono mt-1">
                        Billed annually (${plan.priceAnnual * 12}/yr)
                      </p>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-gold-400/80">
                      Privileges Included:
                    </p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs text-gray-300">
                        <div className="w-4 h-4 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-gold-400" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-8 pt-0">
                  <button
                    type="button"
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full py-3.5 rounded-xl font-heading font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center space-x-2 ${
                      isHighlight
                        ? 'bg-gradient-gold text-black shadow-gold-glow hover:brightness-110 active:scale-98'
                        : 'bg-iron-800 text-white hover:bg-gold-500 hover:text-black hover:shadow-gold-glow active:scale-98 border border-iron-700'
                    }`}
                  >
                    <span>SELECT & REGISTER</span>
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table Drawer / Anchor */}
        <div className="mt-16 bg-iron-900/60 border border-iron-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="font-heading font-black text-lg text-white">
                ALL MEMBERSHIPS INCLUDE IRON GUARANTEES
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Zero lock-in contracts, 30-day money-back guarantee, and full biometric orientation.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-gold-400">
              <span className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-gold-400" />
                <span>30-Day Guarantee</span>
              </span>
              <span className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-gold-400" />
                <span>Zero Initiation Fees</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      {selectedPlan && (
        <MembershipModal
          plan={selectedPlan}
          billingCycle={billingCycle}
          onClose={() => setSelectedPlan(null)}
          onSuccess={(newMember) => {
            onMemberRegistered(newMember);
            setSelectedPlan(null);
          }}
        />
      )}
    </section>
  );
};
