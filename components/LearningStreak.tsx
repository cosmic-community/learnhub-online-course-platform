'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearning: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The only way to do great work is to love what you learn.", author: "Adapted from Steve Jobs" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [dailyQuote, setDailyQuote] = useState<typeof motivationalQuotes[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)

  useEffect(() => {
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const data: StreakData = JSON.parse(savedData)
      const lastVisit = new Date(data.lastVisitDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today, just load the data
        setStreakData(data)
      } else if (lastVisit === yesterday) {
        // Consecutive day - increment streak!
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisitDate: today,
          totalDaysLearning: data.totalDaysLearning + 1
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewStreak(true)
        
        // Trigger confetti for streak milestones
        if (newData.currentStreak % 7 === 0 || newData.currentStreak === 3) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalDaysLearning: data.totalDaysLearning + 1
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDaysLearning: 1
      }
      localStorage.setItem('learnhub_streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsNewStreak(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

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
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900/50">
        <div className="flex items-start gap-6">
          {/* Streak Fire */}
          <div className="flex-shrink-0">
            <div className={`relative w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 ${isNewStreak ? 'animate-pulse' : ''}`}>
              <span className="text-4xl">🔥</span>
              <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                {streakData.currentStreak}
              </div>
            </div>
          </div>

          {/* Streak Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white">
                {streakData.currentStreak} Day Streak!
              </h3>
              {isNewStreak && (
                <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-full animate-bounce">
                  +1 Today!
                </span>
              )}
            </div>
            <p className="text-navy-400 text-sm mb-3">
              Keep learning daily to build your streak
            </p>
            
            {/* Stats Row */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400">🏆</span>
                <span className="text-navy-300">Best: <span className="text-white font-semibold">{streakData.longestStreak} days</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-blue-400">📚</span>
                <span className="text-navy-300">Total: <span className="text-white font-semibold">{streakData.totalDaysLearning} days</span></span>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          {dailyQuote && (
            <div className="hidden lg:block flex-1 max-w-sm pl-6 border-l border-navy-700">
              <p className="text-navy-300 italic text-sm leading-relaxed">
                "{dailyQuote.quote}"
              </p>
              <p className="text-primary-400 text-xs mt-2 font-medium">
                — {dailyQuote.author}
              </p>
            </div>
          )}
        </div>

        {/* Progress to next milestone */}
        <div className="mt-4 pt-4 border-t border-navy-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-navy-400">Progress to next badge</span>
            <span className="text-primary-400 font-medium">
              {streakData.currentStreak % 7}/{7} days
            </span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${((streakData.currentStreak % 7) / 7) * 100}%` }}
            />
          </div>
          <p className="text-xs text-navy-500 mt-2">
            🎉 Complete 7 consecutive days to earn a weekly learner badge!
          </p>
        </div>
      </div>
    </div>
  )
}