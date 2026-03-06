'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  totalCourses: number
  totalLessons: number
  totalMinutes: number
  streakDays: number
  lastVisit: string
}

interface LearningProgressWidgetProps {
  totalCourses: number
  totalLessons: number
  totalMinutes: number
}

export default function LearningProgressWidget({ 
  totalCourses, 
  totalLessons, 
  totalMinutes 
}: LearningProgressWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [stats, setStats] = useState<LearningStats>({
    totalCourses,
    totalLessons,
    totalMinutes,
    streakDays: 0,
    lastVisit: ''
  })
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-progress')
    const today = new Date().toDateString()
    
    if (stored) {
      const parsed = JSON.parse(stored)
      const lastVisit = parsed.lastVisit || ''
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let streakDays = parsed.streakDays || 0
      
      if (lastVisit === today) {
        // Same day visit
        streakDays = parsed.streakDays
      } else if (lastVisit === yesterday) {
        // Consecutive day - increment streak!
        streakDays = (parsed.streakDays || 0) + 1
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else if (lastVisit !== today) {
        // Streak broken, start fresh
        streakDays = 1
      }
      
      setStats(prev => ({
        ...prev,
        streakDays,
        lastVisit: today
      }))
      
      localStorage.setItem('learnhub-progress', JSON.stringify({
        ...parsed,
        streakDays,
        lastVisit: today
      }))
    } else {
      // First visit
      const newStats = {
        streakDays: 1,
        lastVisit: today
      }
      localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
      setStats(prev => ({ ...prev, ...newStats }))
    }
    
    // Animate progress circle
    const timer = setTimeout(() => {
      setAnimatedProgress(75) // Simulated progress
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  const formatMinutes = (mins: number) => {
    if (mins >= 60) {
      const hours = Math.floor(mins / 60)
      const remaining = mins % 60
      return `${hours}h ${remaining}m`
    }
    return `${mins}m`
  }

  const motivationalMessages = [
    "🚀 Keep pushing forward!",
    "💪 You're doing amazing!",
    "🌟 Learning is your superpower!",
    "🔥 Stay curious, stay brilliant!",
    "✨ Every expert was once a beginner!"
  ]

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  return (
    <>
      {/* Confetti animation on streak milestone */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Widget Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-24 right-5 z-40 group"
        aria-label="Learning Progress"
      >
        <div className="relative">
          {/* Animated ring */}
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-navy-800"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="text-primary-500 transition-all duration-1000 ease-out"
              style={{
                strokeDasharray: `${2 * Math.PI * 28}`,
                strokeDashoffset: `${2 * Math.PI * 28 * (1 - animatedProgress / 100)}`
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-lg font-bold text-white">🎯</span>
            </div>
          </div>
          
          {/* Streak badge */}
          {stats.streakDays > 0 && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              {stats.streakDays}
            </div>
          )}
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
        </div>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Panel */}
          <div className="fixed bottom-24 right-5 z-50 w-80 animate-slideUp">
            <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Your Learning Journey</h3>
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-primary-100 text-sm mt-1">{randomMessage}</p>
              </div>
              
              {/* Stats Grid */}
              <div className="p-4 grid grid-cols-2 gap-4">
                {/* Streak */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
                  <div className="text-3xl mb-1">🔥</div>
                  <div className="text-2xl font-bold text-white">{stats.streakDays}</div>
                  <div className="text-orange-300 text-sm">Day Streak</div>
                </div>
                
                {/* Courses */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-3xl mb-1">📚</div>
                  <div className="text-2xl font-bold text-white">{totalCourses}</div>
                  <div className="text-blue-300 text-sm">Courses</div>
                </div>
                
                {/* Lessons */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                  <div className="text-3xl mb-1">📖</div>
                  <div className="text-2xl font-bold text-white">{totalLessons}</div>
                  <div className="text-green-300 text-sm">Lessons</div>
                </div>
                
                {/* Learning Time */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-3xl mb-1">⏱️</div>
                  <div className="text-2xl font-bold text-white">{formatMinutes(totalMinutes)}</div>
                  <div className="text-purple-300 text-sm">Content</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="px-4 pb-4">
                <div className="bg-navy-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${animatedProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-navy-400">Learning Progress</span>
                  <span className="text-primary-400 font-medium">{animatedProgress}%</span>
                </div>
              </div>
              
              {/* Achievement Badges */}
              <div className="px-4 pb-4">
                <div className="text-sm text-navy-300 mb-2">Achievements</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-navy-800 rounded-full text-sm flex items-center gap-1 border border-navy-700">
                    <span>🌱</span> Early Learner
                  </span>
                  {stats.streakDays >= 3 && (
                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-sm flex items-center gap-1 border border-orange-500/30 text-orange-300">
                      <span>🔥</span> On Fire!
                    </span>
                  )}
                  {stats.streakDays >= 7 && (
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm flex items-center gap-1 border border-purple-500/30 text-purple-300">
                      <span>⭐</span> Dedicated
                    </span>
                  )}
                </div>
              </div>
              
              {/* Tip */}
              <div className="bg-navy-800/50 px-4 py-3 border-t border-navy-700">
                <p className="text-navy-300 text-xs">
                  💡 <span className="text-navy-200">Pro tip:</span> Visit daily to maintain your streak and unlock new badges!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}