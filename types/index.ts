export interface CosmicMedia {
  url: string
  imgix_url: string
}

export interface Instructor {
  id: string
  slug: string
  title: string
  metadata?: {
    name?: string
    bio?: string
    photo?: CosmicMedia
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
    resources?: CosmicMedia[]
    order?: number
  }
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

export interface DifficultyValue {
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
    thumbnail?: CosmicMedia
    preview_video_url?: string
    difficulty?: DifficultyValue
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