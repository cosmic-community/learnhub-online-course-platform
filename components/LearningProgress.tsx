'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningStats {
  currentStreak: number
  longestStreak: number
  totalMinutesLearned: number
  coursesViewed: number
  lessonsCompleted: number
  lastActiveDate: string
  dailyGoalMinutes: number
  todayMinutes: number
}

const DEFAULT_STATS: LearningStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalMinutesLearned: 0,
  coursesViewed: 0,
  lessonsCompleted: 0,
  lastActiveDate: '',
  dailyGoalMinutes: 30,
  todayMinutes: 0,
}

function createConfetti() {
  const colors = ['#29ABE2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

// Add keyframes for confetti animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    @keyframes pulse-ring {
      0% {
        transform: scale(0.95);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(0.95);
      }
    }
    @keyframes flame-flicker {
      0%, 100% {
        transform: scale(1) rotate(-2deg);
      }
      50% {
        transform: scale(1.1) rotate(2deg);
      }
    }
  `
  document.head.appendChild(style)
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load stats from localStorage
  useEffect(() => {
    setMounted(true)
    const savedStats = localStorage.getItem('learnhub-stats')
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats) as LearningStats
        const today = new Date().toDateString()
        const lastActive = parsed.lastActiveDate
        
        // Check if it's a new day
        if (lastActive !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const wasYesterday = lastActive === yesterday.toDateString()
          
          setStats({
            ...parsed,
            currentStreak: wasYesterday ? parsed.currentStreak : 0,
            todayMinutes: 0,
            lastActiveDate: today,
          })
        } else {
          setStats(parsed)
        }
      } catch {
        setStats(DEFAULT_STATS)
      }
    }
  }, [])

  // Save stats to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('learnhub-stats', JSON.stringify(stats))
    }
  }, [stats, mounted])

  // Simulate learning activity (in real app, this would track actual page views)
  const logLearningTime = useCallback((minutes: number) => {
    const today = new Date().toDateString()
    
    setStats(prev => {
      const newTodayMinutes = prev.todayMinutes + minutes
      const goalReached = prev.todayMinutes < prev.dailyGoalMinutes && 
                          newTodayMinutes >= prev.dailyGoalMinutes
      
      // Trigger celebration if goal just reached
      if (goalReached) {
        setShowCelebration(true)
        createConfetti()
        setTimeout(() => setShowCelebration(false), 3000)
      }
      
      const isNewDay = prev.lastActiveDate !== today
      const newStreak = isNewDay ? prev.currentStreak + 1 : prev.currentStreak
      
      return {
        ...prev,
        todayMinutes: newTodayMinutes,
        totalMinutesLearned: prev.totalMinutesLearned + minutes,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
        lastActiveDate: today,
      }
    })
  }, [])

  // Track page views
  useEffect(() => {
    if (!mounted) return
    
    // Log initial visit
    const today = new Date().toDateString()
    if (stats.lastActiveDate !== today) {
      logLearningTime(5) // 5 minutes for visiting
    }
    
    // Track time on page
    const interval = setInterval(() => {
      logLearningTime(1)
    }, 60000) // Log 1 minute every minute
    
    return () => clearInterval(interval)
  }, [mounted, stats.lastActiveDate, logLearningTime])

  const progressPercent = Math.min((stats.todayMinutes / stats.dailyGoalMinutes) * 100, 100)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  if (!mounted) return null

  return (
    <>
      {/* Floating Progress Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-24 right-5 z-40 group"
        aria-label="Learning Progress"
      >
        <div className="relative">
          {/* Progress Ring */}
          <svg width="64" height="64" className="transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#29ABE2"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 - (progressPercent / 100) * 2 * Math.PI * 28}
              className="transition-all duration-500"
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {stats.currentStreak > 0 ? (
              <>
                <span 
                  className="text-2xl"
                  style={{ animation: 'flame-flicker 0.5s ease-in-out infinite' }}
                >
                  🔥
                </span>
                <span className="text-xs font-bold text-white">{stats.currentStreak}</span>
              </>
            ) : (
              <span className="text-xl">📚</span>
            )}
          </div>
          
          {/* Glow effect when goal reached */}
          {progressPercent >= 100 && (
            <div 
              className="absolute inset-0 rounded-full bg-primary-500/30"
              style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
            />
          )}
        </div>
        
        {/* Hover tooltip */}
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-navy-800 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {progressPercent >= 100 ? '🎉 Daily goal reached!' : `${Math.round(progressPercent)}% of daily goal`}
        </div>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="fixed bottom-24 right-20 z-40 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Learning Progress</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Daily Goal */}
          <div className="p-4 border-b border-navy-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-navy-300 text-sm">Today&apos;s Goal</span>
              <span className="text-white font-medium">
                {stats.todayMinutes}/{stats.dailyGoalMinutes} min
              </span>
            </div>
            
            {/* Large Progress Ring */}
            <div className="flex justify-center">
              <div className="relative">
                <svg width="120" height="120" className="transform -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={progressPercent >= 100 ? '#10b981' : '#29ABE2'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 - (progressPercent / 100) * 2 * Math.PI * 50}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {Math.round(progressPercent)}%
                  </span>
                  <span className="text-navy-400 text-sm">complete</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Streak Section */}
          <div className="p-4 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span 
                  className="text-3xl"
                  style={stats.currentStreak > 0 ? { animation: 'flame-flicker 0.5s ease-in-out infinite' } : undefined}
                >
                  {stats.currentStreak > 0 ? '🔥' : '❄️'}
                </span>
                <div>
                  <div className="text-white font-bold text-xl">
                    {stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''}
                  </div>
                  <div className="text-navy-400 text-sm">Current streak</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-primary-400 font-bold">{stats.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best streak</div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="bg-navy-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-white font-bold">{stats.totalMinutesLearned}</div>
              <div className="text-navy-400 text-xs">Total minutes</div>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">📖</div>
              <div className="text-white font-bold">{stats.lessonsCompleted}</div>
              <div className="text-navy-400 text-xs">Lessons done</div>
            </div>
          </div>
          
          {/* Motivational Message */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-lg p-3 text-center">
              <p className="text-navy-200 text-sm">
                {progressPercent >= 100 
                  ? "🎉 Amazing! You've crushed your goal today!" 
                  : progressPercent >= 50 
                  ? "💪 You're halfway there! Keep going!" 
                  : "🚀 Start learning to build your streak!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-navy-900/90 backdrop-blur-sm px-8 py-6 rounded-2xl text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Daily Goal Reached!</h2>
            <p className="text-navy-300">You&apos;re on a {stats.currentStreak} day streak!</p>
          </div>
        </div>
      )}
    </>
  )
}

// Export a hook for components to log learning events
export function useLearningProgress() {
  const logLesson = () => {
    const statsStr = localStorage.getItem('learnhub-stats')
    if (statsStr) {
      try {
        const stats = JSON.parse(statsStr) as LearningStats
        stats.lessonsCompleted += 1
        stats.todayMinutes += 10 // Award 10 minutes for completing a lesson
        localStorage.setItem('learnhub-stats', JSON.stringify(stats))
        window.dispatchEvent(new Event('learning-progress-update'))
      } catch {
        // Ignore errors
      }
    }
  }
  
  const logCourseView = () => {
    const statsStr = localStorage.getItem('learnhub-stats')
    if (statsStr) {
      try {
        const stats = JSON.parse(statsStr) as LearningStats
        stats.coursesViewed += 1
        localStorage.setItem('learnhub-stats', JSON.stringify(stats))
      } catch {
        // Ignore errors
      }
    }
  }
  
  return { logLesson, logCourseView }
}