-- Demo cafe seed (owner_id null = system demo)
INSERT INTO public.businesses (
  id, name, slug, phone, whatsapp, address, opening_hours, menu_template,
  is_open, is_published, is_active
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Demo Cafe',
  'demo-cafe',
  '9876543210',
  '9876543210',
  '123 MG Road, Bangalore',
  'Mon-Sun: 8AM - 10PM',
  'cafe',
  true, true, true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.menu_categories (id, business_id, name, sort_order) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Coffee', 0),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Snacks', 1),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Desserts', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.menu_items (category_id, name, price, is_veg, is_available, sort_order, image_url) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Espresso', 120, true, true, 0, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80'),
  ('b0000000-0000-0000-0000-000000000001', 'Cappuccino', 150, true, true, 1, 'https://images.unsplash.com/photo-1572442388796-11668a67e3d9?w=400&q=80'),
  ('b0000000-0000-0000-0000-000000000001', 'Cold Brew', 180, true, true, 2, 'https://images.unsplash.com/photo-1517701603779-8fc752b4232a?w=400&q=80'),
  ('b0000000-0000-0000-0000-000000000002', 'Veg Sandwich', 149, true, true, 0, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80'),
  ('b0000000-0000-0000-0000-000000000002', 'Chicken Wrap', 199, false, true, 1, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80'),
  ('b0000000-0000-0000-0000-000000000002', 'French Fries', 99, true, false, 2, 'https://images.unsplash.com/photo-1573080496216-bf940ebb4174?w=400&q=80'),
  ('b0000000-0000-0000-0000-000000000003', 'Chocolate Brownie', 129, true, true, 0, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80'),
  ('b0000000-0000-0000-0000-000000000003', 'Cheesecake', 179, true, true, 1, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&q=80')
ON CONFLICT DO NOTHING;
