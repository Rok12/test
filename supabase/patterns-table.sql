-- Create patterns table
CREATE TABLE IF NOT EXISTS public.patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    texture_url TEXT,
    thumbnail_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    price_factor NUMERIC(4,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read patterns
CREATE POLICY "Anyone can read patterns" 
ON public.patterns 
FOR SELECT 
USING (true);

-- Only allow admins to insert/update/delete patterns
CREATE POLICY "Only admins can insert patterns" 
ON public.patterns 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'app_metadata' ? 'is_admin');

CREATE POLICY "Only admins can update patterns" 
ON public.patterns 
FOR UPDATE 
USING (auth.jwt() ->> 'app_metadata' ? 'is_admin');

CREATE POLICY "Only admins can delete patterns" 
ON public.patterns 
FOR DELETE 
USING (auth.jwt() ->> 'app_metadata' ? 'is_admin');

-- Insert some initial patterns
INSERT INTO public.patterns (name, category, color_hex, is_premium, price_factor)
VALUES 
    ('Pure White', 'solid', '#FFFFFF', false, 1.0),
    ('Midnight Black', 'solid', '#222222', false, 1.0),
    ('Slate Gray', 'solid', '#708090', false, 1.0),
    ('Navy Blue', 'solid', '#000080', false, 1.0),
    ('Forest Green', 'solid', '#228B22', false, 1.0),
    ('Burgundy', 'solid', '#800020', false, 1.0),
    ('Beige', 'solid', '#F5F5DC', false, 1.0),
    ('Taupe', 'solid', '#483C32', false, 1.0);

-- Wood patterns
INSERT INTO public.patterns (name, category, color_hex, is_premium, price_factor)
VALUES 
    ('Oak', 'wood', '#D4BE9C', false, 1.2),
    ('Walnut', 'wood', '#5C4033', false, 1.3),
    ('Maple', 'wood', '#F0E0C0', false, 1.2),
    ('Cherry', 'wood', '#C19A6B', false, 1.3),
    ('Mahogany', 'wood', '#C04000', true, 1.5),
    ('Ebony', 'wood', '#3D2B1F', true, 1.6);

-- Marble patterns
INSERT INTO public.patterns (name, category, color_hex, is_premium, price_factor)
VALUES 
    ('Carrara White', 'marble', '#F5F5F5', true, 1.8),
    ('Emperador Dark', 'marble', '#6B4423', true, 1.9),
    ('Calacatta Gold', 'marble', '#F5F2E8', true, 2.0);

-- Metal finishes
INSERT INTO public.patterns (name, category, color_hex, is_premium, price_factor)
VALUES 
    ('Brushed Steel', 'metal', '#C0C0C0', true, 1.4),
    ('Copper', 'metal', '#B87333', true, 1.5),
    ('Brass', 'metal', '#D4AF37', true, 1.6);
