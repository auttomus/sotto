import * as React from "react";
import { Loader2, Camera, X, Check } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { Button } from "~/components/ui/Button";
import { useToastStore } from "~/core/store/useToastStore";
import { useUpload } from "~/core/hooks/useUpload";
import { useUpdateProfileMutation, type GetMyProfileQuery } from "~/core/apollo/generated";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface EditProfileFormProps {
  profile: GetMyProfileQuery['myProfile'];
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditProfileForm({ profile, onCancel, onSuccess }: EditProfileFormProps) {
  const [editForm, setEditForm] = React.useState({
    displayName: profile.displayName || "",
    note: profile.note || "",
    major: profile.major || "",
    avatarObjectKey: profile.avatarObjectKey || "",
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const addToast = useToastStore(s => s.addToast);
  const { uploadFile } = useUpload();
  const [updateProfileMutation, { loading: updateLoading }] = useUpdateProfileMutation({
    onCompleted: () => {
      addToast('success', 'Profil berhasil diperbarui');
      onSuccess();
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      addToast('error', 'Hanya file gambar yang diperbolehkan');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'Ukuran gambar maksimal 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const media = await uploadFile(file, 'ACCOUNT', profile.id, false);
      setEditForm(prev => ({ ...prev, avatarObjectKey: media.objectKey }));
      addToast('success', 'Foto profil berhasil diunggah');
    } catch (error: any) {
      addToast('error', `Gagal mengunggah foto: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation({
      variables: {
        input: {
          displayName: editForm.displayName,
          note: editForm.note,
          major: editForm.major,
          avatarObjectKey: editForm.avatarObjectKey,
        }
      }
    });
  };

  return (
    <div className="w-full">
      {/* Action Buttons Top Right (Absolute or relative to parent in ProfileLayout) */}
      <div className="flex justify-end gap-2 mb-4 absolute right-4 -top-12">
        <button onClick={onCancel} className="p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <X className="h-5 w-5 text-gray-900 dark:text-gray-100" />
        </button>
        <Button variant="primary" onClick={handleSaveProfile} disabled={updateLoading || isUploading} className="font-bold px-4 rounded-full shadow-md shadow-indigo-500/20">
          {updateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
      </div>

      {/* Avatar Edit */}
      <div className="relative -mt-16 mb-4">
        <div className="relative inline-block">
          <div className="rounded-full border-4 border-white dark:border-gray-950 bg-white dark:bg-gray-900">
            <Avatar 
              src={resolveMediaUrl(editForm.avatarObjectKey) || resolveMediaUrl(profile.avatarObjectKey)} 
              alt={profile.displayName} 
              size="xl" 
              className={`w-24 h-24 md:w-32 md:h-32 transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-1 right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-colors"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div className="mt-2 space-y-4 bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Nama Tampilan</label>
          <input 
            type="text" 
            value={editForm.displayName} 
            onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
            className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            placeholder="Nama lengkap atau panggilan"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Jurusan / Keahlian</label>
          <input 
            type="text" 
            value={editForm.major} 
            onChange={(e) => setEditForm(prev => ({ ...prev, major: e.target.value }))}
            className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            placeholder="Contoh: Teknik Informatika"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Bio / Catatan</label>
          <textarea 
            value={editForm.note} 
            onChange={(e) => setEditForm(prev => ({ ...prev, note: e.target.value }))}
            className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow min-h-[100px] resize-y"
            placeholder="Ceritakan sedikit tentang diri Anda..."
          />
        </div>
      </div>
    </div>
  );
}
