'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
  { quote: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
  { quote: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { quote: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
]

const milestones = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get quote based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    // Load and update streak data
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored 
      ? JSON.parse(stored) 
      : { currentStreak: 0, lastVisit: '', longestStreak: 0, totalVisits: 0 }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate !== today) {
      // New day visit
      data.totalVisits += 1

      if (lastVisitDate === yesterday) {
        // Consecutive day - increment streak
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        // Streak broken or first visit
        data.currentStreak = 1
      }

      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }

      // Check for milestone celebration
      if (milestones.includes(data.currentStreak)) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }

      data.lastVisit = today
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
    
    // Animate in
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 365) return '👑'
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '⭐'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '💪'
    if (streak >= 7) return '🎯'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getNextMilestone = (current: number) => {
    return milestones.find(m => m > current) || current
  }

  const progress = streakData.currentStreak > 0 
    ? (streakData.currentStreak / getNextMilestone(streakData.currentStreak)) * 100 
    : 0

  return (
    <div 
      className={`relative transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              {['🎉', '🎊', '✨', '💫', '⭐'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl shadow-lg shadow-primary-500/30">
                {getStreakEmoji(streakData.currentStreak)}
              </div>
              {showCelebration && (
                <div className="absolute inset-0 rounded-full animate-ping bg-primary-500/50" />
              )}
            </div>
            <div>
              <div className="text-sm text-navy-400 font-medium">Daily Streak</div>
              <div className="text-4xl font-bold text-white">
                {streakData.currentStreak}
                <span className="text-lg text-navy-400 ml-1">
                  {streakData.currentStreak === 1 ? 'day' : 'days'}
                </span>
              </div>
              {streakData.currentStreak > 0 && (
                <div className="mt-1">
                  <div className="flex items-center gap-2 text-xs text-navy-400">
                    <span>Next milestone: {getNextMilestone(streakData.currentStreak)} days</span>
                  </div>
                  <div className="mt-1 h-1.5 w-32 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-16 bg-navy-700" />

          {/* Daily Quote */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-navy-200 italic leading-relaxed">
                  &ldquo;{dailyQuote.quote}&rdquo;
                </p>
                <p className="text-sm text-primary-400 mt-2">— {dailyQuote.author}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 lg:gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
          </div>
        </div>

        {/* Milestone message */}
        {showCelebration && (
          <div className="mt-4 text-center animate-pulse">
            <span className="text-lg font-semibold text-primary-400">
              🎉 Congratulations! You've reached a {streakData.currentStreak}-day streak! 🎉
            </span>
          </div>
        )}
      </div>
    </div>
  )
}