import { useState } from "react";
import { useNavigate } from "react-router";
import { useUpload } from "~/core/hooks/useUpload";
import { useToastStore } from "~/core/store/useToastStore";
import { useCreatePostMutation, useSearchTagsQuery, useCreateTagMutation } from "~/core/apollo/generated";
import { useCreateStore, type TagObject } from "../../create/store/useCreateStore";

export function useCreatePostLogic(resetStore: () => void) {
  const navigate = useNavigate();
  const { uploadFile } = useUpload();
  const addToast = useToastStore(s => s.addToast);
  const linkedServiceId = useCreateStore(s => s.linkedServiceId);
  
  const [createPost, { loading: isCreatingPost }] = useCreatePostMutation();
  const [createTag, { loading: isCreatingTag }] = useCreateTagMutation();
  
  const [isUploading, setIsUploading] = useState(false);
  
  const submitPost = async (content: string, files: File[], tags: TagObject[]) => {
    if (!content.trim() && files.length === 0) {
      addToast('error', 'Konten tidak boleh kosong');
      return;
    }

    try {
      setIsUploading(true);
      const mediaIds: string[] = [];
      
      for (const file of files) {
        // According to backend Bruno spec, attachedType is 'ScyllaPost'
        const result = await uploadFile(file, 'ScyllaPost');
        mediaIds.push(result.id);
      }

      await createPost({
        variables: {
          input: {
            content,
            mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
            tagIds: tags.length > 0 ? tags.map(t => t.id) : undefined,
            linkedServiceId: linkedServiceId || undefined,
          }
        },
        refetchQueries: ['GetFeed']
      });

      addToast('success', 'Postingan berhasil dibagikan');
      resetStore();
      navigate('/home');
    } catch (error: any) {
      addToast('error', error.message || 'Gagal membuat postingan');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateNewTag = async (name: string, onTagAdded: (tag: TagObject) => void) => {
    if (!name || isCreatingTag) return;
    try {
      const result = await createTag({ variables: { name } });
      if (result.data?.createTag) {
        onTagAdded({
          id: result.data.createTag.id,
          name: result.data.createTag.name
        });
      }
    } catch (e) {
      console.error("Failed to create tag", e);
    }
  };

  return {
    submitPost,
    isSubmitting: isCreatingPost || isUploading,
    handleCreateNewTag,
    isCreatingTag
  };
}
