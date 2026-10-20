export type Role = 'owner' | 'admin' | 'editor';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyllabusModule {
  title: string;
  topics: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  category: string;
  technologies: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Skill Levels';
  duration: string;
  syllabus: SyllabusModule[];
  learningOutcomes: string[];
  rating?: number;
  projectsCount?: number;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  badgeText?: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhyChooseUsItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  features: string[];
  displayOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  fullCaseStudy?: string;
  image: string;
  technologies: string[];
  statusBadge: string;
  externalUrl?: string;
  githubUrl?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  photoUrl: string;
  order: number;
  published: boolean;
  linkedinUrl?: string;
  githubUrl?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: 'notes' | 'guide' | 'boilerplate';
  description: string;
  downloadUrl: string;
  fileFormat: string;
  fileSize: string;
  published: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
  };
  stats?: {
    showStats: boolean;
    studentsEnrolled?: string;
    activeProjects?: string;
    mentorshipHours?: string;
    labSessions?: string;
  };
  footerLinks?: {
    title: string;
    url: string;
  }[];
  updatedAt?: string;
}

export type EnquiryStatus = 'new' | 'in_progress' | 'contacted' | 'resolved' | 'spam';

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  programOrService: string;
  subject?: string;
  message: string;
  status: EnquiryStatus;
  assignedTo?: string;
  internalNotes?: string;
  followUpDate?: string;
  emailNotificationSent?: boolean;
  emailError?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
}
