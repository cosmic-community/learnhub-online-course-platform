export interface CosmicObject {
  id: string
  slug: string
  title: string
  metadata?: Record<string, unknown>
}

export interface CosmicFile {
  url: string
  imgix_url: string
}

export interface Category extends CosmicObject {
  metadata?: {
    name?: string
    description?: string
    icon?: string
  }
}

export interface Instructor extends CosmicObject {
  metadata?: {
    name?: string
    bio?: string
    photo?: CosmicFile
    credentials?: string
  }
}

export interface Lesson extends CosmicObject {
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

export interface Course extends CosmicObject {
  metadata?: {
    title?: string
    tagline?: string
    description?: string
    thumbnail?: CosmicFile
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

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Progress tracking types (re-exported from lib/progress for convenience)
export interface LessonProgress {
  lessonId: string
  lessonSlug: string
  courseId: string
  courseSlug: string
  completed: boolean
  completedAt?: string
  lastAccessedAt: string
}

export interface CourseProgress {
  courseId: string
  courseSlug: string
  courseTitle: string
  totalLessons: number
  completedLessons: number
  lastAccessedAt: string
  startedAt: string
}