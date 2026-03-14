// Cosmic file type
export interface CosmicFile {
  url: string
  imgix_url: string
}

// Difficulty type for select-dropdown
export interface Difficulty {
  key: string
  value: string
}

// Instructor type
export interface Instructor {
  id: string
  slug: string
  title: string
  metadata?: {
    name?: string
    bio?: string
    photo?: CosmicFile
    credentials?: string
  }
}

// Category type
export interface Category {
  id: string
  slug: string
  title: string
  metadata?: {
    name?: string
    description?: string
    icon?: string
  }
}

// Lesson type
export interface Lesson {
  id: string
  slug: string
  title: string
  metadata?: {
    title?: string
    description?: string
    video_url?: string
    content?: string
    code_example?: string
    duration_minutes?: number
    resources?: CosmicFile[]
    order?: number
  }
}

// Course type
export interface Course {
  id: string
  slug: string
  title: string
  metadata?: {
    title?: string
    tagline?: string
    description?: string
    thumbnail?: CosmicFile
    preview_video_url?: string
    difficulty?: Difficulty
    price?: number
    is_free?: boolean
    estimated_hours?: number
    instructors?: Instructor[]
    categories?: Category[]
    lessons?: Lesson[]
    seo_title?: string
    seo_description?: string
  }
}

// Contact form data
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Contact form submission (what gets stored in Cosmic)
export interface ContactFormSubmission {
  id: string
  slug: string
  title: string
  metadata?: {
    name?: string
    email?: string
    subject?: string
    message?: string
    submitted_at?: string
    note?: string
  }
}