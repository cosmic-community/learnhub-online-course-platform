'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  currentStreak: number
  totalLessonsViewed: number
  lastVisit: string
  weeklyGoal: number
  weeklyProgress: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

function getRandomQuote() {
  const today = new Date().toDateString()
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return motivationalQuotes[seed % motivationalQuotes.length]
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => setParticles([]), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}

export default function LearningProgress() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<LearningStats>({
    currentStreak: 0,
    totalLessonsViewed: 0,
    lastVisit: '',
    weeklyGoal: 5,
    weeklyProgress: 0
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestone, setMilestone] = useState<string | null>(null)
  const [quote] = useState(getRandomQuote())

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    const today = new Date().toDateString()
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.currentStreak
      let newWeeklyProgress = parsed.weeklyProgress
      
      // Check if this is a new day
      if (lastVisitDate !== today) {
        // Check if streak continues
        if (lastVisitDate === yesterday) {
          newStreak = parsed.currentStreak + 1
          newWeeklyProgress = parsed.weeklyProgress + 1
        } else if (lastVisitDate !== today) {
          // Streak broken if more than 1 day gap
          const daysSinceVisit = Math.floor((Date.now() - new Date(parsed.lastVisit).getTime()) / 86400000)
          if (daysSinceVisit > 1) {
            newStreak = 1
          } else {
            newStreak = parsed.currentStreak + 1
            newWeeklyProgress = parsed.weeklyProgress + 1
          }
        }
        
        // Reset weekly progress on Monday
        const dayOfWeek = new Date().getDay()
        if (dayOfWeek === 1 && new Date(parsed.lastVisit).getDay() !== 1) {
          newWeeklyProgress = 1
        }

        // Check for milestones
        if (newStreak === 3 && parsed.currentStreak < 3) {
          setMilestone('🔥 3 Day Streak!')
          setShowConfetti(true)
        } else if (newStreak === 7 && parsed.currentStreak < 7) {
          setMilestone('🏆 1 Week Streak!')
          setShowConfetti(true)
        } else if (newStreak === 30 && parsed.currentStreak < 30) {
          setMilestone('👑 30 Day Streak!')
          setShowConfetti(true)
        }
      }

      setStats({
        ...parsed,
        currentStreak: newStreak,
        weeklyProgress: newWeeklyProgress,
        lastVisit: today
      })
    } else {
      // First visit
      setStats({
        currentStreak: 1,
        totalLessonsViewed: 0,
        lastVisit: today,
        weeklyGoal: 5,
        weeklyProgress: 1
      })
      setMilestone('🎉 Welcome! Start your learning journey!')
    }
  }, [])

  useEffect(() => {
    // Save stats to localStorage whenever they change
    if (stats.lastVisit) {
      localStorage.setItem('learnhub-progress', JSON.stringify(stats))
    }
  }, [stats])

  useEffect(() => {
    // Clear milestone after 5 seconds
    if (milestone) {
      const timer = setTimeout(() => setMilestone(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [milestone])

  const progressPercentage = Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100)

  const getStreakEmoji = () => {
    if (stats.currentStreak >= 30) return '👑'
    if (stats.currentStreak >= 7) return '🏆'
    if (stats.currentStreak >= 3) return '🔥'
    return '✨'
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Milestone Toast */}
      {milestone && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full shadow-lg shadow-primary-500/30 font-semibold">
            {milestone}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-4 z-40 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform duration-200"
        aria-label="Learning Progress"
      >
        <span className="text-2xl">{getStreakEmoji()}</span>
        {stats.currentStreak > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full text-xs font-bold text-yellow-900 flex items-center justify-center">
            {stats.currentStreak}
          </span>
        )}
      </button>

      {/* Progress Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-24 left-4 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Your Progress</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-4">
              {/* Streak */}
              <div className="bg-navy-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-navy-400 text-sm">Current Streak</span>
                  <span className="text-2xl">{getStreakEmoji()}</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {stats.currentStreak} <span className="text-lg text-navy-400">days</span>
                </div>
                <p className="text-navy-400 text-xs mt-1">Keep learning daily to maintain your streak!</p>
              </div>

              {/* Weekly Goal */}
              <div className="bg-navy-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-navy-400 text-sm">Weekly Goal</span>
                  <span className="text-primary-400 text-sm font-medium">{stats.weeklyProgress}/{stats.weeklyGoal} days</span>
                </div>
                <div className="h-3 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {progressPercentage >= 100 && (
                  <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                    <span>🎉</span> Weekly goal achieved!
                  </p>
                )}
              </div>

              {/* Quote of the Day */}
              <div className="bg-gradient-to-br from-navy-800/50 to-navy-800/30 rounded-xl p-4 border border-navy-700/50">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-navy-200 text-sm italic">"{quote?.quote}"</p>
                    <p className="text-navy-400 text-xs mt-1">— {quote?.author}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="/courses"
                  className="bg-navy-800 hover:bg-navy-700 text-center py-3 px-4 rounded-xl text-sm text-white font-medium transition-colors"
                >
                  📚 Browse Courses
                </a>
                <button 
                  onClick={() => {
                    setStats(prev => ({ ...prev, weeklyGoal: prev.weeklyGoal === 5 ? 7 : 5 }))
                  }}
                  className="bg-navy-800 hover:bg-navy-700 text-center py-3 px-4 rounded-xl text-sm text-white font-medium transition-colors"
                >
                  🎯 {stats.weeklyGoal === 5 ? 'Set 7/week' : 'Set 5/week'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}