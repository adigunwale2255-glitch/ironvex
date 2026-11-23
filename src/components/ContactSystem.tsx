import React, { useState } from 'react';
import { ironAudio } from '../lib/ironAudio';
import { saveMessage } from '../lib/storage';
import { ContactMessage } from '../types';
import { 
  Send, Mail, Phone, MapPin, Clock, CheckCircle2, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageSquare 
} from 'lucide-react';

export const ContactSystem: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tour & VIP Trial Session Request');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Accordion FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What are the club operating hours?',
      a: 'IRONVEX is accessible 24/7/365 to all active tier members via keyless biometric access. Staffed coaching hours and Fuel Bar operations are Monday–Saturday from 05:00 AM to 10:00 PM, and Sunday from 07:00 AM to 08:00 PM.'
    },
    {
      q: 'Can I bring training partners on guest passes?',
      a: 'Pro Athlete members receive 2 complimentary guest passes per month. Black Gold VIP members enjoy unlimited guest passes whenever accompanied by the primary account holder.'
    },
    {
      q: 'What equipment standards do you enforce?',
      a: 'We feature competition-grade Eleiko IPF/IWF certified barbells, calibrated steel discs, custom machined urethane dumbbells up to 150 lbs, Texas Power Bars, and bespoke multi-station power cages.'
    },
    {
      q: 'How does the 30-day trial guarantee work?',
      a: 'If within your first 30 days of membership you feel IRONVEX does not exceed every expectation of luxury, cleanliness, and athletic performance, simply notify our concierge for an immediate 100% refund.'
    }
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Full name is required';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Valid email is required';
    }
    if (!phone.trim() || phone.length < 7) {
      errs.phone = 'Valid phone is required';
    }
    if (!message.trim() || message.length < 10) {
      errs.message = 'Please provide details for your inquiry (min 10 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      ironAudio.playClank();
      return;
    }

    setIsSubmitting(true);
    ironAudio.playClick();

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject,
      message: message.trim(),
      date: new Date().toISOString(),
      status: 'New'
    };

    setTimeout(async () => {
      await saveMessage(newMsg);
      setIsSubmitting(false);
      setIsSubmitted(true);
      ironAudio.playSuccess();
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 700);
  };

  return (
    <section id="contact" className="relative py-28 bg-iron-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono tracking-widest uppercase mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>DIRECT CONCIERGE & BOOKING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-4">
            CONNECT WITH IRONVEX
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Schedule a private architectural walkthrough, request corporate executive wellness rates, or consult with our head coaching directors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & FAQs Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Cards */}
            <div className="bg-iron-900/60 p-6 rounded-2xl border border-iron-800 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white border-b border-iron-800 pb-3">
                HEADQUARTERS & METRICS
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Flagship Compound</span>
                    <span>840 Ironworks Blvd, Industrial District, Suite 100</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-gray-300">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Operating Schedule</span>
                    <span>24/7/365 Biometric Key Access for Members</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">VIP Concierge Desk</span>
                    <span className="font-mono">+1 (800) 847-6683 (1-800-IRONVEX)</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Electronic Dispatch</span>
                    <span className="font-mono">concierge@ironvexgym.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion FAQ */}
            <div className="bg-iron-900/60 p-6 rounded-2xl border border-iron-800 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center space-x-2 border-b border-iron-800 pb-3">
                <HelpCircle className="w-4 h-4 text-gold-400" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div 
                      key={index}
                      className="border border-iron-800 rounded-xl overflow-hidden bg-iron-950/70"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          ironAudio.playClick();
                          setOpenFaqIndex(isOpen ? null : index);
                        }}
                        className="w-full p-3.5 text-left flex justify-between items-center text-xs font-heading font-bold text-gray-200 hover:text-gold-400 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-gold-400 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-gray-400 leading-relaxed border-t border-iron-900">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Contact Form Column */}
          <div className="lg:col-span-7 bg-iron-900/80 p-8 sm:p-10 rounded-2xl border border-gold-500/30 shadow-2xl relative">
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              DISPATCH A DIRECT MESSAGE
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Our hospitality concierges and head trainers typically respond within 2 hours.
            </p>

            {isSubmitted ? (
              <div className="bg-iron-950 p-8 rounded-xl border border-gold-500/40 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 border border-gold-400/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-gold-400" />
                </div>
                <h4 className="text-xl font-heading font-black text-white">
                  TRANSMISSION RECEIVED
                </h4>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  Thank you for reaching out to IRONVEX. Your message has been logged in our dispatch registry. An executive concierge will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    setIsSubmitted(false);
                  }}
                  className="px-6 py-2 rounded-lg bg-iron-800 text-gold-400 hover:bg-gold-500 hover:text-black font-mono text-xs uppercase font-bold transition-all border border-gold-500/30"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alexander Vance"
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none transition-colors"
                    />
                    {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@ironvex.com"
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none transition-colors"
                    />
                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none transition-colors"
                    />
                    {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                    >
                      <option value="Tour & VIP Trial Session Request">Tour & VIP Trial Session Request</option>
                      <option value="Corporate Executive Wellness Partnership">Corporate Executive Wellness Partnership</option>
                      <option value="Private Powerlifting Coaching Inquiry">Private Powerlifting Coaching Inquiry</option>
                      <option value="Media & Brand Collaboration">Media & Brand Collaboration</option>
                      <option value="General Concierge Question">General Concierge Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                    Your Message & Requirements *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your current training routine, specific amenities needed, or preferred date/time for a private facility tour..."
                    className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none transition-colors"
                  />
                  {errors.message && <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Message...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Inquiry to Concierge</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
