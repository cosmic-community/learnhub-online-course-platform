import type { LearningProgress, CourseProgress, LessonProgress } from '@/types'

const STORAGE_KEY = 'learnhub_progress'

// Initialize empty progress
function getEmptyProgress(): LearningProgress {
  return {
    courses: {},
    lessons: {},
    totalTimeSpentMinutes: 0,
    lastUpdated: new Date().toISOString()
  }
}

// Get progress from localStorage
export function getProgress(): LearningProgress {
  if (typeof window === 'undefined') {
    return getEmptyProgress()
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getEmptyProgress()
    }
    return JSON.parse(stored) as LearningProgress
  } catch {
    return getEmptyProgress()
  }
}

// Save progress to localStorage
export function saveProgress(progress: LearningProgress): void {
  if (typeof window === 'undefined') return
  
  try {
    progress.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

// Update lesson progress
export function updateLessonProgress(
  lessonId: string,
  lessonSlug: string,
  lessonTitle: string,
  courseSlug: string,
  courseTitle: string,
  courseThumbnail: string | undefined,
  scrollProgress: number,
  totalLessonsInCourse: number
): void {
  const progress = getProgress()
  
  const existingLesson = progress.lessons[lessonId]
  const isCompleted = scrollProgress >= 90
  const wasCompleted = existingLesson?.completed ?? false
  
  // Update lesson
  progress.lessons[lessonId] = {
    lessonId,
    lessonSlug,
    lessonTitle,
    courseSlug,
    courseTitle,
    courseThumbnail,
    progress: Math.max(existingLesson?.progress ?? 0, scrollProgress),
    lastAccessedAt: new Date().toISOString(),
    completed: isCompleted || wasCompleted
  }
  
  // Update course progress
  const courseKey = courseSlug
  const existingCourse = progress.courses[courseKey]
  
  // Count completed lessons for this course
  const completedLessonsCount = Object.values(progress.lessons)
    .filter(l => l.courseSlug === courseSlug && l.completed)
    .length
  
  progress.courses[courseKey] = {
    courseId: existingCourse?.courseId ?? courseSlug,
    courseSlug,
    courseTitle,
    courseThumbnail,
    lessonsCompleted: completedLessonsCount,
    totalLessons: Math.max(existingCourse?.totalLessons ?? 0, totalLessonsInCourse),
    lastLessonSlug: lessonSlug,
    lastLessonTitle: lessonTitle,
    lastAccessedAt: new Date().toISOString(),
    overallProgress: totalLessonsInCourse > 0 
      ? Math.round((completedLessonsCount / totalLessonsInCourse) * 100)
      : 0
  }
  
  saveProgress(progress)
}

// Mark lesson as started (when they first visit)
export function markLessonStarted(
  lessonId: string,
  lessonSlug: string,
  lessonTitle: string,
  courseSlug: string,
  courseTitle: string,
  courseThumbnail: string | undefined,
  totalLessonsInCourse: number
): void {
  updateLessonProgress(
    lessonId,
    lessonSlug,
    lessonTitle,
    courseSlug,
    courseTitle,
    courseThumbnail,
    5, // Initial progress
    totalLessonsInCourse
  )
}

// Get recently accessed courses (sorted by last access)
export function getRecentCourses(limit: number = 3): CourseProgress[] {
  const progress = getProgress()
  
  return Object.values(progress.courses)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .slice(0, limit)
}

// Get total stats
export function getLearningStats(): {
  coursesStarted: number
  lessonsCompleted: number
  totalProgress: number
} {
  const progress = getProgress()
  
  const coursesStarted = Object.keys(progress.courses).length
  const lessonsCompleted = Object.values(progress.lessons).filter(l => l.completed).length
  
  const allCourses = Object.values(progress.courses)
  const totalProgress = allCourses.length > 0
    ? Math.round(allCourses.reduce((sum, c) => sum + c.overallProgress, 0) / allCourses.length)
    : 0
  
  return {
    coursesStarted,
    lessonsCompleted,
    totalProgress
  }
}

// Clear all progress
export function clearProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}