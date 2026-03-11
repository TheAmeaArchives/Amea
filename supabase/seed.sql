-- ============================================
-- SEED FIRST SUPER ADMIN
-- ============================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create a user with email/password
-- 3. Copy the user's UUID from the dashboard
-- 4. Replace 'YOUR_USER_UUID' and details below, then run this SQL
-- ============================================

-- INSERT INTO admin_profiles (id, email, full_name, role, permissions, is_active)
-- VALUES (
--   'YOUR_USER_UUID',
--   'admin@amea.com',
--   'Super Admin',
--   'super_admin',
--   '{}',
--   true
-- );

-- ============================================
-- ALTERNATIVE: Create user + profile in one go
-- (Run this in the SQL Editor with service role)
-- ============================================

-- Step 1: The user should already be created via Supabase Auth Dashboard
-- Step 2: Insert the admin profile (replace UUID):

-- INSERT INTO admin_profiles (id, email, full_name, role, is_active)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   'your-email@example.com',
--   'Your Name',
--   'super_admin',
--   true
-- );

-- ============================================
-- STORAGE SETUP (REQUIRED FOR IMAGE UPLOADS)
-- ============================================
-- 
-- STEP 1: Create the bucket manually
-- Go to Supabase Dashboard > Storage > New Bucket
-- - Name: images
-- - Public bucket: YES (toggle ON)
-- - Click "Create bucket"
--
-- STEP 2: Run these SQL commands in the SQL Editor
-- (After creating the bucket)
-- ============================================

-- Allow anyone to view images (public read)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
