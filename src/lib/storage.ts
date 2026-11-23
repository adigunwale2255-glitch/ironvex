import { MemberRecord, BookingRequest, ContactMessage } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  MEMBERS: 'ironvex_members',
  CURRENT_MEMBER: 'ironvex_current_member',
  BOOKINGS: 'ironvex_bookings',
  MESSAGES: 'ironvex_messages',
  COMPLETED_WORKOUTS: 'ironvex_completed_workouts',
  PR_RECORDS: 'ironvex_pr_records'
};

const SEED_MEMBERS: MemberRecord[] = [
  {
    id: 'mem-101',
    memberNumber: 'IV-MEM-88210',
    qrCode: 'IV-MEM-88210-VIP',
    fullName: 'Alexander Wright',
    email: 'alex.wright@executive.io',
    phone: '+1 (555) 234-5678',
    emergencyContact: 'Sarah Wright (+1 555-891-2345)',
    planId: 'black-gold-vip',
    planName: 'Black Gold VIP',
    billingCycle: 'annual',
    amountPaid: 1428,
    startDate: '2026-01-15',
    status: 'Active',
    completedWorkoutsCount: 42,
    joinedAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'mem-102',
    memberNumber: 'IV-MEM-77341',
    qrCode: 'IV-MEM-77341-PRO',
    fullName: 'Samantha Sterling',
    email: 'samantha.s@apexfit.com',
    phone: '+1 (555) 876-5432',
    emergencyContact: 'Mark Sterling (+1 555-123-9876)',
    planId: 'pro-athlete',
    planName: 'Pro Athlete',
    billingCycle: 'monthly',
    amountPaid: 89,
    startDate: '2026-02-01',
    status: 'Active',
    completedWorkoutsCount: 28,
    joinedAt: '2026-02-01T14:30:00Z'
  }
];

const SEED_BOOKINGS: BookingRequest[] = [
  {
    id: 'bk-201',
    bookingCode: 'IV-BK-9901',
    memberName: 'Alexander Wright',
    memberEmail: 'alex.wright@executive.io',
    memberPhone: '+1 (555) 234-5678',
    trainerId: 'trainer-1',
    trainerName: 'Marcus "Vanguard" Stone',
    serviceType: '1-on-1 Heavy Powerlifting & Biomechanics',
    date: '2026-11-26',
    timeSlot: '09:00 AM',
    notes: 'Focus on low bar squat depth and hip drive optimization.',
    status: 'Confirmed',
    createdAt: '2026-11-20T10:00:00Z'
  },
  {
    id: 'bk-202',
    bookingCode: 'IV-BK-9902',
    memberName: 'David Ross',
    memberEmail: 'dross@capital.com',
    memberPhone: '+1 (555) 345-6789',
    trainerId: 'trainer-3',
    trainerName: 'Darius Vance',
    serviceType: 'Body Transformation & Conditioning',
    date: '2026-11-27',
    timeSlot: '04:30 PM',
    notes: 'Sprint interval conditioning and recovery nutrition review.',
    status: 'Pending Review',
    createdAt: '2026-11-21T11:20:00Z'
  }
];

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
  },
  {
    id: 'msg-302',
    name: 'Julian Henderson',
    email: 'julian@athletics.org',
    phone: '+1 (555) 456-7890',
    subject: 'Olympic Platform Reservation Inquiry',
    message: 'Looking to confirm if the Eleiko platforms are available for coached competition prep sessions on Saturday mornings.',
    date: '2026-11-21T09:12:00Z',
    status: 'Replied'
  }
];

export const getMembers = (): MemberRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(SEED_MEMBERS));
      return SEED_MEMBERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_MEMBERS;
  }
};

export const saveMember = async (member: MemberRecord): Promise<void> => {
  const current = getMembers();
  const index = current.findIndex(m => m.id === member.id || m.email === member.email);
  if (index >= 0) {
    current[index] = member;
  } else {
    current.unshift(member);
  }
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(current));
  localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, JSON.stringify(member));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('members').upsert([member]);
    } catch (e) {
      console.warn('Supabase sync warning:', e);
    }
  }
};

export const getCurrentMember = (): MemberRecord => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER);
    if (raw) return JSON.parse(raw);
  } catch {}
  const all = getMembers();
  return all[0];
};

export const setCurrentMember = (member: MemberRecord) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, JSON.stringify(member));
};

export const getBookings = (): BookingRequest[] => {
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

export const saveBooking = async (booking: BookingRequest): Promise<void> => {
  const current = getBookings();
  const index = current.findIndex(b => b.id === booking.id);
  if (index >= 0) {
    current[index] = booking;
  } else {
    current.unshift(booking);
  }
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(current));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('trainer_bookings').upsert([booking]);
    } catch (e) {
      console.warn('Supabase booking sync warning:', e);
    }
  }
};

export const updateBookingStatus = (bookingId: string, status: 'Confirmed' | 'Pending Review' | 'Completed') => {
  const current = getBookings();
  const match = current.find(b => b.id === bookingId);
  if (match) {
    match.status = status;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(current));
  }
};

export const getMessages = (): ContactMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
      return SEED_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_MESSAGES;
  }
};

export const saveMessage = async (msg: ContactMessage): Promise<void> => {
  const current = getMessages();
  current.unshift(msg);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(current));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('contact_messages').insert([msg]);
    } catch (e) {
      console.warn('Supabase message sync warning:', e);
    }
  }
};

export const updateMessageStatus = (id: string, status: 'New' | 'Replied' | 'Archived') => {
  const current = getMessages();
  const match = current.find(m => m.id === id);
  if (match) {
    match.status = status;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(current));
  }
};

export interface PRRecord {
  exercise: string;
  weightLbs: number;
  date: string;
}

export const getPRRecords = (): PRRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PR_RECORDS);
    if (!raw) {
      const defaultPRs: PRRecord[] = [
        { exercise: 'Bench Press', weightLbs: 315, date: '2026-11-12' },
        { exercise: 'Barbell Back Squat', weightLbs: 425, date: '2026-11-18' },
        { exercise: 'Conventional Deadlift', weightLbs: 515, date: '2026-11-21' },
        { exercise: 'Strict Overhead Press', weightLbs: 205, date: '2026-11-05' }
      ];
      localStorage.setItem(STORAGE_KEYS.PR_RECORDS, JSON.stringify(defaultPRs));
      return defaultPRs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const savePRRecord = (newPR: PRRecord): PRRecord[] => {
  const current = getPRRecords();
  const existingIdx = current.findIndex(p => p.exercise.toLowerCase() === newPR.exercise.toLowerCase());
  if (existingIdx >= 0) {
    current[existingIdx] = newPR;
  } else {
    current.push(newPR);
  }
  localStorage.setItem(STORAGE_KEYS.PR_RECORDS, JSON.stringify(current));
  return current;
};
