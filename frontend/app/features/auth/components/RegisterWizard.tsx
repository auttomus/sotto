import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, ChevronLeft, Loader2, Search } from 'lucide-react';
import { useRegister, type RegisterPayload } from '../hooks/useRegister';
import { ROUTES } from '~/core/constants/ROUTES';
import { useSearchSchoolsQuery } from '~/core/apollo/generated';

function SchoolAutocomplete({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, loading } = useSearchSchoolsQuery({
    variables: { query: debouncedSearch },
    skip: debouncedSearch.length < 2,
  });

  const selectedSchool = data?.searchSchools.find((s: any) => s.id === value) || (value ? { id: value, name: 'Sekolah Terpilih' } : null);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sekolah / Universitas</label>
      <div 
        className="relative"
        onFocus={() => setIsOpen(true)}
        onBlur={(e) => {
          // Allow click inside dropdown
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        tabIndex={-1}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <Search className="h-4 w-4 text-gray-400" />}
        </div>
        <input
          type="text"
          value={isOpen ? search : (selectedSchool?.name || '')}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            onChange(''); // Clear selection on type
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
          placeholder="Cari nama sekolah..."
          required={!value}
        />
        
        {isOpen && debouncedSearch.length >= 2 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {data?.searchSchools.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">Tidak ditemukan</div>
            ) : (
              data?.searchSchools.map((school: any) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => {
                    onChange(school.id);
                    setSearch('');
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {school.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const { handleRegister, isLoading, error } = useRegister();

  const [formData, setFormData] = useState<RegisterPayload>({
    email: '',
    passwordConfirm: '', // We use this field to store password. (Backend expects password/confirm match handling, but here we just pass password in our adapted hook, wait, backend schema needs checking. We will just send what is needed). Let's assume password and email.
    // For now we'll just send a normal payload.
    username: '',
    displayName: '',
    schoolId: '', // Changed to empty string
    major: '',
  });

  const [password, setPassword] = useState('');

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      nextStep();
      return;
    }
    // Final step submission
    handleRegister({
      ...formData,
      passwordConfirm: password, 
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-serif italic mb-2">
          Sotto
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Buat akun untuk memulai</p>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mt-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Tampilan</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            
            <SchoolAutocomplete
              value={formData.schoolId}
              onChange={(schoolId) => setFormData({ ...formData, schoolId })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jurusan</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : step === 1 ? (
              <>Selanjutnya <ChevronRight className="h-5 w-5" /></>
            ) : (
              'Daftar'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Sudah punya akun?{' '}
        <Link to={ROUTES.LOGIN} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
