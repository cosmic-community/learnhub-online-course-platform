// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at?: string;
  modified_at?: string;
}

// File/Image metafield type
export interface CosmicFile {
  url: string;
  imgix_url: string;
}

// Difficulty select-dropdown type
export interface DifficultyOption {
  key: 'beginner' | 'intermediate' | 'advanced';
  value: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Instructor type
export interface Instructor extends CosmicObject {
  type: 'instructors';
  metadata: {
    name: string;
    bio?: string;
    photo?: CosmicFile;
    credentials?: string;
  };
}

// Category type
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
    icon?: string;
  };
}

// Lesson type
export interface Lesson extends CosmicObject {
  type: 'lessons';
  metadata: {
    title: string;
    description?: string;
    video_url?: string;
    content?: string;
    code_example?: string;
    duration_minutes?: number;
    resources?: CosmicFile[];
    order?: number;
  };
}

// Course type
export interface Course extends CosmicObject {
  type: 'courses';
  metadata: {
    title: string;
    tagline?: string;
    description?: string;
    thumbnail?: CosmicFile;
    preview_video_url?: string;
    difficulty: DifficultyOption;
    price?: number;
    is_free?: boolean;
    estimated_hours?: number;
    instructors?: Instructor[];
    categories?: Category[];
    lessons?: Lesson[];
    seo_title?: string;
    seo_description?: string;
  };
}

// Contact Form Submission type
export interface ContactFormSubmission extends CosmicObject {
  type: 'contact-form-submissions';
  metadata: {
    name: string;
    email: string;
    subject: string;
    message: string;
    submitted_at: string;
  };
}

// Contact form input data (for form submission)
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API Response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

export interface CosmicSingleResponse<T> {
  object: T;
}