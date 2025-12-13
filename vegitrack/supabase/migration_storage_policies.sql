-- ============================================
-- Storage Policies for 'images' bucket
-- ============================================
-- This migration sets up Row Level Security (RLS) policies
-- for the Supabase Storage 'images' bucket to allow:
-- 1. Authenticated users to upload files
-- 2. Public read access (if bucket is public)
-- 3. Authenticated users to update/delete files

-- IMPORTANT: First, create the bucket in Supabase Dashboard:
-- 1. Go to Storage → New bucket
-- 2. Name: "images"
-- 3. Make it Public (toggle ON)
-- 4. Click "Create bucket"

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated uploads to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from images bucket" ON storage.objects;

-- Policy: Allow authenticated users to upload files to the images bucket
CREATE POLICY "Allow authenticated uploads to images bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy: Allow public read access to images bucket
CREATE POLICY "Allow public read access to images bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to update files in images bucket
CREATE POLICY "Allow authenticated updates to images bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy: Allow authenticated users to delete files from images bucket
CREATE POLICY "Allow authenticated deletes from images bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');

