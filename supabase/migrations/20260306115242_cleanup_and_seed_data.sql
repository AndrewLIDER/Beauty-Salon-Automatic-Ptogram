/*
  # Cleanup and Seed Data

  Clean existing data and insert fresh test data
*/

-- Delete existing services and categories
DELETE FROM services;
DELETE FROM service_categories;
DELETE FROM masters;
DELETE FROM portfolio;

-- Insert service categories
INSERT INTO service_categories (name, description, sort_order, active) VALUES
  ('Манікюр', 'Всі види манікюру', 1, true),
  ('Педикюр', 'Догляд за ногами', 2, true),
  ('Дизайн нігтів', 'Розписи та дизайни', 3, true),
  ('Розширення нігтів', 'Нарощування та шеллак', 4, true);

-- Get category IDs and insert services
DO $$
DECLARE
  cat_manicure_id UUID;
  cat_pedicure_id UUID;
  cat_design_id UUID;
  cat_extension_id UUID;
BEGIN
  SELECT id INTO cat_manicure_id FROM service_categories WHERE name = 'Манікюр';
  SELECT id INTO cat_pedicure_id FROM service_categories WHERE name = 'Педикюр';
  SELECT id INTO cat_design_id FROM service_categories WHERE name = 'Дизайн нігтів';
  SELECT id INTO cat_extension_id FROM service_categories WHERE name = 'Розширення нігтів';

  INSERT INTO services (name, description, price, duration, category_id, category, active) VALUES
    ('Класичний манікюр', 'Обрізний манікюр', 250, 45, cat_manicure_id, 'Манікюр', true),
    ('Європейський манікюр', 'Необрізний манікюр', 300, 40, cat_manicure_id, 'Манікюр', true),
    ('Французький манікюр', 'Французька техніка', 350, 50, cat_manicure_id, 'Манікюр', true),
    ('Педикюр класичний', 'Базовий догляд', 350, 60, cat_pedicure_id, 'Педикюр', true),
    ('Педикюр SPA', 'З маслами та кремами', 500, 90, cat_pedicure_id, 'Педикюр', true),
    ('Простий дизайн', 'Однотонні малюнки', 150, 30, cat_design_id, 'Дизайн нігтів', true),
    ('Складний дизайн', 'Складні розписи', 300, 60, cat_design_id, 'Дизайн нігтів', true),
    ('Нарощування акрилом', 'На 4 тижні', 600, 120, cat_extension_id, 'Розширення нігтів', true),
    ('Гель-лак звичайний', '3 тижні довговічності', 400, 90, cat_extension_id, 'Розширення нігтів', true);
END $$;

-- Insert masters
INSERT INTO masters (name, bio, specialization, avatar_url, active) VALUES
  ('Вікторія', 'Досвід 8 років. Спеціалізація - складні дизайни', 
   ARRAY['Дизайн нігтів', 'Гель-лак', 'Нарощування'],
   'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
   true),
  ('Світлана', 'Досвід 10 років. Експерт класичних манікюрів',
   ARRAY['Манікюр', 'Педикюр', 'Французький манікюр'],
   'https://images.pexels.com/photos/3945684/pexels-photo-3945684.jpeg',
   true),
  ('Юля', 'Досвід 5 років. Творча особистість з інноваційним підходом',
   ARRAY['Дизайн нігтів', 'Комбіновані техніки'],
   'https://images.pexels.com/photos/3945690/pexels-photo-3945690.jpeg',
   true);

-- Insert portfolio items
INSERT INTO portfolio (title, image_url, category, sort_order, active) VALUES
  ('Геометричний дизайн', 'https://images.pexels.com/photos/3985151/pexels-photo-3985151.jpeg', 'дизайн', 1, true),
  ('Флоральний дизайн', 'https://images.pexels.com/photos/3945715/pexels-photo-3945715.jpeg', 'дизайн', 2, true),
  ('Класичний манікюр', 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg', 'манікюр', 3, true),
  ('Педикюр SPA', 'https://images.pexels.com/photos/3991950/pexels-photo-3991950.jpeg', 'педикюр', 4, true),
  ('Нарощування акрилом', 'https://images.pexels.com/photos/3990179/pexels-photo-3990179.jpeg', 'нарощування', 5, true),
  ('Французький манікюр', 'https://images.pexels.com/photos/3975587/pexels-photo-3975587.jpeg', 'манікюр', 6, true),
  ('Градієнт дизайн', 'https://images.pexels.com/photos/3993879/pexels-photo-3993879.jpeg', 'дизайн', 7, true),
  ('Мінімаліст дизайн', 'https://images.pexels.com/photos/3962296/pexels-photo-3962296.jpeg', 'дизайн', 8, true);

-- Insert hero settings
INSERT INTO hero_settings (title, subtitle, cta_text, background_image_url) VALUES
  ('Nails.S. Studio', 'Елегантність та краса в кожному деталі', 'Записатися на процедуру', 
   'https://images.pexels.com/photos/3987330/pexels-photo-3987330.jpeg')
ON CONFLICT DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (salon_name, phone_primary, address, work_hours_mon_fri, work_hours_sat_sun, email) VALUES
  ('Nails.S. Studio', '+380 67 000 00 00', 'Київ, вул. Прикладів, 123', 
   'Пн-Пт: 10:00-19:00', 'Сб-Нд: 11:00-18:00', 'info@nails-studio.ua')
ON CONFLICT DO NOTHING;
