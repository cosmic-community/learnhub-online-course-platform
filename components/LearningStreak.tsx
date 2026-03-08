'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  startDate: string
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not a spectator sport.", author: "D. Blocher" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Gandhi" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The more I live, the more I learn. The more I learn, the more I realize, the less I know.", author: "Michel Legrand" },
]

const milestones = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [dailyQuote, setDailyQuote] = useState({ quote: '', author: '' })
  const [mounted, setMounted] = useState(false)

  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  const getDayOfYear = useCallback(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Set daily quote based on day of year
    const quoteIndex = getDayOfYear() % motivationalQuotes.length
    setDailyQuote(motivationalQuotes[quoteIndex] ?? { quote: '', author: '' })

    // Load or initialize streak data
    const storedData = localStorage.getItem('learnhub-streak')
    const today = getTodayString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Same day, just load existing data
        setStreakData(data)
      } else if (diffDays === 1) {
        // Consecutive day! Increase streak
        const newStreak = data.currentStreak + 1
        const newLongest = Math.max(newStreak, data.longestStreak)
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Check for milestone celebration
        if (milestones.includes(newStreak)) {
          setCelebrationMessage(`🎉 Amazing! ${newStreak} day streak!`)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 5000)
        }
      } else {
        // Streak broken, reset to 1
        const newData: StreakData = {
          ...data,
          currentStreak: 1,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First time visitor
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDaysLearned: 1,
        startDate: today,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setCelebrationMessage('🚀 Welcome! Your learning journey begins!')
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 4000)
    }
  }, [getTodayString, getDayOfYear])

  if (!mounted || !streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🏆'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '✨'
    if (streak >= 3) return '🌟'
    return '💪'
  }

  const getNextMilestone = (currentStreak: number) => {
    return milestones.find(m => m > currentStreak) ?? milestones[milestones.length - 1] ?? 365
  }

  const progressToNextMilestone = () => {
    const next = getNextMilestone(streakData.currentStreak)
    const prev = milestones.filter(m => m < streakData.currentStreak).pop() ?? 0
    const progress = ((streakData.currentStreak - prev) / (next - prev)) * 100
    return Math.min(progress, 100)
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
                  width: `${8 + Math.random() * 8}px`,
                  height: `${8 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                }}
              />
            ))}
          </div>
          {/* Message */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce-in text-xl font-bold">
            {celebrationMessage}
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
          aria-label="Toggle learning streak"
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
            streakData.currentStreak >= 7 ? 'bg-primary-500/40 opacity-100' : 'opacity-0'
          }`} />
          
          {/* Main button */}
          <div className={`relative flex items-center gap-2 bg-navy-900 border border-navy-700 rounded-full px-4 py-2 shadow-lg transition-all duration-300 hover:border-primary-500/50 hover:shadow-primary-500/20 hover:shadow-xl ${
            isExpanded ? 'pr-6' : ''
          }`}>
            <span className="text-2xl animate-pulse-slow">
              {getStreakEmoji(streakData.currentStreak)}
            </span>
            <span className="text-white font-bold">{streakData.currentStreak}</span>
            <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          </div>
        </button>

        {/* Expanded Panel */}
        <div className={`absolute bottom-14 left-0 transition-all duration-300 ${
          isExpanded 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl p-5 shadow-2xl w-72">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
                Learning Streak
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-navy-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-navy-400 text-xs">Current Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best Streak</div>
              </div>
            </div>

            {/* Progress to next milestone */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-navy-400">Next milestone</span>
                <span className="text-primary-400">{getNextMilestone(streakData.currentStreak)} days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressToNextMilestone()}%` }}
                />
              </div>
            </div>

            {/* Daily Quote */}
            <div className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl p-3">
              <div className="text-xs text-primary-400 mb-1">💡 Daily Inspiration</div>
              <p className="text-sm text-navy-200 italic leading-relaxed">
                "{dailyQuote.quote}"
              </p>
              <p className="text-xs text-navy-400 mt-1">— {dailyQuote.author}</p>
            </div>

            {/* Total days */}
            <div className="mt-4 pt-3 border-t border-navy-700 text-center">
              <span className="text-navy-400 text-sm">
                Total: <span className="text-white font-semibold">{streakData.totalDaysLearned}</span> days of learning
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}