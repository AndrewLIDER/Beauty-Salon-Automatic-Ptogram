/*
  # CMS Content Management Tables

  1. New Tables
    - `site_settings` - General salon settings
    - `service_categories` - Service categories
    - `hero_settings` - Hero section content
    - `portfolio` - Portfolio/gallery images

  All tables use RLS for security
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_name text NOT NULL DEFAULT 'Nails.S. Studio',
  address text,
  phone_primary text,
  phone_secondary text,
  email text,
  work_hours_mon_fri text,
  work_hours_sat_sun text,
  instagram text,
  facebook text,
  telegram text,
  whatsapp text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
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

-- Create service_categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON service_categories FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON service_categories FOR ALL
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

-- Create hero_settings table
CREATE TABLE IF NOT EXISTS hero_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Nails.S. Studio',
  subtitle text DEFAULT 'Елегантність та краса в кожному деталі',
  cta_text text DEFAULT 'Записатися на процедуру',
  background_image_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero settings"
  ON hero_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage hero settings"
  ON hero_settings FOR ALL
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

-- Create portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  category text,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active portfolio"
  ON portfolio FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage portfolio"
  ON portfolio FOR ALL
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

-- Insert default hero settings
INSERT INTO hero_settings (title, subtitle, cta_text) VALUES
  ('Nails.S. Studio', 'Елегантність та краса в кожному деталі', 'Записатися на процедуру')
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (salon_name, phone_primary) VALUES
  ('Nails.S. Studio', '+380 00 000 00 00')
ON CONFLICT DO NOTHING;
