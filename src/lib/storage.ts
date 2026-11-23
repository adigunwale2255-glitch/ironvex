import { 
  UserProfile, MembershipPlan, SubscriptionRecord, PaymentTransaction,
  WorkoutPlan, FitnessMeasurement, TrainerProfile, TrainerBooking,
  NotificationItem, GymSettings
} from '../types';

const STORAGE_KEYS = {
  USERS: 'ironvex_users_v2',
  CURRENT_USER: 'ironvex_current_user_v2',
  PLANS: 'ironvex_plans_v2',
  SUBSCRIPTIONS: 'ironvex_subscriptions_v2',
  PAYMENTS: 'ironvex_payments_v2',
  WORKOUTS: 'ironvex_workouts_v2',
  MEASUREMENTS: 'ironvex_measurements_v2',
  TRAINERS: 'ironvex_trainers_v2',
  BOOKINGS: 'ironvex_bookings_v2',
  NOTIFICATIONS: 'ironvex_notifications_v2',
  SETTINGS: 'ironvex_settings_v2'
};

// Seed Users
export const SEED_USERS: UserProfile[] = [
  {
    id: 'user-member-1',
    email: 'alex@ironvex.com',
    role: 'member',
    fullName: 'Alexander Wright',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1992-05-14',
    gender: 'male',
    fitnessGoal: 'strength',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    emergencyContact: 'Sarah Wright (+1 555-891-2345)',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-admin-1',
    email: 'admin@ironvex.com',
    role: 'admin',
    fullName: 'Master Chief Administrator',
    phone: '+1 (800) 847-6683',
    dateOfBirth: '1985-11-20',
    gender: 'male',
    fitnessGoal: 'general_fitness',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// Seed Plans (Basic, Pro, Elite)
export const SEED_PLANS: MembershipPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    tagline: 'Standard access for individual functional lifters.',
    priceMonthly: 49,
    priceAnnual: 39,
    durationMonths: 1,
    isActive: true,
    isPopular: false,
    features: [
      'Full Gym floor & standard equipment access',
      'Free weights & Olympic platforms',
      'Locker room & digital lock access',
      'Complimentary IRONVEX workout logging app',
      '1 Initial physical fitness assessment'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    tagline: 'Complete athletic conditioning with recovery amenities.',
    priceMonthly: 89,
    priceAnnual: 71,
    durationMonths: 1,
    isActive: true,
    isPopular: true,
    badge: 'MOST POPULAR',
    features: [
      'All Basic plan privileges included',
      'Full access to all Group Fitness & HIIT classes',
      'Infrared Nordic Sauna & Cold Plunge suite',
      '1 Monthly 1-on-1 Personal Training session',
      'Biometric body composition analysis',
      '15% Discount on Pro Shop & Fuel Bar'
    ]
  },
  {
    id: 'plan-elite',
    name: 'Elite',
    tagline: 'The pinnacle of luxury fitness and master coaching.',
    priceMonthly: 149,
    priceAnnual: 119,
    durationMonths: 1,
    isActive: true,
    isPopular: false,
    badge: 'VIP TIER',
    features: [
      'All Pro plan privileges included',
      'Weekly dedicated Master Coach 1-on-1 session',
      'Private VIP executive recovery lounge',
      'Unlimited guest passes for training partners',
      'Dedicated locker with complimentary laundry',
      'Priority booking window for all trainers and equipment'
    ]
  }
];

// Seed Subscriptions
export const SEED_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'sub-101',
    memberId: 'user-member-1',
    memberName: 'Alexander Wright',
    planId: 'plan-pro',
    planName: 'Pro',
    billingCycle: 'monthly',
    amount: 89,
    currency: 'USD',
    startDate: '2026-11-01',
    expiresAt: '2026-12-01',
    status: 'active',
    autoRenew: true,
    updatedAt: '2026-11-01T10:00:00Z'
  }
];

// Seed Payments (Paystack / Flutterwave)
export const SEED_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-201',
    reference: 'IV-PAY-882194',
    memberId: 'user-member-1',
    memberName: 'Alexander Wright',
    memberEmail: 'alex@ironvex.com',
    planId: 'plan-pro',
    planName: 'Pro Membership (1 Month)',
    amount: 89,
    currency: 'USD',
    gateway: 'paystack',
    status: 'success',
    createdAt: '2026-11-01T10:05:00Z',
    channel: 'card'
  },
  {
    id: 'pay-202',
    reference: 'IV-PAY-774921',
    memberId: 'user-member-1',
    memberName: 'Alexander Wright',
    memberEmail: 'alex@ironvex.com',
    planId: 'plan-pro',
    planName: 'Pro Membership (1 Month)',
    amount: 89,
    currency: 'USD',
    gateway: 'flutterwave',
    status: 'success',
    createdAt: '2026-10-01T09:30:00Z',
    channel: 'bank_transfer'
  }
];

