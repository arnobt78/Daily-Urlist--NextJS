"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@nanostores/react";
import { currentList, getList } from "@/stores/urlListStore";
import { UrlList } from "@/components/lists/UrlList";
import { Button } from "@/components/ui/Button";

export default function ListPage() {
  const { slug } = useParams();
  const list = useStore(currentList);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchList() {
      if (typeof slug === "string") {
        await getList(slug);
      }
      setIsLoading(false);
    }
    fetchList();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </main>
    );
  }

  if (!list) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold">List not found</h1>
          <p className="mt-2 text-gray-600">
            The list you're looking for doesn't exist or has been deleted.
          </p>
          <Button href="/" className="mt-8">
            Go Home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-4 md:gap-0">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                {list.title || `List: ${list.slug}`}
                <span className="text-lg text-gray-500 font-normal">
                  {list.urls?.length || 0} URLs
                </span>
              </h1>
            </div>
            {/* Add more header actions here if needed */}
          </div>
          <UrlList />
        </div>
      </div>
    </main>
  );
}
