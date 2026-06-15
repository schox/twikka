#!/usr/bin/env node

/**
 * Blog Migration CLI Script
 *
 * Usage:
 *   npm run migrate-blog -- --dry-run    # Test run without actual migration
 *   npm run migrate-blog -- --test 5     # Test with first 5 posts
 *   npm run migrate-blog                 # Full migration
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// We'll need to compile the TypeScript migration file first
// For now, let's create a simpler version that can be run directly

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 FALL Blog Migration Tool');
console.log('📝 TypeScript migration utilities need to be compiled first.');
console.log('');
console.log('To run the migration:');
console.log('1. Build the project: npm run build');
console.log('2. Use the Next.js API route: POST /api/migrate-blog');
console.log('');
console.log('Or create a simple Node.js script to test Supabase connection...');

// Test Supabase connection
try {
  const { data, error } = await supabase
    .from('blog_import_posts')
    .select('count(*)', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Supabase connected successfully`);
  console.log(`📊 Found ${data?.length || 0} posts to migrate`);
} catch (error) {
  console.error('❌ Connection test failed:', error.message);
  process.exit(1);
}
