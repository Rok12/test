-- Update the patterns table to use finishType instead of category

-- First, add the new finishType column
ALTER TABLE public.patterns 
ADD COLUMN IF NOT EXISTS finishType VARCHAR(50);

-- Copy data from category to finishType
UPDATE public.patterns 
SET finishType = category
WHERE finishType IS NULL AND category IS NOT NULL;

-- Add some additional finish types for variety
UPDATE public.patterns 
SET finishType = 'glossy'
WHERE name LIKE '%Marble%';

UPDATE public.patterns 
SET finishType = 'matte'
WHERE name LIKE '%Concrete%';

UPDATE public.patterns 
SET finishType = 'natural'
WHERE name LIKE '%Oak%';

UPDATE public.patterns 
SET finishType = 'oiled'
WHERE name LIKE '%Walnut%';

-- You can now safely drop the category column if needed
-- ALTER TABLE public.patterns DROP COLUMN IF EXISTS category;
