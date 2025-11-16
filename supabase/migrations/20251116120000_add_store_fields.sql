/*
  # Add Store Information Fields

  1. Modifications
    - Add store information fields to `store_settings` table
      - `store_name` (text) - Store display name
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email address
      - `details` (text) - Additional store details
      - `address` (text) - Street address
      - `city` (text) - City name
      - `state` (text) - State name
      - `zip_code` (text) - Postal code
      - `country` (text) - Country name
      - `latitude` (text) - GPS latitude
      - `longitude` (text) - GPS longitude
      - `is_primary` (boolean) - Primary store designation
      - `status` (text) - Store status (Active/Inactive)

  2. Notes
    - Uses IF NOT EXISTS to safely add columns
    - All new fields are optional (nullable) for backward compatibility
    - Default values provided where appropriate
*/

DO $$
BEGIN
  -- Add store_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'store_name'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN store_name text;
  END IF;

  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'phone'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN phone text;
  END IF;

  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'email'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN email text;
  END IF;

  -- Add details column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'details'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN details text;
  END IF;

  -- Add address column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'address'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN address text;
  END IF;

  -- Add city column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'city'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN city text;
  END IF;

  -- Add state column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'state'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN state text;
  END IF;

  -- Add zip_code column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'zip_code'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN zip_code text;
  END IF;

  -- Add country column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'country'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN country text DEFAULT 'USA';
  END IF;

  -- Add latitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN latitude text;
  END IF;

  -- Add longitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN longitude text;
  END IF;

  -- Add is_primary column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'is_primary'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN is_primary boolean DEFAULT false;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'status'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN status text DEFAULT 'Active';
  END IF;
END $$;
