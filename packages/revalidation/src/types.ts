/**
 * Types for @novansa/revalidation
 */

/**
 * Brand IDs in the Novansa multi-brand system
 */
export const BRAND_IDS = {
  FALL: 1,
  TWIKKA: 2,
  COUPLE_TOOLS: 3,
} as const;

export type BrandId = (typeof BRAND_IDS)[keyof typeof BRAND_IDS];

/**
 * The type of database operation that triggered revalidation
 */
export type OperationType = "INSERT" | "UPDATE" | "DELETE";

/**
 * Payload sent from the Edge Function to the app's revalidation endpoint
 */
export interface RevalidationPayload {
  /** The database table that changed */
  table: string;
  /** The type of operation (INSERT, UPDATE, DELETE) */
  type: OperationType;
  /** The record that was affected (NEW for INSERT/UPDATE, OLD for DELETE) */
  record: Record<string, unknown>;
  /** Optional: the old record (for UPDATE operations) */
  oldRecord?: Record<string, unknown>;
}

/**
 * Function that resolves which paths need revalidation for a given record
 */
export type PathResolver = (record: Record<string, unknown>) => string[];

/**
 * Configuration for the revalidation handler
 */
export interface RevalidationConfig {
  /**
   * Secret used to authenticate revalidation requests.
   * Must match the secret sent by the Edge Function.
   */
  secret: string;

  /**
   * The brand ID for this app. Requests for other brands will be ignored.
   */
  brandId: BrandId | number;

  /**
   * The base URL of this app (e.g., 'https://coupletools.app').
   * Used for cache warming - fetching pages after revalidation.
   */
  siteUrl: string;

  /**
   * Map of table names to path resolver functions.
   * Each resolver returns an array of paths to revalidate when that table changes.
   *
   * @example
   * ```typescript
   * paths: {
   *   blog_post: (record) => ['/blog', `/blog/${record.slug}`],
   *   team_member: (record) => ['/team', `/team/${record.slug}`],
   * }
   * ```
   */
  paths: Record<string, PathResolver>;

  /**
   * Whether to warm the cache by fetching pages after revalidation.
   * Defaults to true.
   */
  warmCache?: boolean;

  /**
   * Optional callback for logging/monitoring
   */
  onRevalidate?: (result: RevalidationResult) => void | Promise<void>;
}

/**
 * Result of a revalidation request
 */
export interface RevalidationResult {
  /** Whether revalidation was performed */
  revalidated: boolean;
  /** Paths that were revalidated */
  paths: string[];
  /** The table that triggered revalidation */
  table: string;
  /** The operation type */
  type: OperationType;
  /** Whether the request was skipped and why */
  skipped?: boolean;
  skipReason?: string;
  /** Any errors that occurred */
  error?: string;
  /** Cache warming results */
  cacheWarming?: {
    success: string[];
    failed: string[];
  };
}

/**
 * Headers expected on revalidation requests
 */
export const REVALIDATION_SECRET_HEADER = "x-revalidation-secret";
