const STORAGE_KEY = 'learnhub_progress'

export interface CourseProgress {
  courseSlug: string
  completedLessons: string[]
  lastAccessed: string
  startedAt: string
}

export interface ProgressData {
  courses: Record<string, CourseProgress>
}

// Get all progress data
export function getProgressData(): ProgressData {
  if (typeof window === 'undefined') {
    return { courses: {} }
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return { courses: {} }
    return JSON.parse(data) as ProgressData
  } catch {
    return { courses: {} }
  }
}

// Save progress data
function saveProgressData(data: ProgressData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Get progress for a specific course
export function getCourseProgress(courseSlug: string): CourseProgress | null {
  const data = getProgressData()
  return data.courses[courseSlug] || null
}

// Mark a lesson as complete
export function markLessonComplete(courseSlug: string, lessonSlug: string): CourseProgress {
  const data = getProgressData()
  const now = new Date().toISOString()
  
  if (!data.courses[courseSlug]) {
    data.courses[courseSlug] = {
      courseSlug,
      completedLessons: [],
      lastAccessed: now,
      startedAt: now,
    }
  }
  
  const courseProgress = data.courses[courseSlug]
  
  if (!courseProgress.completedLessons.includes(lessonSlug)) {
    courseProgress.completedLessons.push(lessonSlug)
  }
  
  courseProgress.lastAccessed = now
  
  saveProgressData(data)
  return courseProgress
}

// Mark a lesson as incomplete
export function markLessonIncomplete(courseSlug: string, lessonSlug: string): CourseProgress | null {
  const data = getProgressData()
  
  if (!data.courses[courseSlug]) {
    return null
  }
  
  const courseProgress = data.courses[courseSlug]
  courseProgress.completedLessons = courseProgress.completedLessons.filter(
    (slug) => slug !== lessonSlug
  )
  courseProgress.lastAccessed = new Date().toISOString()
  
  saveProgressData(data)
  return courseProgress
}

// Calculate progress percentage
export function calculateProgressPercentage(
  completedLessons: string[],
  totalLessons: number
): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons.length / totalLessons) * 100)
}

// Get courses in progress (sorted by last accessed)
export function getCoursesInProgress(): CourseProgress[] {
  const data = getProgressData()
  return Object.values(data.courses)
    .filter((course) => course.completedLessons.length > 0)
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
}

// Clear progress for a course
export function clearCourseProgress(courseSlug: string): void {
  const data = getProgressData()
  delete data.courses[courseSlug]
  saveProgressData(data)
}