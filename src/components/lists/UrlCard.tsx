import React from "react";
import {
  GlobeAltIcon,
  StarIcon,
  BookmarkIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import logo from "@/assets/logo.png";

interface UrlCardProps {
  url: any;
  metadata: any;
  onEdit: (url: any) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onShare: (url: { url: string; title?: string }) => void;
  shareTooltip: string | null;
  setShareTooltip: (msg: string | null) => void;
}

export const UrlCard: React.FC<UrlCardProps> = ({
  url,
  metadata,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShare,
  shareTooltip,
  setShareTooltip,
}) => {
  // Use logo.png only for your own site URLs
  const isOwnUrl = (() => {
    try {
      const u = new URL(url.url);
      return [
        "localhost",
        "127.0.0.1",
        "daily-urlist.vercel.app", // your prod domain
      ].includes(u.hostname);
    } catch {
      return false;
    }
  })();
  const metaImage = isOwnUrl ? logo.src : metadata?.image || undefined;
  const favicon = metadata?.favicon;
  const title = metadata?.title || url.title || url.url;
  const description = metadata?.description;
  const domain = url.url ? new URL(url.url).hostname : "";

  // Fallback for sites that block metadata (e.g., Facebook)
  const isNoPreview = !metaImage && !description;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-100">
      <div className="flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8">
        {/* Image Section */}
        <div className="md:w-1/5 w-full flex-shrink-0 flex items-center justify-center">
          <div className="relative h-40 w-40 md:h-52 md:w-full overflow-hidden rounded-xl shadow-sm bg-gray-50 flex items-center justify-center">
            {isNoPreview ? (
              <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
                <GlobeAltIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">No preview available</span>
              </div>
            ) : (
              <img
                src={metaImage || logo.src}
                alt={title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = logo.src;
                }}
              />
            )}
            <button
              onClick={() => onToggleFavorite(url.id)}
              className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 hover:bg-black/70 transition-colors cursor-pointer"
            >
              <StarIcon
                className={`h-5 w-5 ${
                  url.isFavorite ? "text-yellow-400" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
        {/* Content Section */}
        <div className="md:w-3/5 w-full flex-1 min-w-0 flex flex-col gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-2xl text-gray-900 group-hover:text-blue-600 transition-colors truncate font-joti"
              title={title}
            >
              {title}
            </h3>
            {isNoPreview ? (
              <p className="mt-3 text-lg text-gray-400 italic font-delicious">
                No preview available for this site.
              </p>
            ) : (
              description && (
                <p className="mt-3 text-lg text-gray-700 line-clamp-3 leading-relaxed font-delicious">
                  {description}
                </p>
              )
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-base font-delicious">
            <div className="flex items-center gap-2 text-gray-700 min-w-0 max-w-xs">
              {favicon ? (
                <img src={favicon} alt="Site favicon" className="h-5 w-5" />
              ) : (
                <GlobeAltIcon className="h-5 w-5 text-gray-500" />
              )}
              <span
                className="truncate max-w-[10rem] font-medium hover:text-blue-600 transition-colors"
                title={domain}
              >
                {domain}
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
                onClick={() => onShare(url)}
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
          {url.notes && (
            <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 text-sm rounded">
              <span className="font-semibold">Note:</span> {url.notes}
            </div>
          )}
        </div>
        {/* Actions Section */}
        <div className="md:w-1/5 w-full flex-shrink-0 flex flex-col gap-4 items-center justify-center">
          <a
            href={url.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer whitespace-nowrap font-delicious"
          >
            <GlobeAltIcon className="h-6 w-6 mr-2" />
            Visit Site
          </a>
          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(url)}
              className="w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors p-2.5 rounded-xl cursor-pointer font-delicious flex items-center justify-center gap-2"
            >
              <PencilIcon className="h-5 w-5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(url.id)}
              className="w-full text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors p-2.5 rounded-xl cursor-pointer font-delicious flex items-center justify-center gap-2"
            >
              <TrashIcon className="h-5 w-5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
