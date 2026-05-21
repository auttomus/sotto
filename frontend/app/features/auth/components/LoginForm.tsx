import React, { useState } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '~/core/constants/ROUTES';

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
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-serif italic mb-2">
          Sotto
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Masuk untuk melanjutkan karya Anda</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
            placeholder="nama@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Masuk'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum punya akun?{' '}
        <Link to={ROUTES.REGISTER} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
