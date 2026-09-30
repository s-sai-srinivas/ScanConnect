-- ScanConnect initial schema

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Businesses
CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  phone text,
  whatsapp text,
  instagram text,
  address text,
  opening_hours text,
  menu_template text,
  is_open boolean DEFAULT true,
  is_published boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX businesses_slug_idx ON public.businesses(slug);
CREATE INDEX businesses_owner_id_idx ON public.businesses(owner_id);

-- Menu categories
CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order int DEFAULT 0
);

CREATE INDEX menu_categories_business_id_idx ON public.menu_categories(business_id);

-- Menu items
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text,
  is_veg boolean DEFAULT false,
  is_available boolean DEFAULT true,
  sort_order int DEFAULT 0,
  view_count int DEFAULT 0
);

CREATE INDEX menu_items_category_id_idx ON public.menu_items(category_id);

-- QR tables (Phase 2)
CREATE TABLE public.qr_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  table_name text NOT NULL,
  qr_slug text UNIQUE NOT NULL,
  scan_count int DEFAULT 0
);

-- Scans (Phase 2)
CREATE TABLE public.scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  table_id uuid REFERENCES public.qr_tables(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Interactions (Phase 2)
CREATE TABLE public.interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  table_id uuid REFERENCES public.qr_tables(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('call_waiter', 'whatsapp_order')),
  created_at timestamptz DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: check business is publicly visible
CREATE OR REPLACE FUNCTION public.business_is_public(bid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = bid AND b.is_published = true AND b.is_active = true
  );
$$;

-- Helper: user owns business
CREATE OR REPLACE FUNCTION public.user_owns_business(bid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = bid AND b.owner_id = auth.uid()
  );
$$;

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Businesses
CREATE POLICY "businesses_select_public" ON public.businesses FOR SELECT TO anon, authenticated
  USING (is_published = true AND is_active = true);
CREATE POLICY "businesses_select_own" ON public.businesses FOR SELECT TO authenticated
  USING (owner_id = auth.uid());
CREATE POLICY "businesses_insert_own" ON public.businesses FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "businesses_update_own" ON public.businesses FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "businesses_delete_own" ON public.businesses FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Menu categories
CREATE POLICY "categories_select_public" ON public.menu_categories FOR SELECT TO anon, authenticated
  USING (public.business_is_public(business_id));
CREATE POLICY "categories_select_own" ON public.menu_categories FOR SELECT TO authenticated
  USING (public.user_owns_business(business_id));
CREATE POLICY "categories_insert_own" ON public.menu_categories FOR INSERT TO authenticated
  WITH CHECK (public.user_owns_business(business_id));
CREATE POLICY "categories_update_own" ON public.menu_categories FOR UPDATE TO authenticated
  USING (public.user_owns_business(business_id)) WITH CHECK (public.user_owns_business(business_id));
CREATE POLICY "categories_delete_own" ON public.menu_categories FOR DELETE TO authenticated
  USING (public.user_owns_business(business_id));

-- Menu items (via category -> business)
CREATE OR REPLACE FUNCTION public.category_business_id(cid uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT business_id FROM public.menu_categories WHERE id = cid;
$$;

CREATE POLICY "items_select_public" ON public.menu_items FOR SELECT TO anon, authenticated
  USING (public.business_is_public(public.category_business_id(category_id)));
CREATE POLICY "items_select_own" ON public.menu_items FOR SELECT TO authenticated
  USING (public.user_owns_business(public.category_business_id(category_id)));
CREATE POLICY "items_insert_own" ON public.menu_items FOR INSERT TO authenticated
  WITH CHECK (public.user_owns_business(public.category_business_id(category_id)));
CREATE POLICY "items_update_own" ON public.menu_items FOR UPDATE TO authenticated
  USING (public.user_owns_business(public.category_business_id(category_id)))
  WITH CHECK (public.user_owns_business(public.category_business_id(category_id)));
CREATE POLICY "items_delete_own" ON public.menu_items FOR DELETE TO authenticated
  USING (public.user_owns_business(public.category_business_id(category_id)));

-- QR tables
CREATE POLICY "qr_tables_select_public" ON public.qr_tables FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "qr_tables_all_own" ON public.qr_tables FOR ALL TO authenticated
  USING (public.user_owns_business(business_id)) WITH CHECK (public.user_owns_business(business_id));

-- Scans
CREATE POLICY "scans_insert_public" ON public.scans FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "scans_select_own" ON public.scans FOR SELECT TO authenticated
  USING (public.user_owns_business(business_id));

-- Interactions
CREATE POLICY "interactions_insert_public" ON public.interactions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "interactions_select_own" ON public.interactions FOR SELECT TO authenticated
  USING (public.user_owns_business(business_id));

-- Grants for Data API
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "menu_images_public_read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'menu-images');

CREATE POLICY "menu_images_owner_upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'menu-images'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "menu_images_owner_update" ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'menu-images'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'menu-images'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "menu_images_owner_delete" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'menu-images'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
  );
