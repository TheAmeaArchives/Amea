export type AdminRole = "super_admin" | "admin";

export type Permission =
  | "blog"
  | "experiments"
  | "team"
  | "gallery"
  | "programs"
  | "supporters"
  | "contacts"
  | "volunteers"
  | "site_content"
  | "chambers";

export const ALL_PERMISSIONS: Permission[] = [
  "blog",
  "experiments",
  "team",
  "gallery",
  "programs",
  "supporters",
  "contacts",
  "volunteers",
  "site_content",
  "chambers",
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  blog: "Blog Posts",
  experiments: "Experiments",
  team: "Team & Contributors",
  gallery: "Grand Gallery",
  programs: "Programs",
  supporters: "Supporters",
  contacts: "Contact Submissions",
  volunteers: "Volunteer Submissions",
  site_content: "Site Content",
  chambers: "Chambers",
};

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  permissions: Permission[];
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  cover_image_url: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Experiment {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: any;
  image_url: string | null;
  curator: string | null;
  editor: string | null;
  chamber: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  member_type: "team" | "collaborator";
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Contributor {
  id: string;
  name: string;
  location: string | null;
  bio: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContributorArticle {
  id: string;
  contributor_id: string;
  title: string;
  url: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  title: string;
  description: string | null;
  icon_type: "circle" | "diamond" | "triangle" | null;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Supporter {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ChamberStat {
  id: string;
  label: string;
  value: string;
  chamber: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ChamberBelief {
  id: string;
  title: string;
  content: string | null;
  chamber: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ChamberContent {
  id: string;
  chamber: string;
  section: string;
  content: string | null;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export type SiteContentMap = Record<string, string>;

export interface ContentSection {
  page: string;
  label: string;
  description: string;
  keys: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'email' | 'url';
  }[];
}

export const SITE_CONTENT_SECTIONS: ContentSection[] = [
  {
    page: 'Homepage',
    label: 'About Section',
    description: 'Main content displayed on the homepage about section',
    keys: [
      { key: 'home_about_heading_1', label: 'First Heading (e.g., "AI.")', type: 'text' },
      { key: 'home_about_heading_2', label: 'Second Heading (e.g., "Penicillin.")', type: 'text' },
      { key: 'home_about_heading_3', label: 'Third Heading (e.g., "Fire.")', type: 'text' },
      { key: 'home_about_text_1', label: 'First Paragraph', type: 'textarea' },
      { key: 'home_about_text_2', label: 'Second Paragraph', type: 'textarea' },
      { key: 'home_about_text_3', label: 'Third Paragraph', type: 'textarea' },
    ]
  },
  {
    page: 'Homepage',
    label: 'Innovation Section',
    description: 'The "Innovation & Behavioral Science" section',
    keys: [
      { key: 'home_innovation_heading_1', label: 'Heading Line 1', type: 'text' },
      { key: 'home_innovation_heading_2', label: 'Heading Line 2', type: 'text' },
      { key: 'home_innovation_heading_3', label: 'Heading Line 3', type: 'text' },
      { key: 'home_innovation_text', label: 'Description Text', type: 'textarea' },
      { key: 'home_tagline', label: 'Bottom Tagline', type: 'text' },
    ]
  },
  {
    page: 'Team',
    label: 'Team Page Headers',
    description: 'Titles and descriptions on the team page',
    keys: [
      { key: 'team_page_title', label: 'Page Title', type: 'text' },
      { key: 'team_page_description', label: 'Page Description', type: 'textarea' },
      { key: 'team_hero_text_1', label: 'Hero Text Line 1', type: 'text' },
      { key: 'team_hero_text_2', label: 'Hero Text Line 2', type: 'text' },
      { key: 'team_hero_highlight', label: 'Hero Highlighted Word', type: 'text' },
    ]
  },
  {
    page: 'Team',
    label: 'Team Sections',
    description: 'Section titles and descriptions',
    keys: [
      { key: 'team_members_title', label: 'Team Members Title', type: 'text' },
      { key: 'team_members_description', label: 'Team Members Description', type: 'textarea' },
      { key: 'team_collaborators_title', label: 'Collaborators Title', type: 'text' },
      { key: 'team_collaborators_description', label: 'Collaborators Description', type: 'textarea' },
      { key: 'team_contributors_title', label: 'Contributors Title', type: 'text' },
      { key: 'team_contributors_description', label: 'Contributors Description', type: 'textarea' },
      { key: 'team_supporters_title', label: 'Supporters Title', type: 'text' },
      { key: 'team_supporters_description', label: 'Supporters Description', type: 'textarea' },
      { key: 'team_be_part_title', label: 'Be Part Title', type: 'text' },
      { key: 'team_be_part_text', label: 'Be Part Text', type: 'text' },
    ]
  },
  {
    page: 'Archives',
    label: 'Archives Page',
    description: 'The archives/chambers overview page',
    keys: [
      { key: 'archives_title_1', label: 'Page Title Line 1', type: 'text' },
      { key: 'archives_title_2', label: 'Page Title Line 2', type: 'text' },
      { key: 'archives_description', label: 'Page Description', type: 'textarea' },
    ]
  },
  {
    page: 'Chambers',
    label: 'Chamber Pages',
    description: 'Titles and subtitles for each chamber',
    keys: [
      { key: 'chamber_i_title', label: 'Chamber I Title', type: 'text' },
      { key: 'chamber_i_subtitle', label: 'Chamber I Subtitle', type: 'text' },
      { key: 'chamber_ii_title', label: 'Chamber II Title', type: 'text' },
      { key: 'chamber_ii_subtitle', label: 'Chamber II Subtitle', type: 'text' },
      { key: 'chamber_ii_cta', label: 'Chamber II Call to Action', type: 'text' },
      { key: 'chamber_iii_title', label: 'Chamber III Title', type: 'text' },
      { key: 'chamber_iii_subtitle', label: 'Chamber III Subtitle', type: 'text' },
    ]
  },
  {
    page: 'Blog',
    label: 'Blog Page',
    description: 'Blog page content',
    keys: [
      { key: 'blog_title', label: 'Page Title', type: 'text' },
      { key: 'blog_subtitle', label: 'Page Subtitle', type: 'text' },
      { key: 'blog_newsletter_title', label: 'Newsletter Title', type: 'text' },
      { key: 'blog_newsletter_description', label: 'Newsletter Description', type: 'textarea' },
    ]
  },
  {
    page: 'Programs',
    label: 'Programs Page',
    description: 'Programs page content',
    keys: [
      { key: 'programs_title', label: 'Page Title', type: 'text' },
      { key: 'programs_subtitle', label: 'Page Subtitle', type: 'text' },
    ]
  },
  {
    page: 'Gallery',
    label: 'Gallery Page',
    description: 'Grand Gallery page content',
    keys: [
      { key: 'gallery_title_1', label: 'Title Line 1', type: 'text' },
      { key: 'gallery_title_2', label: 'Title Line 2', type: 'text' },
      { key: 'gallery_description', label: 'Description', type: 'text' },
    ]
  },
  {
    page: 'Contact',
    label: 'Contact Page',
    description: 'Contact page and form content',
    keys: [
      { key: 'contact_title', label: 'Page Title', type: 'text' },
      { key: 'contact_form_title', label: 'Form Title', type: 'text' },
      { key: 'contact_form_description', label: 'Form Description', type: 'textarea' },
      { key: 'contact_email', label: 'Contact Email', type: 'email' },
    ]
  },
  {
    page: 'Contributors',
    label: 'Contributors Page',
    description: 'Contributors listing page',
    keys: [
      { key: 'contributors_title', label: 'Page Title', type: 'text' },
      { key: 'contributors_description', label: 'Page Description', type: 'textarea' },
    ]
  },
  {
    page: 'Social Links',
    label: 'Social Media Links',
    description: 'Links to social media profiles',
    keys: [
      { key: 'social_medium', label: 'Medium URL', type: 'url' },
      { key: 'social_instagram', label: 'Instagram URL', type: 'url' },
      { key: 'social_twitter', label: 'X (Twitter) URL', type: 'url' },
      { key: 'social_threads', label: 'Threads URL', type: 'url' },
      { key: 'social_whatsapp', label: 'WhatsApp URL', type: 'url' },
      { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url' },
    ]
  },
];

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface VolunteerSubmission {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  status: "pending" | "contacted" | "accepted" | "rejected";
  created_at: string;
}
