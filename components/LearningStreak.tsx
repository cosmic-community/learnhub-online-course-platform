'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
}

const motivationalQuotes = [
  { quote: "The only way to do great work is to love what you learn.", author: "Inspired by Steve Jobs" },
  { quote: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { quote: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Every expert was once a beginner. Every pro was once an amateur.", author: "Robin Sharma" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
]

function getStreakEmoji(streak: number): string {
  if (streak === 0) return '🌱'
  if (streak < 3) return '🔥'
  if (streak < 7) return '⚡'
  if (streak < 14) return '🌟'
  if (streak < 30) return '💎'
  if (streak < 60) return '🏆'
  return '👑'
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your learning journey today!"
  if (streak === 1) return "Great start! Keep it going!"
  if (streak < 3) return "You're building momentum!"
  if (streak < 7) return "Fantastic consistency!"
  if (streak < 14) return "You're on fire! One week strong!"
  if (streak < 30) return "Incredible dedication!"
  if (streak < 60) return "You're a learning machine!"
  return "Legendary learner status achieved!"
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    totalDaysLearned: 0,
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Get stored streak data
    const storedData = localStorage.getItem('learnhub-streak')
    let data: StreakData = storedData 
      ? JSON.parse(storedData) 
      : { currentStreak: 0, longestStreak: 0, lastVisitDate: '', totalDaysLearned: 0 }

    // Calculate if we need to update the streak
    if (data.lastVisitDate !== today) {
      const lastVisit = data.lastVisitDate ? new Date(data.lastVisitDate) : null
      const todayDate = new Date(today)
      
      if (lastVisit) {
        const diffTime = todayDate.getTime() - lastVisit.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak!
          data.currentStreak += 1
          data.totalDaysLearned += 1
          if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak
          }
          // Show celebration for milestone streaks
          if ([3, 7, 14, 30, 60, 100].includes(data.currentStreak)) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
          data.totalDaysLearned += 1
        }
      } else {
        // First visit ever
        data.currentStreak = 1
        data.totalDaysLearned = 1
      }
      
      data.lastVisitDate = today
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
    
    // Get daily quote based on the day of the year
    const dayOfYear = Math.floor((todayDate.getTime() - new Date(todayDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const todayDate = new Date(today)
    setDailyQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])
    
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Celebration animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-ping"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s',
                  transform: `rotate(${i * 30}deg) translateY(-40px)`,
                }}
              >
                ✨
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-yellow-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Learning Streak</h3>
              <p className="text-white/80 text-sm">{getStreakMessage(streakData.currentStreak)}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-4xl">{getStreakEmoji(streakData.currentStreak)}</span>
                <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
              </div>
              <p className="text-white/80 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="p-4 bg-navy-900/50 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
            <div className="text-navy-400 text-xs">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{streakData.totalDaysLearned}</div>
            <div className="text-navy-400 text-xs">Total Days</div>
          </div>
        </div>

        {/* Daily quote */}
        <div className="p-4 border-t border-navy-800">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-navy-200 text-sm italic">&ldquo;{dailyQuote.quote}&rdquo;</p>
              <p className="text-navy-500 text-xs mt-1">— {dailyQuote.author}</p>
            </div>
          </div>
        </div>

        {/* Streak visualization */}
        <div className="p-4 border-t border-navy-800">
          <p className="text-navy-400 text-xs mb-2">This week&apos;s activity</p>
          <div className="flex gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const today = new Date().getDay()
              const adjustedToday = today === 0 ? 6 : today - 1 // Convert Sunday=0 to Monday-based
              const isToday = index === adjustedToday
              const isPast = index < adjustedToday
              const isActive = isPast || isToday
              
              return (
                <div key={day} className="flex-1 text-center">
                  <div
                    className={`h-8 rounded-md mb-1 flex items-center justify-center text-sm transition-all ${
                      isToday
                        ? 'bg-primary-500 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900'
                        : isActive
                        ? 'bg-primary-500/30 text-primary-400'
                        : 'bg-navy-800 text-navy-600'
                    }`}
                  >
                    {isActive ? '✓' : ''}
                  </div>
                  <span className={`text-xs ${isToday ? 'text-primary-400 font-medium' : 'text-navy-500'}`}>
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}