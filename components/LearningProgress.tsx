'use client'

import { useState, useEffect, useCallback } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  streak: number
  lastVisit: string
  coursesViewed: string[]
  lessonsViewed: string[]
  achievements: Achievement[]
  totalTimeSpent: number
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', title: 'Welcome!', description: 'Visited LearnHub for the first time', icon: '👋', unlocked: false },
  { id: 'explorer', title: 'Explorer', description: 'Viewed 3 different courses', icon: '🔭', unlocked: false },
  { id: 'dedicated', title: 'Dedicated', description: 'Maintained a 3-day streak', icon: '🔥', unlocked: false },
  { id: 'scholar', title: 'Scholar', description: 'Viewed 5 lessons', icon: '📚', unlocked: false },
  { id: 'marathon', title: 'Marathon Learner', description: 'Spent 10+ minutes learning', icon: '⏱️', unlocked: false },
  { id: 'week_warrior', title: 'Week Warrior', description: 'Maintained a 7-day streak', icon: '⚡', unlocked: false },
]

const STORAGE_KEY = 'learnhub_progress'

function getDefaultStats(): LearningStats {
  return {
    streak: 0,
    lastVisit: '',
    coursesViewed: [],
    lessonsViewed: [],
    achievements: DEFAULT_ACHIEVEMENTS,
    totalTimeSpent: 0,
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
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    let currentStats: LearningStats

    if (stored) {
      currentStats = JSON.parse(stored)
      // Ensure achievements array exists and has all achievements
      if (!currentStats.achievements) {
        currentStats.achievements = DEFAULT_ACHIEVEMENTS
      }
    } else {
      currentStats = getDefaultStats()
    }

    // Update streak logic
    const today = new Date().toISOString()
    
    if (!isToday(currentStats.lastVisit)) {
      if (isYesterday(currentStats.lastVisit)) {
        // Continue streak
        currentStats.streak += 1
      } else if (currentStats.lastVisit) {
        // Streak broken
        currentStats.streak = 1
      } else {
        // First visit
        currentStats.streak = 1
      }
      currentStats.lastVisit = today
    }

    // Check for first visit achievement
    const firstVisitAchievement = currentStats.achievements.find(a => a.id === 'first_visit')
    if (firstVisitAchievement && !firstVisitAchievement.unlocked) {
      firstVisitAchievement.unlocked = true
      firstVisitAchievement.unlockedAt = today
      setNewAchievement(firstVisitAchievement)
      setShowConfetti(true)
    }

    // Check for streak achievements
    if (currentStats.streak >= 3) {
      const dedicatedAchievement = currentStats.achievements.find(a => a.id === 'dedicated')
      if (dedicatedAchievement && !dedicatedAchievement.unlocked) {
        dedicatedAchievement.unlocked = true
        dedicatedAchievement.unlockedAt = today
        setNewAchievement(dedicatedAchievement)
        setShowConfetti(true)
      }
    }

    if (currentStats.streak >= 7) {
      const weekWarrior = currentStats.achievements.find(a => a.id === 'week_warrior')
      if (weekWarrior && !weekWarrior.unlocked) {
        weekWarrior.unlocked = true
        weekWarrior.unlockedAt = today
        setNewAchievement(weekWarrior)
        setShowConfetti(true)
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStats))
    setStats(currentStats)
  }, [])

  // Track time spent
  useEffect(() => {
    if (!stats) return

    const interval = setInterval(() => {
      setStats(prev => {
        if (!prev) return prev
        const updated = { ...prev, totalTimeSpent: prev.totalTimeSpent + 1 }
        
        // Check marathon achievement (10 minutes = 600 seconds)
        if (updated.totalTimeSpent >= 600) {
          const marathon = updated.achievements.find(a => a.id === 'marathon')
          if (marathon && !marathon.unlocked) {
            marathon.unlocked = true
            marathon.unlockedAt = new Date().toISOString()
            setNewAchievement(marathon)
            setShowConfetti(true)
          }
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [stats])

  // Track page views for achievements
  useEffect(() => {
    if (!stats) return

    const trackPageView = () => {
      const path = window.location.pathname
      
      setStats(prev => {
        if (!prev) return prev
        const updated = { ...prev }
        
        // Track course views
        if (path.startsWith('/courses/') && path.split('/').length === 3) {
          const courseSlug = path.split('/')[2]
          if (courseSlug && !updated.coursesViewed.includes(courseSlug)) {
            updated.coursesViewed = [...updated.coursesViewed, courseSlug]
            
            // Check explorer achievement
            if (updated.coursesViewed.length >= 3) {
              const explorer = updated.achievements.find(a => a.id === 'explorer')
              if (explorer && !explorer.unlocked) {
                explorer.unlocked = true
                explorer.unlockedAt = new Date().toISOString()
                setNewAchievement(explorer)
                setShowConfetti(true)
              }
            }
          }
        }
        
        // Track lesson views
        if (path.includes('/lessons/')) {
          const lessonSlug = path.split('/').pop()
          if (lessonSlug && !updated.lessonsViewed.includes(lessonSlug)) {
            updated.lessonsViewed = [...updated.lessonsViewed, lessonSlug]
            
            // Check scholar achievement
            if (updated.lessonsViewed.length >= 5) {
              const scholar = updated.achievements.find(a => a.id === 'scholar')
              if (scholar && !scholar.unlocked) {
                scholar.unlocked = true
                scholar.unlockedAt = new Date().toISOString()
                setNewAchievement(scholar)
                setShowConfetti(true)
              }
            }
          }
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    }

    trackPageView()
    
    // Listen for route changes
    window.addEventListener('popstate', trackPageView)
    return () => window.removeEventListener('popstate', trackPageView)
  }, [stats])

  // Hide confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  // Dismiss new achievement notification
  const dismissAchievement = useCallback(() => {
    setNewAchievement(null)
  }, [])

  if (!stats) return null

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const progressPercent = (unlockedCount / stats.achievements.length) * 100
  const circumference = 2 * Math.PI * 40

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] animate-slideDown">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl animate-bounce">{newAchievement.icon}</span>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">Achievement Unlocked!</p>
              <p className="font-bold text-lg">{newAchievement.title}</p>
              <p className="text-sm opacity-90">{newAchievement.description}</p>
            </div>
            <button 
              onClick={dismissAchievement}
              className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 z-50 group"
        aria-label="View learning progress"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary-500/30 rounded-full blur-lg group-hover:bg-primary-500/50 transition-all duration-300" />
          
          {/* Button */}
          <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 w-14 h-14 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            
            {/* Streak flame */}
            <div className="relative">
              <span className="text-2xl">{stats.streak > 0 ? '🔥' : '📊'}</span>
              {stats.streak > 0 && (
                <span className="absolute -top-1 -right-2 bg-white text-primary-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {stats.streak}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Progress Panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-5 z-50 animate-scaleIn">
          <div className="bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl w-80 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-b border-navy-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Your Progress</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-navy-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
              {/* Streak */}
              <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">{stats.streak > 0 ? '🔥' : '❄️'}</div>
                <div className="text-2xl font-bold text-white">{stats.streak}</div>
                <div className="text-xs text-navy-400">Day Streak</div>
              </div>

              {/* Progress Ring */}
              <div className="bg-navy-800/50 rounded-xl p-4 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.2)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - progressPercent / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="text-xs text-navy-400 mt-1">Achievements</div>
              </div>

              {/* Courses Explored */}
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-white">{stats.coursesViewed.length}</div>
                <div className="text-xs text-navy-400">Courses Explored</div>
              </div>

              {/* Lessons Viewed */}
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-white">{stats.lessonsViewed.length}</div>
                <div className="text-xs text-navy-400">Lessons Viewed</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="px-4 pb-4">
              <h4 className="text-sm font-semibold text-navy-300 mb-3">Achievements</h4>
              <div className="grid grid-cols-6 gap-2">
                {stats.achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-40 grayscale scale-90'
                    }`}
                    title={`${achievement.title}: ${achievement.description}`}
                  >
                    <div className={`text-2xl p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-primary-500/20' : 'bg-navy-800'
                    }`}>
                      {achievement.icon}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      <div className="bg-navy-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                        <div className="font-bold">{achievement.title}</div>
                        <div className="text-navy-400">{achievement.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-navy-800/50 px-4 py-3 border-t border-navy-700">
              <p className="text-xs text-navy-400 text-center">
                Keep learning to unlock more achievements! 🚀
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}