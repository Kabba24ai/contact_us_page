/*
  # Create store settings table

  1. New Tables
    - `store_settings`
      - `id` (uuid, primary key)
      - `location` (text, unique) - Store location identifier
      - `hours_of_operation` (jsonb) - Weekly hours in structured format
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `store_settings` table
    - Add policy for public read access (hours are public information)
    - Add policy for authenticated users to manage settings

  3. Sample Data Structure
    hours_of_operation format:
    {
      "monday": {"open": "09:00", "close": "17:00", "closed": false},
      "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
      ...
    }
*/

CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text UNIQUE NOT NULL,
  hours_of_operation jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view store settings"
  ON store_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert store settings"
  ON store_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update store settings"
  ON store_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete store settings"
  ON store_settings
  FOR DELETE
  TO authenticated
  USING (true);