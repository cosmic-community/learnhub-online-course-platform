'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalMinutesLearned: number
}

const motivationalQuotes = [
  { quote: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
]

const morningQuotes = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Every morning brings new potential.", author: "Unknown" },
  { quote: "Today is a perfect day to start learning something new.", author: "Unknown" },
]

const eveningQuotes = [
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Rest, but don't quit.", author: "Unknown" },
  { quote: "Every expert was once a beginner who didn't give up.", author: "Unknown" },
]

function getTimeBasedQuote(): { quote: string; author: string } {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return morningQuotes[Math.floor(Math.random() * morningQuotes.length)] ?? motivationalQuotes[0] ?? { quote: "Keep learning!", author: "Unknown" }
  } else if (hour >= 18 || hour < 5) {
    return eveningQuotes[Math.floor(Math.random() * eveningQuotes.length)] ?? motivationalQuotes[0] ?? { quote: "Keep learning!", author: "Unknown" }
  }
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)] ?? { quote: "Keep learning!", author: "Unknown" }
}

function getStoredStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', totalMinutesLearned: 0 }
  }
  
  const stored = localStorage.getItem('learnhub-streak')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', totalMinutesLearned: 0 }
    }
  }
  return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', totalMinutesLearned: 0 }
}

function updateStreak(): StreakData {
  const today = new Date().toISOString().split('T')[0] ?? ''
  const stored = getStoredStreak()
  
  if (stored.lastActiveDate === today) {
    return stored
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  let newStreak: StreakData
  
  if (stored.lastActiveDate === yesterdayStr) {
    // Continuing streak
    newStreak = {
      currentStreak: stored.currentStreak + 1,
      longestStreak: Math.max(stored.longestStreak, stored.currentStreak + 1),
      lastActiveDate: today,
      totalMinutesLearned: stored.totalMinutesLearned + Math.floor(Math.random() * 30) + 10,
    }
  } else {
    // Starting new streak
    newStreak = {
      currentStreak: 1,
      longestStreak: Math.max(stored.longestStreak, 1),
      lastActiveDate: today,
      totalMinutesLearned: stored.totalMinutesLearned + Math.floor(Math.random() * 30) + 10,
    }
  }
  
  localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
  return newStreak
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastActiveDate: '', totalMinutesLearned: 0 })
  const [quote, setQuote] = useState<{ quote: string; author: string }>({ quote: '', author: '' })
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updatedStreak = updateStreak()
    setStreak(updatedStreak)
    setQuote(getTimeBasedQuote())
    
    // Trigger animation
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 2000)
    
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 border-orange-500/20">
        <div className="animate-pulse h-24 bg-navy-800 rounded"></div>
      </div>
    )
  }

  const fireEmojis = streak.currentStreak >= 7 ? '🔥🔥🔥' : streak.currentStreak >= 3 ? '🔥🔥' : '🔥'

  return (
    <div className="card p-6 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10 border-orange-500/20 relative overflow-hidden">
      {/* Animated fire particles */}
      {isAnimating && streak.currentStreak > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${20 + i * 15}%`,
                bottom: '0',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            >
              <span className="text-2xl opacity-60">🔥</span>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className={`transition-transform ${isAnimating ? 'animate-bounce' : ''}`}>
              {fireEmojis}
            </span>
            Learning Streak
          </h3>
          <div className="text-right">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              {streak.currentStreak}
            </span>
            <span className="text-navy-400 text-sm block">days</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-xl font-bold text-yellow-400">🏆 {streak.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-xl font-bold text-primary-400">⏱️ {streak.totalMinutesLearned}</div>
            <div className="text-xs text-navy-400">Minutes</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-xl font-bold text-purple-400">📚 {Math.floor(streak.totalMinutesLearned / 60)}</div>
            <div className="text-xs text-navy-400">Hours Total</div>
          </div>
        </div>

        {/* Weekly progress dots */}
        <div className="flex justify-center gap-2 mb-4">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const isActive = i < streak.currentStreak % 7 || (streak.currentStreak >= 7 && i < 7)
            return (
              <div key={i} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white scale-110' 
                    : 'bg-navy-800 text-navy-500'
                }`}>
                  {isActive ? '✓' : day}
                </div>
              </div>
            )
          })}
        </div>

        {/* Motivational quote */}
        {quote.quote && (
          <div className="pt-4 border-t border-navy-700/50">
            <p className="text-sm text-navy-300 italic">"{quote.quote}"</p>
            <p className="text-xs text-navy-500 mt-1">— {quote.author}</p>
          </div>
        )}
      </div>
    </div>
  )
}