/**
 * @novansa/database - Shared database types and utilities
 *
 * Provides centralized database types and helper functions for all Novansa apps.
 * Generated from Supabase schema with additional utility types and functions.
 */

// Re-export all database types
export type { Database, Json } from './database.types';

// Import for internal use
import type { Database } from './database.types';

// Convenience type exports for common table operations
export type Tables = Database['public']['Tables'];
export type Views = Database['public']['Views'];
export type Functions = Database['public']['Functions'];
export type Enums = Database['public']['Enums'];

// Common table row types for easy importing
export type AccountRow = Tables['account']['Row'];
export type UserProfileRow = Tables['user_profile']['Row'];
export type BrandRow = Tables['brand']['Row'];
export type ContentRow = Tables['content']['Row'];
export type ReferenceRow = Tables['reference']['Row'];
export type TopicRow = Tables['topic']['Row'];

// Common insert types
export type AccountInsert = Tables['account']['Insert'];
export type UserProfileInsert = Tables['user_profile']['Insert'];
export type BrandInsert = Tables['brand']['Insert'];
export type ContentInsert = Tables['content']['Insert'];
export type ReferenceInsert = Tables['reference']['Insert'];
export type TopicInsert = Tables['topic']['Insert'];

// Common update types
export type AccountUpdate = Tables['account']['Update'];
export type UserProfileUpdate = Tables['user_profile']['Update'];
export type BrandUpdate = Tables['brand']['Update'];
export type ContentUpdate = Tables['content']['Update'];
export type ReferenceUpdate = Tables['reference']['Update'];
export type TopicUpdate = Tables['topic']['Update'];

/**
 * Utility function to create type-safe table name constants
 */
export const TABLE_NAMES = {
  ACCOUNT: 'account',
  USER_PROFILE: 'user_profile',
  BRAND: 'brand',
  CONTENT: 'content',
  REFERENCE: 'reference',
  TOPIC: 'topic',
  AUTHOR: 'author',
  AWARENESS: 'awareness',
  BELIEF: 'belief',
  LIGHTBULB: 'lightbulb',
  TAG: 'tag',
} as const;

/**
 * Helper type to ensure table names are valid
 */
export type TableName = keyof Tables;

/**
 * Helper type to get row type from table name
 */
export type GetRowType<T extends TableName> = Tables[T]['Row'];

/**
 * Helper type to get insert type from table name
 */
export type GetInsertType<T extends TableName> = Tables[T]['Insert'];

/**
 * Helper type to get update type from table name
 */
export type GetUpdateType<T extends TableName> = Tables[T]['Update'];

/**
 * Common enum values for easy reference
 */
export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Account ID type for multi-tenant filtering
 */
export type AccountId = string;

/**
 * Brand ID type
 */
export type BrandId = number;
