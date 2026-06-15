#!/usr/bin/env node

/**
 * Blog Migration CLI Script
 *
 * Usage:
 *   npm run migrate-blog -- --dry-run    # Test run without actual migration
 *   npm run migrate-blog -- --test 5     # Test with first 5 posts
 *   npm run migrate-blog                 # Full migration
 */

const { migrateBlogPosts, testMigration } = require('../src/lib/blogMigration.ts');

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const testIndex = args.indexOf('--test');
  const isTest = testIndex !== -1;
  const testLimit = isTest ? parseInt(args[testIndex + 1]) || 5 : 5;

  console.log('🚀 FALL Blog Migration Tool\n');

  try {
    let result;

    if (isDryRun) {
      console.log('📋 Running dry run (no actual changes will be made)...\n');
      result = await migrateBlogPosts(true);
    } else if (isTest) {
      console.log(`🧪 Running test migration with ${testLimit} posts...\n`);
      result = await testMigration(testLimit);
    } else {
      console.log('⚠️  WARNING: This will replace all existing blog posts for brand = 1');
      console.log('📝 Starting full migration...\n');
      result = await migrateBlogPosts(false);
    }

    // Display detailed results
    console.log('\n📊 Migration Results:');
    console.log('===================');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📝 Posts migrated: ${result.migratedCount}`);
    console.log(`❌ Errors: ${result.errors.length}`);
    console.log(`🖼️  Image failures: ${result.imageFailures.length}`);
    console.log(`🏷️  Category mapping failures: ${result.categoryMappingFailures.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Migration Errors:');
      result.errors.forEach((error, index) => {
        console.log(`${index + 1}. Post ${error.postId}: ${error.error}`);
      });
    }

    if (result.imageFailures.length > 0) {
      console.log('\n🖼️  Image Migration Failures:');
      result.imageFailures.forEach((failure, index) => {
        console.log(`${index + 1}. Post ${failure.postId}: ${failure.error}`);
        console.log(`   Original URL: ${failure.originalUrl}`);
      });
    }

    if (result.categoryMappingFailures.length > 0) {
      console.log('\n🏷️  Category Mapping Failures:');
      result.categoryMappingFailures.forEach((failure, index) => {
        console.log(`${index + 1}. Post ${failure.postId}: "${failure.categories}"`);
      });
    }

    if (result.success) {
      console.log('\n🎉 Migration completed successfully!');
      if (!isDryRun && !isTest) {
        console.log('✨ Your blog is now running on the new system.');
      }
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the issues above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Migration interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();