// Seed Trainers
export const SEED_TRAINERS: TrainerProfile[] = [
  {
    id: 'tr-1',
    name: 'Marcus "Vanguard" Stone',
    title: 'Head Strength & Powerlifting Coach',
    bio: 'Former national powerlifter and CSCS-certified strength coach specializing in bar speed, squat mechanics, and massive strength progression.',
    specialization: 'Powerlifting, Biomechanics & Squat Mechanics',
    experienceYears: 12,
    categories: ['Legs', 'Chest', 'Back', 'Full Body'],
    hourlyRate: 110,
    rating: 4.98,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    certifications: ['CSCS (NSCA)', 'USAW Level 2 Coach', 'FMS Certified'],
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableHours: ['07:00 AM', '09:00 AM', '11:00 AM', '03:00 PM', '05:00 PM'],
    isActive: true
  },
  {
    id: 'tr-2',
    name: 'Elena Rostova',
    title: 'Olympic Weightlifting & Mobility Specialist',
    bio: 'Master of sports in Olympic lifting. Elena guides athletes through precision mobility protocols and explosive power output without joint wear.',
    specialization: 'Olympic Snatch & Clean, Mobility, Core Power',
    experienceYears: 9,
    categories: ['Legs', 'Shoulders', 'Full Body'],
    hourlyRate: 105,
    rating: 4.96,
    reviewsCount: 118,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    certifications: ['USAW Senior Coach', 'Kinstretch Instructor', 'B.S. Kinesiology'],
    availableDays: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    availableHours: ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
    isActive: true
  },
  {
    id: 'tr-3',
    name: 'Darius Vance',
    title: 'High-Performance Conditioning & Transformation',
    bio: 'Darius has coached hundreds of executives and athletes to single-digit body fat and stage-ready conditioning with scientifically backed nutrition.',
    specialization: 'Body Fat Shred, Conditioning & Hypertrophy',
    experienceYears: 11,
    categories: ['Cardio', 'Chest', 'Arms', 'Abs'],
    hourlyRate: 120,
    rating: 4.99,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    certifications: ['NASM-CPT', 'Precision Nutrition Level 2', 'EXOS Specialist'],
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableHours: ['06:30 AM', '08:30 AM', '12:00 PM', '04:30 PM', '06:30 PM'],
    isActive: true
  },
  {
    id: 'tr-4',
    name: 'Dr. Seraphina Cruz',
    title: 'Functional Movement & Athletic Rehabilitation',
    bio: 'Doctor of Physical Therapy and certified personal trainer dedicated to bulletproofing shoulders, knees, and spines for pain-free heavy lifting.',
    specialization: 'Post-Injury Rehab, Posture & Longevity',
    experienceYears: 8,
    categories: ['Full Body', 'Legs', 'Shoulders'],
    hourlyRate: 115,
    rating: 4.95,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    certifications: ['DPT Physical Therapy', 'NASM-CES', 'PRI Restoration'],
    availableDays: ['Wednesday', 'Thursday', 'Saturday'],
    availableHours: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
    isActive: true
  }
];

// Seed Bookings
export const SEED_BOOKINGS: TrainerBooking[] = [
  {
    id: 'bk-301',
    bookingCode: 'IV-BK-9120',
    memberId: 'user-member-1',
    memberName: 'Alexander Wright',
    memberEmail: 'alex@ironvex.com',
    memberPhone: '+1 (555) 234-5678',
    trainerId: 'tr-1',
    trainerName: 'Marcus "Vanguard" Stone',
    serviceType: '1-on-1 Biomechanics & Squat Depth Analysis',
    date: '2026-11-26',
    timeSlot: '09:00 AM',
    notes: 'Low bar squat position and bar path velocity.',
    status: 'Confirmed',
    createdAt: '2026-11-20T14:00:00Z'
  }
];

// Seed Measurements
export const SEED_MEASUREMENTS: FitnessMeasurement[] = [
  { id: 'm-1', memberId: 'user-member-1', weightLbs: 198, heightCm: 182, bmi: 27.2, bmiCategory: 'Overweight', bodyFatPercentage: 16.5, date: '2026-08-01', notes: 'Initial baseline' },
  { id: 'm-2', memberId: 'user-member-1', weightLbs: 194, heightCm: 182, bmi: 26.6, bmiCategory: 'Overweight', bodyFatPercentage: 15.2, date: '2026-09-01', notes: 'Cut phase month 1' },
  { id: 'm-3', memberId: 'user-member-1', weightLbs: 189, heightCm: 182, bmi: 25.9, bmiCategory: 'Overweight', bodyFatPercentage: 14.0, date: '2026-10-01', notes: 'Strength maintained' },
  { id: 'm-4', memberId: 'user-member-1', weightLbs: 184, heightCm: 182, bmi: 25.3, bmiCategory: 'Overweight', bodyFatPercentage: 12.8, date: '2026-11-01', notes: 'Lean hypertrophy' },
  { id: 'm-5', memberId: 'user-member-1', weightLbs: 182, heightCm: 182, bmi: 24.9, bmiCategory: 'Normal', bodyFatPercentage: 11.9, date: '2026-11-20', notes: 'Entered Normal BMI range' }
];

