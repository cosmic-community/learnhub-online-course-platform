'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  totalCourses: number
  totalLessons: number
}

interface LearningStats {
  currentStreak: number
  longestStreak: number
  lastVisit: string | null
  totalVisits: number
  coursesViewed: string[]
}

const MOTIVATIONAL_MESSAGES = [
  "You're on fire! Keep learning! 🔥",
  "Consistency is key to mastery! 🗝️",
  "Every day is a chance to grow! 🌱",
  "You're building something amazing! ⭐",
  "Knowledge is your superpower! 💪",
  "Small steps lead to big achievements! 🏆",
]

export default function LearningStreak({ totalCourses, totalLessons }: LearningStreakProps) {
  const [stats, setStats] = useState<LearningStats>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: null,
    totalVisits: 0,
    coursesViewed: [],
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      const stored = localStorage.getItem('learnhub-stats')
      const today = new Date().toDateString()
      
      if (stored) {
        const parsed: LearningStats = JSON.parse(stored)
        const lastVisitDate = parsed.lastVisit ? new Date(parsed.lastVisit).toDateString() : null
        
        // Check if this is a new day
        if (lastVisitDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const isConsecutive = lastVisitDate === yesterday.toDateString()
          
          const newStreak = isConsecutive ? parsed.currentStreak + 1 : 1
          const newStats: LearningStats = {
            ...parsed,
            currentStreak: newStreak,
            longestStreak: Math.max(parsed.longestStreak, newStreak),
            lastVisit: today,
            totalVisits: parsed.totalVisits + 1,
          }
          
          localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
          setStats(newStats)
          
          // Show celebration for streak milestones
          if (newStreak > 1 && newStreak > parsed.currentStreak) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
        } else {
          setStats(parsed)
        }
      } else {
        // First visit ever
        const newStats: LearningStats = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: today,
          totalVisits: 1,
          coursesViewed: [],
        }
        localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
        setStats(newStats)
      }
      
      setIsLoaded(true)
    }

    loadStats()
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-navy-800/50 rounded-2xl"></div>
      </div>
    )
  }

  const streakFlames = Math.min(stats.currentStreak, 7)

  return (
    <div className="relative">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="celebration-particles">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                {['🔥', '⭐', '✨', '🎉', '💪'][Math.floor(Math.random() * 5)]}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="card p-6 md:p-8 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Streak Counter */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-2xl fire-animation">🔥</span>
              <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
            </div>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 streak-number">
                {stats.currentStreak}
              </span>
              <span className="text-navy-400 text-lg">
                {stats.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="flex justify-center md:justify-start gap-1 mt-3">
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl transition-all duration-300 ${
                    i < streakFlames ? 'flame-active' : 'flame-inactive'
                  }`}
                >
                  🔥
                </span>
              ))}
            </div>
            <p className="text-navy-400 text-sm mt-2">
              Best: {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
            </p>
          </div>

          {/* Progress Ring */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="fill-none stroke-navy-700"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="fill-none stroke-primary-500 progress-ring"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.totalVisits / 30) * 301.6} 301.6`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{stats.totalVisits}</span>
                <span className="text-xs text-navy-400">visits</span>
              </div>
            </div>
            <p className="text-navy-400 text-sm mt-2 text-center">
              {motivationalMessage}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-mini bg-navy-800/50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-xl font-bold text-white">{totalCourses}</div>
              <div className="text-xs text-navy-400">Courses</div>
            </div>
            <div className="stat-mini bg-navy-800/50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">📖</div>
              <div className="text-xl font-bold text-white">{totalLessons}</div>
              <div className="text-xs text-navy-400">Lessons</div>
            </div>
            <div className="stat-mini bg-navy-800/50 rounded-xl p-4 text-center col-span-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="text-sm font-medium text-white">Keep going!</div>
                  <div className="text-xs text-navy-400">
                    {7 - streakFlames} more days to max streak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}