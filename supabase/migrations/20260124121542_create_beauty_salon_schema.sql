/*
  # Beauty Salon Management System Schema

  This migration creates the complete database schema for a beauty salon automation system.

  ## New Tables

  1. `profiles`
    - `id` (uuid, references auth.users)
    - `email` (text)
    - `full_name` (text)
    - `phone` (text)
    - `role` (text) - 'admin', 'master', 'client'
    - `created_at` (timestamptz)

  2. `services`
    - `id` (uuid, primary key)
    - `name` (text) - service name
    - `description` (text)
    - `duration` (integer) - duration in minutes
    - `price` (numeric)
    - `category` (text) - 'manicure', 'pedicure', 'hair', etc.
    - `active` (boolean)
    - `created_at` (timestamptz)

  3. `masters`
    - `id` (uuid, primary key)
    - `profile_id` (uuid, references profiles)
    - `name` (text)
    - `specialization` (text[])
    - `bio` (text)
    - `avatar_url` (text)
    - `active` (boolean)
    - `created_at` (timestamptz)

  4. `master_services`
    - Links masters to services they provide
    - `id` (uuid, primary key)
    - `master_id` (uuid, references masters)
    - `service_id` (uuid, references services)

  5. `bookings`
    - `id` (uuid, primary key)
    - `client_id` (uuid, references profiles)
    - `master_id` (uuid, references masters)
    - `service_id` (uuid, references services)
    - `booking_date` (date)
    - `booking_time` (time)
    - `status` (text) - 'pending', 'confirmed', 'completed', 'cancelled'
    - `client_name` (text) - for non-registered clients
    - `client_phone` (text)
    - `notes` (text)
    - `created_at` (timestamptz)

  6. `working_hours`
    - `id` (uuid, primary key)
    - `master_id` (uuid, references masters)
    - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
    - `start_time` (time)
    - `end_time` (time)
    - `active` (boolean)

  ## Security

  - RLS enabled on all tables
  - Policies for authenticated users to manage their data
  - Admins can manage all data
  - Clients can view services and create bookings
  - Masters can view their schedule and update booking status
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'master', 'client')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration integer NOT NULL DEFAULT 60,
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create masters table
CREATE TABLE IF NOT EXISTS masters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialization text[] DEFAULT '{}',
  bio text,
  avatar_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE masters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active masters"
  ON masters FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage masters"
  ON masters FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create master_services junction table
CREATE TABLE IF NOT EXISTS master_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id uuid REFERENCES masters(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(master_id, service_id)
);

ALTER TABLE master_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view master services"
  ON master_services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage master services"
  ON master_services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  master_id uuid REFERENCES masters(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  client_name text NOT NULL,
  client_phone text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master')
    )
  );

CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Clients can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master')
    )
  )
  WITH CHECK (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master')
    )
  );

-- Create working_hours table
CREATE TABLE IF NOT EXISTS working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id uuid REFERENCES masters(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  active boolean DEFAULT true
);

ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view working hours"
  ON working_hours FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage working hours"
  ON working_hours FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert sample services
INSERT INTO services (name, description, duration, price, category) VALUES
  ('Класичний манікюр', 'Професійний класичний манікюр з покриттям', 60, 350, 'manicure'),
  ('Апаратний манікюр', 'Сучасний апаратний манікюр', 60, 400, 'manicure'),
  ('Манікюр + гель-лак', 'Манікюр з покриттям гель-лаком', 90, 450, 'manicure'),
  ('Педикюр класичний', 'Класичний педикюр', 75, 400, 'pedicure'),
  ('Педикюр апаратний', 'Апаратний педикюр', 75, 450, 'pedicure'),
  ('Педикюр + гель-лак', 'Педикюр з покриттям гель-лаком', 105, 550, 'pedicure'),
  ('Нарощування нігтів', 'Нарощування гелем', 120, 600, 'manicure'),
  ('Дизайн нігтів', 'Художній дизайн (за 1 ніготь)', 15, 50, 'manicure')
ON CONFLICT DO NOTHING;