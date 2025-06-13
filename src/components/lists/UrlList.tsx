import { useState, useEffect, useMemo } from "react";
import { useStore } from "@nanostores/react";
import {
  currentList,
  addUrlToList,
  removeUrlFromList,
  updateUrlInList,
  toggleUrlFavorite,
} from "@/stores/urlListStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tooltip } from "@/components/ui/Tooltip";
import { fetchUrlMetadata, type UrlMetadata } from "@/utils/urlMetadata";
import { UrlCard } from "./UrlCard";
import { PlusIcon, LinkIcon, PencilIcon } from "@heroicons/react/24/outline";

interface EditingUrl {
  id: string;
  title: string;
  url: string;
}

export function UrlList() {
  const list = useStore(currentList);
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState<string>();
  const [editingUrl, setEditingUrl] = useState<EditingUrl | null>(null);
  const [urlMetadata, setUrlMetadata] = useState<Record<string, UrlMetadata>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<
    "latest" | "oldest" | "az" | "za" | "favourite"
  >("latest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch metadata for all URLs in the list
    async function fetchMetadata() {
      if (!list?.urls) return;

      for (const url of list.urls) {
        if (!urlMetadata[url.id]) {
          const metadata = await fetchUrlMetadata(url.url);
          setUrlMetadata((prev) => ({
            ...prev,
            [url.id]: metadata,
          }));
        }
      }
    }

    fetchMetadata();
  }, [list?.urls]);

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);

    try {
      const url = new URL(newUrl);
      const metadata = await fetchUrlMetadata(url.toString());
      await addUrlToList(url.toString(), metadata.title);
      setNewUrl("");
    } catch {
      setError("Please enter a valid URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUrl = async (id: string, title: string, url: string) => {
    try {
      await updateUrlInList(id, { title, url });
      setEditingUrl(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    await toggleUrlFavorite(id);
  };

  const handleShare = async (url: { url: string; title?: string }) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: url.title || "Shared URL from Urlist",
          text: url.title,
          url: url.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(url.url);
        setShareTooltip("URL copied to clipboard!");
        setTimeout(() => setShareTooltip(null), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
        setShareTooltip("Failed to copy URL");
        setTimeout(() => setShareTooltip(null), 2000);
      }
    }
  };

  // Filtering and sorting logic
  const filteredAndSortedUrls = useMemo(() => {
    if (!list?.urls) return [];
    let urls = [...list.urls];
    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      urls = urls.filter(
        (u) =>
          (u.title && u.title.toLowerCase().includes(q)) ||
          (u.url && u.url.toLowerCase().includes(q)) ||
          (urlMetadata[u.id]?.description &&
            urlMetadata[u.id]?.description?.toLowerCase().includes(q))
      );
    }
    // Favourites filter
    if (sortOption === "favourite") {
      urls = urls.filter((u) => u.isFavorite);
    }
    // Sorting
    if (sortOption === "latest") {
      urls.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOption === "oldest") {
      urls.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortOption === "az") {
      urls.sort((a, b) => (a.title || a.url).localeCompare(b.title || b.url));
    } else if (sortOption === "za") {
      urls.sort((a, b) => (b.title || b.url).localeCompare(a.title || a.url));
    }
    return urls;
  }, [list?.urls, sortOption, search, urlMetadata]);

  if (!list.id || !list.urls) return null;

  return (
    <div className="space-y-8">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search URLs, titles, or descriptions..."
          className="flex-1 text-lg shadow-sm font-delicious"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            className={
              sortOption === "latest"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }
            onClick={() => setSortOption("latest")}
          >
            Recently Added
          </Button>
          <Button
            type="button"
            className={
              sortOption === "oldest"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }
            onClick={() => setSortOption("oldest")}
          >
            Oldest
          </Button>
          <Button
            type="button"
            className={
              sortOption === "az"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }
            onClick={() => setSortOption("az")}
          >
            A-Z
          </Button>
          <Button
            type="button"
            className={
              sortOption === "za"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }
            onClick={() => setSortOption("za")}
          >
            Z-A
          </Button>
          <Button
            type="button"
            className={
              sortOption === "favourite"
                ? "bg-yellow-400 text-white"
                : "bg-gray-100 text-gray-700"
            }
            onClick={() => setSortOption("favourite")}
          >
            Favourites
          </Button>
        </div>
      </div>

      <form onSubmit={handleAddUrl} className="flex gap-3">
        <Input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter a URL to add to your list..."
          error={error}
          className="flex-1 text-lg shadow-sm font-delicious"
        />
        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer font-delicious"
        >
          <PlusIcon className="h-5 w-5" />
          Add URL
        </Button>
      </form>

      <div className="space-y-8">
        {filteredAndSortedUrls.map((url) => (
          <UrlCard
            key={url.id}
            url={url}
            metadata={urlMetadata[url.id]}
            onEdit={(urlObj) =>
              setEditingUrl({
                id: urlObj.id,
                title: urlObj.title || "",
                url: urlObj.url,
              })
            }
            onDelete={removeUrlFromList}
            onToggleFavorite={handleToggleFavorite}
            onShare={handleShare}
            shareTooltip={shareTooltip}
            setShareTooltip={setShareTooltip}
          />
        ))}
      </div>

      {list.urls.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center bg-white">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-full flex items-center justify-center shadow-inner">
            <LinkIcon className="h-16 w-16 text-blue-600" />
          </div>
          <h3 className="mt-6 text-2xl font-semibold text-gray-900">
            No URLs Yet
          </h3>
          <p className="mt-3 text-lg text-gray-600 max-w-md mx-auto">
            Start building your collection by adding your first URL using the
            form above
          </p>
        </div>
      )}

      {editingUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PencilIcon className="h-6 w-6 text-blue-600" />
              Edit URL
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUrl(editingUrl.id, editingUrl.title, editingUrl.url);
              }}
              className="mt-8 space-y-6"
            >
              <div>
                <label className="block text-base font-medium text-gray-900">
                  Title
                </label>
                <Input
                  type="text"
                  value={editingUrl.title}
                  onChange={(e) =>
                    setEditingUrl({ ...editingUrl, title: e.target.value })
                  }
                  placeholder="URL Title"
                  className="mt-2 text-lg shadow-sm"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-900">
                  URL
                </label>
                <Input
                  type="url"
                  value={editingUrl.url}
                  onChange={(e) =>
                    setEditingUrl({ ...editingUrl, url: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="mt-2 text-lg shadow-sm"
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUrl(null)}
                  className="text-gray-900 border-gray-300 hover:bg-gray-50 text-lg px-6 py-2.5 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
