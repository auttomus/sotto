/**
 * Resolve a MinIO object key to a full public URL.
 * If the input is already an absolute URL, return as-is.
 * If null/undefined, return undefined.
 */
export function resolveMediaUrl(objectKeyOrUrl: string | null | undefined): string | undefined {
  if (!objectKeyOrUrl) return undefined;

  // Already a full URL
  if (objectKeyOrUrl.startsWith('http://') || objectKeyOrUrl.startsWith('https://')) {
    return objectKeyOrUrl;
  }

  const base = import.meta.env.VITE_MINIO_PUBLIC_URL || 'http://localhost:9000';
  // Ensure no double slash between base and key
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanKey = objectKeyOrUrl.startsWith('/') ? objectKeyOrUrl : `/${objectKeyOrUrl}`;

  return `${cleanBase}${cleanKey}`;
}
