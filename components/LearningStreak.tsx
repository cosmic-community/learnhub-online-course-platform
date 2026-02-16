'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
}

const TIPS = [
  "💡 Consistency beats intensity. 20 minutes daily > 3 hours once a week.",
  "🎯 Set a specific learning goal for today before you start.",
  "🧠 Teaching what you learn helps you remember 90% more!",
  "⏰ The Pomodoro technique: 25 min focus, 5 min break. Try it!",
  "📝 Take notes by hand—it improves retention by 34%.",
  "🔄 Review yesterday's lesson before starting today's.",
  "💪 Struggle is part of learning. Embrace the challenge!",
  "🎮 Build projects, not just tutorials. Apply what you learn.",
  "☕ Stay hydrated! Your brain is 75% water.",
  "🌟 You're one lesson closer to your goals. Keep going!",
]

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [tip, setTip] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    // Get random tip
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)]
    setTip(randomTip)

    // Load streak from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()

    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      if (lastDate === today) {
        // Same day visit
        setStreak(data)
      } else if (lastDate === yesterdayString) {
        // Consecutive day - increase streak!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setIsNewDay(true)
        
        // Show confetti for milestone streaks
        if (newStreak.currentStreak % 5 === 0 || newStreak.currentStreak === 3) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start over
        const newStreak: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setIsNewDay(true)
      }
    } else {
      // First visit ever
      const newStreak: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
      setIsNewDay(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  if (!streak) return null

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#2dd4bf', '#fbbf24', '#f472b6', '#818cf8'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      {/* Learning Streak Banner */}
      <div className="bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-pulse">🔥</span>
                <div>
                  <span className="text-white font-bold text-lg">{streak.currentStreak}</span>
                  <span className="text-navy-400 text-sm ml-1">day streak</span>
                </div>
              </div>
              
              {isNewDay && streak.currentStreak > 1 && (
                <span className="badge bg-primary-500/20 text-primary-400 animate-bounce-subtle">
                  +1 🎉
                </span>
              )}

              <div className="hidden sm:block h-6 w-px bg-navy-700" />
              
              <div className="hidden sm:flex items-center gap-2 text-navy-400 text-sm">
                <span>📚</span>
                <span>{streak.totalVisits} total visits</span>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-navy-300 hidden md:inline">{tip}</span>
              <span className="text-navy-300 md:hidden">{tip.split('.')[0]}.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}