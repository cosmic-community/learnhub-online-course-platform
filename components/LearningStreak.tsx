'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Gandhi" },
]

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalVisits: 0
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get random quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)

    // Load streak from localStorage
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
        setStreak(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, continue streak!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setIsNewStreak(true)
        
        // Celebrate milestones
        if ([3, 7, 14, 30, 50, 100].includes(newStreak.currentStreak)) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 4000)
        }
      } else {
        // Streak broken, start fresh
        const newStreak: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      }
    } else {
      // First visit ever!
      const newStreak: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      setStreak(newStreak)
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setIsNewStreak(true)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '👑'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return 'Learning Legend!'
    if (streak >= 50) return 'Incredible dedication!'
    if (streak >= 30) return 'One month strong!'
    if (streak >= 14) return 'Two weeks of growth!'
    if (streak >= 7) return 'One week warrior!'
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  fontSize: `${20 + Math.random() * 20}px`,
                }}
              >
                {['🎉', '🎊', '⭐', '🔥', '✨', '💫', '🌟'][Math.floor(Math.random() * 7)]}
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-6 rounded-2xl shadow-2xl text-center animate-pulse pointer-events-auto">
            <div className="text-4xl mb-2">{getStreakEmoji(streak.currentStreak)}</div>
            <div className="text-2xl font-bold mb-1">{streak.currentStreak} Day Streak!</div>
            <div className="text-primary-100">{getStreakMessage(streak.currentStreak)}</div>
          </div>
        </div>
      )}

      {/* Streak Card */}
      <div className="card p-6 relative overflow-hidden group">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {getStreakEmoji(streak.currentStreak)} Learning Streak
              {isNewStreak && (
                <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full animate-pulse">
                  +1 today!
                </span>
              )}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-1">
                {streak.currentStreak}
              </div>
              <div className="text-xs text-navy-400">Current</div>
            </div>
            <div className="text-center border-x border-navy-700">
              <div className="text-3xl font-bold text-white mb-1">
                {streak.longestStreak}
              </div>
              <div className="text-xs text-navy-400">Best</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-300 mb-1">
                {streak.totalVisits}
              </div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
          </div>

          {/* Progress to next milestone */}
          <div className="mb-4">
            {(() => {
              const milestones = [3, 7, 14, 30, 50, 100]
              const nextMilestone = milestones.find(m => m > streak.currentStreak) || 100
              const prevMilestone = milestones.filter(m => m <= streak.currentStreak).pop() || 0
              const progress = ((streak.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
              
              return (
                <>
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>{prevMilestone || 'Start'}</span>
                    <span>{nextMilestone} day milestone</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </>
              )
            })()}
          </div>

          {/* Motivational Quote */}
          <div className="border-t border-navy-800 pt-4">
            <p className="text-sm text-navy-300 italic">"{quote.text}"</p>
            <p className="text-xs text-navy-500 mt-1">— {quote.author}</p>
          </div>
        </div>
      </div>
    </>
  )
}