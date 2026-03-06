/*
  # Fix Services and Categories Relationship

  Add proper foreign key relationship between services and service_categories
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE services ADD COLUMN category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update existing services to use first category if it exists
UPDATE services s
SET category_id = (SELECT id FROM service_categories LIMIT 1)
WHERE category_id IS NULL AND EXISTS (SELECT 1 FROM service_categories);
