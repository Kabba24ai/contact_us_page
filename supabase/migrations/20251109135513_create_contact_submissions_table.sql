/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `location` (text) - Store location (e.g., "Bon Aqua", "Clarksville")
      - `name` (text) - Customer's name
      - `phone` (text) - Customer's phone number
      - `message` (text) - Customer's message
      - `created_at` (timestamptz) - Timestamp of submission
      - `status` (text) - Status of the inquiry (default: 'new')
  
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for inserting submissions (public access for form submission)
    - Add policy for authenticated users to view submissions (staff/admin access)

  3. Important Notes
    - Public can insert (submit forms) but cannot read submissions
    - Only authenticated users can read submissions for business management
    - Status field helps track inquiry handling workflow
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);