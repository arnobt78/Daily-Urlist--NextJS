'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function EditListPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchList() {
      if (typeof slug !== 'string') return;
      
      try {
        const { data, error } = await supabase
          .from('lists')
          .select()
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setTitle(data.title || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchList();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof slug !== 'string') return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('lists')
        .update({ title })
        .eq('slug', slug);

      if (error) throw error;
      router.push(`/list/${slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit List
        </h1>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900">
              List Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your list"
              error={error}
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="text-gray-900 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
} 