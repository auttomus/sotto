import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '~/core/store/useAuthStore';
import { ROUTES } from '~/core/constants/ROUTES';

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  displayName: string;
  schoolId: string;
  major: string;
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const isDockerOrProd = typeof window !== 'undefined' && (window.location.port === '8080' || !window.location.port);
      const baseUrl = isDockerOrProd
        ? `${window.location.origin}/iam`
        : import.meta.env.VITE_IAM_BASE_URL || 'http://localhost:3000/iam';
      const res = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || 'Gagal mendaftar');
      }

      const data = await res.json();
      
      if (!data.accessToken || !data.user) {
        throw new Error('Format respons tidak valid');
      }

      login(data.accessToken, data.user);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat pendaftaran');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading, error };
}
