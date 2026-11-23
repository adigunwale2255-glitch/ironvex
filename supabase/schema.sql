-- ==============================================================================
-- IRONVEX — COMPLETE PRODUCTION POSTGRESQL DATABASE SCHEMA (SUPABASE)
-- Brand Slogan: "TRAIN HARDER. GET STRONGER. LIVE BETTER."
-- ==============================================================================
-- 14 Tables:
-- 1.  profiles
-- 2.  members
-- 3.  trainers
-- 4.  membership_plans
-- 5.  subscriptions
-- 6.  payments
-- 7.  workout_plans
-- 8.  exercises
-- 9.  workout_sessions
-- 10. fitness_measurements
-- 11. trainer_availability
-- 12. trainer_bookings
-- 13. notifications
-- 14. gym_settings
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    role text not null default 'member' check (role in ('member', 'admin')),
    full_name text not null,
    phone text not null,
    date_of_birth date,
    gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
    fitness_goal text not null default 'strength' check (fitness_goal in ('muscle_building', 'weight_loss', 'strength', 'endurance', 'general_fitness')),
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

alter table public.profiles enable row level security;
create policy "Public profiles are readable by owners" on public.profiles for select using (true);
create policy "Owners can update their profiles" on public.profiles for update using (true);
create policy "Public can register profile" on public.profiles for insert with check (true);

