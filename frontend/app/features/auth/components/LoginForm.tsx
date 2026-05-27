import React, { useState } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '~/core/constants/ROUTES';
import { Button } from '~/components/ui/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading, error } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    handleLogin(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card text-foreground rounded-2xl shadow-sm border border-border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-serif italic mb-2">
          Sotto
        </h1>
        <p className="text-muted-foreground">Masuk untuk melanjutkan karya Anda</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="form-input"
            placeholder="nama@email.com"
            required
          />
        </div>

        <div>
          <label className="form-label" htmlFor="password">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="form-input pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full py-2.5"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Masuk'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary font-medium hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
