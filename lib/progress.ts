export interface CourseProgress {
  courseSlug: string
  completedLessons: string[]
  lastAccessedAt: string
  startedAt: string
}

export interface ProgressStore {
  courses: Record<string, CourseProgress>
}

const STORAGE_KEY = 'learnhub_progress'

// Get all progress data
export function getProgressStore(): ProgressStore {
  if (typeof window === 'undefined') {
    return { courses: {} }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load progress:', error)
  }
  
  return { courses: {} }
}

// Save progress store
function saveProgressStore(store: ProgressStore): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

// Get progress for a specific course
export function getCourseProgress(courseSlug: string): CourseProgress | null {
  const store = getProgressStore()
  return store.courses[courseSlug] || null
}

// Mark a lesson as complete
export function markLessonComplete(courseSlug: string, lessonSlug: string): CourseProgress {
  const store = getProgressStore()
  const now = new Date().toISOString()
  
  if (!store.courses[courseSlug]) {
    store.courses[courseSlug] = {
      courseSlug,
      completedLessons: [],
      lastAccessedAt: now,
      startedAt: now,
    }
  }
  
  const progress = store.courses[courseSlug]
  
  if (!progress.completedLessons.includes(lessonSlug)) {
    progress.completedLessons.push(lessonSlug)
  }
  
  progress.lastAccessedAt = now
  saveProgressStore(store)
  
  return progress
}

// Mark a lesson as incomplete
export function markLessonIncomplete(courseSlug: string, lessonSlug: string): CourseProgress | null {
  const store = getProgressStore()
  
  if (!store.courses[courseSlug]) {
    return null
  }
  
  const progress = store.courses[courseSlug]
  progress.completedLessons = progress.completedLessons.filter(slug => slug !== lessonSlug)
  progress.lastAccessedAt = new Date().toISOString()
  
  saveProgressStore(store)
  return progress
}

// Calculate progress percentage
export function calculateProgressPercentage(completedLessons: number, totalLessons: number): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

// Get all courses in progress (sorted by last accessed)
export function getCoursesInProgress(): CourseProgress[] {
  const store = getProgressStore()
  return Object.values(store.courses)
    .filter(p => p.completedLessons.length > 0)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
}

// Check if a lesson is complete
export function isLessonComplete(courseSlug: string, lessonSlug: string): boolean {
  const progress = getCourseProgress(courseSlug)
  return progress?.completedLessons.includes(lessonSlug) ?? false
}