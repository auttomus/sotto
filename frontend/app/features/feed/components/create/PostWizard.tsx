import * as React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { useCreateStore } from "../../../create/store/useCreateStore";
import { useToastStore } from "~/core/store/useToastStore";
import { PostMediaGallery } from "./PostMediaGallery";
import { PostTagsInput } from "./PostTagsInput";
import { useSearchTagsQuery } from "~/core/apollo/generated";
import { useCreatePostLogic } from "../../hooks/useCreatePost";

export function PostWizard() {
  const { 
    selectedType, 
    postContent: content, 
    setPostContent: setContent, 
    postFiles: files, 
    setPostFiles: setFiles,
    postTags: tags,
    addPostTag: addTag,
    removePostTag: removeTag,
    setSelectedType,
    reset
  } = useCreateStore();
  
  const addToast = useToastStore(s => s.addToast);
  const [showDraftDialog, setShowDraftDialog] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { submitPost, isSubmitting, handleCreateNewTag, isCreatingTag } = useCreatePostLogic(reset);

  // Tags search state
  const [tagInput, setTagInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(tagInput), 300);
    return () => clearTimeout(timer);
  }, [tagInput]);

  const { data: tagsData, loading: tagsLoading } = useSearchTagsQuery({
    variables: { query: debouncedSearch },
    skip: debouncedSearch.trim().length === 0,
  });

  const title = selectedType === "portfolio" ? "Unggah Karya" : "Berbagi Pengalaman";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        addToast('error', 'Maksimal 5 file diperbolehkan');
        return;
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    const hasContent = content.trim().length > 0 || files.length > 0 || tags.length > 0;
    if (hasContent) {
      setShowDraftDialog(true);
    } else {
      setSelectedType(null);
    }
  };

  const handleDiscard = () => {
    reset();
    setSelectedType(null);
  };

  const handleSaveDraft = () => {
    setSelectedType(null);
    addToast('success', 'Disimpan sebagai draft');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      {showDraftDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDraftDialog(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Simpan sebagai Draft?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Kamu memiliki perubahan yang belum disimpan. Ingin menyimpannya untuk dilanjutkan nanti?</p>
            <div className="flex flex-col gap-2">
              <Button variant="primary" onClick={handleSaveDraft} className="w-full">Simpan sebagai Draft</Button>
              <Button variant="danger" onClick={handleDiscard} className="w-full">Hapus dan Keluar</Button>
              <Button variant="ghost" onClick={() => setShowDraftDialog(false)} className="w-full mt-2">Batal</Button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{title}</h1>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => submitPost(content, files, tags)}
          disabled={isSubmitting || (!content.trim() && files.length === 0)}
          className="h-8 rounded-lg px-4 shadow-md shadow-indigo-500/20"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bagikan"}
        </Button>
      </header>

      <div className="p-4 overflow-y-auto pb-20">
        <PostMediaGallery 
          files={files} 
          removeFile={removeFile} 
          fileInputRef={fileInputRef} 
        />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />

        {/* Text Area */}
        <div className="mb-4 relative">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 text-lg placeholder-gray-400 focus:outline-none resize-none min-h-[120px]"
            placeholder="Ceritakan proses pembuatan karyamu atau pengalamanmu..."
          />
          <span className={`absolute bottom-2 right-2 text-xs font-medium ${content.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {content.length}/500
          </span>
        </div>

        <PostTagsInput 
          tags={tags} 
          addTag={addTag} 
          removeTag={removeTag}
          inputValue={tagInput}
          onInputChange={setTagInput}
          searchResults={tagsData?.searchTags || []}
          isLoading={tagsLoading}
          isCreating={isCreatingTag}
          onCreateNewTag={(name) => handleCreateNewTag(name, addTag)}
        />
      </div>
    </div>
  );
}
