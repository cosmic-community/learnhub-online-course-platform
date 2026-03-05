'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
  weekDays: boolean[]
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
]

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  const initializeStreak = useCallback(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisit === today) {
        // Same day visit
        setStreakData(data)
      } else if (lastVisit === yesterdayStr) {
        // Consecutive day - increment streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          totalDays: data.totalDays + 1,
          weekDays: updateWeekDays(data.weekDays),
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
        // Show celebration for streak continuation!
        if (newStreak > 1) {
          setShowConfetti(true)
          setIsAnimating(true)
          setTimeout(() => setShowConfetti(false), 3000)
          setTimeout(() => setIsAnimating(false), 1000)
        }
      } else {
        // Streak broken - reset but keep records
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDays: data.totalDays + 1,
          weekDays: updateWeekDays([false, false, false, false, false, false, false]),
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First time visitor - welcome!
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDays: 1,
        weekDays: updateWeekDays([false, false, false, false, false, false, false]),
      }
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  const updateWeekDays = (current: boolean[]): boolean[] => {
    const today = new Date().getDay()
    const newWeek = [...current]
    newWeek[today] = true
    return newWeek
  }

  useEffect(() => {
    initializeStreak()
    // Random quote
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
  }, [initializeStreak])

  if (!streakData) return null

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#29ABE2', '#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className={`card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20 ${isAnimating ? 'animate-pulse-glow' : ''}`}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Streak Fire Icon */}
          <div className="relative">
            <div className={`text-6xl ${isAnimating ? 'animate-bounce' : 'animate-flame'}`}>
              🔥
            </div>
            <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              {streakData.currentStreak}
            </div>
          </div>

          {/* Streak Info */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white mb-1">
              {streakData.currentStreak === 1 ? (
                "Welcome, Learner! 🎉"
              ) : streakData.currentStreak < 7 ? (
                `${streakData.currentStreak} Day Streak! Keep Going! 💪`
              ) : streakData.currentStreak < 30 ? (
                `${streakData.currentStreak} Day Streak! You're On Fire! 🔥`
              ) : (
                `${streakData.currentStreak} Day Streak! Legendary! 👑`
              )}
            </h3>
            <p className="text-navy-300 text-sm mb-4">
              {streakData.totalDays === 1 
                ? "Start your learning journey today!"
                : `You've learned for ${streakData.totalDays} total days. Best streak: ${streakData.longestStreak} days!`
              }
            </p>

            {/* Week Progress */}
            <div className="flex justify-center lg:justify-start gap-2 mb-4">
              {streakData.weekDays.map((active, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-navy-500">{dayNames[i]}</span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      active 
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                        : 'bg-navy-800 text-navy-600'
                    } ${i === new Date().getDay() && !active ? 'ring-2 ring-primary-500/50 ring-offset-2 ring-offset-navy-900' : ''}`}
                  >
                    {active ? '✓' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="hidden xl:block max-w-xs pl-6 border-l border-navy-700">
            <p className="text-navy-300 italic text-sm mb-2">&ldquo;{quote.quote}&rdquo;</p>
            <p className="text-primary-400 text-xs">— {quote.author}</p>
          </div>
        </div>

        {/* Achievement Badges */}
        {streakData.totalDays >= 3 && (
          <div className="mt-4 pt-4 border-t border-navy-700/50">
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {streakData.totalDays >= 3 && (
                <span className="badge bg-green-500/20 text-green-400 text-xs">
                  🌱 Getting Started
                </span>
              )}
              {streakData.totalDays >= 7 && (
                <span className="badge bg-blue-500/20 text-blue-400 text-xs">
                  📚 Week Warrior
                </span>
              )}
              {streakData.longestStreak >= 7 && (
                <span className="badge bg-purple-500/20 text-purple-400 text-xs">
                  🔥 Streak Master
                </span>
              )}
              {streakData.totalDays >= 30 && (
                <span className="badge bg-yellow-500/20 text-yellow-400 text-xs">
                  ⭐ Dedicated Learner
                </span>
              )}
              {streakData.longestStreak >= 30 && (
                <span className="badge bg-red-500/20 text-red-400 text-xs">
                  👑 Legend
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}