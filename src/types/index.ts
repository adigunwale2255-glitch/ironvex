export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  isPopular: boolean;
  badge?: string;
  features: string[];
}

export interface MemberRecord {
  id: string;
  memberNumber: string;
  qrCode: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  amountPaid: number;
  startDate: string;
  status: 'Active' | 'Pending Activation' | 'On Hold';
  completedWorkoutsCount: number;
  joinedAt: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  specialty: string;
  rating: number;
  reviewsCount: number;
  bio: string;
  image: string;
  certifications: string[];
  sessionRate: number;
  availableDays: string[];
  availableHours: string[];
}

export interface BookingRequest {
  id: string;
  bookingCode: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  trainerId: string;
  trainerName: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Confirmed' | 'Pending Review' | 'Completed';
  createdAt: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  restSec: number;
  tips: string;
}

export interface DayWorkout {
  dayName: string;
  focus: string;
  exercises: ExerciseItem[];
}

export interface WorkoutSchedule {
  id: string;
  goal: string;
  level: string;
  daysCount: number;
  schedule: DayWorkout[];
}

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

export interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  healthyWeightRange: string;
  recommendation: string;
  dietAdvice: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'facilities' | 'olympic' | 'cardio' | 'spa';
  url: string;
  caption: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  transformation: string;
  quote: string;
  rating: number;
  image: string;
  duration: string;
}
