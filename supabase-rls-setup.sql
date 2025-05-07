-- Enable RLS on the furniture_configurations table
ALTER TABLE furniture_configurations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own configurations
CREATE POLICY "Users can view their own configurations" 
ON furniture_configurations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own configurations
CREATE POLICY "Users can insert their own configurations" 
ON furniture_configurations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own configurations
CREATE POLICY "Users can update their own configurations" 
ON furniture_configurations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own configurations
CREATE POLICY "Users can delete their own configurations" 
ON furniture_configurations 
FOR DELETE 
USING (auth.uid() = user_id);
