import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, ChevronLeft, Loader2, Search, GraduationCap } from 'lucide-react';
import { useRegister, type RegisterPayload } from '../hooks/useRegister';
import { ROUTES } from '~/core/constants/ROUTES';
import { useSearchSchoolsQuery, useMajorsBySchoolQuery } from '~/core/apollo/generated';
import { Button } from '~/components/ui/Button';

function SchoolAutocomplete({ value, onChange }: { value: { id: string; name: string } | null; onChange: (school: { id: string; name: string } | null) => void }) {
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

  return (
    <div className="relative">
      <label className="form-label">Sekolah / Universitas</label>
      <div 
        className="relative"
        onFocus={() => {
          setIsOpen(true);
          if (value && !search) {
            setSearch(value.name);
          }
        }}
        onBlur={(e) => {
          // Allow click inside dropdown
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
            if (!value) {
              setSearch('');
            } else {
              setSearch(value.name);
            }
          }
        }}
        tabIndex={-1}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <Search className="h-4 w-4 text-muted-foreground" />}
        </div>
        <input
          type="text"
          value={isOpen ? search : (value?.name || '')}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (value) onChange(null); // Clear selection on type
          }}
          className="form-input pl-10"
          placeholder="Cari nama sekolah..."
          required={!value}
        />
        
        {isOpen && debouncedSearch.length >= 2 && (
          <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground text-center">Mencari...</div>
            ) : !data?.searchSchools || data.searchSchools.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">Tidak ditemukan</div>
            ) : (
              data.searchSchools.map((school: any) => (
                <button
                  key={school.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Mencegah input kehilangan fokus (onBlur) sebelum event ini selesai
                    onChange({ id: school.id, name: school.name });
                    setSearch(school.name);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
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

function MajorSelect({ schoolId, value, onChange }: { schoolId: string; value: string; onChange: (id: string) => void }) {
  const { data, loading } = useMajorsBySchoolQuery({
    variables: { schoolId },
    skip: !schoolId,
  });

  // Reset selection when schoolId changes
  useEffect(() => {
    onChange('');
  }, [schoolId]); // eslint-disable-line react-hooks/exhaustive-deps

  const majors = data?.majorsBySchool ?? [];
  const isDisabled = !schoolId;

  return (
    <div>
      <label className="form-label">Jurusan</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <GraduationCap className="h-4 w-4 text-muted-foreground" />}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          required
          className={`form-input pl-10 appearance-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="">
            {isDisabled ? 'Pilih sekolah terlebih dahulu' : loading ? 'Memuat jurusan...' : 'Pilih jurusan'}
          </option>
          {majors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        {!isDisabled && !loading && majors.length === 0 && schoolId && (
          <p className="text-xs text-warning mt-1">Belum ada jurusan terdaftar untuk sekolah ini.</p>
        )}
      </div>
    </div>
  );
}

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const { handleRegister, isLoading, error } = useRegister();
  const [selectedSchool, setSelectedSchool] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState<RegisterPayload>({
    email: '',
    password: '',
    username: '',
    displayName: '',
    schoolId: '',
    majorId: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      nextStep();
      return;
    }
    // Final step submission
    if (formData.password !== confirmPassword) {
      return; // Password mismatch, don't submit
    }
    handleRegister(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card text-foreground rounded-md shadow-sm border border-border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-serif italic mb-2">
          Sotto
        </h1>
        <p className="text-muted-foreground">Buat akun untuk memulai</p>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mt-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Kata Sandi</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="form-label">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-input ${confirmPassword && formData.password !== confirmPassword ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}`}
                required
              />
              {confirmPassword && formData.password !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Kata sandi tidak cocok</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="form-label">Nama Tampilan</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <SchoolAutocomplete
              value={selectedSchool}
              onChange={(school) => {
                setSelectedSchool(school);
                setFormData({ ...formData, schoolId: school?.id || '', majorId: '' });
              }}
            />

            <MajorSelect
              schoolId={formData.schoolId}
              value={formData.majorId}
              onChange={(majorId) => setFormData({ ...formData, majorId })}
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={prevStep}
              className="shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : step === 1 ? (
              <>Selanjutnya <ChevronRight className="h-5 w-5 ml-1" /></>
            ) : (
              'Daftar'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
