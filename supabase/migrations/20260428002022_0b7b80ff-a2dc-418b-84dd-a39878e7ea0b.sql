ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS price numeric(10,2);
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS show_price boolean NOT NULL DEFAULT true;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS status text;