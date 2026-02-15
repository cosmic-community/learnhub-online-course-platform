'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  currentStreak: number
  longestStreak: number
  totalCoursesViewed: number
  totalLessonsCompleted: number
  lastVisit: string
  achievements: Achievement[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-visit',
    title: 'First Steps',
    description: 'Visited LearnHub for the first time',
    icon: '👋',
    unlocked: false,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Viewed 3 different courses',
    icon: '🔍',
    unlocked: false,
  },
  {
    id: 'dedicated',
    title: 'Dedicated Learner',
    description: 'Maintained a 3-day learning streak',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'on-fire',
    title: 'On Fire!',
    description: 'Maintained a 7-day learning streak',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'lesson-starter',
    title: 'Getting Started',
    description: 'Completed your first lesson',
    icon: '✅',
    unlocked: false,
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Completed 5 lessons',
    icon: '🎯',
    unlocked: false,
  },
]

const STORAGE_KEY = 'learnhub-progress'

function getStoredStats(): LearningStats {
  if (typeof window === 'undefined') {
    return getDefaultStats()
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return getDefaultStats()
    }
  }
  return getDefaultStats()
}

function getDefaultStats(): LearningStats {
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalCoursesViewed: 0,
    totalLessonsCompleted: 0,
    lastVisit: '',
    achievements: DEFAULT_ACHIEVEMENTS,
  }
}

function saveStats(stats: LearningStats): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }
}

