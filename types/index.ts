export interface Course {
  id: string
  slug: string
  title: string
  metadata?: {
    title?: string
    tagline?: string
    description?: string
    thumbnail?: {
      url: string
      imgix_url: string
    }
    preview_video_url?: string
    difficulty?: {
      key: string
      value: string
    }
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
    resources?: {
      url: string
      imgix_url: string
    }[]
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

export interface Instructor {
  id: string
  slug: string
  title: string
  metadata?: {
    name?: string
    bio?: string
    photo?: {
      url: string
      imgix_url: string
    }
    credentials?: string
  }
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}