/**
 * Resolve a MinIO object key to a full public URL.
 * If the input is already an absolute URL, return as-is.
 * If null/undefined, return undefined.
 */
export function resolveMediaUrl(objectKeyOrUrl: string | null | undefined): string | undefined {
  if (!objectKeyOrUrl) return undefined;

  if (objectKeyOrUrl.startsWith('http://') || objectKeyOrUrl.startsWith('https://')) {
    if (typeof window !== 'undefined' && objectKeyOrUrl.startsWith('http://minio:9000')) {
      return objectKeyOrUrl.replace('http://minio:9000', '');
    }
    return objectKeyOrUrl;
  }

  const base =
    (typeof window !== 'undefined' && (window as any).ENV?.VITE_MINIO_PUBLIC_URL) ||
    import.meta.env.VITE_MINIO_PUBLIC_URL ||
    'http://localhost:9000';
  // Ensure no double slash between base and key
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanKey = objectKeyOrUrl.startsWith('/') ? objectKeyOrUrl : `/${objectKeyOrUrl}`;

  return `${cleanBase}${cleanKey}`;
}
