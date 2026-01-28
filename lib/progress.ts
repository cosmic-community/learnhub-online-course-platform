// Types for progress tracking
export interface LessonProgress {
  lessonSlug: string
  courseSlug: string
  completed: boolean
  completedAt?: string
  lastAccessedAt: string
}

export interface CourseProgress {
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  lessonsCompleted: number
  totalLessons: number
  lastLessonSlug?: string
  lastLessonTitle?: string
  lastAccessedAt: string
  startedAt: string
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>
  courses: Record<string, CourseProgress>
}

const STORAGE_KEY = 'learnhub_progress'

// Get all progress from localStorage
export function getProgressState(): ProgressState {
  if (typeof window === 'undefined') {
    return { lessons: {}, courses: {} }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load progress:', error)
  }
  
  return { lessons: {}, courses: {} }
}

// Save progress to localStorage
function saveProgressState(state: ProgressState): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

// Mark a lesson as accessed/started
export function markLessonAccessed(
  courseSlug: string,
  courseTitle: string,
  lessonSlug: string,
  lessonTitle: string,
  totalLessons: number,
  courseThumbnail?: string
): void {
  const state = getProgressState()
  const lessonKey = `${courseSlug}:${lessonSlug}`
  const now = new Date().toISOString()
  
  // Update lesson progress
  if (!state.lessons[lessonKey]) {
    state.lessons[lessonKey] = {
      lessonSlug,
      courseSlug,
      completed: false,
      lastAccessedAt: now,
    }
  } else {
    state.lessons[lessonKey].lastAccessedAt = now
  }
  
  // Update course progress
  if (!state.courses[courseSlug]) {
    state.courses[courseSlug] = {
      courseSlug,
      courseTitle,
      courseThumbnail,
      lessonsCompleted: 0,
      totalLessons,
      lastLessonSlug: lessonSlug,
      lastLessonTitle: lessonTitle,
      lastAccessedAt: now,
      startedAt: now,
    }
  } else {
    state.courses[courseSlug].lastLessonSlug = lessonSlug
    state.courses[courseSlug].lastLessonTitle = lessonTitle
    state.courses[courseSlug].lastAccessedAt = now
    state.courses[courseSlug].totalLessons = totalLessons
    if (courseThumbnail) {
      state.courses[courseSlug].courseThumbnail = courseThumbnail
    }
  }
  
  saveProgressState(state)
}

// Mark a lesson as completed
export function markLessonCompleted(courseSlug: string, lessonSlug: string): boolean {
  const state = getProgressState()
  const lessonKey = `${courseSlug}:${lessonSlug}`
  const now = new Date().toISOString()
  
  // Check if already completed
  const wasAlreadyCompleted = state.lessons[lessonKey]?.completed
  
  // Update lesson
  if (!state.lessons[lessonKey]) {
    state.lessons[lessonKey] = {
      lessonSlug,
      courseSlug,
      completed: true,
      completedAt: now,
      lastAccessedAt: now,
    }
  } else {
    state.lessons[lessonKey].completed = true
    state.lessons[lessonKey].completedAt = now
  }
  
  // Update course completion count
  if (state.courses[courseSlug]) {
    const completedLessons = Object.values(state.lessons).filter(
      (l) => l.courseSlug === courseSlug && l.completed
    ).length
    state.courses[courseSlug].lessonsCompleted = completedLessons
  }
  
  saveProgressState(state)
  
  // Return true if this was a NEW completion (for confetti trigger)
  return !wasAlreadyCompleted
}

// Get course progress
export function getCourseProgress(courseSlug: string): CourseProgress | null {
  const state = getProgressState()
  return state.courses[courseSlug] || null
}

// Get lesson completion status
export function isLessonCompleted(courseSlug: string, lessonSlug: string): boolean {
  const state = getProgressState()
  const lessonKey = `${courseSlug}:${lessonSlug}`
  return state.lessons[lessonKey]?.completed || false
}

// Get recently accessed courses (for "Continue Learning")
export function getRecentCourses(limit: number = 3): CourseProgress[] {
  const state = getProgressState()
  
  return Object.values(state.courses)
    .filter((c) => c.lessonsCompleted < c.totalLessons) // Only incomplete courses
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .slice(0, limit)
}

// Calculate progress percentage
export function getProgressPercentage(courseSlug: string): number {
  const progress = getCourseProgress(courseSlug)
  if (!progress || progress.totalLessons === 0) return 0
  return Math.round((progress.lessonsCompleted / progress.totalLessons) * 100)
}

// Clear all progress (for testing/reset)
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}