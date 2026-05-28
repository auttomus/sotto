import * as React from "react";
import { ArrowLeft, Loader2, Briefcase, ChevronRight, X } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { useCreateStore } from "../../../create/store/useCreateStore";
import { useToastStore } from "~/core/store/useToastStore";
import { PostMediaGallery } from "./PostMediaGallery";
import { PostTagsInput } from "./PostTagsInput";
import { useSearchTagsQuery, useGetMyProfileQuery, useGetListingsByAccountQuery } from "~/core/apollo/generated";
import { useCreatePostLogic } from "../../hooks/useCreatePost";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { MentionSuggestions } from "~/components/ui/MentionSuggestions";

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
    linkedServiceId,
    setLinkedServiceId,
    setSelectedType,
    reset
  } = useCreateStore();
  
  const addToast = useToastStore(s => s.addToast);
  const [showDraftDialog, setShowDraftDialog] = React.useState(false);
  const [showListingSelector, setShowListingSelector] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

  // Fetch listings for linked service
  const { data: profileData } = useGetMyProfileQuery();
  const accountId = profileData?.myProfile?.id;

  const { data: listingsData, loading: listingsLoading } = useGetListingsByAccountQuery({
    variables: { accountId: accountId || "" },
    skip: !accountId,
  });

  const activeListings = listingsData?.listingsByAccount?.filter(l => l.status === 'ACTIVE') || [];
  const selectedListing = activeListings.find(l => l.id === linkedServiceId);

  const title = selectedType === "portfolio" ? "Unggah Karya & Pengalaman" : "Berbagi Pengalaman";

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
    const hasContent = content.trim().length > 0 || files.length > 0 || tags.length > 0 || linkedServiceId !== null;
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
    <div className="flex flex-col min-h-screen bg-background w-full max-w-lg mx-auto border-x border-border relative">
      {showDraftDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowDraftDialog(false)}>
          <div className="bg-card border border-border rounded-sm shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-2">Simpan sebagai Draft?</h3>
            <p className="text-sm text-muted-foreground mb-6">Kamu memiliki perubahan yang belum disimpan. Ingin menyimpannya untuk dilanjutkan nanti?</p>
            <div className="flex flex-col gap-2">
              <Button variant="primary" onClick={handleSaveDraft} className="w-full">Simpan sebagai Draft</Button>
              <Button variant="danger" onClick={handleDiscard} className="w-full">Hapus dan Keluar</Button>
              <Button variant="ghost" onClick={() => setShowDraftDialog(false)} className="w-full mt-2">Batal</Button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-card border-b border-border px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-muted transition">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-bold text-foreground text-sm">{title}</h1>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => {
            const matches = content.match(/\B@[a-zA-Z0-9_]{3,30}\b/g) || [];
            if (matches.length > 5) {
              addToast("error", "Maksimal 5 tag orang diperbolehkan per postingan/pesan");
              return;
            }
            submitPost(content, files, tags);
          }}
          disabled={isSubmitting || (!content.trim() && files.length === 0)}
          className="h-8 rounded-lg px-4 shadow-md shadow-primary/20"
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
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent text-foreground text-lg placeholder-muted-foreground focus:outline-none resize-none min-h-[120px]"
            placeholder="Ceritakan proses pembuatan karyamu atau pengalamanmu..."
          />
          <MentionSuggestions 
            value={content} 
            onChange={setContent} 
            inputRef={textareaRef} 
          />
          <span className={`absolute bottom-2 right-2 text-xs font-medium ${content.length > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {content.length}/500
          </span>
        </div>

        <PostTagsInput 
          tags={tags} 
          addTag={(tag) => {
            if (tags.length >= 5) {
              addToast('error', 'Maksimal 5 tag diperbolehkan per postingan');
              return;
            }
            addTag(tag);
          }} 
          removeTag={removeTag}
          inputValue={tagInput}
          onInputChange={setTagInput}
          searchResults={tagsData?.searchTags || []}
          isLoading={tagsLoading}
          isCreating={isCreatingTag}
          onCreateNewTag={(name) => {
            if (tags.length >= 5) {
              addToast('error', 'Maksimal 5 tag diperbolehkan per postingan');
              return;
            }
            handleCreateNewTag(name, addTag);
          }}
        />

        {/* Linked Listing Section */}
        {selectedListing ? (
          <div className="w-full mt-5">
            <ListingCard 
              listing={selectedListing as any} 
              isLink={false} 
              onRemove={() => setLinkedServiceId(null)}
              className="border-primary/20"
            />
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => setShowListingSelector(true)}
            className="w-full mt-5 flex items-center justify-between p-4 rounded-sm border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-sm bg-muted border border-border flex items-center justify-center text-muted-foreground">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Hubungkan Penawaran</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Tautkan jasa/produk milikmu ke postingan ini</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Listing Selector Modal/Bottom Sheet */}
      {showListingSelector && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowListingSelector(false)}>
          <div className="bg-card border-t border-border rounded-t-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="h-1.5 w-12 bg-border rounded-full mx-auto my-3 shrink-0" />
            <header className="px-4 pb-3 border-b border-border flex justify-between items-center shrink-0">
              <h3 className="text-base font-bold text-foreground">Pilih Penawaran Anda</h3>
              <button onClick={() => setShowListingSelector(false)} className="p-1 rounded-full hover:bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </header>
            
            <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-0">
              {listingsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : activeListings.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Briefcase className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                  <p className="text-sm font-bold text-foreground">Belum ada penawaran aktif</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Buat penawaran terlebih dahulu di menu Utama &gt; Buat Baru &gt; Penawaran & Produk.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeListings.map(listing => (
                    <button
                      key={listing.id}
                      onClick={() => {
                        setLinkedServiceId(listing.id);
                        setShowListingSelector(false);
                      }}
                      className="w-full text-left focus:outline-none"
                    >
                      <ListingCard 
                        listing={listing as any} 
                        isLink={false} 
                        className={linkedServiceId === listing.id ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : ''}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
