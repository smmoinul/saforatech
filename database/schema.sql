-- ============================================================
-- SaforaTech — Supabase Database Schema
-- Run this in Supabase → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends Supabase auth.users) ──────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name    TEXT,
  username     TEXT UNIQUE,
  avatar_url   TEXT,
  bio          TEXT,
  role         TEXT DEFAULT 'user' CHECK (role IN ('user', 'author', 'admin')),
  phone        TEXT,
  company      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Blog Categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  name_bn    TEXT,
  slug       TEXT UNIQUE NOT NULL,
  color      TEXT DEFAULT '#0057FF'
);

INSERT INTO public.blog_categories (name, name_bn, slug, color) VALUES
  ('Networking',         'নেটওয়ার্কিং',       'networking',  '#0057FF'),
  ('Server & Storage',   'সার্ভার ও স্টোরেজ',  'server',      '#10B981'),
  ('Security',           'নিরাপত্তা',           'security',    '#EF4444'),
  ('Cloud & Web',        'ক্লাউড ও ওয়েব',     'cloud',       '#8B5CF6'),
  ('IT Consultancy',     'আইটি পরামর্শ',       'consulting',  '#F59E0B'),
  ('Software',           'সফটওয়্যার',          'software',    '#FF6B35'),
  ('SaforaERP',          'SaforaERP',           'safora-erp',  '#00C6FF')
ON CONFLICT DO NOTHING;

-- ── Blog Posts ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id  INT REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  title_bn     TEXT,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  excerpt_bn   TEXT,
  content      TEXT,
  content_bn   TEXT,
  cover_image  TEXT,
  tags         TEXT[] DEFAULT '{}',
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  views        INT DEFAULT 0,
  likes        INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Blog Comments ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id    UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content    TEXT NOT NULL,
  approved   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contact Messages ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Services (editable from admin) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id          SERIAL PRIMARY KEY,
  icon        TEXT,
  title       TEXT NOT NULL,
  title_bn    TEXT,
  description TEXT,
  description_bn TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security (RLS) ─────────────────────────────────

-- Profiles: users can read all, update own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Blog posts: published posts visible to all; authors can manage own
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts visible to all" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage own posts" ON public.blog_posts FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'author'))
);

-- Contact messages: only admins can read
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments: approved comments visible to all; authors manage own
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved comments visible to all" ON public.blog_comments FOR SELECT USING (approved = true);
CREATE POLICY "Users can insert comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can manage own comments" ON public.blog_comments FOR ALL USING (auth.uid() = author_id);

-- Services: everyone can read active services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active services visible to all" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ── Sample Blog Posts ────────────────────────────────────────
-- (After adding users, you can insert sample posts via admin panel)
