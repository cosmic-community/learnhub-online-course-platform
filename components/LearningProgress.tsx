'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  requirement: number
  type: 'streak' | 'courses' | 'lessons'
}

const dailyTips = [
  { emoji: '🎯', tip: 'Focus on one concept at a time for better retention.' },
  { emoji: '📝', tip: 'Take notes while learning to improve memory by 30%.' },
  { emoji: '⏰', tip: 'Study in 25-minute blocks with 5-minute breaks (Pomodoro).' },
  { emoji: '🔄', tip: 'Review yesterday\'s material before starting new content.' },
  { emoji: '💪', tip: 'Consistency beats intensity - 20 mins daily > 3 hrs weekly.' },
  { emoji: '🧠', tip: 'Teaching others is the best way to solidify your knowledge.' },
  { emoji: '😴', tip: 'Sleep well! Your brain consolidates learning while you rest.' },
]

const achievements: Achievement[] = [
  { id: 'first-visit', title: 'First Steps', description: 'Visited the platform', icon: '👋', unlocked: true, requirement: 1, type: 'streak' },
  { id: 'streak-3', title: 'Getting Started', description: '3 day streak', icon: '🔥', unlocked: false, requirement: 3, type: 'streak' },
  { id: 'streak-7', title: 'Week Warrior', description: '7 day streak', icon: '⚡', unlocked: false, requirement: 7, type: 'streak' },
  { id: 'streak-30', title: 'Monthly Master', description: '30 day streak', icon: '🏆', unlocked: false, requirement: 30, type: 'streak' },
]

export default function LearningProgress({ totalCourses, totalLessons }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [dailyTip, setDailyTip] = useState(dailyTips[0])
  const [animateRing, setAnimateRing] = useState(false)

  useEffect(() => {
    // Initialize streak from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      // Already visited today
      setStreak(parseInt(savedStreak || '1', 10))
    } else if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
      // Visited yesterday - increment streak
      const newStreak = parseInt(savedStreak || '0', 10) + 1
      setStreak(newStreak)
      localStorage.setItem('learning-streak', newStreak.toString())
      localStorage.setItem('last-visit-date', today)
    } else {
      // Streak broken or first visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-visit-date', today)
    }

    // Set random daily tip based on day
    const dayIndex = new Date().getDay()
    setDailyTip(dailyTips[dayIndex] || dailyTips[0])

    // Animate in after delay
    const timer = setTimeout(() => {
      setIsVisible(true)
      setTimeout(() => setAnimateRing(true), 300)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const progressPercent = Math.min((streak / 30) * 100, 100)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  const unlockedAchievements = achievements.filter(a => 
    a.type === 'streak' ? streak >= a.requirement : a.unlocked
  )

  if (!isVisible) return null

  return (
    <div 
      className={`fixed bottom-24 left-5 z-40 transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Main Progress Widget */}
      <div className="bg-navy-900/95 backdrop-blur-md border border-navy-700 rounded-2xl p-4 shadow-xl shadow-primary-500/10 w-72">
        {/* Header with Streak */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Animated Progress Ring */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="32"
                  cy="32"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-navy-700"
                  style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}
                />
                {/* Progress circle */}
                <circle
                  cx="32"
                  cy="32"
                  r="40"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  style={{ 
                    transform: 'scale(0.75)', 
                    transformOrigin: 'center',
                    strokeDasharray: circumference * 0.75,
                    strokeDashoffset: animateRing ? strokeDashoffset * 0.75 : circumference * 0.75,
                    transition: 'stroke-dashoffset 1s ease-out'
                  }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Streak number in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{streak}</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl">🔥</span>
                <span className="text-lg font-bold text-white">Day Streak</span>
              </div>
              <p className="text-sm text-navy-400">Keep it going!</p>
            </div>
          </div>
          
          {/* Achievement button */}
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="w-10 h-10 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors relative"
            title="View Achievements"
          >
            <span className="text-xl">🏆</span>
            {unlockedAchievements.length > 1 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {unlockedAchievements.length}
              </span>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-navy-800/50 rounded-lg p-2 text-center">
            <div className="text-xl font-bold text-white">{totalCourses}</div>
            <div className="text-xs text-navy-400">Courses</div>
          </div>
          <div className="bg-navy-800/50 rounded-lg p-2 text-center">
            <div className="text-xl font-bold text-white">{totalLessons}</div>
            <div className="text-xs text-navy-400">Lessons</div>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">{dailyTip.emoji}</span>
            <div>
              <p className="text-xs text-primary-300 font-medium mb-0.5">💡 Daily Tip</p>
              <p className="text-sm text-navy-200">{dailyTip.tip}</p>
            </div>
          </div>
        </div>

        {/* Achievements Panel (Expandable) */}
        {showAchievements && (
          <div className="mt-4 pt-4 border-t border-navy-700">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span>🏆</span> Achievements
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {achievements.map((achievement) => {
                const isUnlocked = achievement.type === 'streak' 
                  ? streak >= achievement.requirement 
                  : achievement.unlocked
                
                return (
                  <div
                    key={achievement.id}
                    className={`relative group cursor-pointer ${
                      isUnlocked ? '' : 'opacity-40 grayscale'
                    }`}
                    title={`${achievement.title}: ${achievement.description}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30' 
                        : 'bg-navy-800 border border-navy-700'
                    } transition-transform hover:scale-110`}>
                      {achievement.icon}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      <div className="text-white font-medium">{achievement.title}</div>
                      <div className="text-navy-400">{achievement.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Motivational message based on streak */}
        {streak >= 7 && (
          <div className="mt-3 text-center">
            <p className="text-xs text-primary-400 font-medium animate-pulse">
              {streak >= 30 ? '🎉 Legendary learner!' : streak >= 14 ? '⚡ Unstoppable!' : '🔥 On fire!'}
            </p>
          </div>
        )}
      </div>

      {/* Minimize button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-navy-700 hover:bg-navy-600 rounded-full flex items-center justify-center text-navy-400 hover:text-white transition-colors text-sm"
        aria-label="Minimize"
      >
        ×
      </button>
    </div>
  )
}