-- Supabase setup script for Noval Portfolio
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE POLICY "Siapapun bisa melihat project" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admin bisa menambah project" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin bisa mengubah project" ON public.projects
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin bisa menghapus project" ON public.projects
  FOR DELETE TO authenticated USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-thumbnails', 'project-thumbnails', true)
  ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('resume', 'resume', true)
  ON CONFLICT DO NOTHING;

-- Storage policies for project thumbnails
CREATE POLICY "Siapapun bisa melihat gambar" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-thumbnails');

CREATE POLICY "Admin bisa upload gambar" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-thumbnails');

CREATE POLICY "Admin bisa update gambar" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'project-thumbnails');

CREATE POLICY "Admin bisa hapus gambar" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'project-thumbnails');

-- Storage policies for resume bucket
CREATE POLICY "Siapapun bisa melihat resume" ON storage.objects
  FOR SELECT USING (bucket_id = 'resume');

CREATE POLICY "Admin bisa upload resume" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resume');

CREATE POLICY "Admin bisa update resume" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'resume');

CREATE POLICY "Admin bisa hapus resume" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'resume');
