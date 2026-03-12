-- Add video_url and featured columns to gallery_items table
-- Run this migration if your database was created before these columns existed

ALTER TABLE gallery_items
ADD COLUMN IF NOT EXISTS video_url TEXT;

ALTER TABLE gallery_items
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create a unique partial index to ensure only ONE item can be featured at a time
-- This uses a constant expression so all featured=true rows must be "unique" on that constant,
-- effectively limiting the count to 1
CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_items_single_featured 
ON gallery_items ((true)) 
WHERE featured = true;
