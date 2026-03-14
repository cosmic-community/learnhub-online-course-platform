// Base Cosmic object structure
export interface CosmicObject {
  id: string
  slug: string
  title: string
  metadata: Record<string, unknown>
}

// File/Media type from Cosmic
export interface CosmicFile {
  url: string
  imgix_url: string
}

// Instructor type
export interface Instructor extends CosmicObject {
  metadata: {
    name: string
    bio?: string
    photo?: CosmicFile
    credentials?: string
  }
}

// Category type
export interface Category extends CosmicObject {
  metadata: {
    name: string
    description?: string
    icon?: string
  }
}

// Lesson type
export interface Lesson extends CosmicObject {
  metadata: {
    title: string
    description?: string
    video_url?: string
    content?: string
    code_example?: string
    duration_minutes?: number
    resources?: CosmicFile[]
    order?: number
  }
}

// Difficulty value type
export interface DifficultyValue {
  key: string
  value: string
}

// Course type
export interface Course extends CosmicObject {
  metadata: {
    title: string
    tagline?: string
    description?: string
    thumbnail?: CosmicFile
    preview_video_url?: string
    difficulty: DifficultyValue | string
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

// Contact form data type
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Contact form submission type (as stored in Cosmic)
export interface ContactFormSubmission extends CosmicObject {
  metadata: {
    name: string
    email: string
    subject: string
    message: string
    submitted_at: string
    note?: string
  }
}