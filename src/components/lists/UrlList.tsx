import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { TrashIcon, PencilIcon, LinkIcon, GlobeAltIcon, PlusIcon, ClockIcon, StarIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { currentList, addUrlToList, removeUrlFromList, updateUrlInList, toggleUrlFavorite } from '@/stores/urlListStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { fetchUrlMetadata, type UrlMetadata } from '@/utils/urlMetadata';

interface EditingUrl {
  id: string;
  title: string;
  url: string;
}

export function UrlList() {
  const list = useStore(currentList);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState<string>();
  const [editingUrl, setEditingUrl] = useState<EditingUrl | null>(null);
  const [urlMetadata, setUrlMetadata] = useState<Record<string, UrlMetadata>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);

  useEffect(() => {
    // Fetch metadata for all URLs in the list
    async function fetchMetadata() {
      if (!list?.urls) return;
      
      for (const url of list.urls) {
        if (!urlMetadata[url.id]) {
          const metadata = await fetchUrlMetadata(url.url);
          setUrlMetadata(prev => ({
            ...prev,
            [url.id]: metadata
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
      setNewUrl('');
    } catch {
      setError('Please enter a valid URL');
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
          title: url.title || 'Shared URL from Urlist',
          text: url.title,
          url: url.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(url.url);
        setShareTooltip('URL copied to clipboard!');
        setTimeout(() => setShareTooltip(null), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        setShareTooltip('Failed to copy URL');
        setTimeout(() => setShareTooltip(null), 2000);
      }
    }
  };

  if (!list.id || !list.urls) return null;

  return (
    <div className="space-y-8">
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
        {list.urls.map((url) => (
          <div
            key={url.id}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-100"
          >
            <div className="flex p-8 gap-8">
              {/* Left 20% - Image Section */}
              <div className="w-1/5 flex-shrink-0">
                {urlMetadata[url.id]?.image ? (
                  <div className="relative h-52 w-full overflow-hidden rounded-xl shadow-sm">
                    <img
                      src={urlMetadata[url.id].image}
                      alt={urlMetadata[url.id].title || url.url}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <button 
                      onClick={() => handleToggleFavorite(url.id)}
                      className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 hover:bg-black/70 transition-colors cursor-pointer"
                    >
                      <StarIcon className={`h-5 w-5 ${url.isFavorite ? 'text-yellow-400' : 'text-white'}`} />
                    </button>
                  </div>
                ) : (
                  <div className="relative h-52 w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <GlobeAltIcon className="h-20 w-20 text-gray-400" />
                    <button
                      onClick={() => handleToggleFavorite(url.id)}
                      className="absolute top-2 right-2 bg-black/10 backdrop-blur-sm rounded-lg p-2 hover:bg-black/20 transition-colors cursor-pointer"
                    >
                      <BookmarkIcon className={`h-5 w-5 ${url.isFavorite ? 'text-blue-600' : 'text-gray-500'}`} />
                    </button>
                  </div>
                )}
              </div>

              {/* Middle 60% - Content Section */}
              <div className="w-3/5 flex-1 min-w-0">
                <div className="flex flex-col gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-2xl text-gray-900 group-hover:text-blue-600 transition-colors truncate font-joti">
                      {urlMetadata[url.id]?.title || url.title || url.url}
                    </h3>
                    {urlMetadata[url.id]?.description && (
                      <p className="mt-3 text-lg text-gray-700 line-clamp-3 leading-relaxed font-delicious">
                        {urlMetadata[url.id].description}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-6 text-base font-delicious">
                    <div className="flex items-center gap-2 text-gray-700">
                      {urlMetadata[url.id]?.favicon ? (
                        <img
                          src={urlMetadata[url.id].favicon}
                          alt="Site favicon"
                          className="h-5 w-5"
                        />
                      ) : (
                        <GlobeAltIcon className="h-5 w-5 text-gray-500" />
                      )}
                      <span className="truncate max-w-2xl font-medium hover:text-blue-600 transition-colors">
                        {url.url}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      Added {new Date(url.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="relative">
                      <button 
                        onClick={() => handleShare(url)}
                        className="text-gray-600 flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <ShareIcon className="h-4 w-4" />
                        Share
                      </button>
                      {shareTooltip && (
                        <Tooltip
                          message={shareTooltip}
                          isVisible={true}
                          onHide={() => setShareTooltip(null)}
                          position="top"
                        />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right 20% - Actions Section */}
              <div className="w-1/5 flex-shrink-0 flex flex-col gap-4">
                <a
                  href={url.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer whitespace-nowrap font-delicious"
                >
                  <GlobeAltIcon className="h-6 w-6 mr-2" />
                  Visit Site
                </a>
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingUrl({
                      id: url.id,
                      title: url.title || '',
                      url: url.url
                    })}
                    className="w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors p-2.5 rounded-xl cursor-pointer font-delicious flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUrlFromList(url.id)}
                    className="w-full text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors p-2.5 rounded-xl cursor-pointer font-delicious flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {list.urls.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center bg-white">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-full flex items-center justify-center shadow-inner">
            <LinkIcon className="h-16 w-16 text-blue-600" />
          </div>
          <h3 className="mt-6 text-2xl font-semibold text-gray-900">No URLs Yet</h3>
          <p className="mt-3 text-lg text-gray-600 max-w-md mx-auto">
            Start building your collection by adding your first URL using the form above
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