export interface LessonProgress {
  lessonId: string
  courseId: string
  completedAt: string
}

export interface CourseProgress {
  courseId: string
  courseSlug: string
  courseTitle: string
  startedAt: string
  completedLessons: string[]
  totalLessons: number
  completedAt?: string
}

const PROGRESS_KEY = 'learnhub_progress'

// Get all progress data
export function getProgressData(): Record<string, CourseProgress> {
  if (typeof window === 'undefined') return {}
  
  try {
    const data = localStorage.getItem(PROGRESS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// Save progress data
function saveProgressData(data: Record<string, CourseProgress>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
}

// Start a course
export function startCourse(courseId: string, courseSlug: string, courseTitle: string, totalLessons: number): CourseProgress {
  const data = getProgressData()
  
  if (!data[courseId]) {
    data[courseId] = {
      courseId,
      courseSlug,
      courseTitle,
      startedAt: new Date().toISOString(),
      completedLessons: [],
      totalLessons,
    }
    saveProgressData(data)
  }
  
  return data[courseId]
}

// Mark lesson as complete
export function completeLesson(courseId: string, lessonId: string): { 
  progress: CourseProgress
  isNewCompletion: boolean
  isCourseComplete: boolean 
} {
  const data = getProgressData()
  const course = data[courseId]
  
  if (!course) {
    return { 
      progress: { courseId, courseSlug: '', courseTitle: '', startedAt: '', completedLessons: [], totalLessons: 0 },
      isNewCompletion: false,
      isCourseComplete: false
    }
  }
  
  const isNewCompletion = !course.completedLessons.includes(lessonId)
  
  if (isNewCompletion) {
    course.completedLessons.push(lessonId)
    
    // Check if course is complete
    const isCourseComplete = course.completedLessons.length >= course.totalLessons
    if (isCourseComplete && !course.completedAt) {
      course.completedAt = new Date().toISOString()
    }
    
    saveProgressData(data)
    
    return { progress: course, isNewCompletion, isCourseComplete }
  }
  
  return { 
    progress: course, 
    isNewCompletion: false, 
    isCourseComplete: course.completedLessons.length >= course.totalLessons 
  }
}

// Unmark lesson as complete
export function uncompleteLesson(courseId: string, lessonId: string): CourseProgress | null {
  const data = getProgressData()
  const course = data[courseId]
  
  if (!course) return null
  
  course.completedLessons = course.completedLessons.filter(id => id !== lessonId)
  course.completedAt = undefined
  
  saveProgressData(data)
  return course
}

// Get course progress
export function getCourseProgress(courseId: string): CourseProgress | null {
  const data = getProgressData()
  return data[courseId] || null
}

// Check if lesson is complete
export function isLessonComplete(courseId: string, lessonId: string): boolean {
  const course = getCourseProgress(courseId)
  return course ? course.completedLessons.includes(lessonId) : false
}

// Get progress percentage
export function getProgressPercentage(courseId: string): number {
  const course = getCourseProgress(courseId)
  if (!course || course.totalLessons === 0) return 0
  return Math.round((course.completedLessons.length / course.totalLessons) * 100)
}

// Get all in-progress courses
export function getInProgressCourses(): CourseProgress[] {
  const data = getProgressData()
  return Object.values(data).filter(course => !course.completedAt)
}

// Get all completed courses
export function getCompletedCourses(): CourseProgress[] {
  const data = getProgressData()
  return Object.values(data).filter(course => course.completedAt)
}

// Get total stats
export function getStats(): {
  totalCoursesStarted: number
  totalCoursesCompleted: number
  totalLessonsCompleted: number
} {
  const data = getProgressData()
  const courses = Object.values(data)
  
  return {
    totalCoursesStarted: courses.length,
    totalCoursesCompleted: courses.filter(c => c.completedAt).length,
    totalLessonsCompleted: courses.reduce((sum, c) => sum + c.completedLessons.length, 0),
  }
}