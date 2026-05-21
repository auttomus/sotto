import * as React from "react";
import { X } from "lucide-react";

interface PostTagsInputProps {
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export function PostTagsInput({ tags, addTag, removeTag }: PostTagsInputProps) {
  const [tagInput, setTagInput] = React.useState("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag)) {
        addTag(newTag);
      }
      setTagInput("");
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Topik / Tags</label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1">
              #{tag} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </span>
          ))}
        </div>
      )}
      <input 
        type="text" 
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyDown}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition"
        placeholder="Ketik topik dan tekan Enter..."
      />
    </div>
  );
}
