'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lessonsCompleted: number
  lastActiveDate: string
  totalMinutesLearned: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning, learner! ☀️"
  if (hour < 17) return "Keep up the great work! 🚀"
  if (hour < 21) return "Evening learning session? Nice! 🌙"
  return "Night owl learning? You're dedicated! 🦉"
}

const getStreakEmoji = (streak: number): string => {
  if (streak >= 30) return "🔥💎"
  if (streak >= 14) return "🔥🏆"
  if (streak >= 7) return "🔥⭐"
  if (streak >= 3) return "🔥"
  if (streak >= 1) return "✨"
  return "🌱"
}

const getStreakMessage = (streak: number): string => {
  if (streak >= 30) return "Legendary! You're unstoppable!"
  if (streak >= 14) return "Two weeks strong! Amazing dedication!"
  if (streak >= 7) return "One week streak! You're on fire!"
  if (streak >= 3) return "Great momentum! Keep it going!"
  if (streak >= 1) return "You're building a habit!"
  return "Start your streak today!"
}

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lessonsCompleted: 0,
    lastActiveDate: '',
    totalMinutesLearned: 0,
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)

  // Load streak data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const data = JSON.parse(savedData) as StreakData
      
      // Check if we need to update the streak
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastActive === today) {
        // Already active today, keep streak
        setStreakData(data)
      } else if (lastActive === yesterdayStr) {
        // Was active yesterday, streak continues but not incremented yet
        setStreakData(data)
      } else {
        // Streak broken, reset
        setStreakData({
          ...data,
          currentStreak: 0,
          lastActiveDate: data.lastActiveDate,
        })
      }
    }
    
    // Random quote
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
    
    // Show widget after delay
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Simulate completing a lesson (for demo purposes)
  const simulateProgress = useCallback(() => {
    const today = new Date().toDateString()
    const newData: StreakData = {
      currentStreak: streakData.lastActiveDate === today 
        ? streakData.currentStreak 
        : streakData.currentStreak + 1,
      longestStreak: Math.max(streakData.longestStreak, streakData.currentStreak + 1),
      lessonsCompleted: streakData.lessonsCompleted + 1,
      lastActiveDate: today,
      totalMinutesLearned: streakData.totalMinutesLearned + Math.floor(Math.random() * 20) + 10,
    }
    
    setStreakData(newData)
    localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    
    // Show confetti!
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [streakData])

  if (!isVisible) return null

  return (
    <>
      {/* Confetti Effect */}
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
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 8)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Floating Streak Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 z-50 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 group"
        aria-label="Learning streak"
      >
        <span className="group-hover:animate-bounce">{getStreakEmoji(streakData.currentStreak)}</span>
        {streakData.currentStreak > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-navy-950 text-xs font-bold rounded-full flex items-center justify-center">
            {streakData.currentStreak}
          </span>
        )}
      </button>

      {/* Streak Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-5 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4">
            <p className="text-white/80 text-sm">{getTimeBasedGreeting()}</p>
            <h3 className="text-white font-bold text-lg mt-1">Your Learning Journey</h3>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-4">
            {/* Current Streak */}
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">{getStreakEmoji(streakData.currentStreak)}</div>
              <div className="text-3xl font-bold text-white">{streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}</div>
              <div className="text-primary-400 text-sm font-medium">{getStreakMessage(streakData.currentStreak)}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-navy-800/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best Streak</div>
              </div>
              <div className="bg-navy-800/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{streakData.lessonsCompleted}</div>
                <div className="text-navy-400 text-xs">Lessons</div>
              </div>
              <div className="bg-navy-800/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{streakData.totalMinutesLearned}</div>
                <div className="text-navy-400 text-xs">Minutes</div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-navy-800/50 to-navy-800/30 rounded-xl p-4 border-l-4 border-primary-500">
              <p className="text-navy-200 text-sm italic">"{quote.quote}"</p>
              <p className="text-primary-400 text-xs mt-2">— {quote.author}</p>
            </div>

            {/* Demo Button */}
            <button
              onClick={simulateProgress}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🎯</span>
              <span>Mark Lesson Complete</span>
              <span>+1</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}