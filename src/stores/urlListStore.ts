import { atom, map } from 'nanostores';
import { supabase } from '@/lib/supabase';

export interface UrlItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  createdAt: string;
  isFavorite: boolean;
}

export interface UrlList {
  id: string;
  slug: string;
  title?: string;
  urls: UrlItem[];
  createdAt: string;
}

// Initialize with empty list state
export const currentList = map<Partial<UrlList>>({});
export const isLoading = atom<boolean>(false);
export const error = atom<string | null>(null);

export async function getList(slug: string) {
  isLoading.set(true);
  error.set(null);

  try {
    const { data, error: err } = await supabase
      .from('lists')
      .select()
      .eq('slug', slug)
      .single();

    if (err) throw err;
    currentList.set(data);
    return data;
  } catch (err: any) {
    error.set(err.message);
    return null;
  } finally {
    isLoading.set(false);
  }
}

export async function createList(slug?: string) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const { data, error: err } = await supabase
      .from('lists')
      .insert({
        slug: slug || generateRandomSlug(),
        urls: []
      })
      .select()
      .single();

    if (err) throw err;
    currentList.set(data);
    return data;
  } catch (err: any) {
    error.set(err.message);
    throw err;
  } finally {
    isLoading.set(false);
  }
}

export async function addUrlToList(url: string, title?: string) {
  const current = currentList.get();
  if (!current.id || !current.urls) return;
  
  isLoading.set(true);
  error.set(null);

  try {
    const newUrl: UrlItem = {
      id: crypto.randomUUID(),
      url,
      title,
      createdAt: new Date().toISOString(),
      isFavorite: false
    };

    const updatedUrls = [...current.urls, newUrl];

    const { data, error: err } = await supabase
      .from('lists')
      .update({ urls: updatedUrls })
      .eq('id', current.id)
      .select()
      .single();

    if (err) throw err;
    currentList.set(data);
    return data;
  } catch (err: any) {
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

export async function updateUrlInList(urlId: string, updates: Partial<UrlItem>) {
  const current = currentList.get();
  if (!current.id || !current.urls) return;

  isLoading.set(true);
  error.set(null);

  try {
    const updatedUrls = current.urls.map(url => 
      url.id === urlId ? { ...url, ...updates } : url
    );

    const { data, error: err } = await supabase
      .from('lists')
      .update({ urls: updatedUrls })
      .eq('id', current.id)
      .select()
      .single();

    if (err) throw err;
    currentList.set(data);
    return data;
  } catch (err: any) {
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

export async function removeUrlFromList(urlId: string) {
  const current = currentList.get();
  if (!current.id || !current.urls) return;

  isLoading.set(true);
  error.set(null);

  try {
    const updatedUrls = current.urls.filter(url => url.id !== urlId);

    const { data, error: err } = await supabase
      .from('lists')
      .update({ urls: updatedUrls })
      .eq('id', current.id)
      .select()
      .single();

    if (err) throw err;
    currentList.set(data);
  } catch (err: any) {
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

export async function toggleUrlFavorite(id: string) {
  const list = currentList.get() as UrlList | undefined;
  
  // Early return if list or urls don't exist
  if (!list?.id || !list?.urls) {
    console.warn('No list or URLs found');
    return;
  }

  // Find the URL with type safety
  const urlIndex = list.urls.findIndex((url: UrlItem) => url.id === id);
  if (urlIndex === -1) {
    console.warn('URL not found');
    return;
  }

  // Get the current URL
  const url = list.urls[urlIndex];

  try {
    await updateUrlInList(id, { isFavorite: !url.isFavorite });
  } catch (err) {
    console.error('Error toggling favorite:', err);
  }
}

function generateRandomSlug(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
} 