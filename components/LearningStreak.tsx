'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalLessonsCompleted: number
  todayLessonsCompleted: number
  dailyGoal: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalLessonsCompleted: 0,
    todayLessonsCompleted: 0,
    dailyGoal: 1,
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const parsed: StreakData = JSON.parse(savedData)
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      let newStreak = parsed.currentStreak
      let todayLessons = parsed.todayLessonsCompleted
      
      if (lastVisitDate === today) {
        // Same day visit
        todayLessons = parsed.todayLessonsCompleted
      } else if (lastVisitDate === yesterdayString) {
        // Consecutive day - increment streak!
        newStreak = parsed.currentStreak + 1
        todayLessons = 0
        if (newStreak > parsed.longestStreak) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken
        newStreak = 1
        todayLessons = 0
      }
      
      const updatedData = {
        ...parsed,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, parsed.longestStreak),
        lastVisit: today,
        todayLessonsCompleted: todayLessons,
      }
      
      setStreakData(updatedData)
      localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
    } else {
      // First visit
      const initialData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalLessonsCompleted: 0,
        todayLessonsCompleted: 0,
        dailyGoal: 1,
      }
      setStreakData(initialData)
      localStorage.setItem('learnhub-streak', JSON.stringify(initialData))
    }
    
    // Random motivational quote
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const progressPercentage = Math.min(
    (streakData.todayLessonsCompleted / streakData.dailyGoal) * 100,
    100
  )

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "You're a learning champion!"
    if (streak >= 14) return "Two weeks strong! Incredible!"
    if (streak >= 7) return "One week streak! Amazing!"
    if (streak >= 3) return "Building momentum!"
    return "Every journey begins with a single step!"
  }

  return (
    <div 
      className={`relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Confetti celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][
                  Math.floor(Math.random() * 6)
                ],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        {/* Header with streak */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-pulse">{getStreakEmoji(streakData.currentStreak)}</div>
            <div>
              <div className="text-2xl font-bold text-white">
                {streakData.currentStreak} Day Streak
              </div>
              <div className="text-sm text-navy-400">
                {getStreakMessage(streakData.currentStreak)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-navy-500 uppercase tracking-wider">Best Streak</div>
            <div className="text-xl font-bold text-primary-400">
              {streakData.longestStreak} days
            </div>
          </div>
        </div>

        {/* Daily goal progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-navy-300">Today&apos;s Goal</span>
            <span className="text-sm text-navy-400">
              {streakData.todayLessonsCompleted} / {streakData.dailyGoal} lessons
            </span>
          </div>
          <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 0 && (
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              )}
            </div>
          </div>
          {progressPercentage >= 100 && (
            <div className="mt-2 text-center text-green-400 text-sm font-medium animate-pulse">
              ✅ Daily goal completed! You&apos;re amazing!
            </div>
          )}
        </div>

        {/* Motivational quote */}
        <div className="bg-navy-950/50 rounded-lg p-4 border border-navy-800">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-navy-200 italic text-sm leading-relaxed">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <p className="text-primary-400 text-xs mt-2">— {quote.author}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-navy-950/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{streakData.totalLessonsCompleted}</div>
            <div className="text-xs text-navy-400">Total Lessons</div>
          </div>
          <div className="bg-navy-950/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {Math.floor(streakData.totalLessonsCompleted * 15)}
            </div>
            <div className="text-xs text-navy-400">Minutes Learned</div>
          </div>
          <div className="bg-navy-950/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">
              {Math.floor(streakData.currentStreak / 7)}
            </div>
            <div className="text-xs text-navy-400">Weeks Active</div>
          </div>
        </div>
      </div>
    </div>
  )
}