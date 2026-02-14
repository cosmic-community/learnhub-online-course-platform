'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  streak: number
  lastVisit: string
  lessonsToday: number
  dailyGoal: number
  totalLessons: number
}

const motivationalQuotes = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

const DEFAULT_STATS: LearningStats = {
  streak: 0,
  lastVisit: '',
  lessonsToday: 0,
  dailyGoal: 3,
  totalLessons: 0,
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    const today = new Date().toDateString()
    
    if (savedStats) {
      const parsed: LearningStats = JSON.parse(savedStats)
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      // Check streak logic
      if (lastVisitDate === today) {
        // Same day, keep everything
        setStats(parsed)
      } else if (lastVisitDate === yesterdayString) {
        // Yesterday - increment streak!
        const newStats = {
          ...parsed,
          streak: parsed.streak + 1,
          lastVisit: today,
          lessonsToday: 0,
        }
        setStats(newStats)
        localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
      } else {
        // Streak broken
        const newStats = {
          ...parsed,
          streak: 1,
          lastVisit: today,
          lessonsToday: 0,
        }
        setStats(newStats)
        localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
      }
    } else {
      // First visit ever
      const newStats = {
        ...DEFAULT_STATS,
        streak: 1,
        lastVisit: today,
      }
      setStats(newStats)
      localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
    }

    // Random quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)

    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  const progress = stats.dailyGoal > 0 ? Math.min((stats.lessonsToday / stats.dailyGoal) * 100, 100) : 0
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const incrementLesson = () => {
    const newLessonsToday = stats.lessonsToday + 1
    const newStats = {
      ...stats,
      lessonsToday: newLessonsToday,
      totalLessons: stats.totalLessons + 1,
      lastVisit: new Date().toDateString(),
    }
    setStats(newStats)
    localStorage.setItem('learnhub-progress', JSON.stringify(newStats))

    // Check if goal completed
    if (newLessonsToday === stats.dailyGoal) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const updateDailyGoal = (goal: number) => {
    const newStats = { ...stats, dailyGoal: goal }
    setStats(newStats)
    localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
  }

  const getStreakMessage = () => {
    if (stats.streak >= 30) return "Legendary! 🏆"
    if (stats.streak >= 14) return "On fire! 🔥"
    if (stats.streak >= 7) return "Crushing it! 💪"
    if (stats.streak >= 3) return "Building momentum! 🚀"
    return "Great start! ⭐"
  }

  const getStreakEmoji = () => {
    if (stats.streak >= 30) return "🏆"
    if (stats.streak >= 14) return "🔥"
    if (stats.streak >= 7) return "💪"
    if (stats.streak >= 3) return "🚀"
    return "⭐"
  }

  return (
    <div
      className={`fixed bottom-24 right-4 z-40 transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 -top-20 -left-20 -right-20 -bottom-20 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '💪', '🏆'][Math.floor(Math.random() * 5)]}
            </span>
          ))}
        </div>
      )}

      {/* Collapsed View - Just the streak badge */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-navy-900/90 backdrop-blur-lg border border-navy-700 rounded-2xl p-4 shadow-xl hover:border-primary-500/50 transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-navy-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary-500 transition-all duration-1000"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg">{getStreakEmoji()}</span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{stats.streak}</div>
              <div className="text-xs text-navy-400">day streak</div>
            </div>
          </div>
        </button>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-2xl w-80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-4 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                📊 Your Learning Journey
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Streak & Progress */}
            <div className="flex items-center gap-4">
              {/* Progress Ring */}
              <div className="relative flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-navy-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className="text-primary-500 transition-all duration-1000"
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: strokeDashoffset,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">{stats.lessonsToday}</span>
                  <span className="text-xs text-navy-400">/{stats.dailyGoal}</span>
                </div>
              </div>

              {/* Streak Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl animate-pulse">{getStreakEmoji()}</span>
                  <span className="text-3xl font-bold text-white">{stats.streak}</span>
                  <span className="text-navy-400 text-sm">day streak</span>
                </div>
                <p className="text-primary-400 text-sm font-medium">{getStreakMessage()}</p>
              </div>
            </div>

            {/* Daily Goal Selector */}
            <div className="bg-navy-800/50 rounded-xl p-3">
              <label className="text-xs text-navy-400 mb-2 block">Daily Goal</label>
              <div className="flex gap-2">
                {[1, 3, 5, 10].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => updateDailyGoal(goal)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      stats.dailyGoal === goal
                        ? 'bg-primary-500 text-white'
                        : 'bg-navy-700 text-navy-300 hover:bg-navy-600'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{stats.totalLessons}</div>
                <div className="text-xs text-navy-400">Total Lessons</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
                <div className="text-xs text-navy-400">Today&apos;s Goal</div>
              </div>
            </div>

            {/* Log Lesson Button */}
            <button
              onClick={incrementLesson}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
            >
              <span>✓</span>
              Log Completed Lesson
            </button>

            {/* Motivational Quote */}
            <div className="bg-navy-800/30 rounded-xl p-3 border border-navy-700/50">
              <p className="text-navy-300 text-sm italic">&ldquo;{quote.quote}&rdquo;</p>
              <p className="text-primary-400 text-xs mt-1">— {quote.author}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}