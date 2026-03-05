export interface CosmicFile {
  url: string
  imgix_url: string
}

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

export interface CourseDifficulty {
  key?: string
  value?: string
}

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
    difficulty?: CourseDifficulty | string
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

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

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