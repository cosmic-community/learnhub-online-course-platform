// Progress tracking utilities with local storage persistence

export interface LessonProgress {
  lessonId: string
  courseSlug: string
  completed: boolean
  completedAt?: string
  timeSpentMinutes?: number
}

export interface UserProgress {
  lessonProgress: Record<string, LessonProgress>
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
  achievements: string[]
}

const STORAGE_KEY = 'learnhub_progress'

// Get initial empty progress state
function getEmptyProgress(): UserProgress {
  return {
    lessonProgress: {},
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    totalLessonsCompleted: 0,
    achievements: [],
  }
}

// Load progress from local storage
export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return getEmptyProgress()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getEmptyProgress()
    
    const progress = JSON.parse(stored) as UserProgress
    return updateStreak(progress)
  } catch {
    return getEmptyProgress()
  }
}

// Save progress to local storage
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    console.error('Failed to save progress')
  }
}

// Calculate if date is today
function isToday(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

// Calculate if date is yesterday
function isYesterday(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  )
}

// Update streak based on last active date
function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0]
  
  // Already active today, no change needed
  if (isToday(progress.lastActiveDate)) {
    return progress
  }
  
  // Was active yesterday, streak continues but needs today's activity
  if (isYesterday(progress.lastActiveDate)) {
    return progress
  }
  
  // Streak broken - more than 1 day gap
  if (progress.lastActiveDate && !isToday(progress.lastActiveDate) && !isYesterday(progress.lastActiveDate)) {
    return {
      ...progress,
      currentStreak: 0,
    }
  }
  
  return progress
}

// Mark a lesson as completed
export function markLessonComplete(
  progress: UserProgress,
  lessonId: string,
  courseSlug: string
): UserProgress {
  const today = new Date().toISOString()
  const todayDate = today.split('T')[0]
  
  const wasAlreadyComplete = progress.lessonProgress[lessonId]?.completed
  
  const lessonProgress: LessonProgress = {
    lessonId,
    courseSlug,
    completed: true,
    completedAt: today,
  }
  
  let newStreak = progress.currentStreak
  let newLongestStreak = progress.longestStreak
  
  // Update streak if this is first activity today
  if (!isToday(progress.lastActiveDate)) {
    if (isYesterday(progress.lastActiveDate) || progress.currentStreak === 0) {
      newStreak = progress.currentStreak + 1
    } else {
      newStreak = 1
    }
    newLongestStreak = Math.max(newLongestStreak, newStreak)
  }
  
  const newTotalCompleted = wasAlreadyComplete 
    ? progress.totalLessonsCompleted 
    : progress.totalLessonsCompleted + 1
  
  // Check for new achievements
  const newAchievements = [...progress.achievements]
  
  if (newTotalCompleted === 1 && !newAchievements.includes('first_lesson')) {
    newAchievements.push('first_lesson')
  }
  if (newTotalCompleted === 5 && !newAchievements.includes('five_lessons')) {
    newAchievements.push('five_lessons')
  }
  if (newTotalCompleted === 10 && !newAchievements.includes('ten_lessons')) {
    newAchievements.push('ten_lessons')
  }
  if (newTotalCompleted === 25 && !newAchievements.includes('twentyfive_lessons')) {
    newAchievements.push('twentyfive_lessons')
  }
  if (newStreak === 3 && !newAchievements.includes('three_day_streak')) {
    newAchievements.push('three_day_streak')
  }
  if (newStreak === 7 && !newAchievements.includes('week_streak')) {
    newAchievements.push('week_streak')
  }
  if (newStreak === 30 && !newAchievements.includes('month_streak')) {
    newAchievements.push('month_streak')
  }
  
  return {
    ...progress,
    lessonProgress: {
      ...progress.lessonProgress,
      [lessonId]: lessonProgress,
    },
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    lastActiveDate: todayDate,
    totalLessonsCompleted: newTotalCompleted,
    achievements: newAchievements,
  }
}

// Mark lesson as incomplete
export function markLessonIncomplete(
  progress: UserProgress,
  lessonId: string
): UserProgress {
  const wasComplete = progress.lessonProgress[lessonId]?.completed
  
  const updatedLessonProgress = { ...progress.lessonProgress }
  if (updatedLessonProgress[lessonId]) {
    updatedLessonProgress[lessonId] = {
      ...updatedLessonProgress[lessonId],
      completed: false,
      completedAt: undefined,
    }
  }
  
  return {
    ...progress,
    lessonProgress: updatedLessonProgress,
    totalLessonsCompleted: wasComplete 
      ? Math.max(0, progress.totalLessonsCompleted - 1)
      : progress.totalLessonsCompleted,
  }
}

// Get progress for a specific course
export function getCourseProgress(
  progress: UserProgress,
  courseSlug: string,
  lessonIds: string[]
): { completed: number; total: number; percentage: number } {
  const completed = lessonIds.filter(
    id => progress.lessonProgress[id]?.completed && 
         progress.lessonProgress[id]?.courseSlug === courseSlug
  ).length
  
  const total = lessonIds.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}

// Achievement definitions
export const ACHIEVEMENTS = {
  first_lesson: {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
  },
  five_lessons: {
    id: 'five_lessons',
    title: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '⭐',
  },
  ten_lessons: {
    id: 'ten_lessons',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '🌟',
  },
  twentyfive_lessons: {
    id: 'twentyfive_lessons',
    title: 'Knowledge Seeker',
    description: 'Complete 25 lessons',
    icon: '🏆',
  },
  three_day_streak: {
    id: 'three_day_streak',
    title: 'Consistent',
    description: 'Learn 3 days in a row',
    icon: '🔥',
  },
  week_streak: {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Learn 7 days in a row',
    icon: '💪',
  },
  month_streak: {
    id: 'month_streak',
    title: 'Monthly Master',
    description: 'Learn 30 days in a row',
    icon: '👑',
  },
} as const