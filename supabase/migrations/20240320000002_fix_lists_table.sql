-- First drop existing policies and table
DROP POLICY IF EXISTS "Users can view own lists" ON public.lists;
DROP POLICY IF EXISTS "Users can create lists" ON public.lists;
DROP POLICY IF EXISTS "Users can update own lists" ON public.lists;
DROP POLICY IF EXISTS "Users can delete own lists" ON public.lists;
DROP POLICY IF EXISTS "Anyone can view shared lists" ON public.lists;

DROP TABLE IF EXISTS public.lists;

-- Create the table fresh
CREATE TABLE public.lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    urls JSONB DEFAULT '[]'::jsonb NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL
);

-- Create indexes
CREATE INDEX lists_user_id_idx ON public.lists(user_id);
CREATE INDEX lists_slug_idx ON public.lists(slug);

-- Enable RLS
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own lists" ON public.lists
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create lists" ON public.lists
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists" ON public.lists
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists" ON public.lists
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared lists" ON public.lists
    FOR SELECT
    USING (is_public = true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lists_updated_at
    BEFORE UPDATE ON public.lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 