function isToday(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isYesterday(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(getDefaultStats())
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedStats = getStoredStats()
    
    // Update streak logic
    const today = new Date().toISOString()
    let updatedStats = { ...storedStats }
    
    if (!isToday(storedStats.lastVisit)) {
      // New day visit
      if (isYesterday(storedStats.lastVisit)) {
        // Consecutive day - increase streak
        updatedStats.currentStreak += 1
      } else if (storedStats.lastVisit) {
        // Streak broken
        updatedStats.currentStreak = 1
      } else {
        // First visit ever
        updatedStats.currentStreak = 1
      }
      
      updatedStats.lastVisit = today
      
      // Update longest streak
      if (updatedStats.currentStreak > updatedStats.longestStreak) {
        updatedStats.longestStreak = updatedStats.currentStreak
      }
    }
    
    // Check for first visit achievement
    const firstVisit = updatedStats.achievements.find(a => a.id === 'first-visit')
    if (firstVisit && !firstVisit.unlocked) {
      updatedStats = unlockAchievement(updatedStats, 'first-visit')
      setTimeout(() => triggerCelebration(firstVisit), 500)
    }
    
    // Check streak achievements
    if (updatedStats.currentStreak >= 3) {
      const dedicated = updatedStats.achievements.find(a => a.id === 'dedicated')
      if (dedicated && !dedicated.unlocked) {
        updatedStats = unlockAchievement(updatedStats, 'dedicated')
        setTimeout(() => triggerCelebration(dedicated), 500)
      }
    }
    
    if (updatedStats.currentStreak >= 7) {
      const onFire = updatedStats.achievements.find(a => a.id === 'on-fire')
      if (onFire && !onFire.unlocked) {
        updatedStats = unlockAchievement(updatedStats, 'on-fire')
        setTimeout(() => triggerCelebration(onFire), 500)
      }
    }
    
    saveStats(updatedStats)
    setStats(updatedStats)
  }, [])

  const unlockAchievement = (currentStats: LearningStats, achievementId: string): LearningStats => {
    return {
      ...currentStats,
      achievements: currentStats.achievements.map(a => 
        a.id === achievementId 
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      ),
    }
  }

  const triggerCelebration = (achievement: Achievement) => {
    setNewAchievement(achievement)
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setNewAchievement(null)
    }, 4000)
  }

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const totalAchievements = stats.achievements.length

  if (!mounted) return null

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[101] animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl">{newAchievement.icon}</span>
            <div>
              <div className="text-sm opacity-90">Achievement Unlocked!</div>
              <div className="font-bold text-lg">{newAchievement.title}</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Widget */}
      <div className="card overflow-visible">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl">
                  🔥
                </div>
                {stats.currentStreak > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {stats.currentStreak}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Your Learning Journey</h3>
                <p className="text-navy-400 text-sm">
                  {stats.currentStreak > 0 
                    ? `${stats.currentStreak} day streak! Keep it up!`
                    : 'Start your learning streak today!'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="text-navy-300 text-sm">{unlockedCount}/{totalAchievements}</span>
              </div>
              <svg 
                className={`w-5 h-5 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-navy-800 pt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                <div className="text-navy-400 text-xs">Current Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">📖</div>
                <div className="text-2xl font-bold text-white">{stats.totalCoursesViewed}</div>
                <div className="text-navy-400 text-xs">Courses Viewed</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">✅</div>
                <div className="text-2xl font-bold text-white">{stats.totalLessonsCompleted}</div>
                <div className="text-navy-400 text-xs">Lessons Done</div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>🏆</span> Achievements
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative rounded-xl p-3 text-center transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/30'
                        : 'bg-navy-800/30 border border-navy-700/50 opacity-50'
                    }`}
                  >
                    <div className={`text-3xl mb-1 ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className={`text-sm font-medium ${achievement.unlocked ? 'text-white' : 'text-navy-500'}`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-navy-400 mt-1">
                      {achievement.description}
                    </div>
                    {achievement.unlocked && (
                      <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Calendar Preview */}
            <div className="mt-6 pt-6 border-t border-navy-800">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>📅</span> This Week
              </h4>
              <div className="flex justify-between gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const today = new Date().getDay()
                  const dayIndex = i === 6 ? 0 : i + 1 // Convert to JS day index (0=Sun)
                  const isCurrentDay = today === dayIndex
                  const isPastInStreak = stats.currentStreak > 0 && i < (today === 0 ? 6 : today - 1) && i >= (today === 0 ? 6 : today - 1) - stats.currentStreak + 1
                  
                  return (
                    <div key={day} className="flex-1 text-center">
                      <div className="text-navy-500 text-xs mb-1">{day}</div>
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm ${
                        isCurrentDay 
                          ? 'bg-primary-500 text-white'
                          : isPastInStreak
                            ? 'bg-primary-500/30 text-primary-400'
                            : 'bg-navy-800 text-navy-500'
                      }`}>
                        {isCurrentDay ? '🔥' : isPastInStreak ? '✓' : '·'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Export function to track course views (to be called from course pages)
export function trackCourseView(): void {
  if (typeof window === 'undefined') return
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return
  
  try {
    const stats: LearningStats = JSON.parse(stored)
    stats.totalCoursesViewed += 1
    
    // Check explorer achievement
    if (stats.totalCoursesViewed >= 3) {
      const explorer = stats.achievements.find(a => a.id === 'explorer')
      if (explorer && !explorer.unlocked) {
        stats.achievements = stats.achievements.map(a => 
          a.id === 'explorer' 
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        )
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // Ignore errors
  }
}

// Export function to track lesson completions
export function trackLessonComplete(): void {
  if (typeof window === 'undefined') return
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return
  
  try {
    const stats: LearningStats = JSON.parse(stored)
    stats.totalLessonsCompleted += 1
    
    // Check lesson achievements
    if (stats.totalLessonsCompleted >= 1) {
      const lessonStarter = stats.achievements.find(a => a.id === 'lesson-starter')
      if (lessonStarter && !lessonStarter.unlocked) {
        stats.achievements = stats.achievements.map(a => 
          a.id === 'lesson-starter' 
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        )
      }
    }
    
    if (stats.totalLessonsCompleted >= 5) {
      const knowledgeSeeker = stats.achievements.find(a => a.id === 'knowledge-seeker')
      if (knowledgeSeeker && !knowledgeSeeker.unlocked) {
        stats.achievements = stats.achievements.map(a => 
          a.id === 'knowledge-seeker' 
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        )
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // Ignore errors
  }
}