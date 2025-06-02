-- Add user_id column if it doesn't exist
ALTER TABLE public.lists 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add is_public column if it doesn't exist
ALTER TABLE public.lists 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own lists
CREATE POLICY "Users can view own lists" ON public.lists
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own lists
CREATE POLICY "Users can create lists" ON public.lists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own lists
CREATE POLICY "Users can update own lists" ON public.lists
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own lists
CREATE POLICY "Users can delete own lists" ON public.lists
    FOR DELETE
    USING (auth.uid() = user_id);

-- Allow public access to shared lists
CREATE POLICY "Anyone can view shared lists" ON public.lists
    FOR SELECT
    USING (is_public = true);

-- Set user_id for existing lists if needed (optional)
-- This assumes you want to assign existing lists to a specific user
-- Replace 'your-user-id' with an actual user ID if needed
-- UPDATE public.lists SET user_id = 'your-user-id' WHERE user_id IS NULL; 