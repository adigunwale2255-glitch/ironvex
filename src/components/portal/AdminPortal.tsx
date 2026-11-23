import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { 
  ShieldAlert, Users, Dumbbell, Award, CreditCard, 
  Calendar, BarChart3, Bell, Settings, LogOut, Search, 
  Plus, Check, X, Edit, Trash2, CheckCircle2, AlertCircle, 
  DollarSign, RefreshCw, ChevronRight, ExternalLink, Volume2, VolumeX
} from 'lucide-react';
import { ironAudio } from '../../lib/ironAudio';
import { 
  getStoredUsers, saveUser, getStoredPlans, savePlan, 
  getStoredTrainers, saveTrainer, deleteTrainer, 
  getStoredBookings, updateBookingStatus, getStoredPayments, 
  getStoredSubscriptions, saveSubscription, getGymSettings, 
  saveGymSettings, addNotification 
} from '../../lib/storage';
import { UserProfile, MembershipPlan, TrainerProfile, TrainerBooking, PaymentTransaction } from '../../types';

interface AdminPortalProps {
  onSwitchToMember?: () => void;
  onSwitchToWebsite?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onSwitchToMember,
  onSwitchToWebsite
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'members' | 'trainers' | 'memberships' | 
    'subscriptions' | 'payments' | 'bookings' | 'notifications' | 'settings'
  >('overview');

  const [isMuted, setIsMuted] = useState(ironAudio.isMuted);

  // Data states
  const [members, setMembers] = useState<UserProfile[]>(() => getStoredUsers().filter(u => u.role === 'member'));
  const [trainers, setTrainers] = useState<TrainerProfile[]>(getStoredTrainers);
  const [plans, setPlans] = useState<MembershipPlan[]>(getStoredPlans);
  const [bookings, setBookings] = useState<TrainerBooking[]>(getStoredBookings);
  const [payments, setPayments] = useState<PaymentTransaction[]>(getStoredPayments);
  const [subscriptions, setSubscriptions] = useState(getStoredSubscriptions);
  const [settings, setSettings] = useState(getGymSettings);

