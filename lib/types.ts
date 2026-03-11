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
