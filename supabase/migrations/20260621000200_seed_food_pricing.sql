-- Seed the CMS with the content that currently lives in source code, so the
-- public site looks identical after switching to the database. Each block only
-- runs when its table is empty, so re-applying is safe and won't duplicate.

-- Pricing: mirrors the static cards previously hardcoded in app/rooms/page.tsx
insert into public.pricing
  (plan_name, subtitle, occupancy_type, monthly_rate, deposit, tag, description, features, recommended, sort_order)
select * from (values
  ('Multi Sharing', 'Non AC Hall', 'multi', 9000, 9000, 'Budget',
   'Great for building friendships and keeping costs low.',
   array['Bed & Mattress', 'Study Table', 'Shared Washroom', 'Fan & Lights'], false, 1),
  ('3 Sharing', 'Non AC Room', '3-sharing', 10000, 10000, 'Standard',
   'A balanced mix of social living and personal comfort.',
   array['Personal Cupboard', 'Study Table', 'Attached Washroom', 'Fan & Lights'], true, 2),
  ('3 Sharing', 'AC Room', '3-sharing', 11000, 11000, 'Premium',
   'Cool comfort with shared amenities.',
   array['Air Conditioner', 'Personal Cupboard', 'Study Table', 'Attached Washroom'], false, 3),
  ('2 Sharing', 'AC Room', '2-sharing', 14500, 14500, 'Elite',
   'More space and privacy with premium comfort.',
   array['Air Conditioner', 'Premium Bedding', 'Spacious Cupboard', 'Attached Washroom'], false, 4),
  ('1 Sharing', 'AC Room', 'single', 20000, 20000, 'Luxury',
   'Private room for those who prefer complete solitude and focus.',
   array['Air Conditioner', 'Private Room', 'Dedicated Workspace', 'Private Washroom'], false, 5)
) as v(plan_name, subtitle, occupancy_type, monthly_rate, deposit, tag, description, features, recommended, sort_order)
where not exists (select 1 from public.pricing);

-- Food photos: the images already deployed under public/images/food. Their URLs
-- are the existing static paths; new admin uploads will use Storage URLs instead.
insert into public.food_photos (title, image_url, category, sort_order)
select * from (values
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 2.43.53 PM.jpeg', 'breakfast', 1),
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 3.22.52 PM.jpeg', 'breakfast', 2),
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 3.23.38 PM.jpeg', 'breakfast', 3),
  ('Breakfast', '/images/food/breakfast/WhatsApp Image 2026-02-15 at 3.24.35 PM.jpeg', 'breakfast', 4),
  ('Breakfast', '/images/food/breakfast/food-23.jpg', 'breakfast', 5),
  ('Breakfast', '/images/food/breakfast/food-28.jpg', 'breakfast', 6),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-2.jpg', 'lunch-dinner', 1),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-20.jpg', 'lunch-dinner', 2),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-26.jpg', 'lunch-dinner', 3),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-4.jpg', 'lunch-dinner', 4),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-5.jpg', 'lunch-dinner', 5),
  ('Lunch & Dinner', '/images/food/lunch-dinner/food-8.jpg', 'lunch-dinner', 6),
  ('Festival Food', '/images/food/festival-food/WhatsApp Image 2026-02-15 at 2.46.54 PM.jpeg', 'festival-food', 1),
  ('Festival Food', '/images/food/festival-food/WhatsApp Image 2026-02-15 at 2.47.38 PM.jpeg', 'festival-food', 2),
  ('Fast Food', '/images/food/fastfood/WhatsApp Image 2026-02-15 at 3.27.05 PM.jpeg', 'fastfood', 1),
  ('Fast Food', '/images/food/fastfood/WhatsApp Image 2026-02-15 at 3.28.44 PM.jpeg', 'fastfood', 2),
  ('Fast Food', '/images/food/fastfood/WhatsApp Image 2026-02-15 at 3.29.55 PM.jpeg', 'fastfood', 3),
  ('Fast Food', '/images/food/fastfood/food-10.jpg', 'fastfood', 4),
  ('Fast Food', '/images/food/fastfood/food-21.jpg', 'fastfood', 5)
) as v(title, image_url, category, sort_order)
where not exists (select 1 from public.food_photos);
