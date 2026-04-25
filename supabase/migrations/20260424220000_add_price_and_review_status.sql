-- Migration: add price/show_price to rooms, status to reviews
-- Gaivota Hotel - 2026-04-24

-- Add price fields to rooms
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS price numeric,
  ADD COLUMN IF NOT EXISTS show_price boolean NOT NULL DEFAULT true;

-- Add moderation status to reviews
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Mark all existing reviews as approved
UPDATE public.reviews SET status = 'approved' WHERE status = 'approved';
