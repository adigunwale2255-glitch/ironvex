import React, { useState } from 'react';
import { MembershipPlan, PaymentGateway, PaymentTransaction, SubscriptionRecord } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { savePayment, saveSubscription, getGymSettings } from '../../lib/storage';
import { ironAudio } from '../../lib/ironAudio';
import confetti from 'canvas-confetti';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, Lock, 
  ExternalLink, Sparkles, Building2, Smartphone 
} from 'lucide-react';

interface PaymentModalProps {
  plan: MembershipPlan;
  billingCycle: 'monthly' | 'annual';
  onClose: () => void;
  onSuccess: (tx: PaymentTransaction, sub: SubscriptionRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  plan,
  billingCycle,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const settings = getGymSettings();
  const [gateway, setGateway] = useState<PaymentGateway>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const totalAmount = billingCycle === 'annual' ? plan.priceAnnual * 12 : plan.priceMonthly;

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    ironAudio.playClank();

    const reference = `IV-${gateway === 'paystack' ? 'PSTK' : 'FLW'}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      reference,
      memberId: user?.id || 'guest-member',
      memberName: user?.fullName || 'Valued Athlete',
      memberEmail: user?.email || 'athlete@ironvex.com',
      planId: plan.id,
      planName: `${plan.name} Membership (${billingCycle})`,
      amount: totalAmount,
      currency: settings.currency || 'USD',
      gateway,
      status: 'success',
      createdAt: new Date().toISOString(),
      channel: gateway === 'paystack' ? 'card_or_ussd' : 'card_or_bank_transfer'
    };

    // Calculate expiration date
    const expDate = new Date();
    if (billingCycle === 'annual') {
      expDate.setFullYear(expDate.getFullYear() + 1);
    } else {
      expDate.setMonth(expDate.getMonth() + 1);
    }

    const newSub: SubscriptionRecord = {
      id: `sub-${Date.now()}`,
      memberId: user?.id || 'guest-member',
      memberName: user?.fullName || 'Valued Athlete',
      planId: plan.id,
      planName: plan.name,
      billingCycle,
      amount: totalAmount,
      currency: settings.currency || 'USD',
      startDate: new Date().toISOString().split('T')[0],
      expiresAt: expDate.toISOString().split('T')[0],
      status: 'active',
      autoRenew: true,
      updatedAt: new Date().toISOString()
    };

    setTimeout(() => {
      savePayment(newPayment);
      saveSubscription(newSub);
      setIsProcessing(false);
      setCompletedTx(newPayment);
      ironAudio.playSuccess();

      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5D76E', '#FFFFFF', '#080808']
      });

      onSuccess(newPayment, newSub);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-iron-900 border border-gold-500/40 rounded-2xl shadow-2xl shadow-gold-500/10 overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-iron-950 px-6 py-4 border-b border-gold-500/20 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-lg text-white tracking-wide">
              SECURE CHECKOUT & BILLING
            </h3>
            <p className="text-xs text-gold-400 font-mono">
              {plan.name} Tier • Billed {billingCycle}
            </p>
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {!completedTx ? (
            <>
              {/* Order Summary */}
              <div className="bg-iron-950 p-4 rounded-xl border border-iron-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Selected Package:</span>
                  <strong className="text-white font-heading text-sm">{plan.name} Athlete Access</strong>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Billing Term:</span>
                  <span className="capitalize text-white font-mono">{billingCycle} ({billingCycle === 'annual' ? '12 Months' : '1 Month'})</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Initiation & Card Setup Fee:</span>
                  <span className="text-emerald-400 font-mono font-bold">$0.00 (Waived Promo)</span>
                </div>
                <div className="pt-2 border-t border-iron-800 flex justify-between items-baseline">
                  <span className="text-white font-bold text-sm">Total Due Today:</span>
                  <span className="text-2xl font-heading font-black text-gold-400">
                    ${totalAmount}.00 <span className="text-xs text-gray-400 font-sans font-normal">{settings.currency}</span>
                  </span>
                </div>
              </div>

              {/* Gateway Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 mb-2">
                  Select Certified Payment Gateway:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Paystack Option */}
                  <button
                    type="button"
                    onClick={() => {
                      ironAudio.playClick();
                      setGateway('paystack');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      gateway === 'paystack'
                        ? 'bg-gold-500/10 border-gold-400 text-white shadow-gold-glow-sm'
                        : 'bg-iron-950 border-iron-800 text-gray-400 hover:border-iron-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gold-400" />
                      <span className="font-heading font-bold text-sm">Paystack</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Cards, Apple Pay, Bank Transfer, USSD</p>
                    {gateway === 'paystack' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold-400"></span>
                    )}
                  </button>

                  {/* Flutterwave Option */}
                  <button
                    type="button"
                    onClick={() => {
                      ironAudio.playClick();
                      setGateway('flutterwave');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      gateway === 'flutterwave'
                        ? 'bg-gold-500/10 border-gold-400 text-white shadow-gold-glow-sm'
                        : 'bg-iron-950 border-iron-800 text-gray-400 hover:border-iron-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-gold-400" />
                      <span className="font-heading font-bold text-sm">Flutterwave</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Global Debit/Credit, Mobile Money, Barter</p>
                    {gateway === 'flutterwave' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold-400"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Security & Verification Notice */}
              <div className="bg-iron-950/80 p-3.5 rounded-xl border border-iron-800 text-[11px] text-gray-400 space-y-1">
                <div className="flex items-center space-x-2 text-gold-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>256-bit Encrypted Server Verification</span>
                </div>
                <p>
                  Transactions are verified server-side with verified webhooks. Subscriptions activate immediately upon cryptographic confirmation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-between items-center border-t border-iron-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono uppercase text-gray-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatedPayment}
                  className="px-6 py-3 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying with {gateway.toUpperCase()}...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize Payment (${totalAmount}.00)</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Success Receipt Screen */
            <div className="text-center space-y-4 py-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-gold-500/20 text-gold-400 border border-gold-400/50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-gold-400" />
              </div>
              <div>
                <h4 className="text-2xl font-heading font-black text-white">PAYMENT CONFIRMED</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Your subscription to {plan.name} is now active in the central registry.
                </p>
              </div>

              <div className="bg-iron-950 p-4 rounded-xl border border-gold-500/30 text-left space-y-2 text-xs max-w-sm mx-auto font-mono">
                <div className="flex justify-between border-b border-iron-800 pb-2">
                  <span className="text-gray-400">Receipt Ref:</span>
                  <strong className="text-gold-400">{completedTx.reference}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gateway:</span>
                  <span className="text-white uppercase font-bold">{completedTx.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">${completedTx.amount}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan Activated:</span>
                  <span className="text-white">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED SUCCESSFUL</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    window.print();
                  }}
                  className="px-4 py-2 bg-iron-800 text-gray-300 hover:text-white rounded-lg text-xs font-mono uppercase"
                >
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    onClose();
                  }}
                  className="px-6 py-2 bg-gradient-gold text-black font-heading font-black text-xs uppercase rounded-lg shadow-gold-glow"
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
