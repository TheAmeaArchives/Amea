-- ============================================
-- AMEA ADMIN SECTION - DATABASE SCHEMA
-- Run this in the Supabase SQL Editor
-- ============================================

-- Admin Profiles
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
  permissions TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experiments
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content JSONB,
  image_url TEXT,
  curator TEXT,
  editor TEXT,
  chamber TEXT DEFAULT 'i',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team Members (also used for collaborators)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image_url TEXT,
  member_type TEXT NOT NULL CHECK (member_type IN ('team', 'collaborator')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contributors
CREATE TABLE contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  bio TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contributor Articles
CREATE TABLE contributor_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID NOT NULL REFERENCES contributors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery Items
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure only ONE item can be featured at a time
CREATE UNIQUE INDEX idx_gallery_items_single_featured 
ON gallery_items ((true)) 
WHERE featured = true;

-- Programs
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_type TEXT CHECK (icon_type IN ('circle', 'diamond', 'triangle')),
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Supporters
CREATE TABLE supporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chamber Stats (Chamber II)
CREATE TABLE chamber_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  chamber TEXT DEFAULT 'ii',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chamber Beliefs (Chamber II)
CREATE TABLE chamber_beliefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  chamber TEXT DEFAULT 'ii',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chamber Content (Chamber III, etc.)
CREATE TABLE chamber_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site Content (key-value store for static sections)
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Volunteer Submissions
CREATE TABLE volunteer_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_experiments_slug ON experiments(slug);
CREATE INDEX idx_experiments_published ON experiments(published);
CREATE INDEX idx_team_members_type ON team_members(member_type);
CREATE INDEX idx_team_members_order ON team_members(order_index);
CREATE INDEX idx_gallery_items_order ON gallery_items(order_index);
CREATE INDEX idx_programs_order ON programs(order_index);
CREATE INDEX idx_supporters_order ON supporters(order_index);
CREATE INDEX idx_site_content_key ON site_content(key);
CREATE INDEX idx_contact_submissions_read ON contact_submissions(read);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributor_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamber_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamber_beliefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamber_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function: check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: check if current user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Profiles: super admins can manage, admins can read their own
CREATE POLICY "Super admins can manage all profiles"
  ON admin_profiles FOR ALL
  USING (is_super_admin());

CREATE POLICY "Admins can read own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);

-- Content tables: public read, admin write
-- Blog Posts
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage posts" ON blog_posts
  FOR ALL USING (is_admin());

-- Experiments
CREATE POLICY "Public can read published experiments" ON experiments
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage experiments" ON experiments
  FOR ALL USING (is_admin());

-- Team Members
CREATE POLICY "Public can read team members" ON team_members
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (is_admin());

-- Contributors
CREATE POLICY "Public can read contributors" ON contributors
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage contributors" ON contributors
  FOR ALL USING (is_admin());

-- Contributor Articles
CREATE POLICY "Public can read articles" ON contributor_articles
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage articles" ON contributor_articles
  FOR ALL USING (is_admin());

-- Gallery Items
CREATE POLICY "Public can read gallery" ON gallery_items
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON gallery_items
  FOR ALL USING (is_admin());

-- Programs
CREATE POLICY "Public can read programs" ON programs
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage programs" ON programs
  FOR ALL USING (is_admin());

-- Supporters
CREATE POLICY "Public can read supporters" ON supporters
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage supporters" ON supporters
  FOR ALL USING (is_admin());

-- Chamber Stats
CREATE POLICY "Public can read chamber stats" ON chamber_stats
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage chamber stats" ON chamber_stats
  FOR ALL USING (is_admin());

-- Chamber Beliefs
CREATE POLICY "Public can read chamber beliefs" ON chamber_beliefs
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage chamber beliefs" ON chamber_beliefs
  FOR ALL USING (is_admin());

-- Chamber Content
CREATE POLICY "Public can read chamber content" ON chamber_content
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage chamber content" ON chamber_content
  FOR ALL USING (is_admin());

-- Site Content
CREATE POLICY "Public can read site content" ON site_content
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON site_content
  FOR ALL USING (is_admin());

-- Contact Submissions (admin only)
CREATE POLICY "Admins can read contacts" ON contact_submissions
  FOR SELECT USING (is_admin());
CREATE POLICY "Anyone can submit contact" ON contact_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update contacts" ON contact_submissions
  FOR UPDATE USING (is_admin());

-- Volunteer Submissions (admin only)
CREATE POLICY "Admins can read volunteers" ON volunteer_submissions
  FOR SELECT USING (is_admin());
CREATE POLICY "Anyone can submit volunteer" ON volunteer_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update volunteers" ON volunteer_submissions
  FOR UPDATE USING (is_admin());

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run in Supabase Dashboard > Storage or via API:
-- Create bucket 'images' with public access

-- Storage policies (run in SQL editor):
-- INSERT policy: admins can upload
-- SELECT policy: public can view
-- DELETE policy: admins can delete

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experiments_updated_at
  BEFORE UPDATE ON experiments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contributors_updated_at
  BEFORE UPDATE ON contributors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_supporters_updated_at
  BEFORE UPDATE ON supporters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
