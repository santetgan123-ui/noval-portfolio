-- Supabase setup script for Noval Portfolio
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin table to restrict dashboard and storage operations
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view own record" ON public.admins
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop old project policies if they exist
DROP POLICY IF EXISTS "Siapapun bisa melihat project" ON public.projects;
DROP POLICY IF EXISTS "Admin bisa menambah project" ON public.projects;
DROP POLICY IF EXISTS "Admin bisa mengubah project" ON public.projects;
DROP POLICY IF EXISTS "Admin bisa menghapus project" ON public.projects;

-- Create new project policies
CREATE POLICY "Public can read project" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert project" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admins)
  );

CREATE POLICY "Admin can update project" ON public.projects
  FOR UPDATE TO authenticated USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
  );

CREATE POLICY "Admin can delete project" ON public.projects
  FOR DELETE TO authenticated USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-thumbnails', 'project-thumbnails', true)
  ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('resume', 'resume', true)
  ON CONFLICT DO NOTHING;

-- Drop old storage policies for project-thumbnails if they exist
DROP POLICY IF EXISTS "Siapapun bisa melihat gambar" ON storage.objects;
DROP POLICY IF EXISTS "Admin bisa upload gambar" ON storage.objects;
DROP POLICY IF EXISTS "Admin bisa update gambar" ON storage.objects;
DROP POLICY IF EXISTS "Admin bisa hapus gambar" ON storage.objects;

-- Drop old storage policies for resume if they exist
DROP POLICY IF EXISTS "Siapapun bisa melihat resume" ON storage.objects;
DROP POLICY IF EXISTS "Admin bisa upload resume" ON storage.objects;
DROP POLICY IF EXISTS "Admin bisa update resume" ON storage.objects;
DROP POLICY IF EXISTS "Admin bisa hapus resume" ON storage.objects;

-- Storage policies for project thumbnails
CREATE POLICY "Public can read all storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('project-thumbnails', 'resume'));

CREATE POLICY "Admin can upload to project-thumbnails" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'project-thumbnails' AND auth.uid() IN (SELECT user_id FROM public.admins)
  );

CREATE POLICY "Admin can update project-thumbnails" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'project-thumbnails' AND auth.uid() IN (SELECT user_id FROM public.admins)
  );

CREATE POLICY "Admin can delete project-thumbnails" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'project-thumbnails' AND auth.uid() IN (SELECT user_id FROM public.admins)
  );

CREATE POLICY "Admin can upload to resume" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'resume' AND auth.uid() IN (SELECT user_id FROM public.admins)
  );

CREATE POLICY "Admin can update resume" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'resume' AND auth.uid() IN (SELECT user_id FROM public.admins)
  );

CREATE POLICY "Admin can delete resume" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'resume' AND auth.uid() IN (SELECT user_id FROM public.admins)
  );

-- Create settings table for dynamic site configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage settings" ON public.site_settings
  FOR ALL TO authenticated USING (auth.uid() IN (SELECT user_id FROM public.admins));

-- Insert default resume value
INSERT INTO public.site_settings (key, value) VALUES ('resume_url', '/resume/noval-abdillah.pdf') ON CONFLICT DO NOTHING;