// Seed Notifications
export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientId: 'user-member-1',
    title: 'Trainer Appointment Confirmed',
    message: 'Your 1-on-1 session with Coach Marcus Stone is confirmed for Nov 26 at 09:00 AM.',
    type: 'booking',
    isRead: false,
    createdAt: '2026-11-20T14:05:00Z'
  },
  {
    id: 'notif-2',
    recipientId: 'user-member-1',
    title: 'Pro Membership Active',
    message: 'Your Pro Athlete monthly subscription payment of $89 was processed successfully.',
    type: 'payment',
    isRead: true,
    createdAt: '2026-11-01T10:06:00Z'
  },
  {
    id: 'notif-3',
    recipientId: 'user-member-1',
    title: 'New Olympic Hardwood Platforms Ready',
    message: 'Two new competition Eleiko platforms are now calibrated and ready in Zone A.',
    type: 'announcement',
    isRead: false,
    createdAt: '2026-11-18T08:00:00Z'
  }
];

// Seed Settings
export const DEFAULT_SETTINGS: GymSettings = {
  gymName: 'IRONVEX FITNESS & GYM',
  slogan: 'TRAIN HARDER. GET STRONGER. LIVE BETTER.',
  currency: 'USD',
  contactEmail: 'concierge@ironvexgym.com',
  contactPhone: '+1 (800) 847-6683',
  address: '840 Ironworks Blvd, Industrial District, Suite 100',
  operatingHours: '24/7/365 Biometric Keycard Access',
  paystackPublicKey: 'pk_test_ironvex_paystack_public_sample_key',
  flutterwavePublicKey: 'FLWPUBK_TEST-ironvex_flutterwave_sample_key'
};

// ------------------------------------------------------------------------------
// STORAGE ACCESSORS & MUTATORS
// ------------------------------------------------------------------------------

export const getStoredUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_USERS;
  }
};

export const saveUser = (user: UserProfile) => {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.unshift(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  // If current session is this user, update
  const current = getCurrentUser();
  if (current && (current.id === user.id || current.email.toLowerCase() === user.email.toLowerCase())) {
    setCurrentUser(user);
  }
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default to Demo Member if none logged in
  const users = getStoredUsers();
  const defaultMember = users.find(u => u.role === 'member') || users[0];
  if (defaultMember) {
    setCurrentUser(defaultMember);
    return defaultMember;
  }
  return null;
};

export const setCurrentUser = (user: UserProfile | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
};

export const getStoredPlans = (): MembershipPlan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(SEED_PLANS));
      return SEED_PLANS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PLANS;
  }
};

export const savePlan = (plan: MembershipPlan) => {
  const plans = getStoredPlans();
  const idx = plans.findIndex(p => p.id === plan.id);
  if (idx >= 0) {
    plans[idx] = plan;
  } else {
    plans.push(plan);
  }
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
};

export const getStoredSubscriptions = (): SubscriptionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(SEED_SUBSCRIPTIONS));
      return SEED_SUBSCRIPTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_SUBSCRIPTIONS;
  }
};

export const saveSubscription = (sub: SubscriptionRecord) => {
  const subs = getStoredSubscriptions();
  const idx = subs.findIndex(s => s.id === sub.id);
  if (idx >= 0) {
    subs[idx] = sub;
  } else {
    subs.unshift(sub);
  }
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
};

export const getStoredPayments = (): PaymentTransaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS));
      return SEED_PAYMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PAYMENTS;
  }
};

export const savePayment = (payment: PaymentTransaction) => {
  const payments = getStoredPayments();
  payments.unshift(payment);
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
};

export const getStoredTrainers = (): TrainerProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAINERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(SEED_TRAINERS));
      return SEED_TRAINERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_TRAINERS;
  }
};

export const saveTrainer = (tr: TrainerProfile) => {
  const trainers = getStoredTrainers();
  const idx = trainers.findIndex(t => t.id === tr.id);
  if (idx >= 0) {
    trainers[idx] = tr;
  } else {
    trainers.push(tr);
  }
  localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
};

export const deleteTrainer = (trainerId: string) => {
  const trainers = getStoredTrainers().filter(t => t.id !== trainerId);
  localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
};

export const getStoredBookings = (): TrainerBooking[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_BOOKINGS;
  }
};

