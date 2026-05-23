import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '~/core/store/useAuthStore';
import { ROUTES } from '~/core/constants/ROUTES';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const isDockerOrProd = typeof window !== 'undefined' && (window.location.port === '8080' || !window.location.port);
      const baseUrl = isDockerOrProd
        ? `${window.location.origin}/iam`
        : import.meta.env.VITE_IAM_BASE_URL || 'http://localhost:3000/iam';
      const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Email atau kata sandi salah');
      }

      const data = await res.json();
      
      // Expected backend format: { accessToken: "...", user: { id, accountId, username, displayName, avatarObjectKey } }
      if (!data.accessToken || !data.user) {
        throw new Error('Format respons tidak valid');
      }

      login(data.accessToken, data.user);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}
