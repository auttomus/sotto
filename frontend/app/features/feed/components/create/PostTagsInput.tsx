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
    <div className="border-t border-border pt-4 mb-4">
      <label className="form-label mb-2 block">Topik / Tags</label>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span key={tag.id} className="bg-primary/10 text-primary text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1">
              #{tag.name} <X className="h-3 w-3 cursor-pointer hover:text-primary/80" onClick={() => removeTag(tag.id)} />
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
          {(isLoading || isCreating) ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <Search className="h-4 w-4 text-muted-foreground" />}
        </div>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => {
            onInputChange(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          disabled={tags.length >= 5}
          className="form-input w-full pl-10 pr-3 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder={tags.length >= 5 ? "Maksimal 5 tag telah tercapai" : "Cari atau buat tag baru..."}
        />

        {isOpen && inputValue.trim().length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground text-center">Mencari...</div>
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
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
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
                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors border-t border-border"
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
