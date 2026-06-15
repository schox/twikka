import { NextRequest, NextResponse } from 'next/server';
import { migrateBlogPosts, testMigration } from '@/lib/blogMigration';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dryRun = searchParams.get('dry-run') === 'true';
    const test = searchParams.get('test');
    const testLimit = test ? parseInt(test) : null;

    console.log('🚀 Starting blog migration via API...');

    let result;

    if (testLimit) {
      console.log(`🧪 Running test migration with ${testLimit} posts...`);
      result = await testMigration(testLimit);
    } else {
      console.log(dryRun ? '📋 Running dry run...' : '📝 Running full migration...');
      result = await migrateBlogPosts(dryRun);
    }

    return NextResponse.json(
      {
        success: result.success,
        migratedCount: result.migratedCount,
        errors: result.errors,
        imageFailures: result.imageFailures,
        categoryMappingFailures: result.categoryMappingFailures,
        summary: {
          totalProcessed: result.migratedCount + result.errors.length,
          successRate: `${Math.round((result.migratedCount / (result.migratedCount + result.errors.length)) * 100)}%`,
        },
      },
      {
        status: result.success ? 200 : 207, // 207 = Multi-Status (partial success)
      },
    );
  } catch (error) {
    console.error('Migration API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        migratedCount: 0,
        errors: [{ postId: -1, error: error instanceof Error ? error.message : String(error) }],
        imageFailures: [],
        categoryMappingFailures: [],
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Blog Migration API',
    endpoints: {
      'POST /api/migrate-blog': 'Run full migration',
      'POST /api/migrate-blog?dry-run=true': 'Dry run (no changes)',
      'POST /api/migrate-blog?test=5': 'Test with 5 posts',
    },
    usage: [
      'curl -X POST http://localhost:3002/api/migrate-blog?dry-run=true',
      'curl -X POST http://localhost:3002/api/migrate-blog?test=3',
      'curl -X POST http://localhost:3002/api/migrate-blog',
    ],
  });
}
