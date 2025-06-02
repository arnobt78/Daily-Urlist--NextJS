import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function getUserLists() {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }

  return data;
}

export async function getPublicList(slug: string) {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching list:', error);
    throw error;
  }

  return data;
}

export async function createList(list: {
  title: string;
  description?: string;
  urls: { url: string; title?: string; description?: string }[];
  is_public?: boolean;
}) {
  const { data, error } = await supabase
    .from('lists')
    .insert([
      {
        ...list,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating list:', error);
    throw error;
  }

  return data;
}

export async function updateList(
  listId: string,
  updates: {
    title?: string;
    description?: string;
    urls?: { url: string; title?: string; description?: string }[];
    is_public?: boolean;
  }
) {
  const { data, error } = await supabase
    .from('lists')
    .update(updates)
    .eq('id', listId)
    .select()
    .single();

  if (error) {
    console.error('Error updating list:', error);
    throw error;
  }

  return data;
}

export async function deleteList(listId: string) {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);

  if (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
} 