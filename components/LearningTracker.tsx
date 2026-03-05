'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ViewedCourse {
  slug: string
  title: string
  timestamp: number
  category?: string
}

interface LearningStats {
  streak: number
  lastVisit: string
  totalVisits: number
  viewedCourses: ViewedCourse[]
  completedLessons: string[]
}

const defaultStats: LearningStats = {
  streak: 0,
  lastVisit: '',
  totalVisits: 0,
  viewedCourses: [],
  completedLessons: []
}

const motivationalMessages = [
  "🔥 You're on fire! Keep learning!",
  "⭐ Amazing progress today!",
  "🚀 Sky's the limit!",
  "💪 You've got this!",
  "🎯 Focused and determined!",
  "✨ Every day is a chance to grow!",
  "🌟 Your dedication inspires us!",
  "📚 Knowledge is power!"
]

export default function LearningTracker() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [stats, setStats] = useState<LearningStats>(defaultStats)
  const [showConfetti, setShowConfetti] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    let currentStats: LearningStats = savedStats ? JSON.parse(savedStats) : defaultStats
    
    // Check and update streak
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (currentStats.lastVisit !== today) {
      if (currentStats.lastVisit === yesterday) {
        // Consecutive day - increment streak!
        currentStats.streak += 1
        if (currentStats.streak % 5 === 0) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else if (currentStats.lastVisit && currentStats.lastVisit !== today) {
        // Streak broken
        currentStats.streak = 1
      } else {
        // First visit
        currentStats.streak = 1
      }
      currentStats.lastVisit = today
      currentStats.totalVisits += 1
    }
    
    setStats(currentStats)
    localStorage.setItem('learnhub-stats', JSON.stringify(currentStats))
    
    // Set random motivational message
    setMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
    
    // Auto-open for first-time visitors after a delay
    if (currentStats.totalVisits === 1) {
      setTimeout(() => {
        setIsMinimized(false)
        setIsOpen(true)
      }, 3000)
    }
  }, [])

  const trackCourseView = (slug: string, title: string, category?: string) => {
    const newStats = { ...stats }
    const existingIndex = newStats.viewedCourses.findIndex(c => c.slug === slug)
    
    if (existingIndex >= 0) {
      newStats.viewedCourses[existingIndex].timestamp = Date.now()
    } else {
      newStats.viewedCourses.unshift({ slug, title, timestamp: Date.now(), category })
      if (newStats.viewedCourses.length > 10) {
        newStats.viewedCourses = newStats.viewedCourses.slice(0, 10)
      }
    }
    
    setStats(newStats)
    localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
  }

  // Expose tracking function globally
  useEffect(() => {
    (window as unknown as { trackCourseView?: typeof trackCourseView }).trackCourseView = trackCourseView
  }, [stats])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '💎'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '⚡'
    return '✨'
  }

  const getStreakColor = (streak: number): string => {
    if (streak >= 30) return 'from-yellow-400 to-amber-500'
    if (streak >= 14) return 'from-purple-400 to-pink-500'
    if (streak >= 7) return 'from-orange-400 to-red-500'
    if (streak >= 3) return 'from-blue-400 to-cyan-500'
    return 'from-primary-400 to-primary-600'
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => {
          setIsMinimized(false)
          setIsOpen(true)
        }}
        className="fixed bottom-24 right-5 z-40 group"
        aria-label="Open learning tracker"
      >
        <div className="relative">
          {/* Pulse animation for streak */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getStreakColor(stats.streak)} opacity-75 animate-ping`} />
          <div className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${getStreakColor(stats.streak)} shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-110`}>
            <span className="text-2xl">{getStreakEmoji(stats.streak)}</span>
          </div>
          {/* Streak badge */}
          <div className="absolute -top-1 -right-1 bg-white text-navy-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-md">
            {stats.streak}
          </div>
        </div>
      </button>
    )
  }

  return (
    <>
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <span className="text-2xl">
                {['🎉', '⭐', '🔥', '💫', '✨'][Math.floor(Math.random() * 5)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tracker Panel */}
      <div className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="w-80 bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getStreakColor(stats.streak)} p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getStreakEmoji(stats.streak)}</div>
                <div>
                  <div className="text-white font-bold text-lg">
                    {stats.streak} Day Streak!
                  </div>
                  <div className="text-white/80 text-sm">
                    {motivationalMessage}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setTimeout(() => setIsMinimized(true), 300)
                }}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Minimize tracker"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-4 grid grid-cols-3 gap-3">
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalVisits}</div>
              <div className="text-navy-400 text-xs">Total Visits</div>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.viewedCourses.length}</div>
              <div className="text-navy-400 text-xs">Courses Explored</div>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.completedLessons.length}</div>
              <div className="text-navy-400 text-xs">Lessons Done</div>
            </div>
          </div>

          {/* Recently Viewed */}
          {stats.viewedCourses.length > 0 && (
            <div className="px-4 pb-4">
              <h4 className="text-navy-400 text-xs uppercase tracking-wider mb-2">Continue Learning</h4>
              <div className="space-y-2">
                {stats.viewedCourses.slice(0, 3).map((course) => (
                  <Link
                    key={course.slug}
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-3 p-2 bg-navy-800/30 hover:bg-navy-800/50 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-primary-400">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">
                        {course.title}
                      </div>
                      <div className="text-navy-500 text-xs">
                        {new Date(course.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 pt-0">
            <Link
              href="/courses"
              className="block w-full text-center py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Discover New Courses
            </Link>
          </div>

          {/* Streak milestones */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-500">Next milestone:</span>
              <span className="text-primary-400 font-medium">
                {stats.streak < 3 ? '3 days ⚡' : 
                 stats.streak < 7 ? '7 days 🔥' : 
                 stats.streak < 14 ? '14 days 💎' : 
                 stats.streak < 30 ? '30 days 🏆' : 'Legend status! 👑'}
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStreakColor(stats.streak)} transition-all duration-500`}
                style={{ 
                  width: `${Math.min(100, (stats.streak / (stats.streak < 3 ? 3 : stats.streak < 7 ? 7 : stats.streak < 14 ? 14 : 30)) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}