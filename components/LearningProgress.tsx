'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  streak: number
  lessonsCompleted: number
  totalMinutes: number
  lastVisit: string | null
}

const MOTIVATIONAL_MESSAGES = [
  "🚀 You're on fire! Keep that streak going!",
  "💪 Every expert was once a beginner. Keep learning!",
  "🌟 Small progress is still progress!",
  "🎯 Focus on progress, not perfection!",
  "🧠 Your brain is getting stronger every day!",
  "✨ Today's learning is tomorrow's expertise!",
  "🔥 Consistency beats intensity. Show up daily!",
  "🏆 Champions are made in practice, not games!",
]

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "🎉 3-day streak! You're building momentum!",
  7: "🔥 One week strong! You're unstoppable!",
  14: "⚡ Two weeks! You're a learning machine!",
  30: "🏆 30 days! You're a true champion!",
  50: "👑 50 days! Legendary status achieved!",
  100: "💎 100 days! You're in the hall of fame!",
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>({
    streak: 0,
    lessonsCompleted: 0,
    totalMinutes: 0,
    lastVisit: null,
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null)
  const [dailyMessage, setDailyMessage] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    const today = new Date().toDateString()
    
    if (savedStats) {
      const parsed: LearningStats = JSON.parse(savedStats)
      const lastVisitDate = parsed.lastVisit ? new Date(parsed.lastVisit).toDateString() : null
      
      if (lastVisitDate === today) {
        // Same day, keep stats
        setStats(parsed)
      } else if (lastVisitDate === new Date(Date.now() - 86400000).toDateString()) {
        // Yesterday, increment streak
        const newStreak = parsed.streak + 1
        const newStats = {
          ...parsed,
          streak: newStreak,
          lastVisit: today,
        }
        setStats(newStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
        
        // Check for milestone
        if (MILESTONE_MESSAGES[newStreak]) {
          setMilestoneMessage(MILESTONE_MESSAGES[newStreak])
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh but keep totals
        const newStats = {
          streak: 1,
          lessonsCompleted: parsed.lessonsCompleted,
          totalMinutes: parsed.totalMinutes,
          lastVisit: today,
        }
        setStats(newStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
      }
    } else {
      // First visit
      const newStats = {
        streak: 1,
        lessonsCompleted: 0,
        totalMinutes: 0,
        lastVisit: today,
      }
      setStats(newStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
      setMilestoneMessage("🎊 Welcome! Your learning journey begins today!")
    }

    // Set random motivational message
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
    setDailyMessage(MOTIVATIONAL_MESSAGES[randomIndex])
  }, [])

  const handleCompleteLesson = () => {
    const newStats = {
      ...stats,
      lessonsCompleted: stats.lessonsCompleted + 1,
      totalMinutes: stats.totalMinutes + 15, // Assume 15 min per lesson
    }
    setStats(newStats)
    localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
    
    // Celebrate every 5 lessons
    if (newStats.lessonsCompleted % 5 === 0) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  if (!isClient) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ec4899'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Milestone Toast */}
      {milestoneMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl shadow-primary-500/30">
            <p className="font-semibold text-lg">{milestoneMessage}</p>
            <button 
              onClick={() => setMilestoneMessage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white text-primary-500 rounded-full flex items-center justify-center text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-900/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span> Your Progress
          </h3>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-3 py-1.5 rounded-full">
            <span className="text-2xl animate-pulse">🔥</span>
            <span className="font-bold text-orange-400">{stats.streak} day streak</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-primary-400">{stats.streak}</div>
            <div className="text-sm text-navy-400">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-green-400">{stats.lessonsCompleted}</div>
            <div className="text-sm text-navy-400">Lessons Done</div>
          </div>
          <div className="text-center p-4 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-blue-400">{stats.totalMinutes}</div>
            <div className="text-sm text-navy-400">Minutes</div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-navy-300">Daily Goal</span>
            <span className="text-primary-400 font-medium">
              {Math.min(stats.lessonsCompleted % 3, 3)}/3 lessons today
            </span>
          </div>
          <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.lessonsCompleted % 3) * 33.33, 100)}%` }}
            />
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-primary-500/10 to-blue-500/10 border border-primary-500/20 rounded-xl p-4">
          <p className="text-navy-200 text-center font-medium">{dailyMessage}</p>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex gap-3">
          <button 
            onClick={handleCompleteLesson}
            className="flex-1 btn-primary text-sm py-2"
          >
            ✅ Complete a Lesson
          </button>
          <button 
            onClick={() => {
              setShowConfetti(true)
              setTimeout(() => setShowConfetti(false), 2000)
            }}
            className="btn-secondary text-sm py-2 px-4"
          >
            🎉
          </button>
        </div>
      </div>
    </div>
  )
}