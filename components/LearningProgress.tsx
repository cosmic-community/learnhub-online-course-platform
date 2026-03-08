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
  lessonsViewed: number
  coursesStarted: number
  totalTimeSpent: number // in minutes
  currentStreak: number
  longestStreak: number
  lastVisit: string
  achievements: Achievement[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-visit', title: 'Explorer', description: 'Visited LearnHub for the first time', icon: '🚀', unlocked: false },
  { id: 'first-lesson', title: 'Student', description: 'Viewed your first lesson', icon: '📖', unlocked: false },
  { id: 'streak-3', title: 'Committed', description: 'Maintained a 3-day learning streak', icon: '🔥', unlocked: false },
  { id: 'streak-7', title: 'Dedicated', description: 'Maintained a 7-day learning streak', icon: '⭐', unlocked: false },
  { id: 'courses-3', title: 'Curious Mind', description: 'Explored 3 different courses', icon: '🧠', unlocked: false },
  { id: 'time-60', title: 'Deep Diver', description: 'Spent over an hour learning', icon: '🏊', unlocked: false },
]

const DEFAULT_STATS: LearningStats = {
  lessonsViewed: 0,
  coursesStarted: 0,
  totalTimeSpent: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  achievements: DEFAULT_ACHIEVEMENTS,
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [isOpen, setIsOpen] = useState(false)
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    let currentStats: LearningStats = savedStats ? JSON.parse(savedStats) : DEFAULT_STATS
    
    // Check and update streak
    const today = new Date().toDateString()
    const lastVisit = currentStats.lastVisit
    
    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Continuing streak
        currentStats.currentStreak += 1
        if (currentStats.currentStreak > currentStats.longestStreak) {
          currentStats.longestStreak = currentStats.currentStreak
        }
      } else if (lastVisit !== today) {
        // Streak broken (unless first visit)
        if (lastVisit) {
          currentStats.currentStreak = 1
        } else {
          currentStats.currentStreak = 1
        }
      }
      
      currentStats.lastVisit = today
      
      // Check for first visit achievement
      if (!currentStats.achievements.find(a => a.id === 'first-visit')?.unlocked) {
        currentStats = unlockAchievement(currentStats, 'first-visit')
      }
      
      // Check streak achievements
      if (currentStats.currentStreak >= 3) {
        currentStats = unlockAchievement(currentStats, 'streak-3')
      }
      if (currentStats.currentStreak >= 7) {
        currentStats = unlockAchievement(currentStats, 'streak-7')
      }
      
      localStorage.setItem('learnhub-progress', JSON.stringify(currentStats))
    }
    
    setStats(currentStats)
    
    // Track time spent
    const startTime = Date.now()
    const interval = setInterval(() => {
      const minutesSpent = Math.floor((Date.now() - startTime) / 60000)
      if (minutesSpent > 0) {
        updateTimeSpent(minutesSpent)
      }
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const unlockAchievement = (currentStats: LearningStats, achievementId: string): LearningStats => {
    const achievement = currentStats.achievements.find(a => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      const updatedAchievements = currentStats.achievements.map(a => 
        a.id === achievementId 
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      )
      
      const unlockedAchievement = updatedAchievements.find(a => a.id === achievementId)
      if (unlockedAchievement) {
        setTimeout(() => {
          setShowAchievement(unlockedAchievement)
          setTimeout(() => setShowAchievement(null), 4000)
        }, 500)
      }
      
      return { ...currentStats, achievements: updatedAchievements }
    }
    return currentStats
  }

  const updateTimeSpent = (additionalMinutes: number) => {
    setStats(prev => {
      const updated = {
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + additionalMinutes
      }
      
      // Check time achievement
      if (updated.totalTimeSpent >= 60) {
        const withAchievement = unlockAchievement(updated, 'time-60')
        localStorage.setItem('learnhub-progress', JSON.stringify(withAchievement))
        return withAchievement
      }
      
      localStorage.setItem('learnhub-progress', JSON.stringify(updated))
      return updated
    })
  }

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const totalAchievements = stats.achievements.length

  if (!mounted) return null

  return (
    <>
      {/* Achievement Toast */}
      {showAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-4">
            <span className="text-4xl">{showAchievement.icon}</span>
            <div>
              <div className="text-sm font-medium opacity-90">Achievement Unlocked!</div>
              <div className="font-bold text-lg">{showAchievement.title}</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110 group"
        aria-label="View learning progress"
      >
        <div className="relative">
          <span className="text-2xl">🎯</span>
          {stats.currentStreak > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {stats.currentStreak}
            </span>
          )}
        </div>
      </button>

      {/* Progress Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-24 right-5 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                🎯 Learning Progress
              </h3>
              <p className="text-primary-100 text-sm">Keep learning to unlock achievements!</p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Streak */}
              <div className="bg-navy-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-navy-300 text-sm">Current Streak</span>
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{stats.currentStreak}</span>
                  <span className="text-navy-400 text-sm">days</span>
                </div>
                {stats.longestStreak > 0 && (
                  <div className="text-navy-400 text-xs mt-1">
                    Best: {stats.longestStreak} days
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-lg font-bold text-white">{stats.lessonsViewed}</div>
                  <div className="text-navy-400 text-xs">Lessons Viewed</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-lg font-bold text-white">{stats.totalTimeSpent}</div>
                  <div className="text-navy-400 text-xs">Minutes Spent</div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">Achievements</span>
                  <span className="text-primary-400 text-sm">{unlockedCount}/{totalAchievements}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {stats.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`relative group p-3 rounded-xl text-center transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-primary-500/20 border border-primary-500/30' 
                          : 'bg-navy-800/30 border border-navy-700/50 opacity-50'
                      }`}
                      title={achievement.title}
                    >
                      <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {achievement.title}
                        <br />
                        <span className="text-navy-400">{achievement.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational Message */}
              <div className="text-center py-2">
                <p className="text-navy-300 text-sm italic">
                  {stats.currentStreak >= 7 
                    ? "🌟 You're on fire! Amazing dedication!"
                    : stats.currentStreak >= 3
                    ? "🚀 Great momentum! Keep it going!"
                    : stats.currentStreak >= 1
                    ? "💪 Every day counts. You've got this!"
                    : "🎓 Start your learning journey today!"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// Helper function to track lesson views (call this from lesson pages)
export function trackLessonView() {
  if (typeof window === 'undefined') return
  
  const savedStats = localStorage.getItem('learnhub-progress')
  if (!savedStats) return
  
  const stats: LearningStats = JSON.parse(savedStats)
  stats.lessonsViewed += 1
  
  // Check first lesson achievement
  if (stats.lessonsViewed === 1) {
    const achievement = stats.achievements.find(a => a.id === 'first-lesson')
    if (achievement && !achievement.unlocked) {
      stats.achievements = stats.achievements.map(a =>
        a.id === 'first-lesson'
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      )
    }
  }
  
  localStorage.setItem('learnhub-progress', JSON.stringify(stats))
}

// Helper function to track course starts
export function trackCourseStart() {
  if (typeof window === 'undefined') return
  
  const savedStats = localStorage.getItem('learnhub-progress')
  if (!savedStats) return
  
  const stats: LearningStats = JSON.parse(savedStats)
  stats.coursesStarted += 1
  
  // Check courses achievement
  if (stats.coursesStarted >= 3) {
    const achievement = stats.achievements.find(a => a.id === 'courses-3')
    if (achievement && !achievement.unlocked) {
      stats.achievements = stats.achievements.map(a =>
        a.id === 'courses-3'
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      )
    }
  }
  
  localStorage.setItem('learnhub-progress', JSON.stringify(stats))
}