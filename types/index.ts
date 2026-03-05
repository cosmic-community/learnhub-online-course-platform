export interface CosmicFile {
  url: string
  imgix_url: string
}

export interface CosmicObject {
  id: string
  slug: string
  title: string
  type: string
  status: string
  created_at: string
  modified_at: string
  published_at: string
  thumbnail?: string
  metadata: Record<string, unknown>
}

export interface DifficultyOption {
  key: string
  value: string
}

export interface Course extends CosmicObject {
  metadata: {
    title?: string
    tagline?: string
    description?: string
    thumbnail?: CosmicFile
    preview_video_url?: string
    difficulty?: DifficultyOption | string
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

export interface Lesson extends CosmicObject {
  metadata: {
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

export interface Category extends CosmicObject {
  metadata: {
    name?: string
    description?: string
    icon?: string
  }
}

export interface Instructor extends CosmicObject {
  metadata: {
    name?: string
    bio?: string
    photo?: CosmicFile
    credentials?: string
  }
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

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

// Learning Streak Types
export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalLessonsCompleted: number
  todayLessonsCompleted: number
  dailyGoal: number
}

export interface Achievement {
  id: string
  emoji: string
  title: string
  description: string
  unlocked: boolean
  unlockedAt?: string
}

export interface LearningProgress {
  courseSlug: string
  lessonSlug: string
  courseName: string
  lessonName: string
  timestamp: number
  completed: boolean
}