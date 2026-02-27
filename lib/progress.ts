// Types for learning progress tracking
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

export interface UserProgress {
  lessons: Record<string, LessonProgress>
  courses: Record<string, CourseProgress>
}

const STORAGE_KEY = 'learnhub_progress'

// Get all progress data from localStorage
export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return { lessons: {}, courses: {} }
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data) as UserProgress
    }
  } catch (error) {
    console.error('Failed to parse progress data:', error)
  }
  
  return { lessons: {}, courses: {} }
}

// Save progress data to localStorage
function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

// Mark a lesson as complete
export function markLessonComplete(
  lessonId: string,
  lessonSlug: string,
  courseId: string,
  courseSlug: string,
  courseTitle: string,
  totalLessons: number
): void {
  const progress = getProgress()
  const now = new Date().toISOString()
  
  // Update lesson progress
  progress.lessons[lessonId] = {
    lessonId,
    lessonSlug,
    courseId,
    courseSlug,
    completed: true,
    completedAt: now,
    lastAccessedAt: now,
  }
  
  // Update course progress
  const completedLessons = Object.values(progress.lessons).filter(
    (l) => l.courseId === courseId && l.completed
  ).length
  
  progress.courses[courseId] = {
    courseId,
    courseSlug,
    courseTitle,
    totalLessons,
    completedLessons,
    lastAccessedAt: now,
    startedAt: progress.courses[courseId]?.startedAt || now,
  }
  
  saveProgress(progress)
}

// Mark a lesson as incomplete
export function markLessonIncomplete(lessonId: string, courseId: string): void {
  const progress = getProgress()
  
  if (progress.lessons[lessonId]) {
    progress.lessons[lessonId].completed = false
    progress.lessons[lessonId].completedAt = undefined
  }
  
  // Update course completed count
  if (progress.courses[courseId]) {
    const completedLessons = Object.values(progress.lessons).filter(
      (l) => l.courseId === courseId && l.completed
    ).length
    progress.courses[courseId].completedLessons = completedLessons
  }
  
  saveProgress(progress)
}

// Track lesson access (for "continue learning" feature)
export function trackLessonAccess(
  lessonId: string,
  lessonSlug: string,
  courseId: string,
  courseSlug: string,
  courseTitle: string,
  totalLessons: number
): void {
  const progress = getProgress()
  const now = new Date().toISOString()
  
  // Update or create lesson entry
  progress.lessons[lessonId] = {
    ...progress.lessons[lessonId],
    lessonId,
    lessonSlug,
    courseId,
    courseSlug,
    completed: progress.lessons[lessonId]?.completed || false,
    lastAccessedAt: now,
  }
  
  // Update or create course entry
  const completedLessons = Object.values(progress.lessons).filter(
    (l) => l.courseId === courseId && l.completed
  ).length
  
  progress.courses[courseId] = {
    courseId,
    courseSlug,
    courseTitle,
    totalLessons,
    completedLessons,
    lastAccessedAt: now,
    startedAt: progress.courses[courseId]?.startedAt || now,
  }
  
  saveProgress(progress)
}

// Check if a lesson is complete
export function isLessonComplete(lessonId: string): boolean {
  const progress = getProgress()
  return progress.lessons[lessonId]?.completed || false
}

// Get course progress percentage
export function getCourseProgressPercent(courseId: string): number {
  const progress = getProgress()
  const course = progress.courses[courseId]
  
  if (!course || course.totalLessons === 0) {
    return 0
  }
  
  return Math.round((course.completedLessons / course.totalLessons) * 100)
}

// Get recently accessed courses (for "Continue Learning" section)
export function getRecentCourses(limit: number = 3): CourseProgress[] {
  const progress = getProgress()
  
  return Object.values(progress.courses)
    .filter((course) => course.completedLessons < course.totalLessons)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .slice(0, limit)
}

// Get completed courses
export function getCompletedCourses(): CourseProgress[] {
  const progress = getProgress()
  
  return Object.values(progress.courses)
    .filter((course) => course.completedLessons === course.totalLessons && course.totalLessons > 0)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
}

// Get total stats
export function getLearningStats(): {
  totalCoursesStarted: number
  totalCoursesCompleted: number
  totalLessonsCompleted: number
} {
  const progress = getProgress()
  
  const courses = Object.values(progress.courses)
  const lessons = Object.values(progress.lessons)
  
  return {
    totalCoursesStarted: courses.length,
    totalCoursesCompleted: courses.filter(
      (c) => c.completedLessons === c.totalLessons && c.totalLessons > 0
    ).length,
    totalLessonsCompleted: lessons.filter((l) => l.completed).length,
  }
}