export const saveBookingRecord = (booking: TrainerBooking) => {
  const bookings = getStoredBookings();
  const idx = bookings.findIndex(b => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.unshift(booking);
  }
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const updateBookingStatus = (bookingId: string, status: 'Confirmed' | 'Pending Review' | 'Cancelled' | 'Completed') => {
  const bookings = getStoredBookings();
  const b = bookings.find(item => item.id === bookingId);
  if (b) {
    b.status = status;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
};

export const getStoredMeasurements = (memberId?: string): FitnessMeasurement[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
    const all = raw ? JSON.parse(raw) : SEED_MEASUREMENTS;
    if (memberId) {
      return all.filter((m: FitnessMeasurement) => m.memberId === memberId);
    }
    return all;
  } catch {
    return SEED_MEASUREMENTS;
  }
};

export const saveMeasurement = (measurement: FitnessMeasurement) => {
  const all = getStoredMeasurements();
  all.push(measurement);
  localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(all));
};

export const getStoredNotifications = (recipientId?: string): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all = raw ? JSON.parse(raw) : SEED_NOTIFICATIONS;
    if (recipientId) {
      return all.filter((n: NotificationItem) => n.recipientId === recipientId || n.recipientId === 'all');
    }
    return all;
  } catch {
    return SEED_NOTIFICATIONS;
  }
};

export const markNotificationRead = (notifId: string) => {
  const all = getStoredNotifications();
  const target = all.find(n => n.id === notifId);
  if (target) {
    target.isRead = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  }
};

export const markAllNotificationsRead = (recipientId?: string) => {
  const all = getStoredNotifications();
  all.forEach(n => {
    if (!recipientId || n.recipientId === recipientId || n.recipientId === 'all') {
      n.isRead = true;
    }
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
};

export const addNotification = (notif: NotificationItem) => {
  const all = getStoredNotifications();
  all.unshift(notif);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
};

export const getGymSettings = (): GymSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveGymSettings = (settings: GymSettings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// ------------------------------------------------------------------------------
// BACKWARD COMPATIBILITY EXPORTS
// ------------------------------------------------------------------------------

export const getMembers = () => getStoredUsers().filter(u => u.role === 'member');
export const getCurrentMember = () => getCurrentUser() || getStoredUsers()[0];
export const saveMember = (m: any) => saveUser(m);
export const getBookings = () => getStoredBookings();
export const saveBooking = (b: any) => saveBookingRecord(b);

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Replied' | 'Archived';
}

const SEED_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-301',
    name: 'Victoria Hawthorne',
    email: 'vhawthorne@invest.com',
    phone: '+1 (555) 678-9012',
    subject: 'Corporate Executive VIP Wellness Program',
    message: 'We are seeking corporate tier memberships for our executive leadership group of 15 partners. Can you arrange a private tour and walkthrough this Thursday?',
    date: '2026-11-22T15:45:00Z',
    status: 'New'
  }
];

export const getMessages = (): ContactMessage[] => {
  try {
    const raw = localStorage.getItem('ironvex_messages');
    if (!raw) {
      localStorage.setItem('ironvex_messages', JSON.stringify(SEED_MESSAGES));
      return SEED_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_MESSAGES;
  }
};

export const saveMessage = (msg: ContactMessage) => {
  const current = getMessages();
  current.unshift(msg);
  localStorage.setItem('ironvex_messages', JSON.stringify(current));
};

export const updateMessageStatus = (id: string, status: 'New' | 'Replied' | 'Archived') => {
  const current = getMessages();
  const match = current.find(m => m.id === id);
  if (match) {
    match.status = status;
    localStorage.setItem('ironvex_messages', JSON.stringify(current));
  }
};

export interface PRRecord {
  exercise: string;
  weightLbs: number;
  date: string;
}

const DEFAULT_PRS: PRRecord[] = [
  { exercise: 'Bench Press', weightLbs: 315, date: '2026-11-12' },
  { exercise: 'Barbell Back Squat', weightLbs: 425, date: '2026-11-18' },
  { exercise: 'Conventional Deadlift', weightLbs: 515, date: '2026-11-21' },
  { exercise: 'Strict Overhead Press', weightLbs: 205, date: '2026-11-05' }
];

export const getPRRecords = (): PRRecord[] => {
  try {
    const raw = localStorage.getItem('ironvex_prs');
    if (!raw) {
      localStorage.setItem('ironvex_prs', JSON.stringify(DEFAULT_PRS));
      return DEFAULT_PRS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PRS;
  }
};

export const savePRRecord = (pr: PRRecord): PRRecord[] => {
  const current = getPRRecords();
  const idx = current.findIndex(p => p.exercise.toLowerCase() === pr.exercise.toLowerCase());
  if (idx >= 0) {
    current[idx] = pr;
  } else {
    current.push(pr);
  }
  localStorage.setItem('ironvex_prs', JSON.stringify(current));
  return current;
};
