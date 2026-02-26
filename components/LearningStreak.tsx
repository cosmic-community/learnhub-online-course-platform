'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
  weekActivity: boolean[]
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Get today's quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    // Load and update streak data
    const loadStreakData = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      let data: StreakData = stored ? JSON.parse(stored) : {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        totalDaysLearned: 0,
        weekActivity: [false, false, false, false, false, false, false]
      }

      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastVisitDate.getTime()) / 86400000)

      if (data.lastVisit !== today) {
        // New day visit
        if (diffDays === 1) {
          // Consecutive day
          data.currentStreak += 1
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        } else if (!data.lastVisit) {
          // First visit ever
          data.currentStreak = 1
        }
        
        data.lastVisit = today
        data.totalDaysLearned += 1
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
          // Trigger confetti for new record!
          if (data.currentStreak > 1) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }
        }

        // Update week activity (last 7 days including today)
        const dayOfWeek = todayDate.getDay()
        data.weekActivity = data.weekActivity.map((_, i) => {
          if (i === dayOfWeek) return true
          // Keep other days as-is for now (simplified)
          return data.weekActivity[i]
        })

        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }

      setStreakData(data)
    }

    loadStreakData()
    
    // Show after slight delay for smooth appearance
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!streakData || !isVisible) return null

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const todayIndex = new Date().getDay()

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
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
              {['🎉', '⭐', '🔥', '✨', '🎊', '💫'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Floating Streak Widget */}
      <div 
        className={`fixed left-5 bottom-5 z-40 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div 
          className={`bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-80' : 'w-auto'
          }`}
        >
          {/* Main Streak Badge */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 p-4 w-full hover:bg-navy-800/50 transition-colors"
          >
            <div className="relative">
              <span className={`text-3xl ${streakData.currentStreak > 0 ? 'animate-pulse' : ''}`}>
                {streakData.currentStreak > 0 ? '🔥' : '❄️'}
              </span>
              {streakData.currentStreak >= 7 && (
                <span className="absolute -top-1 -right-1 text-sm">⭐</span>
              )}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">
                {streakData.currentStreak}
              </div>
              <div className="text-xs text-navy-400">
                day streak
              </div>
            </div>
            <div className={`ml-auto transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-navy-800">
              {/* Week Activity */}
              <div className="pt-4">
                <div className="text-xs text-navy-400 mb-2">This Week</div>
                <div className="flex justify-between">
                  {dayNames.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-navy-500">{day}</span>
                      <div 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                          i === todayIndex 
                            ? 'bg-primary-500 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' 
                            : streakData.weekActivity[i] 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-navy-800 text-navy-600'
                        }`}
                      >
                        {i === todayIndex ? '✓' : streakData.weekActivity[i] ? '✓' : '·'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-primary-400">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-400">{streakData.totalDaysLearned}</div>
                  <div className="text-xs text-navy-400">Days Learned</div>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="bg-gradient-to-r from-primary-500/10 to-transparent border-l-2 border-primary-500 rounded-r-lg p-3">
                <p className="text-sm text-navy-200 italic">"{quote.quote}"</p>
                <p className="text-xs text-navy-400 mt-1">— {quote.author}</p>
              </div>

              {/* Achievement Badges */}
              {streakData.currentStreak >= 3 && (
                <div className="flex flex-wrap gap-2">
                  {streakData.currentStreak >= 3 && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      🌟 3-Day Warrior
                    </span>
                  )}
                  {streakData.currentStreak >= 7 && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      🏆 Week Champion
                    </span>
                  )}
                  {streakData.totalDaysLearned >= 10 && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      📚 Dedicated Learner
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}