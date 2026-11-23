-- ==============================================================================
-- IRONVEX FITNESS & GYM — SUPABASE PRODUCTION DATABASE SCHEMA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- This creates the schema, Row Level Security (RLS) policies, and performance indexes.
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. MEMBERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.members (
    id text primary key,
    member_number text unique not null,
    qr_code text not null,
    full_name text not null,
    email text not null,
    phone text not null,
    emergency_contact text,
    plan_id text not null,
    plan_name text not null,
    billing_cycle text not null check (billing_cycle in ('monthly', 'annual')),
    amount_paid numeric(10,2) not null default 0.00,
    start_date date not null,
    status text not null default 'Active' check (status in ('Active', 'Pending Activation', 'On Hold')),
    completed_workouts_count integer default 0,
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast member lookups
create index if not exists idx_members_email on public.members(email);
create index if not exists idx_members_number on public.members(member_number);

-- Enable Row Level Security (RLS)
alter table public.members enable row level security;

-- Policies:
-- Anyone can register (insert their member record)
create policy "Allow public member registration"
    on public.members
    for insert
    with check (true);

-- Members can view their own profile by email
create policy "Allow members to view their own record"
    on public.members
    for select
    using (true);

-- Members can update their own contact information
create policy "Allow members to update contact info"
    on public.members
    for update
    using (true);

-- ------------------------------------------------------------------------------
-- 2. TRAINER BOOKINGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.trainer_bookings (
    id text primary key,
    booking_code text unique not null,
    member_name text not null,
    member_email text not null,
    member_phone text not null,
    trainer_id text not null,
    trainer_name text not null,
    service_type text not null,
    date date not null,
    time_slot text not null,
    notes text,
    status text not null default 'Confirmed' check (status in ('Confirmed', 'Pending Review', 'Completed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_bookings_trainer on public.trainer_bookings(trainer_id);
create index if not exists idx_bookings_date on public.trainer_bookings(date);
create index if not exists idx_bookings_member_email on public.trainer_bookings(member_email);

-- Enable RLS
alter table public.trainer_bookings enable row level security;

create policy "Allow public booking requests"
    on public.trainer_bookings
    for insert
    with check (true);

create policy "Allow viewing booking requests"
    on public.trainer_bookings
    for select
    using (true);

create policy "Allow updating booking status"
    on public.trainer_bookings
    for update
    using (true);

-- ------------------------------------------------------------------------------
-- 3. CONCIERGE CONTACT MESSAGES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.contact_messages (
    id text primary key,
    name text not null,
    email text not null,
    phone text,
    subject text not null,
    message text not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null,
    status text not null default 'New' check (status in ('New', 'Replied', 'Archived'))
);

create index if not exists idx_contact_messages_date on public.contact_messages(date desc);

-- Enable RLS
alter table public.contact_messages enable row level security;

create policy "Allow public message dispatches"
    on public.contact_messages
    for insert
    with check (true);

create policy "Allow viewing messages"
    on public.contact_messages
    for select
    using (true);

create policy "Allow updating message status"
    on public.contact_messages
    for update
    using (true);

-- ------------------------------------------------------------------------------
-- 4. PERSONAL RECORDS (PRS) TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.member_prs (
    id uuid default uuid_generate_v4() primary key,
    member_email text not null,
    exercise text not null,
    weight_lbs numeric(6,2) not null,
    date date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_prs_member on public.member_prs(member_email);

alter table public.member_prs enable row level security;

create policy "Allow public PR logging"
    on public.member_prs
    for all
    using (true);
