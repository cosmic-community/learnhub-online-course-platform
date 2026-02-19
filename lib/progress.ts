// Types for learning progress
export interface LessonProgress {
  lessonSlug: string;
  courseSlug: string;
  completedAt: string;
  timeSpentMinutes: number;
}

export interface CourseProgress {
  courseSlug: string;
  startedAt: string;
  lastAccessedAt: string;
  completedLessons: string[];
  totalLessons: number;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastLearningDate: string;
  totalDaysLearned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProgress {
  courses: Record<string, CourseProgress>;
  completedLessons: LessonProgress[];
  streak: LearningStreak;
  achievements: Achievement[];
  totalTimeSpentMinutes: number;
}

const STORAGE_KEY = 'learnhub_progress';

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { id: 'five_lessons', title: 'Getting Started', description: 'Complete 5 lessons', icon: '⭐' },
  { id: 'ten_lessons', title: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '🌟' },
  { id: 'first_course', title: 'Course Champion', description: 'Complete your first course', icon: '🏆' },
  { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day learning streak', icon: '🔥' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: '💪' },
  { id: 'streak_30', title: 'Monthly Master', description: 'Maintain a 30-day learning streak', icon: '👑' },
  { id: 'hour_spent', title: 'Time Invested', description: 'Spend 1 hour learning', icon: '⏰' },
  { id: 'five_hours', title: 'Committed', description: 'Spend 5 hours learning', icon: '📚' },
];

// Get default progress object
function getDefaultProgress(): UserProgress {
  return {
    courses: {},
    completedLessons: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastLearningDate: '',
      totalDaysLearned: 0,
    },
    achievements: [],
    totalTimeSpentMinutes: 0,
  };
}

// Load progress from localStorage
export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserProgress;
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  
  return getDefaultProgress();
}

// Save progress to localStorage
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

// Check if a lesson is completed
export function isLessonCompleted(courseSlug: string, lessonSlug: string): boolean {
  const progress = loadProgress();
  const courseProgress = progress.courses[courseSlug];
  return courseProgress?.completedLessons.includes(lessonSlug) ?? false;
}

// Get course progress percentage
export function getCourseProgressPercent(courseSlug: string, totalLessons: number): number {
  const progress = loadProgress();
  const courseProgress = progress.courses[courseSlug];
  if (!courseProgress || totalLessons === 0) return 0;
  return Math.round((courseProgress.completedLessons.length / totalLessons) * 100);
}

// Update streak based on today's date
function updateStreak(streak: LearningStreak): LearningStreak {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (streak.lastLearningDate === today) {
    // Already learned today, no change
    return streak;
  }
  
  if (streak.lastLearningDate === yesterday) {
    // Continuing the streak
    return {
      ...streak,
      currentStreak: streak.currentStreak + 1,
      longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
      lastLearningDate: today,
      totalDaysLearned: streak.totalDaysLearned + 1,
    };
  }
  
  // Streak broken, start new
  return {
    ...streak,
    currentStreak: 1,
    lastLearningDate: today,
    totalDaysLearned: streak.totalDaysLearned + 1,
  };
}

// Check and unlock achievements
function checkAchievements(progress: UserProgress): Achievement[] {
  const newAchievements: Achievement[] = [];
  const unlockedIds = new Set(progress.achievements.map(a => a.id));
  const now = new Date().toISOString();
  
  const totalLessons = progress.completedLessons.length;
  const completedCourses = Object.values(progress.courses).filter(
    c => c.completedLessons.length === c.totalLessons && c.totalLessons > 0
  ).length;
  
  // Lesson milestones
  if (totalLessons >= 1 && !unlockedIds.has('first_lesson')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'first_lesson');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  if (totalLessons >= 5 && !unlockedIds.has('five_lessons')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'five_lessons');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  if (totalLessons >= 10 && !unlockedIds.has('ten_lessons')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'ten_lessons');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  
  // Course completion
  if (completedCourses >= 1 && !unlockedIds.has('first_course')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'first_course');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  
  // Streak achievements
  if (progress.streak.currentStreak >= 3 && !unlockedIds.has('streak_3')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'streak_3');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  if (progress.streak.currentStreak >= 7 && !unlockedIds.has('streak_7')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'streak_7');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  if (progress.streak.currentStreak >= 30 && !unlockedIds.has('streak_30')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'streak_30');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  
  // Time achievements
  if (progress.totalTimeSpentMinutes >= 60 && !unlockedIds.has('hour_spent')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'hour_spent');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  if (progress.totalTimeSpentMinutes >= 300 && !unlockedIds.has('five_hours')) {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'five_hours');
    if (achievement) newAchievements.push({ ...achievement, unlockedAt: now });
  }
  
  return newAchievements;
}

// Mark a lesson as complete
export function completeLesson(
  courseSlug: string,
  lessonSlug: string,
  totalLessonsInCourse: number,
  timeSpentMinutes: number = 10
): { progress: UserProgress; newAchievements: Achievement[] } {
  const progress = loadProgress();
  const now = new Date().toISOString();
  
  // Initialize course progress if needed
  if (!progress.courses[courseSlug]) {
    progress.courses[courseSlug] = {
      courseSlug,
      startedAt: now,
      lastAccessedAt: now,
      completedLessons: [],
      totalLessons: totalLessonsInCourse,
    };
  }
  
  const courseProgress = progress.courses[courseSlug];
  
  // Add lesson if not already completed
  if (!courseProgress.completedLessons.includes(lessonSlug)) {
    courseProgress.completedLessons.push(lessonSlug);
    progress.completedLessons.push({
      lessonSlug,
      courseSlug,
      completedAt: now,
      timeSpentMinutes,
    });
    progress.totalTimeSpentMinutes += timeSpentMinutes;
  }
  
  courseProgress.lastAccessedAt = now;
  courseProgress.totalLessons = totalLessonsInCourse;
  
  // Update streak
  progress.streak = updateStreak(progress.streak);
  
  // Check for new achievements
  const newAchievements = checkAchievements(progress);
  progress.achievements = [...progress.achievements, ...newAchievements];
  
  // Save and return
  saveProgress(progress);
  
  return { progress, newAchievements };
}

// Get the last accessed course for "Continue Learning"
export function getLastAccessedCourse(): { courseSlug: string; lessonSlug?: string } | null {
  const progress = loadProgress();
  
  let lastCourse: CourseProgress | null = null;
  let lastTime = 0;
  
  for (const course of Object.values(progress.courses)) {
    const accessTime = new Date(course.lastAccessedAt).getTime();
    if (accessTime > lastTime) {
      lastTime = accessTime;
      lastCourse = course;
    }
  }
  
  if (!lastCourse) return null;
  
  // Find the next incomplete lesson
  const completedCount = lastCourse.completedLessons.length;
  
  return {
    courseSlug: lastCourse.courseSlug,
  };
}

// Get user stats summary
export function getUserStats(): {
  totalLessons: number;
  totalCourses: number;
  completedCourses: number;
  streak: number;
  totalMinutes: number;
  achievements: number;
} {
  const progress = loadProgress();
  
  const completedCourses = Object.values(progress.courses).filter(
    c => c.completedLessons.length === c.totalLessons && c.totalLessons > 0
  ).length;
  
  return {
    totalLessons: progress.completedLessons.length,
    totalCourses: Object.keys(progress.courses).length,
    completedCourses,
    streak: progress.streak.currentStreak,
    totalMinutes: progress.totalTimeSpentMinutes,
    achievements: progress.achievements.length,
  };
}