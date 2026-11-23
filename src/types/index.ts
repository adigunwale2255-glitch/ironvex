export type UserRole = 'member' | 'admin';

export type FitnessGoal = 'muscle_building' | 'weight_loss' | 'strength' | 'endurance' | 'general_fitness';

export type WorkoutCategory = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Abs' | 'Cardio' | 'Full Body';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type SubscriptionStatus = 'active' | 'expired' | 'canceled' | 'pending';

export type PaymentGateway = 'paystack' | 'flutterwave' | 'card';

export type PaymentStatus = 'success' | 'pending' | 'failed';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  fitnessGoal: FitnessGoal;
  avatarUrl?: string;
  emergencyContact?: string;
  memberNumber?: string;
  planId?: string;
  planName?: string;
  billingCycle?: 'monthly' | 'annual';
  amountPaid?: number;
  startDate?: string;
  status?: string;
  qrCode?: string;
  completedWorkoutsCount?: number;
  createdAt?: string;
  joinedAt?: string;
}

export type MemberRecord = UserProfile;

export interface MembershipPlan {
  id: string;
  name: 'Basic' | 'Pro' | 'Elite' | string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  durationMonths?: number;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  badge?: string;
}

export interface SubscriptionRecord {
  id: string;
  memberId: string;
  memberName: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  currency: string;
  startDate: string;
  expiresAt: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  planId: string;
  planName: string;
  amount: number;
  currency: 'USD' | 'NGN' | string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  createdAt: string;
  channel?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category?: WorkoutCategory;
  muscle?: string;
  sets: number;
  reps: string;
  restSec: number;
  targetMuscles?: string;
  instructions?: string;
  tips?: string;
  completed?: boolean;
}

export interface DayWorkout {
  dayNumber?: number;
  dayName: string;
  focusTitle?: string;
  focus?: string;
  category?: WorkoutCategory;
  exercises: ExerciseItem[];
}

export interface WorkoutPlan {
  id: string;
  memberId?: string;
  title: string;
  goal: FitnessGoal | string;
  level: ExperienceLevel | string;
  daysPerWeek?: number;
  daysCount?: number;
  categories?: WorkoutCategory[];
  days?: DayWorkout[];
  schedule?: DayWorkout[];
  createdAt?: string;
}

export type WorkoutSchedule = WorkoutPlan;

export interface FitnessMeasurement {
  id: string;
  memberId: string;
  weightLbs: number;
  heightCm: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bodyFatPercentage?: number;
  date: string;
  notes?: string;
}

export interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  healthyWeightRange?: string;
  recommendation?: string;
  dietAdvice?: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialization: string;
  specialty?: string;
  experienceYears: number;
  categories?: WorkoutCategory[];
  hourlyRate?: number;
  sessionRate?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  certifications: string[];
  availableDays: string[];
  availableHours: string[];
  isActive?: boolean;
}

export interface TrainerBooking {
  id: string;
  bookingCode: string;
  memberId?: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  trainerId: string;
  trainerName: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Confirmed' | 'Pending Review' | 'Cancelled' | 'Completed';
  createdAt: string;
}

export type BookingRequest = TrainerBooking;

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

export interface GalleryItem {
  id: string;
  title: string;
  category: string | any;
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

export interface NotificationItem {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'membership' | 'payment' | 'booking' | 'workout' | 'announcement';
  isRead: boolean;
  createdAt: string;
}

export interface GymSettings {
  gymName: string;
  slogan: string;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  operatingHours: string;
  paystackPublicKey: string;
  flutterwavePublicKey: string;
}
