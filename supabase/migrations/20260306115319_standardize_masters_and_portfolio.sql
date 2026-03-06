/*
  # Standardize Masters and Portfolio Tables

  Update schema to use avatar_url instead of photo_url for consistency
*/

-- Update masters column names if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'masters' AND column_name = 'photo_url') THEN
    ALTER TABLE masters RENAME COLUMN photo_url TO avatar_url;
  END IF;
END $$;

-- Ensure specialization column is an array
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'masters' AND column_name = 'specialization') THEN
    ALTER TABLE masters ADD COLUMN specialization text[] DEFAULT '{}';
  END IF;
END $$;
