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
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </main>
    );
  }

  if (!list) {
    return (
      <main className="container mx-auto px-4 sm:px-6 py-8">
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
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-16 gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                {list.title || `List: ${list.slug}`}
                <span className="text-base sm:text-lg text-gray-500 font-normal">
                  {list.urls?.length || 0} URLs
                </span>
              </h1>
              {/* Public/Private toggle */}
              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    list.isPublic
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {list.isPublic ? "Public" : "Private"}
                </span>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs px-3 py-1"
                  onClick={async () => {
                    // Toggle public/private
                    await fetch(`/api/lists/${list.id}/visibility`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ isPublic: !list.isPublic }),
                    });
                    window.location.reload();
                  }}
                >
                  Make {list.isPublic ? "Private" : "Public"}
                </Button>
              </div>
              {/* Shareable link */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Shareable Link:</span>
                <input
                  type="text"
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/list/${list.slug}`
                      : ""
                  }
                  className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-1 w-48"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  size="sm"
                  className="text-xs px-3 py-1"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/list/${list.slug}`
                    );
                  }}
                >
                  Copy
                </Button>
              </div>
              {/* Collaborators (invite logic) */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Collaborators:</span>
                {list.collaborators && list.collaborators.length > 0 ? (
                  list.collaborators.map((email) => (
                    <span
                      key={email}
                      className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mr-1"
                    >
                      {email}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="text-xs px-3 py-1"
                  onClick={async () => {
                    const email = prompt("Enter collaborator email:");
                    if (!email) return;
                    await fetch(`/api/lists/${list.id}/collaborators`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    window.location.reload();
                  }}
                >
                  Invite
                </Button>
              </div>
            </div>
            {/* Add more header actions here if needed */}
          </div>
          <UrlList />
          {/* Social Preview Card */}
          <div className="my-8 max-w-xl mx-auto border border-gray-200 rounded-2xl shadow-lg bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="The Urlist Logo"
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {list.title || `List: ${list.slug}`}
                </h2>
                <span className="text-xs text-gray-500">
                  Shared via The Urlist
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4 line-clamp-3">
              {list.description || "A collection of useful links."}
            </p>
            <ul className="space-y-2">
              {list.urls?.slice(0, 3).map((url, idx) => {
                // Defensive: ensure key is always unique and non-empty
                const key =
                  url.id && typeof url.id === "string" && url.id.length > 0
                    ? url.id
                    : url.url || `url-${idx}`;
                return (
                  <li
                    key={key}
                    className="flex items-center gap-2 text-sm text-blue-700 truncate"
                  >
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    <span className="truncate">{url.title || url.url}</span>
                  </li>
                );
              })}
              {list.urls && list.urls.length > 3 && (
                <li className="text-xs text-gray-400">...and more</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
