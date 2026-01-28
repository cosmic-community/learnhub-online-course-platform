'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalDays: number
  longestStreak: number
}

interface Quote {
  text: string
  author: string
}

const motivationalQuotes: Quote[] = [
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "The more you learn, the more you earn.", author: "Warren Buffett" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
]

const milestones = [3, 7, 14, 30, 50, 100, 365]

export default function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [quote, setQuote] = useState<Quote>(motivationalQuotes[0])
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Changed: Return string type explicitly with fallback
  const getDateString = (date: Date): string => {
    const dateStr = date.toISOString().split('T')[0]
    return dateStr ?? new Date().toISOString().slice(0, 10)
  }

  const initializeStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub_streak')
    const today = getDateString(new Date())
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      // Changed: Handle potentially undefined lastVisit with fallback
      const lastVisitStr = data.lastVisit ?? today
      const lastVisit = new Date(lastVisitStr)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day, no change
        setStreakData(data)
      } else if (diffDays === 1) {
        // Consecutive day!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          totalDays: data.totalDays + 1,
          longestStreak: Math.max(data.longestStreak, newStreak)
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for milestone celebration
        if (milestones.includes(newStreak)) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh but keep stats
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalDays: data.totalDays + 1,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalDays: 1,
        longestStreak: 1
      }
      localStorage.setItem('learnhub_streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    initializeStreak()
    
    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
      // Changed: Ensure we always have a valid quote
      if (randomQuote) {
        setQuote(randomQuote)
      }
    }, 10000)

    // Set random initial quote
    const initialQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    // Changed: Ensure we always have a valid quote
    if (initialQuote) {
      setQuote(initialQuote)
    }

    return () => clearInterval(quoteInterval)
  }, [initializeStreak])

  if (!mounted || !streakData) {
    return null
  }

  const getFlameSize = () => {
    if (streakData.currentStreak >= 30) return 'text-5xl'
    if (streakData.currentStreak >= 14) return 'text-4xl'
    if (streakData.currentStreak >= 7) return 'text-3xl'
    if (streakData.currentStreak >= 3) return 'text-2xl'
    return 'text-xl'
  }

  const getFlameColor = () => {
    if (streakData.currentStreak >= 30) return 'from-orange-500 via-red-500 to-yellow-400'
    if (streakData.currentStreak >= 14) return 'from-orange-400 via-red-400 to-yellow-300'
    if (streakData.currentStreak >= 7) return 'from-orange-300 via-red-300 to-yellow-200'
    return 'from-orange-200 via-red-200 to-yellow-100'
  }

  const getNextMilestone = () => {
    return milestones.find(m => m > streakData.currentStreak) || null
  }

  const nextMilestone = getNextMilestone()
  const progressToMilestone = nextMilestone 
    ? ((streakData.currentStreak / nextMilestone) * 100)
    : 100

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative group flex items-center gap-2 bg-navy-900/90 backdrop-blur-lg 
            border border-navy-700 rounded-full px-4 py-3 
            transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20
            ${isExpanded ? 'rounded-2xl' : ''}
          `}
        >
          {/* Animated Flame */}
          <div className={`${getFlameSize()} animate-flame relative`}>
            <span className="relative z-10">🔥</span>
            <div className={`absolute inset-0 blur-md bg-gradient-to-t ${getFlameColor()} opacity-50 rounded-full`} />
          </div>
          
          {/* Streak Count */}
          <div className="flex flex-col items-start">
            <span className="text-white font-bold text-lg leading-none">
              {streakData.currentStreak}
            </span>
            <span className="text-navy-400 text-xs">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          </div>

          {/* Expand Indicator */}
          <svg 
            className={`w-4 h-4 text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl p-5 shadow-2xl animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Learning Streak</h3>
              <div className="flex items-center gap-1 text-primary-400 text-sm">
                <span>🏆</span>
                <span>Best: {streakData.longestStreak} days</span>
              </div>
            </div>

            {/* Current Streak Display */}
            <div className="flex items-center justify-center gap-4 mb-4 py-4 bg-navy-800/50 rounded-xl">
              <div className={`${getFlameSize()} animate-flame`}>🔥</div>
              <div>
                <div className="text-4xl font-bold text-white">{streakData.currentStreak}</div>
                <div className="text-navy-400 text-sm">day streak</div>
              </div>
            </div>

            {/* Progress to Next Milestone */}
            {nextMilestone && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-navy-400">Next milestone</span>
                  <span className="text-primary-400">{nextMilestone} days</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressToMilestone}%` }}
                  />
                </div>
                <div className="text-right text-xs text-navy-500 mt-1">
                  {nextMilestone - streakData.currentStreak} days to go
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalDays}</div>
                <div className="text-navy-400 text-xs">Total Learning Days</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Longest Streak</div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="border-t border-navy-700 pt-4">
              <div className="flex gap-2">
                <span className="text-primary-400 text-lg">💡</span>
                <div>
                  <p className="text-navy-200 text-sm italic leading-relaxed">
                    &quot;{quote.text}&quot;
                  </p>
                  <p className="text-navy-500 text-xs mt-1">— {quote.author}</p>
                </div>
              </div>
            </div>

            {/* Milestone Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              {milestones.filter(m => m <= streakData.longestStreak).map(milestone => (
                <div 
                  key={milestone}
                  className="flex items-center gap-1 bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs"
                >
                  <span>🎖️</span>
                  <span>{milestone} days</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}