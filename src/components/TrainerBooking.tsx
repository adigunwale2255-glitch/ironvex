import React, { useState } from 'react';
import { TrainerProfile, BookingRequest } from '../types';
import { SEED_TRAINERS } from '../lib/supabase';
import { saveBooking } from '../lib/storage';
import { ironAudio } from '../lib/ironAudio';
import confetti from 'canvas-confetti';
import { 
  Star, Award, Calendar, Clock, X, Check, ShieldCheck, 
  User, Mail, Phone, ArrowRight, Sparkles 
} from 'lucide-react';

interface TrainerBookingProps {
  onBookingCreated?: (booking: BookingRequest) => void;
}

export const TrainerBooking: React.FC<TrainerBookingProps> = ({ onBookingCreated }) => {
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:00 AM');
  const [serviceType, setServiceType] = useState('1-on-1 Biomechanics & Technique Analysis');

  // Contact info
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openBookingModal = (trainer: TrainerProfile) => {
    ironAudio.playClick();
    setSelectedTrainer(trainer);
    setSelectedTimeSlot(trainer.availableHours[0] || '09:00 AM');
    setConfirmedBooking(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!clientName.trim() || clientName.trim().length < 2) {
      errs.clientName = 'Full name is required';
    }
    if (!clientEmail.trim() || !/^\S+@\S+\.\S+$/.test(clientEmail)) {
      errs.clientEmail = 'Valid email is required';
    }
    if (!clientPhone.trim() || clientPhone.length < 7) {
      errs.clientPhone = 'Valid phone number is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedTrainer) {
      ironAudio.playClank();
      return;
    }

    setIsSubmitting(true);
    ironAudio.playClank();

    const bookingCode = `IV-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRequest = {
      id: `bk-${Date.now()}`,
      bookingCode,
      memberName: clientName.trim(),
      memberEmail: clientEmail.trim().toLowerCase(),
      memberPhone: clientPhone.trim(),
      trainerId: selectedTrainer.id,
      trainerName: selectedTrainer.name,
      serviceType,
      date: bookingDate,
      timeSlot: selectedTimeSlot,
      notes: notes.trim(),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    setTimeout(async () => {
      await saveBooking(newBooking);
      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      ironAudio.playSuccess();

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#e5c058']
      });

      if (onBookingCreated) {
        onBookingCreated(newBooking);
      }
    }, 800);
  };

  return (
    <section id="trainers" className="relative py-28 bg-iron-900 border-t border-iron-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>WORLD-CLASS COACHING CADRE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-4">
            MASTER TRAINERS & BIOMECHANISTS
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Every IRONVEX trainer holds master-tier certifications, competitive athletic backgrounds, and science-driven coaching philosophies. Select a coach to schedule an appointment.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEED_TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-iron-950 rounded-2xl border border-iron-800 hover:border-gold-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-iron-950 via-iron-950/20 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-gold-500/40 flex items-center space-x-1.5 text-xs font-mono text-gold-400">
                    <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    <span className="font-bold">{trainer.rating}</span>
                    <span className="text-[10px] text-gray-400">({trainer.reviewsCount})</span>
                  </div>

                  {/* Hourly Rate */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-mono text-gray-300 bg-iron-900/90 px-2 py-0.5 rounded border border-iron-700">
                      ${trainer.sessionRate} / hr session
                    </span>
                  </div>
                </div>

                {/* Info Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-gold-400/90 font-mono">{trainer.title}</p>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {trainer.bio}
                  </p>

                  {/* Certifications Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trainer.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-gray-300 bg-iron-900 px-2 py-0.5 rounded border border-iron-800"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => openBookingModal(trainer)}
                  className="w-full py-2.5 rounded-xl bg-iron-800 hover:bg-gradient-gold text-white hover:text-black font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border border-iron-700 hover:border-gold-500 shadow-md active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>BOOK PRIVATE SESSION</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal Dialog */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-iron-900 border border-gold-500/40 rounded-2xl shadow-2xl shadow-gold-500/10 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-iron-950 px-6 py-4 border-b border-gold-500/20 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                  SCHEDULE PRIVATE MASTER SESSION
                </h3>
                <p className="text-xs text-gold-400 font-mono">
                  Coach: {selectedTrainer.name} (${selectedTrainer.sessionRate}/hr)
                </p>
              </div>
              <button
                onClick={() => {
                  ironAudio.playClick();
                  setSelectedTrainer(null);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-iron-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {!confirmedBooking ? (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  {/* Service Type Selection */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 tracking-wider mb-1.5">
                      Service Type
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                    >
                      <option value="1-on-1 Biomechanics & Technique Analysis">1-on-1 Biomechanics & Technique Analysis (60 min)</option>
                      <option value="Competition Squat / Bench / Deadlift Prep">Competition Squat / Bench / Deadlift Prep (60 min)</option>
                      <option value="Olympic Snatch & Clean Mobility Protocol">Olympic Snatch & Clean Mobility Protocol (60 min)</option>
                      <option value="Body Transformation & Body Composition Consultation">Body Transformation & Nutrition Consultation (60 min)</option>
                    </select>
                  </div>

                  {/* Date & Time Slot Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-300 tracking-wider mb-1.5 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-400" />
                        <span>Appointment Date</span>
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-300 tracking-wider mb-1.5 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-gold-400" />
                        <span>Select Available Slot</span>
                      </label>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => {
                          ironAudio.playClick();
                          setSelectedTimeSlot(e.target.value);
                        }}
                        className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-400 focus:outline-none font-mono"
                      >
                        {selectedTrainer.availableHours.map((hour) => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Client Info Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Your Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                      />
                      {formErrors.clientName && <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.clientName}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Email *</label>
                      <input
                        type="email"
                        placeholder="john@apex.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                      />
                      {formErrors.clientEmail && <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.clientEmail}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">Phone *</label>
                      <input
                        type="tel"
                        placeholder="+1 555-000-0000"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                      />
                      {formErrors.clientPhone && <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.clientPhone}</p>}
                    </div>
                  </div>

                  {/* Notes / Goals */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
                      Focus Area or Past Injuries (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. History of rotator cuff impingement; seeking bar path corrections..."
                      className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                    />
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-iron-950 p-3 rounded-lg border border-iron-800 text-[11px] text-gray-400 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>Booking is logged into the IRONVEX live coaching calendar with SMS appointment confirmation.</span>
                  </div>

                  <div className="flex justify-end space-x-3 pt-3 border-t border-iron-800">
                    <button
                      type="button"
                      onClick={() => setSelectedTrainer(null)}
                      className="px-4 py-2 rounded-lg text-xs font-mono uppercase text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-lg bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-1.5"
                    >
                      {isSubmitting ? (
                        <span>Securing Slot...</span>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-black" />
                          <span>Confirm Booking Reservation</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Booking Confirmed State */
                <div className="text-center space-y-4 py-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 border border-gold-400/40 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-heading font-black text-white">APPOINTMENT RESERVED</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      A booking pass has been issued for your private training session.
                    </p>
                  </div>

                  <div className="bg-iron-950 p-4 rounded-xl border border-gold-500/30 text-left space-y-2 text-xs max-w-sm mx-auto">
                    <div className="flex justify-between border-b border-iron-800 pb-2">
                      <span className="text-gray-400 font-mono">Confirmation Code:</span>
                      <strong className="text-gold-400 font-mono">{confirmedBooking.bookingCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coach:</span>
                      <span className="text-white font-bold">{confirmedBooking.trainerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date & Slot:</span>
                      <span className="text-white font-mono">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Athlete:</span>
                      <span className="text-white">{confirmedBooking.memberName}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        ironAudio.playClick();
                        setSelectedTrainer(null);
                      }}
                      className="px-6 py-2.5 rounded-lg bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110"
                    >
                      Close & Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
