-- Storage Bucket Setup

-- Since we cannot directly modify storage.objects RLS policies via SQL,
-- you need to configure storage policies through the Supabase Dashboard.

-- Step 1: Create buckets in Supabase Dashboard
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Create bucket named "team-photos"
--    - Keep "Public bucket" toggle OFF (private bucket)
--    - Click "Create bucket"
-- 4. Create bucket named "service-images"  
--    - Keep "Public bucket" toggle OFF (private bucket)
--    - Click "Create bucket"

-- Step 2: Configure bucket policies in the Dashboard
-- For EACH bucket (team-photos and service-images):

-- 1. Click on the bucket name
-- 2. Go to "Policies" tab
-- 3. Click "New policy" and create these policies:

-- SELECT Policy (Public Read):
-- - Policy name: "Public read access"
-- - Allowed operation: SELECT
-- - Target roles: Leave empty (applies to all including anonymous)
-- - WITH CHECK expression: true
-- - Save

-- INSERT Policy (Authenticated Upload):
-- - Policy name: "Authenticated users can upload"
-- - Allowed operation: INSERT  
-- - Target roles: authenticated
-- - WITH CHECK expression:
--   (storage.foldername(name))[1] = (SELECT account::text FROM public.user_profile WHERE auth_id = auth.uid())
-- - Save

-- UPDATE Policy (Account Users Update):
-- - Policy name: "Account users can update"
-- - Allowed operation: UPDATE
-- - Target roles: authenticated
-- - USING expression:
--   (storage.foldername(name))[1] = (SELECT account::text FROM public.user_profile WHERE auth_id = auth.uid())
-- - Save

-- DELETE Policy (Account Users Delete):
-- - Policy name: "Account users can delete"
-- - Allowed operation: DELETE
-- - Target roles: authenticated
-- - USING expression:
--   (storage.foldername(name))[1] = (SELECT account::text FROM public.user_profile WHERE auth_id = auth.uid())
-- - Save

-- Alternative: Simple setup for single-tenant
-- If this is only for one account, you can simplify by:
-- 1. Making buckets public (toggle ON "Public bucket") - allows public read
-- 2. Default authenticated-only write access is automatically applied
-- 3. No additional policies needed

-- File structure for multi-tenant support:
-- team-photos/[account-id]/[filename]
-- service-images/[account-id]/[filename]

-- URLs will be:
-- https://[project-ref].supabase.co/storage/v1/object/public/team-photos/[account-id]/[filename]
-- https://[project-ref].supabase.co/storage/v1/object/public/service-images/[account-id]/[filename]