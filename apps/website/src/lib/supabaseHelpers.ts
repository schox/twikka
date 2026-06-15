// Helper functions for Supabase public asset URLs (no auth required)

/**
 * Get the URL for an image stored in Supabase Storage using public URLs (better for CDN caching).
 * If the value is already a full URL (http/https), it is returned as-is, allowing the database
 * to store either a storage filename or an external URL.
 *
 * @param filenameOrUrl - A filename in the bucket OR a full URL
 * @param bucket - The storage bucket name (e.g., "team-photos")
 * @returns The resolved image URL
 */
export function getStorageUrl(filenameOrUrl: string, bucket: string): string {
  if (!filenameOrUrl) {
    return '';
  }

  // Pass through full URLs (supports external images)
  if (filenameOrUrl.startsWith('http://') || filenameOrUrl.startsWith('https://')) {
    return filenameOrUrl;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_NOVANSA_SUPABASE_URL ??
    process.env.NOVANSA_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    return '';
  }

  const normalized = filenameOrUrl.replace(/^\/+/, '');
  return `${baseUrl}/storage/v1/object/public/${bucket}/${normalized}`;
}

/** Get the URL for a team member's photo */
export function getTeamPhotoUrl(filename: string): string {
  return getStorageUrl(filename, 'team-photos');
}

/** Get the URL for a service's image */
export function getServicePhotoUrl(filename: string): string {
  return getStorageUrl(filename, 'service-images');
}

/** Get the URL for a blog post's cover image */
export function getBlogImageUrl(imageUrl: string): string {
  return getStorageUrl(imageUrl, 'blog-images');
}
