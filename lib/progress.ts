// Types for progress tracking
export interface LessonProgress {
  lessonId: string
  courseId: string
  completed: boolean
  completedAt?: string
  lastAccessedAt: string
}

export interface CourseProgress {
  courseId: string
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  totalLessons: number
  completedLessons: number
  lastAccessedAt: string
  startedAt: string
  completedAt?: string
}

const STORAGE_KEY = 'learnhub_progress'

// Get all progress data from localStorage
export function getProgressData(): { lessons: LessonProgress[]; courses: CourseProgress[] } {
  if (typeof window === 'undefined') {
    return { lessons: [], courses: [] }
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to parse progress data:', error)
  }
  
  return { lessons: [], courses: [] }
}

// Save progress data to localStorage
function saveProgressData(data: { lessons: LessonProgress[]; courses: CourseProgress[] }): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save progress data:', error)
  }
}

// Mark a lesson as complete
export function markLessonComplete(
  lessonId: string,
  courseId: string,
  courseSlug: string,
  courseTitle: string,
  courseThumbnail: string | undefined,
  totalLessons: number
): { isNewCourseCompletion: boolean } {
  const data = getProgressData()
  const now = new Date().toISOString()
  
  // Update or add lesson progress
  const existingLessonIndex = data.lessons.findIndex(l => l.lessonId === lessonId)
  if (existingLessonIndex >= 0) {
    data.lessons[existingLessonIndex] = {
      ...data.lessons[existingLessonIndex],
      completed: true,
      completedAt: now,
      lastAccessedAt: now,
    }
  } else {
    data.lessons.push({
      lessonId,
      courseId,
      completed: true,
      completedAt: now,
      lastAccessedAt: now,
    })
  }
  
  // Calculate completed lessons for this course
  const completedLessonsCount = data.lessons.filter(
    l => l.courseId === courseId && l.completed
  ).length
  
  // Update or add course progress
  const existingCourseIndex = data.courses.findIndex(c => c.courseId === courseId)
  const wasAlreadyComplete = existingCourseIndex >= 0 && 
    data.courses[existingCourseIndex].completedLessons >= totalLessons
  
  if (existingCourseIndex >= 0) {
    data.courses[existingCourseIndex] = {
      ...data.courses[existingCourseIndex],
      completedLessons: completedLessonsCount,
      lastAccessedAt: now,
      completedAt: completedLessonsCount >= totalLessons ? now : undefined,
    }
  } else {
    data.courses.push({
      courseId,
      courseSlug,
      courseTitle,
      courseThumbnail,
      totalLessons,
      completedLessons: completedLessonsCount,
      lastAccessedAt: now,
      startedAt: now,
      completedAt: completedLessonsCount >= totalLessons ? now : undefined,
    })
  }
  
  saveProgressData(data)
  
  // Return whether this completion just finished the course
  const isNewCourseCompletion = !wasAlreadyComplete && completedLessonsCount >= totalLessons
  return { isNewCourseCompletion }
}

// Mark a lesson as incomplete
export function markLessonIncomplete(lessonId: string, courseId: string, totalLessons: number): void {
  const data = getProgressData()
  const now = new Date().toISOString()
  
  // Update lesson progress
  const existingLessonIndex = data.lessons.findIndex(l => l.lessonId === lessonId)
  if (existingLessonIndex >= 0) {
    data.lessons[existingLessonIndex] = {
      ...data.lessons[existingLessonIndex],
      completed: false,
      completedAt: undefined,
      lastAccessedAt: now,
    }
  }
  
  // Recalculate course progress
  const completedLessonsCount = data.lessons.filter(
    l => l.courseId === courseId && l.completed
  ).length
  
  const existingCourseIndex = data.courses.findIndex(c => c.courseId === courseId)
  if (existingCourseIndex >= 0) {
    data.courses[existingCourseIndex] = {
      ...data.courses[existingCourseIndex],
      completedLessons: completedLessonsCount,
      lastAccessedAt: now,
      completedAt: undefined, // Course is no longer complete
    }
  }
  
  saveProgressData(data)
}

// Check if a lesson is complete
export function isLessonComplete(lessonId: string): boolean {
  const data = getProgressData()
  const lesson = data.lessons.find(l => l.lessonId === lessonId)
  return lesson?.completed ?? false
}

// Get progress for a specific course
export function getCourseProgress(courseId: string): CourseProgress | null {
  const data = getProgressData()
  return data.courses.find(c => c.courseId === courseId) ?? null
}

// Get all in-progress courses (started but not completed)
export function getInProgressCourses(): CourseProgress[] {
  const data = getProgressData()
  return data.courses
    .filter(c => c.completedLessons > 0 && c.completedLessons < c.totalLessons)
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
}

// Get all completed courses
export function getCompletedCourses(): CourseProgress[] {
  const data = getProgressData()
  return data.courses
    .filter(c => c.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
}

// Get overall learning stats
export function getLearningStats(): {
  totalCoursesStarted: number
  totalCoursesCompleted: number
  totalLessonsCompleted: number
} {
  const data = getProgressData()
  return {
    totalCoursesStarted: data.courses.length,
    totalCoursesCompleted: data.courses.filter(c => c.completedAt).length,
    totalLessonsCompleted: data.lessons.filter(l => l.completed).length,
  }
}

// Record that a lesson was accessed (for "continue where you left off")
export function recordLessonAccess(
  lessonId: string,
  courseId: string,
  courseSlug: string,
  courseTitle: string,
  courseThumbnail: string | undefined,
  totalLessons: number
): void {
  const data = getProgressData()
  const now = new Date().toISOString()
  
  // Update lesson access time
  const existingLessonIndex = data.lessons.findIndex(l => l.lessonId === lessonId)
  if (existingLessonIndex >= 0) {
    data.lessons[existingLessonIndex].lastAccessedAt = now
  } else {
    data.lessons.push({
      lessonId,
      courseId,
      completed: false,
      lastAccessedAt: now,
    })
  }
  
  // Update or create course progress
  const existingCourseIndex = data.courses.findIndex(c => c.courseId === courseId)
  const completedLessonsCount = data.lessons.filter(
    l => l.courseId === courseId && l.completed
  ).length
  
  if (existingCourseIndex >= 0) {
    data.courses[existingCourseIndex].lastAccessedAt = now
  } else {
    data.courses.push({
      courseId,
      courseSlug,
      courseTitle,
      courseThumbnail,
      totalLessons,
      completedLessons: completedLessonsCount,
      lastAccessedAt: now,
      startedAt: now,
    })
  }
  
  saveProgressData(data)
}