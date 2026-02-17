'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

interface LearningStats {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  lessonsViewed: string[]
  coursesStarted: string[]
  totalMinutesLearned: number
  achievements: Achievement[]
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', title: 'First Steps', description: 'View your first lesson', icon: '🎯' },
  { id: 'streak_3', title: 'On Fire!', description: '3 day learning streak', icon: '🔥' },
  { id: 'streak_7', title: 'Weekly Warrior', description: '7 day learning streak', icon: '⚔️' },
  { id: 'explorer', title: 'Explorer', description: 'Start 3 different courses', icon: '🧭' },
  { id: 'dedicated', title: 'Dedicated Learner', description: 'View 10 lessons', icon: '📚' },
  { id: 'marathon', title: 'Learning Marathon', description: '60+ minutes of learning', icon: '🏃' },
]

const defaultStats: LearningStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  lessonsViewed: [],
  coursesStarted: [],
  totalMinutesLearned: 0,
  achievements: [],
}

export default function LearningProgress() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<LearningStats>(defaultStats)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    // Load stats from localStorage
    const saved = localStorage.getItem('learnhub_stats')
    if (saved) {
      const parsed = JSON.parse(saved) as LearningStats
      setStats(parsed)
      
      // Check and update streak
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (parsed.lastVisit !== today) {
        const newStats = { ...parsed }
        
        if (parsed.lastVisit === yesterday) {
          // Continue streak
          newStats.currentStreak = parsed.currentStreak + 1
          newStats.longestStreak = Math.max(newStats.currentStreak, parsed.longestStreak)
        } else if (parsed.lastVisit !== today) {
          // Reset streak (more than 1 day gap)
          newStats.currentStreak = 1
        }
        
        newStats.lastVisit = today
        
        // Check for streak achievements
        checkAchievements(newStats)
        
        setStats(newStats)
        localStorage.setItem('learnhub_stats', JSON.stringify(newStats))
      }
    } else {
      // First visit
      const newStats: LearningStats = {
        ...defaultStats,
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: new Date().toDateString(),
      }
      setStats(newStats)
      localStorage.setItem('learnhub_stats', JSON.stringify(newStats))
    }
  }, [])

  const checkAchievements = (currentStats: LearningStats) => {
    const unlockedIds = currentStats.achievements.map(a => a.id)
    let newUnlock: Achievement | null = null

    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedIds.includes(achievement.id)) return

      let shouldUnlock = false
      
      switch (achievement.id) {
        case 'first_lesson':
          shouldUnlock = currentStats.lessonsViewed.length >= 1
          break
        case 'streak_3':
          shouldUnlock = currentStats.currentStreak >= 3
          break
        case 'streak_7':
          shouldUnlock = currentStats.currentStreak >= 7
          break
        case 'explorer':
          shouldUnlock = currentStats.coursesStarted.length >= 3
          break
        case 'dedicated':
          shouldUnlock = currentStats.lessonsViewed.length >= 10
          break
        case 'marathon':
          shouldUnlock = currentStats.totalMinutesLearned >= 60
          break
      }

      if (shouldUnlock) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date().toISOString(),
        }
        currentStats.achievements.push(unlockedAchievement)
        newUnlock = unlockedAchievement
      }
    })

    if (newUnlock) {
      setNewAchievement(newUnlock)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }
  }

  const progressPercent = Math.min((stats.lessonsViewed.length / 20) * 100, 100)
  const streakPercent = Math.min((stats.currentStreak / 7) * 100, 100)

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#22c55e'][Math.floor(Math.random() * 5)],
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[101] animate-slideDown">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl animate-bounce">{newAchievement.icon}</span>
            <div>
              <div className="text-sm opacity-90">Achievement Unlocked!</div>
              <div className="font-bold text-lg">{newAchievement.title}</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white p-4 rounded-full shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-110 group"
        aria-label="Learning Progress"
      >
        <div className="relative">
          {/* Streak Fire Animation */}
          {stats.currentStreak >= 3 && (
            <span className="absolute -top-1 -right-1 text-lg animate-pulse">🔥</span>
          )}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        {/* Streak Badge */}
        {stats.currentStreak > 0 && (
          <span className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
            {stats.currentStreak}
          </span>
        )}
      </button>

      {/* Progress Panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-5 z-40 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-4 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                📊 Your Progress
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-4">
            {/* Learning Streak */}
            <div className="bg-navy-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-navy-300 text-sm">Learning Streak</span>
                <span className="text-2xl font-bold text-orange-400 flex items-center gap-1">
                  {stats.currentStreak} {stats.currentStreak >= 3 && '🔥'}
                </span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${streakPercent}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-navy-400">
                {7 - stats.currentStreak > 0 ? `${7 - stats.currentStreak} days to Weekly Warrior!` : 'You\'re a Weekly Warrior! 🏆'}
              </div>
            </div>

            {/* Progress Ring */}
            <div className="flex items-center gap-4 bg-navy-800/50 rounded-xl p-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercent}, 100`}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {stats.lessonsViewed.length}
                </span>
              </div>
              <div>
                <div className="text-white font-semibold">Lessons Viewed</div>
                <div className="text-navy-400 text-sm">Keep learning!</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{stats.coursesStarted.length}</div>
                <div className="text-xs text-navy-400">Courses Started</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{stats.totalMinutesLearned}</div>
                <div className="text-xs text-navy-400">Minutes Learned</div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <div className="text-white font-semibold mb-2 flex items-center gap-2">
                🏆 Achievements
                <span className="text-xs text-navy-400">({stats.achievements.length}/{ACHIEVEMENTS.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map((achievement) => {
                  const unlocked = stats.achievements.find(a => a.id === achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                        unlocked 
                          ? 'bg-primary-500/20 hover:scale-110 cursor-pointer' 
                          : 'bg-navy-800/50 grayscale opacity-50'
                      }`}
                      title={`${achievement.title}: ${achievement.description}`}
                    >
                      {achievement.icon}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Export a function to track lesson views (to be called from lesson pages)
export function trackLessonView(lessonSlug: string, courseSlug: string, durationMinutes: number = 5) {
  if (typeof window === 'undefined') return

  const saved = localStorage.getItem('learnhub_stats')
  const stats: LearningStats = saved ? JSON.parse(saved) : {
    currentStreak: 1,
    longestStreak: 1,
    lastVisit: new Date().toDateString(),
    lessonsViewed: [],
    coursesStarted: [],
    totalMinutesLearned: 0,
    achievements: [],
  }

  // Add lesson if not already viewed
  if (!stats.lessonsViewed.includes(lessonSlug)) {
    stats.lessonsViewed.push(lessonSlug)
  }

  // Add course if not already started
  if (!stats.coursesStarted.includes(courseSlug)) {
    stats.coursesStarted.push(courseSlug)
  }

  // Add learning time
  stats.totalMinutesLearned += durationMinutes

  localStorage.setItem('learnhub_stats', JSON.stringify(stats))
  
  // Dispatch event to notify the widget
  window.dispatchEvent(new CustomEvent('learnhub_stats_updated'))
}