  // Search & Filter
  const [searchMember, setSearchMember] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  // Modals
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [trainerName, setTrainerName] = useState('');
  const [trainerSpecialty, setTrainerSpecialty] = useState('');
  const [trainerRate, setTrainerRate] = useState(110);
  const [trainerBio, setTrainerBio] = useState('');

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);

  // Settings Saved Toast
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const toggleSound = () => {
    const muted = ironAudio.toggleMute();
    setIsMuted(muted);
  };

  const reloadData = () => {
    setMembers(getStoredUsers().filter(u => u.role === 'member'));
    setTrainers(getStoredTrainers());
    setPlans(getStoredPlans());
    setBookings(getStoredBookings());
    setPayments(getStoredPayments());
    setSubscriptions(getStoredSubscriptions());
    ironAudio.playClick();
  };

  // KPI Calculations
  const totalMembersCount = members.length;
  const activeSubsCount = subscriptions.filter(s => s.status === 'active').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending Review').length;
  const totalRevenue = payments.reduce((acc, p) => p.status === 'success' ? acc + p.amount : acc, 0);

  const handleToggleMemberRole = (m: UserProfile) => {
    ironAudio.playClick();
    const updated: UserProfile = { ...m, emergencyContact: m.emergencyContact === 'SUSPENDED' ? 'Active' : 'SUSPENDED' };
    saveUser(updated);
    reloadData();
  };

  const handleUpdateBooking = (id: string, status: 'Confirmed' | 'Cancelled' | 'Completed') => {
    ironAudio.playClick();
    updateBookingStatus(id, status);
    reloadData();
  };

  const handleSavePrice = (planId: string, newPrice: number) => {
    ironAudio.playSuccess();
    const target = plans.find(p => p.id === planId);
    if (target) {
      target.priceMonthly = newPrice;
      target.priceAnnual = Math.round(newPrice * 0.8);
      savePlan(target);
      reloadData();
    }
  };

  const handleCreateTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerName.trim() || !trainerSpecialty.trim()) return;

    const newTr: TrainerProfile = {
      id: `tr-${Date.now()}`,
      name: trainerName.trim(),
      title: 'Certified IRONVEX Coach',
      bio: trainerBio.trim() || 'Elite strength conditioning and athletic bio-mechanics coach.',
      specialization: trainerSpecialty.trim(),
      experienceYears: 6,
      categories: ['Full Body', 'Legs', 'Chest'],
      hourlyRate: Number(trainerRate),
      rating: 5.0,
      reviewsCount: 1,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      certifications: ['CSCS (NSCA)', 'IRONVEX Master Tier'],
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableHours: ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'],
      isActive: true
    };

    saveTrainer(newTr);
    setShowAddTrainer(false);
    ironAudio.playSuccess();
    setTrainerName('');
    setTrainerSpecialty('');
    setTrainerBio('');
    reloadData();
  };

  const handleDeleteTrainer = (id: string) => {
    ironAudio.playClick(600);
    deleteTrainer(id);
    reloadData();
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    addNotification({
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title: announcementTitle.trim(),
      message: announcementMsg.trim(),
      type: 'announcement',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    ironAudio.playSuccess();
    setAnnouncementSent(true);
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setTimeout(() => setAnnouncementSent(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveGymSettings(settings);
    ironAudio.playSuccess();
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users, badge: `${totalMembersCount}` },
    { id: 'trainers', label: 'Trainers', icon: Dumbbell, badge: `${trainers.length}` },
    { id: 'memberships', label: 'Plans & Pricing', icon: Award },
    { id: 'subscriptions', label: 'Subscriptions', icon: Award, badge: `${activeSubsCount}` },
    { id: 'payments', label: 'Payments (Gateways)', icon: CreditCard },
    { id: 'bookings', label: 'Bookings Queue', icon: Calendar, badge: pendingBookingsCount > 0 ? `${pendingBookingsCount}` : undefined },
    { id: 'notifications', label: 'Broadcast Dispatch', icon: Bell },
    { id: 'settings', label: 'Gym Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-iron-950 text-white flex flex-col md:flex-row font-sans selection:bg-gold-500 selection:text-black">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-iron-950 border-r border-gold-500/20 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-iron-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-black border border-gold-500/40 p-1 shadow-gold-glow flex items-center justify-center">
                <img src="/ironvex-logo.png" alt="IRONVEX" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-heading font-black text-lg tracking-wider text-white">
                    IRON<span className="text-gold-400">VEX</span>
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono font-bold">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                  EXECUTIVE HQ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                !isMuted ? 'border-gold-500/40 bg-gold-500/10 text-gold-400' : 'border-iron-800 text-gray-500'
              }`}
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    ironAudio.playClick(900);
                    setActiveTab(item.id as any);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-gradient-gold text-black font-black shadow-gold-glow'
                      : 'text-gray-400 hover:bg-iron-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive 
                        ? 'bg-black/30 text-black' 
                        : 'bg-iron-900 text-gold-400 border border-iron-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-iron-900 space-y-2">
          {onSwitchToMember && (
            <button
              onClick={() => {
                ironAudio.playClick(1000);
                onSwitchToMember();
              }}
              className="w-full py-2 px-3 rounded-xl bg-iron-900 hover:bg-iron-800 border border-iron-800 text-gray-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors"
            >
              <span>Member Portal View</span>
              <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
            </button>
          )}

          {onSwitchToWebsite && (
            <button
              onClick={() => {
                ironAudio.playClick(900);
                onSwitchToWebsite();
              }}
              className="w-full py-2 px-3 rounded-xl bg-iron-950 hover:bg-iron-900 border border-iron-800 text-gray-400 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors"
            >
              <span>Public Club Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}

          <button
            onClick={() => {
              ironAudio.playClick(600);
              logout();
            }}
            className="w-full py-2 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-400 hover:text-rose-300 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 bg-iron-950/80 backdrop-blur-md border-b border-gold-500/20 px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-3">
            <h2 className="font-heading font-black text-lg text-white uppercase tracking-wider">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="text-xs font-mono text-gold-400 hidden sm:inline">
              EXECUTIVE CONSOLE
            </span>
          </div>

          <button
            type="button"
            onClick={reloadData}
            className="px-3 py-1.5 bg-iron-900 hover:bg-iron-800 border border-iron-700 text-xs font-mono text-gray-300 hover:text-gold-400 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Data</span>
          </button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>TOTAL ATHLETES</span>
                    <Users className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-heading font-black text-white">{totalMembersCount}</div>
                  <span className="text-[11px] font-mono text-emerald-400">100% active retention</span>
                </div>

                <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>ACTIVE SUBSCRIPTIONS</span>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-heading font-black text-emerald-400">{activeSubsCount}</div>
                  <span className="text-[11px] font-mono text-gray-400">Pro & Elite tiers</span>
                </div>

                <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>PROCESSED REVENUE</span>
                    <DollarSign className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-heading font-black text-gold-400">${totalRevenue}.00</div>
                  <span className="text-[11px] font-mono text-gray-400">Paystack & Flutterwave</span>
                </div>

                <div className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>PENDING BOOKINGS</span>
                    <Calendar className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-heading font-black text-white">{pendingBookingsCount}</div>
                  <span className="text-[11px] font-mono text-amber-400">Requires coach confirmation</span>
                </div>

              </div>

              {/* Revenue & Growth Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-7 bg-iron-950 p-6 rounded-2xl border border-iron-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading font-bold text-white text-base">MONTHLY REVENUE RUN-RATE</h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+28% vs Last Quarter</span>
                  </div>
                  
                  {/* Visual Bar Chart */}
                  <div className="grid grid-cols-6 gap-3 pt-4 items-end h-44">
                    {[
                      { m: 'Jun', rev: 4200 },
                      { m: 'Jul', rev: 5400 },
                      { m: 'Aug', rev: 6800 },
                      { m: 'Sep', rev: 8200 },
                      { m: 'Oct', rev: 9500 },
                      { m: 'Nov', rev: 12400 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-1">
                        <span className="text-[10px] font-mono text-gray-400">${(item.rev / 1000).toFixed(1)}k</span>
                        <div className="w-full bg-iron-900 rounded-lg overflow-hidden h-32 flex flex-col justify-end p-0.5">
                          <div 
                            className="w-full bg-gradient-gold rounded" 
                            style={{ height: `${(item.rev / 13000) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-heading text-white">{item.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-iron-950 p-6 rounded-2xl border border-iron-800 space-y-4">
                  <h3 className="font-heading font-bold text-white text-base">MEMBERSHIP PLAN ALLOCATION</h3>
                  <div className="space-y-3 pt-2">
                    {plans.map((p) => (
                      <div key={p.id} className="space-y-1 text-xs">
                        <div className="flex justify-between text-gray-300">
                          <span>{p.name} Tier (${p.priceMonthly}/mo)</span>
                          <span className="text-gold-400 font-bold">{p.name === 'Pro' ? '54%' : p.name === 'Elite' ? '28%' : '18%'}</span>
                        </div>
                        <div className="h-2 w-full bg-iron-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-gold rounded-full"
                            style={{ width: p.name === 'Pro' ? '54%' : p.name === 'Elite' ? '28%' : '18%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. MEMBERS MANAGEMENT */}
          {activeTab === 'members' && (
            <div className="space-y-4 animate-fadeIn max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search athlete by name or email..."
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    className="w-full bg-iron-950 border border-iron-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-gray-400">Total: {members.length} Athletes</span>
                </div>
              </div>

              <div className="bg-iron-950 rounded-2xl border border-iron-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-iron-900 text-gray-400 border-b border-iron-800">
                    <tr>
                      <th className="p-3.5">Athlete</th>
                      <th className="p-3.5">Goal</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Enrolled</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-iron-800/60">
                    {members
                      .filter(m => m.fullName.toLowerCase().includes(searchMember.toLowerCase()) || m.email.toLowerCase().includes(searchMember.toLowerCase()))
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-iron-900/40">
                          <td className="p-3.5">
                            <strong className="text-white font-sans text-sm block">{m.fullName}</strong>
                            <span className="text-gray-400 text-[11px]">{m.email}</span>
                          </td>
                          <td className="p-3.5 capitalize text-gold-400 font-bold">{m.fitnessGoal.replace('_', ' ')}</td>
                          <td className="p-3.5 text-gray-300">{m.phone}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              m.emergencyContact === 'SUSPENDED'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {m.emergencyContact === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE'}
                            </span>
                          </td>
                          <td className="p-3.5 text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</td>
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleMemberRole(m)}
                              className="px-2.5 py-1 bg-iron-900 hover:bg-iron-800 border border-iron-700 rounded text-[11px] text-gray-300"
                            >
                              {m.emergencyContact === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. TRAINERS MANAGEMENT */}
          {activeTab === 'trainers' && (
            <div className="space-y-4 animate-fadeIn max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-heading font-black text-white">MASTER COACH CADRE</h3>
                  <p className="text-xs text-gray-400">Configure trainers, hourly booking rates, and specialties.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTrainer(true)}
                  className="px-4 py-2 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Master Trainer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainers.map((tr) => (
                  <div key={tr.id} className="bg-iron-950 p-5 rounded-2xl border border-iron-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading font-bold text-white text-base">{tr.name}</h4>
                          <span className="text-gold-400 text-xs font-mono">{tr.specialization}</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">${tr.hourlyRate}/hr</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">{tr.bio}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-iron-900 text-xs font-mono">
                      <span className="text-gray-400">{tr.availableDays.length} Days Active</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTrainer(tr.id)}
                        className="text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PLANS & PRICING */}
          {activeTab === 'memberships' && (
            <div className="space-y-4 animate-fadeIn max-w-7xl mx-auto">
              <div>
                <h3 className="text-xl font-heading font-black text-white">MEMBERSHIP PLAN PRICING</h3>
                <p className="text-xs text-gray-400">Adjust monthly subscription fees and amenities in real time.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((p) => (
                  <div key={p.id} className="bg-iron-950 p-6 rounded-2xl border border-iron-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-heading font-black text-lg text-white">{p.name} Tier</h4>
                      <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Active</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Monthly Fee ($)</label>
                      <input
                        type="number"
                        defaultValue={p.priceMonthly}
                        onBlur={(e) => handleSavePrice(p.id, Number(e.target.value))}
                        className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2 text-white font-mono text-sm focus:border-gold-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 border-t border-iron-900 pt-3 text-xs text-gray-300">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. BOOKINGS QUEUE */}
          {activeTab === 'bookings' && (
            <div className="space-y-4 animate-fadeIn max-w-7xl mx-auto">
              <h3 className="text-xl font-heading font-black text-white">TRAINER APPOINTMENT QUEUE</h3>
              
              <div className="bg-iron-950 rounded-2xl border border-iron-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-iron-900 text-gray-400 border-b border-iron-800">
                    <tr>
                      <th className="p-3.5">Ref</th>
                      <th className="p-3.5">Athlete</th>
                      <th className="p-3.5">Coach</th>
                      <th className="p-3.5">Date & Slot</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-iron-800/60">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-iron-900/40">
                        <td className="p-3.5 text-gold-400 font-bold">{b.bookingCode}</td>
                        <td className="p-3.5 text-white font-sans">{b.memberName}</td>
                        <td className="p-3.5 text-gray-300">{b.trainerName}</td>
                        <td className="p-3.5 text-gray-400">{b.date} • {b.timeSlot}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3.5 space-x-2">
                          {b.status !== 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBooking(b.id, 'Confirmed')}
                              className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded text-[10px]"
                            >
                              Approve
                            </button>
                          )}
                          {b.status !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBooking(b.id, 'Completed')}
                              className="px-2 py-1 bg-iron-900 text-gray-300 border border-iron-700 rounded text-[10px]"
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

          {/* 6. BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl mx-auto bg-iron-950 p-6 sm:p-8 rounded-2xl border border-iron-800 space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-xl font-heading font-black text-white">BROADCAST GYM ANNOUNCEMENT</h3>
                <p className="text-xs text-gray-400">Dispatches in-app notification alerts instantly to all enrolled athletes.</p>
              </div>

              {announcementSent && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300">
                  Announcement transmitted to all members.
                </div>
              )}

              <form onSubmit={handleSendAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="e.g. Extended Weekend Recovery Sauna Hours"
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Announcement Body</label>
                  <textarea
                    rows={4}
                    value={announcementMsg}
                    onChange={(e) => setAnnouncementMsg(e.target.value)}
                    placeholder="Provide details regarding new equipment calibrations, holiday schedules, or coach clinics..."
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow"
                >
                  Broadcast Notice
                </button>
              </form>
            </div>
          )}

          {/* 7. GYM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-iron-950 p-6 sm:p-8 rounded-2xl border border-iron-800 space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-xl font-heading font-black text-white">OPERATIONAL SETTINGS</h3>
                <p className="text-xs text-gray-400">Manage payment gateway public API keys and club parameters.</p>
              </div>

              {settingsSavedToast && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300">
                  Settings saved successfully.
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Facility Name</label>
                  <input
                    type="text"
                    value={settings.gymName}
                    onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Paystack Public Key</label>
                  <input
                    type="text"
                    value={settings.paystackPublicKey}
                    onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Flutterwave Public Key</label>
                  <input
                    type="text"
                    value={settings.flutterwavePublicKey}
                    onChange={(e) => setSettings({ ...settings, flutterwavePublicKey: e.target.value })}
                    className="w-full bg-iron-900 border border-iron-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-gold text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow"
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Add Trainer Modal */}
      {showAddTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-iron-900 border border-gold-500/40 rounded-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-iron-800 pb-3">
              <h4 className="font-heading font-bold text-white text-base">ENROLL MASTER TRAINER</h4>
              <button onClick={() => setShowAddTrainer(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Trainer Full Name *</label>
                <input
                  type="text"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  placeholder="e.g. Jackson 'Titan' Hayes"
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Specialization *</label>
                <input
                  type="text"
                  value={trainerSpecialty}
                  onChange={(e) => setTrainerSpecialty(e.target.value)}
                  placeholder="e.g. Olympic Snatch & Explosive Power"
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Hourly Session Rate ($)</label>
                <input
                  type="number"
                  value={trainerRate}
                  onChange={(e) => setTrainerRate(Number(e.target.value))}
                  className="w-full bg-iron-950 border border-iron-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrainer(false)}
                  className="px-3 py-2 text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-gold text-black font-heading font-black text-xs uppercase rounded-lg shadow-gold-glow"
                >
                  Enroll Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
