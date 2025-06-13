"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { LinkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface List {
  id: string;
  slug: string;
  title: string | null;
  urls: any[];
  created_at: string;
}

export default function ListsPage() {
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLists() {
      try {
        const { data, error } = await supabase
          .from("lists")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLists(data || []);
      } catch (error) {
        console.error("Error fetching lists:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLists();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this list?")) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("lists").delete().eq("id", id);

      if (error) throw error;
      setLists(lists.filter((list) => list.id !== id));
    } catch (error) {
      console.error("Error deleting list:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Lists
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and organize your URL collections
            </p>
          </div>
          <Button
            href="/new"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto"
          >
            Create New List
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {lists.length > 0 ? (
            lists.map((list) => (
              <div
                key={list.id}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {list.title || `List: ${list.slug}`}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        {list.urls.length} URLs
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        Created {new Date(list.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => router.push(`/list/${list.slug}/edit`)}
                      variant="ghost"
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(list.id)}
                      variant="ghost"
                      className="text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                      disabled={deletingId === list.id}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => router.push(`/list/${list.slug}`)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                    >
                      View List
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 sm:p-12 text-center bg-white">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <LinkIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">
                No Lists Yet
              </h3>
              <p className="mt-2 text-gray-500">
                Start organizing your URLs by creating your first list
              </p>
              <div className="mt-8">
                <Button
                  href="/new"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                >
                  Create New List
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
