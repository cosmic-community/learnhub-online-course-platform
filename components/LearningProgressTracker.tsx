'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  totalCourses: number
  totalLessons: number
  totalHours: number
  streak: number
  lastVisit: string
}

interface LearningProgressTrackerProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

const motivationalQuotes = [
  "Every expert was once a beginner. Keep learning! 🚀",
  "The beautiful thing about learning is that no one can take it away from you. 💡",
  "Success is the sum of small efforts repeated day in and day out. ✨",
  "Learning is not attained by chance, it must be sought for with ardor. 🔥",
  "The capacity to learn is a gift; the ability to learn is a skill. 🎯",
  "Education is the passport to the future. 🌟",
  "The more you learn, the more you earn. 📈",
  "Never stop learning because life never stops teaching. 🌱"
]

export default function LearningProgressTracker({ 
  totalCourses, 
  totalLessons, 
  totalHours 
}: LearningProgressTrackerProps) {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [quote, setQuote] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [animatedHours, setAnimatedHours] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedCourses, setAnimatedCourses] = useState(0)

  useEffect(() => {
    // Get random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)

    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    const today = new Date().toDateString()
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.streak
      
      if (lastVisitDate === today) {
        // Same day visit, keep streak
        newStreak = parsed.streak
      } else if (lastVisitDate === yesterday) {
        // Consecutive day visit, increment streak!
        newStreak = parsed.streak + 1
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken, reset to 1
        newStreak = 1
      }
      
      const updatedStats: LearningStats = {
        totalCourses,
        totalLessons,
        totalHours,
        streak: newStreak,
        lastVisit: today
      }
      
      setStats(updatedStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(updatedStats))
    } else {
      // First time visitor
      const newStats: LearningStats = {
        totalCourses,
        totalLessons,
        totalHours,
        streak: 1,
        lastVisit: today
      }
      setStats(newStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [totalCourses, totalLessons, totalHours])

  // Animate numbers on mount
  useEffect(() => {
    const duration = 1500 // 1.5 seconds
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease out cubic for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedHours(Math.floor(totalHours * easeOut))
      setAnimatedLessons(Math.floor(totalLessons * easeOut))
      setAnimatedCourses(Math.floor(totalCourses * easeOut))
      
      if (step >= steps) {
        clearInterval(timer)
        setAnimatedHours(totalHours)
        setAnimatedLessons(totalLessons)
        setAnimatedCourses(totalCourses)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalHours])

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Learning Legend!'
    if (streak >= 14) return 'On Fire!'
    if (streak >= 7) return 'Week Warrior!'
    if (streak >= 3) return 'Building Momentum!'
    return 'Just Getting Started!'
  }

  if (!stats) return null

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 animate-bounce text-4xl opacity-70">🎉</div>
          <div className="absolute top-0 right-1/4 animate-bounce text-4xl opacity-70 delay-100">🎊</div>
          <div className="absolute top-0 left-1/2 animate-bounce text-4xl opacity-70 delay-200">⭐</div>
        </div>
      )}

      <div className="card p-8 bg-gradient-to-br from-navy-900/80 to-navy-800/50">
        {/* Header with Streak */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Your Learning Dashboard</h2>
            <p className="text-navy-400 text-sm max-w-md">{quote}</p>
          </div>
          
          {/* Streak Badge */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-primary-500/20 to-primary-600/10 px-6 py-4 rounded-2xl border border-primary-500/30">
            <div className="text-5xl animate-pulse">{getStreakEmoji(stats.streak)}</div>
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-white">{stats.streak}</div>
              <div className="text-xs text-primary-400 uppercase tracking-wider font-medium">Day Streak</div>
              <div className="text-xs text-navy-400 mt-1">{getStreakMessage(stats.streak)}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          <div className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 hover:border-primary-500/30 transition-colors group">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {animatedCourses}+
            </div>
            <div className="text-navy-400 text-xs md:text-sm flex items-center justify-center gap-2">
              <span className="text-lg">📚</span>
              <span>Courses</span>
            </div>
            <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (animatedCourses / totalCourses) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 hover:border-primary-500/30 transition-colors group">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {animatedLessons}+
            </div>
            <div className="text-navy-400 text-xs md:text-sm flex items-center justify-center gap-2">
              <span className="text-lg">📖</span>
              <span>Lessons</span>
            </div>
            <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (animatedLessons / totalLessons) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 hover:border-primary-500/30 transition-colors group">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {animatedHours}+
            </div>
            <div className="text-navy-400 text-xs md:text-sm flex items-center justify-center gap-2">
              <span className="text-lg">⏱️</span>
              <span>Hours</span>
            </div>
            <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (animatedHours / totalHours) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-8 pt-6 border-t border-navy-700/50">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-navy-500 text-sm">Achievements:</span>
            {stats.streak >= 1 && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
                🌱 First Visit
              </span>
            )}
            {stats.streak >= 3 && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                ✨ 3-Day Streak
              </span>
            )}
            {stats.streak >= 7 && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                ⚡ Week Warrior
              </span>
            )}
            {stats.streak >= 14 && (
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
                🔥 Two-Week Titan
              </span>
            )}
            {stats.streak >= 30 && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">
                🏆 Learning Legend
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}