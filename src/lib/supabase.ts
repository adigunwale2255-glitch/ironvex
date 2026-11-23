import { createClient } from '@supabase/supabase-js';
import { MembershipPlan, TrainerProfile, TestimonialItem, GalleryItem } from '../types';

// Supabase configuration with safe fallback
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  metaEnv.VITE_SUPABASE_URL && 
  metaEnv.VITE_SUPABASE_ANON_KEY &&
  !metaEnv.VITE_SUPABASE_URL.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Membership Plans
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
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

// Initial Trainers
export const SEED_TRAINERS: TrainerProfile[] = [
  {
    id: 'trainer-1',
    name: 'Marcus "Vanguard" Stone',
    title: 'Head Strength & Powerlifting Coach',
    experienceYears: 12,
    specialization: 'Powerlifting, Hypertrophy & Biomechanics',
    specialty: 'Powerlifting, Hypertrophy & Biomechanics',
    rating: 4.98,
    reviewsCount: 142,
    bio: 'Former national powerlifter and CSCS-certified strength coach specializing in raw bar speed, squat mechanics, and massive strength progression.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    certifications: ['CSCS (NSCA)', 'USAW Level 2 Coach', 'FMS Certified'],
    hourlyRate: 110,
    sessionRate: 110,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableHours: ['07:00 AM', '09:00 AM', '11:00 AM', '03:00 PM', '05:00 PM']
  },
  {
    id: 'trainer-2',
    name: 'Elena Rostova',
    title: 'Olympic Weightlifting & Mobility Specialist',
    experienceYears: 9,
    specialization: 'Olympic Snatch & Clean, Mobility, Core Power',
    specialty: 'Olympic Snatch & Clean, Mobility, Core Power',
    rating: 4.96,
    reviewsCount: 118,
    bio: 'Master of sports in Olympic lifting. Elena guides athletes through precision mobility protocols and explosive power output without joint wear.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    certifications: ['USAW Senior Coach', 'Kinstretch Instructor', 'B.S. Kinesiology'],
    hourlyRate: 105,
    sessionRate: 105,
    availableDays: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    availableHours: ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '06:00 PM']
  },
  {
    id: 'trainer-3',
    name: 'Darius Vance',
    title: 'High-Performance Conditioning & Body Transformation',
    experienceYears: 11,
    specialization: 'Body Fat Shred, Athletic Conditioning, Nutrition',
    specialty: 'Body Fat Shred, Athletic Conditioning, Nutrition',
    rating: 4.99,
    reviewsCount: 165,
    bio: 'Darius has coached hundreds of executives and athletes to single-digit body fat and stage-ready conditioning with scientifically backed nutrition.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    certifications: ['NASM-CPT', 'Precision Nutrition Level 2', 'EXOS Performance Specialist'],
    hourlyRate: 120,
    sessionRate: 120,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableHours: ['06:30 AM', '08:30 AM', '12:00 PM', '04:30 PM', '06:30 PM']
  },
  {
    id: 'trainer-4',
    name: 'Seraphina Cruz',
    title: 'Functional Movement & Athletic Rehabilitation',
    experienceYears: 8,
    specialization: 'Post-Injury Rehab, Posture Optimization, Longevity',
    specialty: 'Post-Injury Rehab, Posture Optimization, Longevity',
    rating: 4.95,
    reviewsCount: 94,
    bio: 'Doctor of Physical Therapy and certified personal trainer dedicated to bulletproofing shoulders, knees, and spines for pain-free heavy lifting.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    certifications: ['DPT Physical Therapy', 'NASM-CES', 'PRI Postural Restoration'],
    hourlyRate: 115,
    sessionRate: 115,
    availableDays: ['Wednesday', 'Thursday', 'Saturday'],
    availableHours: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM']
  }
];

// Initial Testimonials
export const SEED_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Julian Sterling',
    role: 'Venture Capitalist & Lifter',
    transformation: '-28 lbs Fat, +14 lbs Lean Mass',
    quote: 'IRONVEX is in a league of its own. The Eleiko calibrated plates, the atmosphere, and the infrared recovery suite make this the best hour of my day. Worth every dollar of the Black Gold membership.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    duration: 'Member for 14 Months'
  },
  {
    id: 'test-2',
    name: 'Kendra Miller',
    role: 'Marathoner & Functional Athlete',
    transformation: 'Squat PR: 185 lbs ➔ 315 lbs',
    quote: 'The coaching here completely restructured my movement patterns. Working with Elena took 15 minutes off my marathon time while bulletproofing my knees. The trainers are true world-class masters.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    duration: 'Member for 8 Months'
  },
  {
    id: 'test-3',
    name: 'Dr. Raymond Zhao',
    role: 'Cardiologist & Master Athlete',
    transformation: 'Resting Heart Rate: 72 ➔ 49 bpm',
    quote: 'As a physician, I demand clinical precision in training environments. The air purification, clean stainless steel aesthetics, and science-based programming at IRONVEX are second to none.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    duration: 'Member for 2 Years'
  }
];

// Initial Gallery Items
export const SEED_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Heavy Iron & Dumbbell Arsenal',
    category: 'facilities',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    caption: 'Custom cast urethane dumbbells up to 150 lbs, custom welded racks, and matte black steel.'
  },
  {
    id: 'g-2',
    title: 'Calibrated Olympic Lifting Platforms',
    category: 'olympic',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    caption: 'Hardwood insert oak platforms with competition Eleiko barbells and IPF-spec bumper plates.'
  },
  {
    id: 'g-3',
    title: 'Curved Woodway & High-Altitude Cardio Deck',
    category: 'cardio',
    url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Self-powered curved slat treadmills, Assault AirBikes, and Concept2 rowers overlooking city skyline.'
  },
  {
    id: 'g-4',
    title: 'Nordic Infrared Sauna & Cryo Recovery',
    category: 'spa',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Full-spectrum cedar infrared sauna with 38°F stainless steel cold plunge immersion.'
  },
  {
    id: 'g-5',
    title: 'Functional Turf & Sled Sprint Lanes',
    category: 'facilities',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80',
    caption: '40-yard indoor turf with heavy push sleds, battle ropes, plyometric boxes, and medicine balls.'
  },
  {
    id: 'g-6',
    title: 'VIP Executive Locker Suite',
    category: 'spa',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rainfall showers, eucalyptus infused towels, Dyson styling stations, and keyless biometric lockers.'
  }
];
