'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalLessonsCompleted: number
  lastActiveDate: string
  weeklyActivity: boolean[]
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalLessonsCompleted: 0,
  lastActiveDate: '',
  weeklyActivity: [false, false, false, false, false, false, false]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as StreakData
        setStreakData(parsed)
        
        // Check if it's a new day and update streak
        const today = new Date().toDateString()
        const lastActive = parsed.lastActiveDate
        
        if (lastActive !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          
          if (lastActive === yesterday.toDateString()) {
            // Continue streak
            const newStreak = parsed.currentStreak + 1
            const newData: StreakData = {
              ...parsed,
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, parsed.longestStreak),
              lastActiveDate: today,
              weeklyActivity: [...parsed.weeklyActivity.slice(1), true]
            }
            setStreakData(newData)
            localStorage.setItem('learnhub-streak', JSON.stringify(newData))
            
            // Celebrate milestones
            if (newStreak === 7 || newStreak === 30 || newStreak % 50 === 0) {
              setShowCelebration(true)
              setTimeout(() => setShowCelebration(false), 3000)
            }
          } else if (lastActive !== today) {
            // Streak broken - but give grace for first visit of the day
            const newData: StreakData = {
              ...parsed,
              currentStreak: 1,
              lastActiveDate: today,
              weeklyActivity: [...parsed.weeklyActivity.slice(1), true]
            }
            setStreakData(newData)
            localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          }
        }
      } catch {
        // Initialize fresh data
        initializeStreak()
      }
    } else {
      initializeStreak()
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const initializeStreak = () => {
    const today = new Date().toDateString()
    const newData: StreakData = {
      currentStreak: 1,
      longestStreak: 1,
      totalLessonsCompleted: 0,
      lastActiveDate: today,
      weeklyActivity: [false, false, false, false, false, false, true]
    }
    setStreakData(newData)
    localStorage.setItem('learnhub-streak', JSON.stringify(newData))
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '⭐'
    if (streak >= 14) return '🚀'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 100) return 'Legendary learner!'
    if (streak >= 50) return 'Diamond dedication!'
    if (streak >= 30) return 'Star student!'
    if (streak >= 14) return 'On fire!'
    if (streak >= 7) return 'One week strong!'
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  if (!isVisible) return null

  return (
    <>
      {/* Celebration Confetti Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-navy-900/90 backdrop-blur-xl rounded-2xl p-8 text-center animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {streakData.currentStreak} Day Streak!
              </h3>
              <p className="text-primary-400">Keep up the amazing work!</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
        >
          {/* Main Badge */}
          <div className={`
            bg-gradient-to-br from-navy-800 to-navy-900 
            border border-navy-700 rounded-2xl shadow-xl
            transition-all duration-300 overflow-hidden
            ${isExpanded ? 'w-64' : 'w-auto'}
          `}>
            {/* Collapsed View */}
            <div className="flex items-center gap-3 p-3">
              {/* Animated Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-navy-700"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="url(#streak-gradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(streakData.currentStreak / 30, 1) * 125.6} 125.6`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="streak-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-lg">
                  {getStreakEmoji(streakData.currentStreak)}
                </span>
              </div>
              
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-white">
                    {streakData.currentStreak}
                  </span>
                  <span className="text-sm text-navy-400">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-xs text-primary-400">{getStreakMessage(streakData.currentStreak)}</p>
              </div>
              
              <svg 
                className={`w-5 h-5 text-navy-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-navy-700/50 pt-3 animate-slide-down">
                {/* Weekly Activity */}
                <div className="mb-3">
                  <p className="text-xs text-navy-400 mb-2">This Week</p>
                  <div className="flex gap-1 justify-between">
                    {streakData.weeklyActivity.map((active, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                            active 
                              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                              : 'bg-navy-700/50 text-navy-500'
                          }`}
                        >
                          {active ? '✓' : dayLabels[i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
                    <div className="text-[10px] text-navy-400">Best Streak</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">{streakData.totalLessonsCompleted}</div>
                    <div className="text-[10px] text-navy-400">Lessons Done</div>
                  </div>
                </div>

                {/* Motivational Progress */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Next milestone</span>
                    <span>{Math.ceil(streakData.currentStreak / 7) * 7} days</span>
                  </div>
                  <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${(streakData.currentStreak % 7) / 7 * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  )
}