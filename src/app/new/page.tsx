"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";

export default function NewList() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    url: "",
    description: "",
    is_public: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title) {
      setError("Title is required");
      return;
    }

    try {
      // Generate a slug if not provided
      const slug =
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const urls = formData.url ? [{ url: formData.url }] : [];

      const { data, error: insertError } = await supabase
        .from("lists")
        .insert([
          {
            title: formData.title,
            slug,
            description: formData.description || null,
            urls,
            is_public: formData.is_public,
            user_id: session?.user?.id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      router.push(`/list/${data.slug}`);
    } catch (err: any) {
      setError(err.message || "Failed to create list");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-10 mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Create a New List
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="List Title"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-900 mb-1">
              Custom Slug (optional)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="custom-slug"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-900 mb-1">
              First URL (optional)
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-900 mb-1">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your list..."
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              id="is_public"
            />
            <label htmlFor="is_public" className="text-gray-700 text-base">
              Make this list public
            </label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 text-lg"
          >
            Create List
          </button>
        </form>
      </div>
    </main>
  );
}
