import React, { useState, useEffect } from 'react';
import { MemberRecord, BookingRequest } from '../types';
import { getCurrentMember, getMembers, getBookings, getPRRecords, savePRRecord, PRRecord, saveMember } from '../lib/storage';
import { ironAudio } from '../lib/ironAudio';
import { 
  X, Award, Shield, Dumbbell, Calendar, Clock, Trophy, 
  Plus, Check, Save, User, Phone, Sparkles 
} from 'lucide-react';

interface MemberDashboardProps {
  onClose: () => void;
  onOpenMembership: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onClose, onOpenMembership }) => {
  const [member, setMember] = useState<MemberRecord>(getCurrentMember);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [prs, setPRs] = useState<PRRecord[]>(getPRRecords);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [phone, setPhone] = useState(member?.phone || '');
  const [emergencyContact, setEmergencyContact] = useState(member?.emergencyContact || '');

  // Add PR state
  const [newExercise, setNewExercise] = useState('Bench Press');
  const [newWeight, setNewWeight] = useState<number>(325);
  const [showAddPR, setShowAddPR] = useState(false);

  useEffect(() => {
    const allBookings = getBookings();
    if (member) {
      const memberBookings = allBookings.filter(
        b => b.memberEmail.toLowerCase() === member.email.toLowerCase() || b.memberName.toLowerCase() === member.fullName.toLowerCase()
      );
      setBookings(memberBookings);
    }
  }, [member]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    const updated: MemberRecord = {
      ...member,
      phone,
      emergencyContact
    };
    await saveMember(updated);
    setMember(updated);
    setIsEditingProfile(false);
    ironAudio.playSuccess();
  };

  const handleRecordPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight <= 0) return;
    const updated = savePRRecord({
      exercise: newExercise,
      weightLbs: Number(newWeight),
      date: new Date().toISOString().split('T')[0]
    });
    setPRs([...updated]);
    setShowAddPR(false);
    ironAudio.playSuccess();
  };

  if (!member) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="bg-iron-900 border border-gold-500/40 rounded-2xl p-8 max-w-md text-center space-y-4">
          <Award className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-heading font-black text-xl text-white">NO ACTIVE MEMBERSHIP DETECTED</h3>
          <p className="text-xs text-gray-400">
            Join the IRONVEX elite roster or choose a membership package to access your member pass and athlete dashboard.
          </p>
          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-iron-800 text-xs font-mono text-gray-300 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenMembership();
              }}
              className="px-6 py-2 rounded-lg bg-gradient-gold text-black font-heading font-black text-xs uppercase shadow-gold-glow"
            >
              Explore Memberships
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-iron-900 border border-gold-500/40 rounded-2xl shadow-2xl shadow-gold-500/10 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-iron-950 px-6 py-4 border-b border-gold-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center font-bold font-mono">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center space-x-2">
                <span>{member.fullName}</span>
                <span className="text-[11px] font-mono bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded border border-gold-500/30">
                  {member.planName}
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                ID: {member.memberNumber} • Status: <span className="text-emerald-400 font-bold">{member.status}</span>
              </p>
            </div>
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

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Workouts Logged</span>
              <span className="font-heading font-black text-2xl text-white mt-1 block">
                {member.completedWorkoutsCount + 3}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">↑ 4 this week</span>
            </div>

            <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Weekly Streak</span>
              <span className="font-heading font-black text-2xl text-gold-400 mt-1 block">5 Days</span>
              <span className="text-[10px] font-mono text-gray-400 mt-1 block">Current record: 14</span>
            </div>

            <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Trainer Sessions</span>
              <span className="font-heading font-black text-2xl text-white mt-1 block">
                {bookings.length}
              </span>
              <span className="text-[10px] font-mono text-gold-400 mt-1 block">Active on calendar</span>
            </div>

            <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Club Privileges</span>
              <span className="font-heading font-bold text-sm text-emerald-400 mt-1 block truncate">
                {member.planId === 'black-gold-vip' ? 'All-Access VIP' : 'Full Platform Access'}
              </span>
              <span className="text-[10px] font-mono text-gray-400 mt-1 block">Valid 24/7/365</span>
            </div>
          </div>

          {/* Digital VIP Keycard & Barcode */}
          <div className="bg-gradient-to-r from-iron-950 via-iron-900 to-black p-6 rounded-2xl border border-gold-500/40 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold block">
                  DIGITAL BIOMETRIC KEYCARD
                </span>
                <h4 className="font-heading font-black text-xl text-white mt-0.5">IRONVEX ATHLETE PASS</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  ironAudio.playClick();
                  window.print();
                }}
                className="px-3 py-1.5 rounded bg-iron-800 hover:bg-iron-700 text-xs font-mono text-gray-300 hover:text-white border border-iron-700 transition-colors"
              >
                Print / Save Pass
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono border-t border-iron-800 pt-3">
              <div>
                <span className="text-gray-400 block text-[10px]">MEMBER NAME</span>
                <span className="text-white font-bold text-sm">{member.fullName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">MEMBERSHIP TIER</span>
                <span className="text-gold-400 font-bold">{member.planName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">ACTIVATION DATE</span>
                <span className="text-gray-300">{member.startDate}</span>
              </div>
            </div>

            {/* Barcode Strip */}
            <div className="mt-4 pt-3 border-t border-iron-800/80 bg-black/60 p-3 rounded-lg text-center">
              <div className="flex justify-center items-center space-x-1.5 h-8 overflow-hidden opacity-85">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gold-400"
                    style={{ width: `${(i % 3) + 1.2}px`, height: `${20 + (i % 4) * 3}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-gold-400 tracking-widest block mt-1">
                {member.qrCode}
              </span>
            </div>
          </div>

          {/* Personal Records (PRs) Tracker & Personal Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PRs Card */}
            <div className="bg-iron-950 p-5 rounded-xl border border-iron-800 space-y-4">
              <div className="flex justify-between items-center border-b border-iron-800 pb-2">
                <div className="flex items-center space-x-2 text-white font-heading font-bold text-sm">
                  <Trophy className="w-4 h-4 text-gold-400" />
                  <span>PERSONAL LIFT RECORDS (PR)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    setShowAddPR(!showAddPR);
                  }}
                  className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log PR</span>
                </button>
              </div>

              {showAddPR && (
                <form onSubmit={handleRecordPR} className="bg-iron-900 p-3 rounded-lg border border-gold-500/30 space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">Exercise</label>
                    <select
                      value={newExercise}
                      onChange={(e) => setNewExercise(e.target.value)}
                      className="w-full bg-iron-950 border border-iron-700 rounded p-1.5 text-white text-xs"
                    >
                      <option value="Bench Press">Bench Press</option>
                      <option value="Barbell Back Squat">Barbell Back Squat</option>
                      <option value="Conventional Deadlift">Conventional Deadlift</option>
                      <option value="Strict Overhead Press">Strict Overhead Press</option>
                      <option value="Barbell Hip Thrust">Barbell Hip Thrust</option>
                      <option value="Weighted Pull-Up">Weighted Pull-Up</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">Weight (lbs)</label>
                    <input
                      type="number"
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full bg-iron-950 border border-iron-700 rounded p-1.5 text-white text-xs font-mono"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddPR(false)}
                      className="px-2 py-1 text-gray-400 hover:text-white text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-gradient-gold text-black font-heading font-black text-[11px] rounded"
                    >
                      Save Lift
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {prs.map((pr, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-iron-900/60 text-xs border border-iron-800/80">
                    <div>
                      <span className="text-white font-semibold block">{pr.exercise}</span>
                      <span className="text-[10px] text-gray-400 font-mono">Logged: {pr.date}</span>
                    </div>
                    <span className="font-heading font-black text-gold-400 text-sm">
                      {pr.weightLbs} lbs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile & Emergency Contact */}
            <div className="bg-iron-950 p-5 rounded-xl border border-iron-800 space-y-4">
              <div className="flex justify-between items-center border-b border-iron-800 pb-2">
                <div className="flex items-center space-x-2 text-white font-heading font-bold text-sm">
                  <User className="w-4 h-4 text-gold-400" />
                  <span>ATHLETE CONTACT RECORDS</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    ironAudio.playClick();
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="text-xs font-mono text-gold-400 hover:text-gold-300"
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Info'}
                </button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-iron-900 border border-iron-700 rounded p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full bg-iron-900 border border-iron-700 rounded p-2 text-white text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-gold text-black font-heading font-black text-xs uppercase rounded flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Contact Changes</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-mono">REGISTERED EMAIL</span>
                    <span className="text-white font-mono">{member.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-mono">PRIMARY PHONE</span>
                    <span className="text-white font-mono">{member.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-mono">EMERGENCY CONTACT</span>
                    <span className="text-white">{member.emergencyContact || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-mono">BILLING TERM</span>
                    <span className="text-gold-400 font-mono capitalize">{member.billingCycle} (${member.amountPaid} Total)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Trainer Appointments */}
          <div className="bg-iron-950 p-5 rounded-xl border border-iron-800 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white flex items-center space-x-2 border-b border-iron-800 pb-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>UPCOMING TRAINER SESSIONS</span>
            </h4>

            {bookings.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center">
                No active trainer bookings recorded. Visit the Master Trainers section to book a 1-on-1 session.
              </p>
            ) : (
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="p-3 bg-iron-900/70 rounded-lg border border-iron-800 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-white">{b.trainerName}</strong>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[11px] mt-0.5">{b.serviceType}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-gold-400 font-bold block">{b.date} • {b.timeSlot}</span>
                      <span className="text-[10px] font-mono text-gray-400">Pass Code: {b.bookingCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
