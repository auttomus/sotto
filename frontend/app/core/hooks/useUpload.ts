import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import type { 
  MutationRequestUploadUrlArgs, 
  PresignedUploadResult,
  MutationConfirmUploadArgs,
  MediaAttachmentModel
} from "~/core/apollo/base-types";

const REQUEST_UPLOAD_URL = gql`
  mutation RequestUploadUrl($input: RequestUploadInput!) {
    requestUploadUrl(input: $input) {
      uploadUrl
      objectKey
    }
  }
`;

const CONFIRM_UPLOAD = gql`
  mutation ConfirmUpload($input: RequestUploadInput!, $objectKey: String!) {
    confirmUpload(input: $input, objectKey: $objectKey) {
      id
      objectKey
      url
      fileName
      contentType
    }
  }
`;

export function useUpload() {
  const [requestUploadUrl] = useMutation<{ requestUploadUrl: PresignedUploadResult }, MutationRequestUploadUrlArgs>(REQUEST_UPLOAD_URL);
  const [confirmUpload] = useMutation<{ confirmUpload: MediaAttachmentModel }, MutationConfirmUploadArgs>(CONFIRM_UPLOAD);

  const uploadFile = useCallback(async (
    file: File, 
    attachedType: string, 
    attachedId?: string, 
    isPrivate = false
  ): Promise<MediaAttachmentModel> => {
    // 1. Request presigned URL
    const requestRes = await requestUploadUrl({
      variables: {
        input: {
          attachedType,
          attachedId,
          fileName: file.name,
          contentType: file.type,
          isPrivate,
        }
      }
    });

    const uploadData = requestRes.data?.requestUploadUrl;
    if (!uploadData) throw new Error("Failed to get upload URL");

    // 2. Upload directly to MinIO
    const uploadRes = await fetch(uploadData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload file to storage");
    }

    // 3. Confirm upload
    const confirmRes = await confirmUpload({
      variables: {
        input: {
          attachedType,
          attachedId,
          fileName: file.name,
          contentType: file.type,
          isPrivate,
        },
        objectKey: uploadData.objectKey,
      }
    });

    const media = confirmRes.data?.confirmUpload;
    if (!media) throw new Error("Failed to confirm upload");

    return media;
  }, [requestUploadUrl, confirmUpload]);

  return { uploadFile };
}
