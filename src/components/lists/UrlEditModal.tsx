import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PencilIcon } from "@heroicons/react/24/outline";
import React from "react";

interface UrlEditModalProps {
  editingUrl: any;
  setEditingUrl: (v: any) => void;
  editingTags: string;
  setEditingTags: (v: string) => void;
  editingNotes: string;
  setEditingNotes: (v: string) => void;
  editingReminder: string;
  setEditingReminder: (v: string) => void;
  handleEditUrl: (id: string, title: string, url: string) => void;
}

export function UrlEditModal({
  editingUrl,
  setEditingUrl,
  editingTags,
  setEditingTags,
  editingNotes,
  setEditingNotes,
  editingReminder,
  setEditingReminder,
  handleEditUrl,
}: UrlEditModalProps) {
  if (!editingUrl) return null;
  return (
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
          <div>
            <label className="block text-base font-medium text-gray-900">
              Tags (comma separated)
            </label>
            <Input
              type="text"
              value={editingTags}
              onChange={(e) => setEditingTags(e.target.value)}
              placeholder="e.g. work, reading, ai"
              className="mt-2 text-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-900">
              Notes (optional)
            </label>
            <Input
              type="text"
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              placeholder="Add a note..."
              className="mt-2 text-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-900">
              Reminder (optional)
            </label>
            <Input
              type="date"
              value={editingReminder}
              onChange={(e) => setEditingReminder(e.target.value)}
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
  );
}
