/*
  # Initial Schema Setup for LocalServiceHub

  1. New Tables
    - businesses
      - Stores business information including name, category, and booking preferences
    - business_owners
      - Links businesses to authenticated users
    - bookings
      - Stores customer booking information
    - contact_submissions
      - Stores contact form submissions from potential business partners

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  accepts_onsite_booking BOOLEAN NOT NULL DEFAULT false,
  affiliate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create business owners table
CREATE TABLE IF NOT EXISTS business_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  service_requested TEXT NOT NULL,
  booking_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses table
CREATE POLICY "Allow public read access to businesses"
  ON businesses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their businesses"
  ON businesses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_owners
      WHERE business_owners.business_id = businesses.id
      AND business_owners.user_id = auth.uid()
    )
  );

-- Create policies for business_owners table
CREATE POLICY "Allow authenticated users to manage their business ownership"
  ON business_owners
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for bookings table
CREATE POLICY "Allow authenticated users to manage their bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_owners
      WHERE business_owners.business_id = bookings.business_id
      AND business_owners.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow public to create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for contact submissions
CREATE POLICY "Allow users to create contact submissions"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_business_owners_user_id ON business_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_business_owners_business_id ON business_owners(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_business_id ON bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);