export interface CosmicMedia {
  url: string
  imgix_url: string
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
    difficulty?: { key: string; value: string } | string
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

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Learning Progress Types
export interface LessonProgress {
  lessonId: string
  lessonSlug: string
  lessonTitle: string
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  progress: number // 0-100
  lastAccessedAt: string
  completed: boolean
}

export interface CourseProgress {
  courseId: string
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  lessonsCompleted: number
  totalLessons: number
  lastLessonSlug?: string
  lastLessonTitle?: string
  lastAccessedAt: string
  overallProgress: number // 0-100
}

export interface LearningProgress {
  courses: Record<string, CourseProgress>
  lessons: Record<string, LessonProgress>
  totalTimeSpentMinutes: number
  lastUpdated: string
}