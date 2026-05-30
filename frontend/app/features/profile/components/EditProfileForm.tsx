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
    avatarObjectKey: profile.avatarObjectKey || "",
    bannerObjectKey: profile.bannerObjectKey || "",
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [isBannerUploading, setIsBannerUploading] = React.useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  
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

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Hanya file gambar yang diperbolehkan');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'Ukuran gambar maksimal 5MB');
      return;
    }

    try {
      setIsBannerUploading(true);
      const media = await uploadFile(file, 'ACCOUNT', profile.id, false);
      setEditForm(prev => ({ ...prev, bannerObjectKey: media.objectKey }));
      addToast('success', 'Banner profil berhasil diunggah');
    } catch (error: any) {
      addToast('error', `Gagal mengunggah banner: ${error.message}`);
    } finally {
      setIsBannerUploading(false);
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation({
      variables: {
        input: {
          displayName: editForm.displayName,
          note: editForm.note,
          avatarObjectKey: editForm.avatarObjectKey,
          bannerObjectKey: editForm.bannerObjectKey,
        }
      }
    });
  };

  return (
    <div className="w-full">
      {/* Banner Edit Overlay */}
      <div 
        className="absolute -top-32 md:-top-48 -left-4 -right-4 h-32 md:h-48 bg-black/45 hover:bg-black/55 transition-colors flex items-center justify-center cursor-pointer group overflow-hidden"
        onClick={() => bannerInputRef.current?.click()}
        style={{ zIndex: 10 }}
      >
        {editForm.bannerObjectKey && (
          <img 
            src={resolveMediaUrl(editForm.bannerObjectKey)} 
            alt="Preview Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-[1.02] transition-transform duration-500"
          />
        )}
        
        {isBannerUploading ? (
          <div className="flex flex-col items-center gap-2 text-white relative z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs font-semibold">Mengunggah Banner...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-white opacity-95 group-hover:opacity-100 transition-opacity relative z-10">
            <div className="p-2.5 bg-black/40 rounded-full group-hover:scale-105 transition-transform backdrop-blur-sm border border-white/20">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-bold tracking-wide drop-shadow-md">Ubah Banner Profil</span>
          </div>
        )}
        <input 
          type="file" 
          ref={bannerInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleBannerChange}
        />
      </div>

      {/* Action Buttons Top Right */}
      <div className="flex justify-end gap-2 mb-4 absolute right-4 -top-12" style={{ zIndex: 30 }}>
        <button onClick={onCancel} className="p-2 border border-border bg-card rounded-full hover:bg-muted transition">
          <X className="h-5 w-5 text-foreground" />
        </button>
        <Button variant="primary" onClick={handleSaveProfile} disabled={updateLoading || isUploading || isBannerUploading} className="font-bold px-4 rounded-full shadow-md shadow-primary/20">
          {updateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
      </div>

      {/* Avatar Edit */}
      <div className="relative -mt-16 mb-4" style={{ zIndex: 20 }}>
        <div className="relative inline-block">
          <div className="rounded-full border-4 border-background bg-card">
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
            className="absolute bottom-1 right-1 p-2 bg-primary hover:opacity-90 text-primary-foreground rounded-full shadow-md transition-colors"
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

      <div className="mt-2 space-y-4 bg-muted/30 p-5 rounded-sm border border-border">
        <div>
          <label className="form-label mb-1.5 block">Nama Tampilan</label>
          <input 
            type="text" 
            value={editForm.displayName} 
            onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
            className="form-input w-full p-3 text-sm"
            placeholder="Nama lengkap atau panggilan"
          />
        </div>
        <div>
          <label className="form-label mb-1.5 block">Jurusan / Keahlian</label>
          <div className="w-full bg-muted border border-border rounded-sm p-3 text-sm text-muted-foreground cursor-not-allowed">
            {profile.major || "Belum ditentukan"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Jurusan dikelola oleh administrator sekolah.</p>
        </div>
        <div>
          <label className="form-label mb-1.5 block">Bio / Catatan</label>
          <textarea 
            value={editForm.note} 
            onChange={(e) => setEditForm(prev => ({ ...prev, note: e.target.value }))}
            className="form-input w-full p-3 text-sm min-h-[100px] resize-y"
            placeholder="Ceritakan sedikit tentang diri Anda..."
          />
        </div>
      </div>
    </div>
  );
}
