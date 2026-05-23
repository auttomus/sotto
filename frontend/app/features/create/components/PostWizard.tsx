import * as React from "react";
import { ArrowLeft, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/Button";
import { useCreateStore } from "../store/useCreateStore";
import { useUpload } from "~/core/hooks/useUpload";
import { useToastStore } from "~/core/store/useToastStore";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { PostMediaGallery } from "./wizard-steps/PostMediaGallery";
import { PostTagsInput } from "./wizard-steps/PostTagsInput";

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      postId
      content
    }
  }
`;

export function PostWizard() {
  const navigate = useNavigate();
  const { 
    selectedType, 
    content, 
    setContent, 
    files, 
    setFiles,
    tags,
    addTag,
    removeTag,
    setSelectedType,
    reset
  } = useCreateStore();
  const { uploadFile } = useUpload();
  const addToast = useToastStore(s => s.addToast);
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) {
      addToast('error', 'Konten tidak boleh kosong');
      return;
    }

    try {
      setIsUploading(true);
      const mediaIds: string[] = [];
      
      // Upload files sequentially for now to avoid overloading
      for (const file of files) {
        const result = await uploadFile(file, 'POST');
        mediaIds.push(result.id);
      }

      await createPost({
        variables: {
          input: {
            content,
            mediaIds: mediaIds.length > 0 ? mediaIds : undefined
          }
        }
      });

      addToast('success', 'Postingan berhasil dibagikan');
      reset();
      navigate('/home');
    } catch (error: any) {
      addToast('error', error.message || 'Gagal membuat postingan');
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = loading || isUploading;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedType(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{title}</h1>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleSubmit}
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
        />
      </div>
    </div>
  );
}
