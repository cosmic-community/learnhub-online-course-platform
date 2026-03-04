// Types for progress tracking
export interface LessonProgress {
  lessonId: string
  lessonSlug: string
  courseSlug: string
  completedAt: string
}

export interface CourseProgress {
  courseSlug: string
  courseName: string
  totalLessons: number
  completedLessons: string[]
  lastAccessedAt: string
  lastLessonSlug?: string
}

const PROGRESS_KEY = 'learnhub_progress'

// Get all progress data
export function getAllProgress(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {}
  
  try {
    const data = localStorage.getItem(PROGRESS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// Save progress data
function saveProgress(progress: Record<string, CourseProgress>): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

// Mark a lesson as complete
export function markLessonComplete(
  courseSlug: string,
  courseName: string,
  lessonSlug: string,
  totalLessons: number
): CourseProgress {
  const progress = getAllProgress()
  
  const courseProgress = progress[courseSlug] || {
    courseSlug,
    courseName,
    totalLessons,
    completedLessons: [],
    lastAccessedAt: new Date().toISOString(),
  }
  
  // Add lesson if not already completed
  if (!courseProgress.completedLessons.includes(lessonSlug)) {
    courseProgress.completedLessons.push(lessonSlug)
  }
  
  courseProgress.lastAccessedAt = new Date().toISOString()
  courseProgress.lastLessonSlug = lessonSlug
  courseProgress.totalLessons = totalLessons
  
  progress[courseSlug] = courseProgress
  saveProgress(progress)
  
  return courseProgress
}

// Mark a lesson as incomplete
export function markLessonIncomplete(
  courseSlug: string,
  lessonSlug: string
): void {
  const progress = getAllProgress()
  
  if (progress[courseSlug]) {
    progress[courseSlug].completedLessons = progress[courseSlug].completedLessons.filter(
      (slug) => slug !== lessonSlug
    )
    progress[courseSlug].lastAccessedAt = new Date().toISOString()
    saveProgress(progress)
  }
}

// Update last accessed lesson
export function updateLastAccessed(
  courseSlug: string,
  courseName: string,
  lessonSlug: string,
  totalLessons: number
): void {
  const progress = getAllProgress()
  
  const courseProgress = progress[courseSlug] || {
    courseSlug,
    courseName,
    totalLessons,
    completedLessons: [],
    lastAccessedAt: new Date().toISOString(),
  }
  
  courseProgress.lastAccessedAt = new Date().toISOString()
  courseProgress.lastLessonSlug = lessonSlug
  courseProgress.totalLessons = totalLessons
  
  progress[courseSlug] = courseProgress
  saveProgress(progress)
}

// Get progress for a specific course
export function getCourseProgress(courseSlug: string): CourseProgress | null {
  const progress = getAllProgress()
  return progress[courseSlug] || null
}

// Check if a lesson is completed
export function isLessonCompleted(courseSlug: string, lessonSlug: string): boolean {
  const progress = getCourseProgress(courseSlug)
  return progress?.completedLessons.includes(lessonSlug) ?? false
}

// Get courses in progress (sorted by last accessed)
export function getCoursesInProgress(): CourseProgress[] {
  const progress = getAllProgress()
  
  return Object.values(progress)
    .filter((course) => course.completedLessons.length > 0)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
}

// Calculate completion percentage
export function getCompletionPercentage(courseProgress: CourseProgress): number {
  if (courseProgress.totalLessons === 0) return 0
  return Math.round((courseProgress.completedLessons.length / courseProgress.totalLessons) * 100)
}

// Clear all progress (for testing)
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PROGRESS_KEY)
}