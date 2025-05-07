-- Add pattern_id column to furniture_configurations table
ALTER TABLE public.furniture_configurations 
ADD COLUMN IF NOT EXISTS pattern_id UUID REFERENCES public.patterns(id);
