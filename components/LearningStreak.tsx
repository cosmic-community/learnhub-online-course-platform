'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  todayCompleted: boolean
  weekProgress: boolean[]
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    todayCompleted: false,
    weekProgress: [false, false, false, false, false, false, false],
  })
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    if (savedStreak) {
      try {
        const parsed = JSON.parse(savedStreak)
        setStreakData(parsed)
      } catch {
        // Initialize with demo data for delight
        initializeDemoStreak()
      }
    } else {
      initializeDemoStreak()
    }

    // Rotate quotes
    const quoteInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
        setIsAnimating(false)
      }, 300)
    }, 8000)

    return () => clearInterval(quoteInterval)
  }, [])

  const initializeDemoStreak = () => {
    // Create engaging demo data
    const demoData: StreakData = {
      currentStreak: 7,
      longestStreak: 14,
      todayCompleted: true,
      weekProgress: [true, true, true, false, true, true, true],
    }
    setStreakData(demoData)
    localStorage.setItem('learning-streak', JSON.stringify(demoData))
  }

  const handleCheckIn = () => {
    const newData = {
      ...streakData,
      todayCompleted: true,
      currentStreak: streakData.todayCompleted ? streakData.currentStreak : streakData.currentStreak + 1,
      weekProgress: [...streakData.weekProgress.slice(1), true],
    }
    newData.longestStreak = Math.max(newData.longestStreak, newData.currentStreak)
    setStreakData(newData)
    localStorage.setItem('learning-streak', JSON.stringify(newData))
  }

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  if (!mounted) {
    return null
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl animate-pulse">
            🔥
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
            <p className="text-sm text-navy-400">Keep the momentum going!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-400">{streakData.currentStreak}</div>
          <div className="text-xs text-navy-400">day streak</div>
        </div>
      </div>

      {/* Week Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-navy-400">This Week</span>
          <span className="text-sm text-primary-400">
            {streakData.weekProgress.filter(Boolean).length}/7 days
          </span>
        </div>
        <div className="flex gap-2">
          {streakData.weekProgress.map((completed, index) => (
            <div
              key={index}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                completed
                  ? 'bg-primary-500/20 border border-primary-500/40'
                  : 'bg-navy-800/50 border border-navy-700/50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                  completed
                    ? 'bg-primary-500 text-white scale-110'
                    : 'bg-navy-700 text-navy-400'
                }`}
              >
                {completed ? '✓' : dayNames[index]}
              </div>
              <span className={`text-xs ${completed ? 'text-primary-400' : 'text-navy-500'}`}>
                {dayNames[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-navy-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
          <div className="text-xs text-navy-400">Best Streak</div>
        </div>
        <div className="bg-navy-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">
            {Math.round((streakData.weekProgress.filter(Boolean).length / 7) * 100)}%
          </div>
          <div className="text-xs text-navy-400">Weekly Goal</div>
        </div>
      </div>

      {/* Check-in Button */}
      {!streakData.todayCompleted ? (
        <button
          onClick={handleCheckIn}
          className="w-full btn-primary group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-xl">🎯</span>
            Check In Today
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ) : (
        <div className="w-full py-3 px-6 bg-green-500/20 border border-green-500/40 rounded-lg text-center">
          <span className="text-green-400 flex items-center justify-center gap-2">
            <span className="text-xl">🌟</span>
            You&apos;re on fire today!
          </span>
        </div>
      )}

      {/* Motivational Quote */}
      <div
        className={`mt-6 p-4 bg-navy-800/30 rounded-lg border-l-4 border-primary-500 transition-all duration-300 ${
          isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        <p className="text-sm text-navy-300 italic">&ldquo;{quote.text}&rdquo;</p>
        <p className="text-xs text-primary-400 mt-2">— {quote.author}</p>
      </div>
    </div>
  )
}