'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get random quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
    setQuote(randomQuote)

    // Load and update streak data
    const storedData = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()

      let newStreak = data.currentStreak
      let newLongest = data.longestStreak

      if (lastVisitDate === today) {
        // Already visited today, keep the streak
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak
        newStreak = data.currentStreak + 1
        newLongest = Math.max(newLongest, newStreak)
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub_streak', JSON.stringify(newData))
      setStreakData(newData)
    }

    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🌟'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Legendary learner! You're unstoppable!"
    if (streak >= 14) return "Two weeks strong! Keep it up!"
    if (streak >= 7) return "One week streak! You're on fire!"
    if (streak >= 3) return "Great momentum! Keep learning!"
    return "Welcome back! Every day counts!"
  }

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Streak Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl animate-pulse">
                {getStreakEmoji(streakData.currentStreak)}
              </div>
              {streakData.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-navy-950">
                  {streakData.currentStreak}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
                </span>
                <span className="text-primary-400">Streak!</span>
              </div>
              <p className="text-navy-400 text-sm">{getStreakMessage(streakData.currentStreak)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-6 pt-6 border-t border-navy-800">
          <blockquote className="text-navy-300 italic">
            "{quote.quote}"
            <footer className="mt-2 text-sm text-primary-400">— {quote.author}</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}