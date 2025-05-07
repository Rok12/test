-- Update the patterns table to remove texture_url column
ALTER TABLE public.patterns 
DROP COLUMN IF EXISTS texture_url;

-- Make sure the patterns table has all the necessary columns
ALTER TABLE public.patterns 
ADD COLUMN IF NOT EXISTS length NUMERIC DEFAULT 100,
ADD COLUMN IF EXISTS width NUMERIC DEFAULT 100,
ADD COLUMN IF EXISTS thickness NUMERIC DEFAULT 18,
ADD COLUMN IF EXISTS texture_repeat_x NUMERIC DEFAULT 1,
ADD COLUMN IF EXISTS texture_repeat_y NUMERIC DEFAULT 1;

-- Update existing patterns with appropriate dimensions if they don't have them
UPDATE public.patterns 
SET 
length = 120, 
width = 60, 
thickness = 20, 
texture_repeat_x = 1, 
texture_repeat_y = 1
WHERE name = 'White Marble' AND (length IS NULL OR width IS NULL OR thickness IS NULL);

UPDATE public.patterns 
SET 
length = 240, 
width = 60, 
thickness = 18, 
texture_repeat_x = 2, 
texture_repeat_y = 1
WHERE name = 'Walnut Classic' AND (length IS NULL OR width IS NULL OR thickness IS NULL);

UPDATE public.patterns 
SET 
length = 240, 
width = 60, 
thickness = 18, 
texture_repeat_x = 2, 
texture_repeat_y = 1
WHERE name = 'Oak Natural' AND (length IS NULL OR width IS NULL OR thickness IS NULL);

UPDATE public.patterns 
SET 
length = 120, 
width = 120, 
thickness = 22, 
texture_repeat_x = 1, 
texture_repeat_y = 1
WHERE name = 'Concrete Grey' AND (length IS NULL OR width IS NULL OR thickness IS NULL);
