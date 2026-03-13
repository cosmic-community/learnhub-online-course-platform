'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  coursesViewed: number
  lessonsCompleted: number
  minutesLearned: number
  streak: number
}

const motivationalMessages = [
  "Keep up the great work! 🔥",
  "Every expert was once a beginner! 💪",
  "You're making progress! 📈",
  "Learning is a journey, enjoy it! 🚀",
  "Small steps lead to big achievements! ⭐",
]

export default function LearningProgressWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<LearningStats>({
    coursesViewed: 0,
    lessonsCompleted: 0,
    minutesLearned: 0,
    streak: 0,
  })
  const [message, setMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    } else {
      // Initialize with some demo data for new users
      const initialStats = {
        coursesViewed: 3,
        lessonsCompleted: 7,
        minutesLearned: 45,
        streak: 1,
      }
      setStats(initialStats)
      localStorage.setItem('learnhub-progress', JSON.stringify(initialStats))
    }

    // Set random motivational message
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])

    // Track page view
    const trackView = () => {
      const today = new Date().toDateString()
      const lastVisit = localStorage.getItem('learnhub-last-visit')
      
      if (lastVisit !== today) {
        localStorage.setItem('learnhub-last-visit', today)
        setStats(prev => {
          const newStats = {
            ...prev,
            streak: lastVisit === new Date(Date.now() - 86400000).toDateString() 
              ? prev.streak + 1 
              : 1,
            minutesLearned: prev.minutesLearned + 5,
          }
          localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
          return newStats
        })
      }
    }
    trackView()
  }, [])

  const handleOpen = () => {
    setIsOpen(true)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const incrementStat = (stat: keyof LearningStats) => {
    setStats(prev => {
      const newStats = { ...prev, [stat]: prev[stat] + 1 }
      localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
      return newStats
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-24 right-5 z-40 group"
        aria-label="Open learning progress"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
          <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          {stats.streak > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-navy-950 text-xs font-bold px-2 py-0.5 rounded-full">
              {stats.streak}🔥
            </span>
          )}
        </div>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-24 right-5 z-40 w-80 ${isAnimating ? 'animate-bounce-in' : ''}`}>
      <div className="bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-white">Your Progress</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close progress widget"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              icon="📚" 
              label="Courses Viewed" 
              value={stats.coursesViewed} 
              color="from-blue-500/20 to-blue-600/20"
              onClick={() => incrementStat('coursesViewed')}
            />
            <StatCard 
              icon="✅" 
              label="Lessons Done" 
              value={stats.lessonsCompleted}
              color="from-green-500/20 to-green-600/20"
              onClick={() => incrementStat('lessonsCompleted')}
            />
            <StatCard 
              icon="⏱️" 
              label="Minutes" 
              value={stats.minutesLearned}
              color="from-purple-500/20 to-purple-600/20"
              onClick={() => incrementStat('minutesLearned')}
            />
            <StatCard 
              icon="🔥" 
              label="Day Streak" 
              value={stats.streak}
              color="from-orange-500/20 to-orange-600/20"
              highlight
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Weekly Goal</span>
              <span className="text-primary-400 font-medium">{Math.min(stats.lessonsCompleted, 10)}/10 lessons</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((stats.lessonsCompleted / 10) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-navy-800/50 rounded-lg p-3 text-center">
            <p className="text-navy-300 text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: string
  label: string
  value: number
  color: string
  highlight?: boolean
  onClick?: () => void
}

function StatCard({ icon, label, value, color, highlight, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${color} border border-navy-700/50 rounded-xl p-3 text-left transition-all duration-200 hover:scale-105 hover:border-navy-600 ${highlight ? 'ring-2 ring-orange-500/30' : ''}`}
    >
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-navy-400">{label}</div>
    </button>
  )
}