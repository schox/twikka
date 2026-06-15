// URL utility functions for reference management

/**
 * Strips all query parameters and fragments from a URL, keeping only the base URL
 * @param url - The URL to clean
 * @returns The clean URL without parameters
 */
export function stripUrlParameters(url: string): string {
  try {
    const urlObj = new URL(url);
    // Return just the origin + pathname, no search params or hash
    return urlObj.origin + urlObj.pathname;
  } catch {
    // If URL is invalid, return the original string
    // This allows the form validation to handle the error
    return url;
  }
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL by:
 * 1. Adding https:// if no protocol is provided
 * 2. Stripping parameters
 * 3. Converting to lowercase
 * @param url - The URL to normalize
 * @returns The normalized URL
 */
export function normalizeUrl(url: string): string {
  let normalizedUrl = url.trim();

  // Add https:// if no protocol is provided
  if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//i)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  // Strip parameters
  normalizedUrl = stripUrlParameters(normalizedUrl);

  // Convert to lowercase for consistency
  return normalizedUrl.toLowerCase();
}
