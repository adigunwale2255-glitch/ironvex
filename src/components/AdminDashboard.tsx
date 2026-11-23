import React, { useState, useEffect } from 'react';
import { MemberRecord, BookingRequest, ContactMessage } from '../types';
import { 
  getMembers, getBookings, getMessages, updateBookingStatus, 
  updateMessageStatus, saveMember 
} from '../lib/storage';
import { MEMBERSHIP_PLANS, SEED_TRAINERS } from '../lib/supabase';
import { ironAudio } from '../lib/ironAudio';
import { 
  ShieldAlert, Users, DollarSign, Calendar, MessageSquare, 
  X, Check, Lock, Unlock, Search, Filter, RefreshCw 
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Data states
  const [activeTab, setActiveTab] = useState<'members' | 'bookings' | 'messages' | 'plans'>('members');
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAllData = () => {
    setMembers(getMembers());
    setBookings(getBookings());
    setMessages(getMessages());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '8888' || pin === 'admin') {
      ironAudio.playSuccess();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      ironAudio.playClank();
      setPinError(true);
    }
  };

  const quickDemoUnlock = () => {
    ironAudio.playSuccess();
    setPin('8888');
    setIsAuthenticated(true);
  };

  const toggleMemberStatus = async (m: MemberRecord) => {
    const updatedStatus = m.status === 'Active' ? 'On Hold' : 'Active';
    const updated: MemberRecord = { ...m, status: updatedStatus };
    await saveMember(updated);
    setMembers(getMembers());
    ironAudio.playClick();
  };

  const handleBookingStatus = (id: string, st: 'Confirmed' | 'Pending Review' | 'Completed') => {
    updateBookingStatus(id, st);
    setBookings(getBookings());
    ironAudio.playClick();
  };

  const handleMessageStatus = (id: string, st: 'New' | 'Replied' | 'Archived') => {
    updateMessageStatus(id, st);
    setMessages(getMessages());
    ironAudio.playClick();
  };

  // KPIs
  const totalMembers = members.length;
  const estimatedMRR = members.reduce((sum, m) => {
    const plan = MEMBERSHIP_PLANS.find(p => p.id === m.planId);
    return sum + (plan ? (m.billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly) : 79);
  }, 0);
  const pendingBookings = bookings.filter(b => b.status === 'Pending Review').length;
  const newMessagesCount = messages.filter(m => m.status === 'New').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-iron-900 border border-gold-500/40 rounded-2xl shadow-2xl shadow-gold-500/10 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-iron-950 px-6 py-4 border-b border-gold-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-gold-400" />
            <div>
              <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                IRONVEX EXECUTIVE COMMAND CENTER
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Platform Operations & Management Console
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

        {/* Lock Screen if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="p-10 text-center space-y-6 max-w-md mx-auto my-auto animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-heading font-black text-white">RESTRICTED EXECUTIVE ACCESS</h4>
              <p className="text-xs text-gray-400 mt-1">
                Enter your administrative PIN authorization to manage members, appointments, and billing infrastructure.
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Security PIN (8888)"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full bg-iron-950 border border-iron-700 text-center text-lg tracking-widest text-white rounded-lg p-3 font-mono focus:border-gold-400 focus:outline-none"
                />
                {pinError && (
                  <p className="text-rose-400 text-xs font-mono mt-1">
                    Invalid PIN authorization. (Demo PIN: 8888)
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-lg shadow-gold-glow hover:brightness-110 active:scale-95"
                >
                  Verify Authorization
                </button>
                <button
                  type="button"
                  onClick={quickDemoUnlock}
                  className="px-4 py-3 bg-iron-800 text-gold-400 hover:text-white rounded-lg text-xs font-mono uppercase border border-iron-700"
                >
                  Quick Unlock (8888)
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Content */
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
                <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                  <span>TOTAL REGISTERED</span>
                  <Users className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-2xl font-heading font-black text-white mt-2">
                  {totalMembers} Members
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">100% Retained</span>
              </div>

              <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
                <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                  <span>ESTIMATED MRR</span>
                  <DollarSign className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-2xl font-heading font-black text-gold-400 mt-2">
                  ${estimatedMRR.toLocaleString()} / mo
                </div>
                <span className="text-[10px] text-gray-400 font-mono">Run-rate basis</span>
              </div>

              <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
                <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                  <span>BOOKING SESSIONS</span>
                  <Calendar className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-2xl font-heading font-black text-white mt-2">
                  {bookings.length} Total
                </div>
                <span className="text-[10px] text-gold-400 font-mono">
                  {pendingBookings} awaiting review
                </span>
              </div>

              <div className="bg-iron-950 p-4 rounded-xl border border-iron-800">
                <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                  <span>CONCIERGE INQUIRIES</span>
                  <MessageSquare className="w-4 h-4 text-gold-400" />
                </div>
                <div className="text-2xl font-heading font-black text-white mt-2">
                  {messages.length} Total
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {newMessagesCount} new unread
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-iron-800 gap-2">
              {[
                { id: 'members', label: `Members (${members.length})` },
                { id: 'bookings', label: `Trainer Bookings (${bookings.length})` },
                { id: 'messages', label: `Inquiries (${messages.length})` },
                { id: 'plans', label: 'Tiers & Configuration' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    ironAudio.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-gold-400 text-gold-400 bg-iron-950/50'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: MEMBERS MANAGEMENT */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search member name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-iron-950 border border-iron-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={loadAllData}
                    className="p-2 rounded-lg bg-iron-950 border border-iron-800 text-gray-300 hover:text-gold-400 text-xs flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-iron-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-iron-950 text-gray-400 border-b border-iron-800">
                      <tr>
                        <th className="p-3">Member ID</th>
                        <th className="p-3">Athlete</th>
                        <th className="p-3">Plan Tier</th>
                        <th className="p-3">Cycle</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-iron-800/60 bg-iron-900/40">
                      {members
                        .filter(m => 
                          m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.memberNumber.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((m) => (
                          <tr key={m.id} className="hover:bg-iron-800/40">
                            <td className="p-3 text-gold-400 font-bold">{m.memberNumber}</td>
                            <td className="p-3">
                              <span className="text-white font-sans font-bold block">{m.fullName}</span>
                              <span className="text-[10px] text-gray-400">{m.email}</span>
                            </td>
                            <td className="p-3 text-gray-300">{m.planName}</td>
                            <td className="p-3 capitalize text-gray-400">{m.billingCycle}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] border ${
                                m.status === 'Active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                type="button"
                                onClick={() => toggleMemberStatus(m)}
                                className="px-2 py-1 rounded bg-iron-800 hover:bg-iron-700 text-[10px] text-gray-300"
                              >
                                {m.status === 'Active' ? 'Hold' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-iron-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-iron-950 text-gray-400 border-b border-iron-800">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Member</th>
                        <th className="p-3">Coach</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Date & Slot</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-iron-800/60 bg-iron-900/40">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-iron-800/40">
                          <td className="p-3 text-gold-400 font-bold">{b.bookingCode}</td>
                          <td className="p-3">
                            <span className="text-white font-sans font-bold block">{b.memberName}</span>
                            <span className="text-[10px] text-gray-400">{b.memberEmail}</span>
                          </td>
                          <td className="p-3 text-white">{b.trainerName}</td>
                          <td className="p-3 text-gray-400 text-[11px] max-w-xs truncate">{b.serviceType}</td>
                          <td className="p-3 text-gray-300">{b.date} {b.timeSlot}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] border ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : b.status === 'Completed'
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3 space-x-1">
                            {b.status !== 'Confirmed' && (
                              <button
                                onClick={() => handleBookingStatus(b.id, 'Confirmed')}
                                className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px]"
                              >
                                Confirm
                              </button>
                            )}
                            {b.status !== 'Completed' && (
                              <button
                                onClick={() => handleBookingStatus(b.id, 'Completed')}
                                className="px-2 py-1 rounded bg-iron-800 text-gray-300 text-[10px]"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CONTACT MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="p-4 bg-iron-950 rounded-xl border border-iron-800 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-white font-heading text-sm">{m.name}</strong>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${
                            m.status === 'New'
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                              : 'bg-iron-800 text-gray-400 border-iron-700'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-gray-400 font-mono text-[11px] mt-0.5">
                          {m.email} • {m.phone} • {new Date(m.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        {m.status !== 'Replied' && (
                          <button
                            onClick={() => handleMessageStatus(m.id, 'Replied')}
                            className="px-2.5 py-1 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[10px] font-mono uppercase"
                          >
                            Mark Replied
                          </button>
                        )}
                        {m.status !== 'Archived' && (
                          <button
                            onClick={() => handleMessageStatus(m.id, 'Archived')}
                            className="px-2.5 py-1 rounded bg-iron-800 text-gray-400 text-[10px] font-mono uppercase"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-iron-900">
                      <span className="font-semibold text-gold-400/90 block mb-1">Subject: {m.subject}</span>
                      <p className="text-gray-300 leading-relaxed font-sans">{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: PLANS & CONFIGURATION */}
            {activeTab === 'plans' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MEMBERSHIP_PLANS.map((p) => (
                  <div key={p.id} className="p-4 bg-iron-950 rounded-xl border border-iron-800 space-y-2 text-xs">
                    <h5 className="font-heading font-bold text-white text-base">{p.name}</h5>
                    <p className="text-gold-400 font-mono font-bold">${p.priceMonthly}/mo (${p.priceAnnual}/mo annual)</p>
                    <p className="text-gray-400 text-[11px]">{p.tagline}</p>
                    <div className="pt-2 border-t border-iron-900 space-y-1">
                      {p.features.map((f, i) => (
                        <div key={i} className="text-gray-300 text-[10px] flex items-center space-x-1">
                          <Check className="w-3 h-3 text-gold-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
