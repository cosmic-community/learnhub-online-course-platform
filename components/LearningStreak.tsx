'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalMessages = [
  { threshold: 0, message: "Start your learning journey today! 🚀" },
  { threshold: 1, message: "Great start! Keep the momentum going! 💪" },
  { threshold: 3, message: "3 days strong! You're building a habit! 🌱" },
  { threshold: 7, message: "One week streak! You're on fire! 🔥" },
  { threshold: 14, message: "Two weeks! You're unstoppable! ⚡" },
  { threshold: 30, message: "A month of learning! You're a legend! 🏆" },
  { threshold: 60, message: "60 days! You're in the top 1%! 👑" },
  { threshold: 100, message: "100 days! You've achieved mastery! 🎓" },
]

function getMotivationalMessage(streak: number): string {
  const sorted = [...motivationalMessages].sort((a, b) => b.threshold - a.threshold)
  const match = sorted.find(m => streak >= m.threshold)
  return match?.message ?? motivationalMessages[0].message
}

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '👑'
  if (streak >= 60) return '🏆'
  if (streak >= 30) return '⭐'
  if (streak >= 14) return '⚡'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '🌱'
  if (streak >= 1) return '✨'
  return '🎯'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsAnimating(true)
        
        // Show confetti for milestone streaks
        if ([7, 14, 30, 60, 100].includes(newStreak)) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsAnimating(true)
    }
  }, [])

  if (!streakData) return null

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '🎊', '✨', '⭐', '🔥'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className={`card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20 ${isAnimating ? 'animate-streak-pulse' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Streak Badge */}
            <div className="relative">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl shadow-lg shadow-primary-500/30 ${isAnimating ? 'animate-bounce-subtle' : ''}`}>
                {getStreakEmoji(streakData.currentStreak)}
              </div>
              {streakData.currentStreak > 0 && (
                <div className="absolute -top-1 -right-1 bg-white text-navy-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                  {streakData.currentStreak}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">
                  {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''} Streak!
                </h3>
                {streakData.currentStreak >= 7 && (
                  <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-full animate-pulse">
                    ON FIRE
                  </span>
                )}
              </div>
              <p className="text-navy-300 text-sm mt-1">
                {getMotivationalMessage(streakData.currentStreak)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="w-px h-10 bg-navy-700" />
            <div className="text-center">
              <div className="text-lg font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
          </div>
        </div>

        {/* Progress Bar to Next Milestone */}
        <div className="mt-4">
          <StreakProgress currentStreak={streakData.currentStreak} />
        </div>
      </div>
    </div>
  )
}

function StreakProgress({ currentStreak }: { currentStreak: number }) {
  const milestones = [7, 14, 30, 60, 100]
  const nextMilestone = milestones.find(m => m > currentStreak) ?? 100
  const prevMilestone = milestones.filter(m => m <= currentStreak).pop() ?? 0
  
  const progress = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
  const daysToGo = nextMilestone - currentStreak

  if (currentStreak >= 100) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-primary-400 font-semibold">🏆 Maximum streak achieved!</span>
        <span className="text-navy-400">You&apos;re a learning legend!</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-navy-400">
          {daysToGo} day{daysToGo !== 1 ? 's' : ''} to {nextMilestone}-day milestone
        </span>
        <span className="text-primary-400 font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-navy-500">
        {milestones.map((milestone) => (
          <span 
            key={milestone}
            className={currentStreak >= milestone ? 'text-primary-400' : ''}
          >
            {milestone}d
          </span>
        ))}
      </div>
    </div>
  )
}