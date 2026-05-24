import React, { useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import type { TagObject } from "../../../create/store/useCreateStore";

interface PostTagsInputProps {
  tags: TagObject[];
  addTag: (tag: TagObject) => void;
  removeTag: (tagId: string) => void;
  
  inputValue: string;
  onInputChange: (val: string) => void;
  
  searchResults: TagObject[];
  isLoading: boolean;
  isCreating: boolean;
  
  onCreateNewTag: (name: string) => void;
}

export function PostTagsInput({ 
  tags, 
  addTag, 
  removeTag,
  inputValue,
  onInputChange,
  searchResults,
  isLoading,
  isCreating,
  onCreateNewTag
}: PostTagsInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagSelect = (tag: TagObject) => {
    addTag(tag);
    onInputChange("");
    setIsOpen(false);
  };

  const handleCreateClick = () => {
    const newTagName = inputValue.trim().replace(/^#/, '');
    if (newTagName) {
      onCreateNewTag(newTagName);
      onInputChange("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const exactMatch = searchResults.find(t => t.name.toLowerCase() === inputValue.trim().toLowerCase());
      if (exactMatch) {
        handleTagSelect({ id: exactMatch.id, name: exactMatch.name });
      } else if (inputValue.trim().length > 0) {
        handleCreateClick();
      }
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Topik / Tags</label>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span key={tag.id} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1">
              #{tag.name} <X className="h-3 w-3 cursor-pointer hover:text-indigo-800 dark:hover:text-indigo-200" onClick={() => removeTag(tag.id)} />
            </span>
          ))}
        </div>
      )}

      <div className="relative"
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        tabIndex={-1}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {(isLoading || isCreating) ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <Search className="h-4 w-4 text-gray-400" />}
        </div>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => {
            onInputChange(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white transition"
          placeholder="Cari atau buat tag baru..."
        />

        {isOpen && inputValue.trim().length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500 text-center">Mencari...</div>
            ) : (
              <>
                {searchResults.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleTagSelect({ id: t.id, name: t.name });
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    #{t.name}
                  </button>
                ))}
                
                {!searchResults.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase()) && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCreateClick();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border-t border-gray-100 dark:border-gray-700"
                  >
                    + Buat tag "{inputValue.trim()}"
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
