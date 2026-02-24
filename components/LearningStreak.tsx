'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalLearningDays: number
  lessonsCompleted: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0])
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    // Get or initialize streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    // Set daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      if (lastVisitDate === today) {
        // Same day, just load the data
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Consecutive day - increment streak!
        const newData: StreakData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalLearningDays: data.totalLearningDays + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setIsNewDay(true)
        
        // Show celebration for streak milestones
        if (newData.currentStreak % 7 === 0 || newData.currentStreak === 3) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalLearningDays: data.totalLearningDays + 1,
          lessonsCompleted: data.lessonsCompleted,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setIsNewDay(true)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalLearningDays: 1,
        lessonsCompleted: 0,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setIsNewDay(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-navy-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-navy-800 rounded w-2/3"></div>
      </div>
    )
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '💎'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '⚡'
    return '✨'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Legendary learner!"
    if (streak >= 14) return "You're unstoppable!"
    if (streak >= 7) return "On fire this week!"
    if (streak >= 3) return "Building momentum!"
    return "Great start!"
  }

  return (
    <div className="relative">
      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          {/* Header with streak */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce-slow">{getStreakEmoji(streakData.currentStreak)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">{streakData.currentStreak}</span>
                  <span className="text-lg text-navy-400">day streak</span>
                </div>
                <p className="text-primary-400 text-sm font-medium">{getStreakMessage(streakData.currentStreak)}</p>
              </div>
            </div>
            {isNewDay && (
              <div className="badge badge-free animate-pulse">
                +1 Today! 🎉
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-xl font-bold text-white">{streakData.totalLearningDays}</div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-xl font-bold text-white">{streakData.lessonsCompleted}</div>
              <div className="text-xs text-navy-400">Lessons Done</div>
            </div>
          </div>

          {/* Weekly Progress Visualization */}
          <div className="mb-6">
            <div className="text-sm text-navy-400 mb-2">This Week</div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => {
                const dayDate = new Date()
                dayDate.setDate(dayDate.getDate() - (6 - i))
                const isToday = i === 6
                const isPast = i < 6
                const isActive = i >= 7 - Math.min(streakData.currentStreak, 7)
                
                return (
                  <div
                    key={i}
                    className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-t from-primary-600 to-primary-400 text-white shadow-lg shadow-primary-500/25' 
                        : 'bg-navy-800 text-navy-500'
                    } ${isToday ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' : ''}`}
                  >
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayDate.getDay()]}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Daily Quote */}
          <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-lg p-4 border border-primary-500/20">
            <p className="text-navy-200 italic text-sm mb-2">"{dailyQuote.quote}"</p>
            <p className="text-primary-400 text-xs font-medium">— {dailyQuote.author}</p>
          </div>
        </div>
      </div>
    </div>
  )
}