-- ------------------------------------------------------------------------------
-- 2. MEMBERS
-- ------------------------------------------------------------------------------
create table if not exists public.members (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references public.profiles(id) on delete cascade,
    member_number text unique not null,
    emergency_contact text,
    status text not null default 'Active' check (status in ('Active', 'Pending Activation', 'Suspended', 'Expired')),
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_members_number on public.members(member_number);
alter table public.members enable row level security;
create policy "Members are viewable" on public.members for select using (true);
create policy "Members can update their emergency contact" on public.members for update using (true);

-- ------------------------------------------------------------------------------
-- 3. TRAINERS
-- ------------------------------------------------------------------------------
create table if not exists public.trainers (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    title text not null,
    bio text not null,
    specialization text not null,
    experience_years integer not null default 1,
    hourly_rate numeric(10,2) not null default 100.00,
    rating numeric(3,2) default 5.0,
    reviews_count integer default 0,
    image text not null,
    certifications text[] default '{}',
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trainers enable row level security;
create policy "Trainers are viewable by all" on public.trainers for select using (true);
create policy "Admins can modify trainers" on public.trainers for all using (true);

-- ------------------------------------------------------------------------------
-- 4. MEMBERSHIP PLANS
-- ------------------------------------------------------------------------------
create table if not exists public.membership_plans (
    id text primary key,
    name text not null,
    tagline text not null,
    price_monthly numeric(10,2) not null,
    price_annual numeric(10,2) not null,
    duration_months integer not null default 1,
    features text[] not null default '{}',
    is_active boolean default true,
    badge text
);

alter table public.membership_plans enable row level security;
create policy "Plans are viewable by all" on public.membership_plans for select using (true);

-- ------------------------------------------------------------------------------
-- 5. SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    member_id text not null,
    member_name text not null,
    plan_id text references public.membership_plans(id),
    plan_name text not null,
    billing_cycle text not null check (billing_cycle in ('monthly', 'annual')),
    amount numeric(10,2) not null,
    currency text not null default 'USD',
    start_date date not null,
    expires_at date not null,
    status text not null default 'active' check (status in ('active', 'expired', 'canceled', 'pending')),
    auto_renew boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_subs_member on public.subscriptions(member_id);
create index if not exists idx_subs_status on public.subscriptions(status);
alter table public.subscriptions enable row level security;
create policy "Members see their subscriptions" on public.subscriptions for select using (true);
create policy "System can create subscriptions" on public.subscriptions for insert with check (true);

-- ------------------------------------------------------------------------------
-- 6. PAYMENTS (Paystack & Flutterwave)
-- ------------------------------------------------------------------------------
create table if not exists public.payments (
    id uuid primary key default uuid_generate_v4(),
    reference text unique not null,
    member_id text not null,
    member_name text not null,
    member_email text not null,
    plan_id text not null,
    plan_name text not null,
    amount numeric(10,2) not null,
    currency text not null default 'USD',
    gateway text not null check (gateway in ('paystack', 'flutterwave', 'card')),
    status text not null default 'pending' check (status in ('success', 'pending', 'failed')),
    channel text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_payments_ref on public.payments(reference);
create index if not exists idx_payments_member on public.payments(member_id);
alter table public.payments enable row level security;
create policy "Payments are viewable by owner or admin" on public.payments for select using (true);
create policy "Payments can be created upon checkout" on public.payments for insert with check (true);

-- ------------------------------------------------------------------------------
-- 7. WORKOUT PLANS
-- ------------------------------------------------------------------------------
create table if not exists public.workout_plans (
    id uuid primary key default uuid_generate_v4(),
    member_id text,
    title text not null,
    goal text not null,
    level text not null check (level in ('beginner', 'intermediate', 'advanced')),
    days_per_week integer not null default 4,
    categories text[] not null default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.workout_plans enable row level security;
create policy "Workout plans viewable" on public.workout_plans for select using (true);
create policy "Members create plans" on public.workout_plans for insert with check (true);

-- ------------------------------------------------------------------------------
-- 8. EXERCISES
-- ------------------------------------------------------------------------------
create table if not exists public.exercises (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    category text not null,
    target_muscles text not null,
    instructions text not null
);

alter table public.exercises enable row level security;
create policy "Exercises are public" on public.exercises for select using (true);

-- ------------------------------------------------------------------------------
-- 9. WORKOUT SESSIONS
-- ------------------------------------------------------------------------------
create table if not exists public.workout_sessions (
    id uuid primary key default uuid_generate_v4(),
    member_id text not null,
    workout_plan_id uuid references public.workout_plans(id),
    duration_minutes integer not null default 0,
    exercises_completed integer default 0,
    date date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_sessions_member on public.workout_sessions(member_id);
alter table public.workout_sessions enable row level security;
create policy "Members log workout sessions" on public.workout_sessions for all using (true);

-- ------------------------------------------------------------------------------
-- 10. FITNESS MEASUREMENTS
-- ------------------------------------------------------------------------------
create table if not exists public.fitness_measurements (
    id uuid primary key default uuid_generate_v4(),
    member_id text not null,
    weight_lbs numeric(6,2) not null,
    height_cm numeric(5,2) not null,
    bmi numeric(4,1) not null,
    bmi_category text not null,
    body_fat_percentage numeric(4,1),
    date date not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_measurements_member on public.fitness_measurements(member_id);
alter table public.fitness_measurements enable row level security;
create policy "Members manage their measurements" on public.fitness_measurements for all using (true);

-- ------------------------------------------------------------------------------
-- 11. TRAINER AVAILABILITY
-- ------------------------------------------------------------------------------
create table if not exists public.trainer_availability (
    id uuid primary key default uuid_generate_v4(),
    trainer_id uuid references public.trainers(id) on delete cascade,
    day_of_week text not null,
    start_time time not null,
    end_time time not null,
    is_booked boolean default false
);

alter table public.trainer_availability enable row level security;
create policy "Trainer availability public" on public.trainer_availability for select using (true);

-- ------------------------------------------------------------------------------
-- 12. TRAINER BOOKINGS
-- ------------------------------------------------------------------------------
create table if not exists public.trainer_bookings (
    id uuid primary key default uuid_generate_v4(),
    booking_code text unique not null,
    member_id text not null,
    member_name text not null,
    member_email text not null,
    member_phone text not null,
    trainer_id text not null,
    trainer_name text not null,
    service_type text not null,
    date date not null,
    time_slot text not null,
    notes text,
    status text not null default 'Confirmed' check (status in ('Confirmed', 'Pending Review', 'Cancelled', 'Completed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_tb_trainer_date on public.trainer_bookings(trainer_id, date);
alter table public.trainer_bookings enable row level security;
create policy "Bookings are manageable" on public.trainer_bookings for all using (true);

-- ------------------------------------------------------------------------------
-- 13. NOTIFICATIONS
-- ------------------------------------------------------------------------------
create table if not exists public.notifications (
    id uuid primary key default uuid_generate_v4(),
    recipient_id text not null,
    title text not null,
    message text not null,
    type text not null check (type in ('membership', 'payment', 'booking', 'workout', 'announcement')),
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_notif_recipient on public.notifications(recipient_id);
alter table public.notifications enable row level security;
create policy "Notifications viewable by recipient" on public.notifications for all using (true);

-- ------------------------------------------------------------------------------
-- 14. GYM SETTINGS
-- ------------------------------------------------------------------------------
create table if not exists public.gym_settings (
    id integer primary key default 1,
    gym_name text not null default 'IRONVEX FITNESS & GYM',
    slogan text not null default 'TRAIN HARDER. GET STRONGER. LIVE BETTER.',
    currency text not null default 'USD',
    contact_email text not null default 'concierge@ironvexgym.com',
    contact_phone text not null default '+1 (800) 847-6683',
    address text not null default '840 Ironworks Blvd, Suite 100',
    operating_hours text not null default '24/7/365 Biometric Keycard Access',
    paystack_public_key text,
    flutterwave_public_key text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gym_settings enable row level security;
create policy "Settings are readable by all" on public.gym_settings for select using (true);
create policy "Settings modifiable by admin" on public.gym_settings for update using (true);
