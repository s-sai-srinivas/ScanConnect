-- Add business hub link fields
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS swiggy_url text,
  ADD COLUMN IF NOT EXISTS zomato_url text,
  ADD COLUMN IF NOT EXISTS google_reviews_url text;
