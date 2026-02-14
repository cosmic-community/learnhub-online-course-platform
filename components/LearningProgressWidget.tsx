'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningStats {
  totalVisits: number
  coursesViewed: number
  lessonsViewed: number
  currentStreak: number
  longestStreak: number
  lastVisit: string
  achievements: string[]
}

const ACHIEVEMENTS = {
  firstVisit: { id: 'firstVisit', name: 'First Steps', emoji: '👋', description: 'Visited the platform' },
  explorer: { id: 'explorer', name: 'Explorer', emoji: '🧭', description: 'Viewed 3 courses' },
  dedicated: { id: 'dedicated', name: 'Dedicated', emoji: '🔥', description: '3-day streak' },
  weekWarrior: { id: 'weekWarrior', name: 'Week Warrior', emoji: '⚡', description: '7-day streak' },
  courseHunter: { id: 'courseHunter', name: 'Course Hunter', emoji: '🎯', description: 'Viewed 5 courses' },
  lessonLover: { id: 'lessonLover', name: 'Lesson Lover', emoji: '📖', description: 'Read 10 lessons' },
  scholar: { id: 'scholar', name: 'Scholar', emoji: '🎓', description: 'Viewed 10 courses' },
  marathoner: { id: 'marathoner', name: 'Marathoner', emoji: '🏃', description: '14-day streak' },
}

function getStoredStats(): LearningStats {
  if (typeof window === 'undefined') {
    return {
      totalVisits: 0,
      coursesViewed: 0,
      lessonsViewed: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      achievements: [],
    }
  }
  
  const stored = localStorage.getItem('learnhub_stats')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Corrupted data, return defaults
    }
  }
  
  return {
    totalVisits: 0,
    coursesViewed: 0,
    lessonsViewed: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    achievements: [],
  }
}

function saveStats(stats: LearningStats): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('learnhub_stats', JSON.stringify(stats))
  }
}

function createConfetti(): void {
  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6']
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden'
  document.body.appendChild(container)
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    const left = Math.random() * 100
    const delay = Math.random() * 0.5
    const duration = 2 + Math.random() * 2
    const size = 8 + Math.random() * 8
    
    confetti.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      background:${color};
      left:${left}%;
      top:-20px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation:confetti-fall ${duration}s ease-out ${delay}s forwards;
    `
    container.appendChild(confetti)
  }
  
  setTimeout(() => container.remove(), 4000)
}

// Add confetti animation styles
if (typeof document !== 'undefined' && !document.getElementById('confetti-styles')) {
  const style = document.createElement('style')
  style.id = 'confetti-styles'
  style.textContent = `
    @keyframes confetti-fall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
      50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
    }
    @keyframes badge-pop {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `
  document.head.appendChild(style)
}

export default function LearningProgressWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<LearningStats>(getStoredStats)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const checkAndAwardAchievements = useCallback((currentStats: LearningStats): LearningStats => {
    const newAchievements = [...currentStats.achievements]
    let awardedNew = false
    let latestAchievement = ''

    // Check each achievement
    if (!newAchievements.includes('firstVisit')) {
      newAchievements.push('firstVisit')
      awardedNew = true
      latestAchievement = 'firstVisit'
    }
    
    if (currentStats.coursesViewed >= 3 && !newAchievements.includes('explorer')) {
      newAchievements.push('explorer')
      awardedNew = true
      latestAchievement = 'explorer'
    }
    
    if (currentStats.coursesViewed >= 5 && !newAchievements.includes('courseHunter')) {
      newAchievements.push('courseHunter')
      awardedNew = true
      latestAchievement = 'courseHunter'
    }
    
    if (currentStats.coursesViewed >= 10 && !newAchievements.includes('scholar')) {
      newAchievements.push('scholar')
      awardedNew = true
      latestAchievement = 'scholar'
    }
    
    if (currentStats.lessonsViewed >= 10 && !newAchievements.includes('lessonLover')) {
      newAchievements.push('lessonLover')
      awardedNew = true
      latestAchievement = 'lessonLover'
    }
    
    if (currentStats.currentStreak >= 3 && !newAchievements.includes('dedicated')) {
      newAchievements.push('dedicated')
      awardedNew = true
      latestAchievement = 'dedicated'
    }
    
    if (currentStats.currentStreak >= 7 && !newAchievements.includes('weekWarrior')) {
      newAchievements.push('weekWarrior')
      awardedNew = true
      latestAchievement = 'weekWarrior'
    }
    
    if (currentStats.currentStreak >= 14 && !newAchievements.includes('marathoner')) {
      newAchievements.push('marathoner')
      awardedNew = true
      latestAchievement = 'marathoner'
    }

    if (awardedNew && latestAchievement) {
      createConfetti()
      setNewAchievement(latestAchievement)
      setTimeout(() => setNewAchievement(null), 3000)
    }

    return { ...currentStats, achievements: newAchievements }
  }, [])

  useEffect(() => {
    // Delay showing the widget for a nice entrance
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    let updatedStats = { ...stats }
    
    // Check if this is a new day
    if (stats.lastVisit !== today) {
      const lastDate = stats.lastVisit ? new Date(stats.lastVisit) : null
      const todayDate = new Date(today)
      
      // Calculate streak
      if (lastDate) {
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          updatedStats.currentStreak = stats.currentStreak + 1
        } else if (diffDays > 1) {
          // Streak broken
          updatedStats.currentStreak = 1
        }
      } else {
        // First visit ever
        updatedStats.currentStreak = 1
      }
      
      updatedStats.longestStreak = Math.max(updatedStats.longestStreak, updatedStats.currentStreak)
      updatedStats.totalVisits = stats.totalVisits + 1
      updatedStats.lastVisit = today
    }
    
    // Track page views
    const path = window.location.pathname
    if (path.includes('/courses/') && !path.includes('/lessons/')) {
      // Viewing a course page (but not a lesson)
      const viewedCourses = JSON.parse(sessionStorage.getItem('viewedCourses') || '[]')
      if (!viewedCourses.includes(path)) {
        viewedCourses.push(path)
        sessionStorage.setItem('viewedCourses', JSON.stringify(viewedCourses))
        updatedStats.coursesViewed = stats.coursesViewed + 1
      }
    }
    
    if (path.includes('/lessons/')) {
      const viewedLessons = JSON.parse(sessionStorage.getItem('viewedLessons') || '[]')
      if (!viewedLessons.includes(path)) {
        viewedLessons.push(path)
        sessionStorage.setItem('viewedLessons', JSON.stringify(viewedLessons))
        updatedStats.lessonsViewed = stats.lessonsViewed + 1
      }
    }
    
    // Check for new achievements
    updatedStats = checkAndAwardAchievements(updatedStats)
    
    // Save and update state
    if (JSON.stringify(updatedStats) !== JSON.stringify(stats)) {
      saveStats(updatedStats)
      setStats(updatedStats)
    }
  }, [stats, checkAndAwardAchievements])

  if (!isVisible) return null

  const unlockedCount = stats.achievements.length
  const totalAchievements = Object.keys(ACHIEVEMENTS).length
  const progressPercent = (unlockedCount / totalAchievements) * 100

  return (
    <>
      {/* Achievement Toast */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          style={{ animation: 'badge-pop 0.5s ease-out' }}
        >
          <span className="text-3xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].emoji}</span>
          <div>
            <div className="font-bold">Achievement Unlocked!</div>
            <div className="text-sm opacity-90">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].name}</div>
          </div>
        </div>
      )}

      {/* Floating Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
        style={{ animation: 'pulse-glow 2s infinite' }}
        aria-label="Learning Progress"
      >
        {stats.currentStreak > 0 ? (
          <div className="relative">
            <span className="text-2xl">🔥</span>
            <span className="absolute -top-1 -right-2 bg-white text-primary-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {stats.currentStreak}
            </span>
          </div>
        ) : (
          <span className="text-2xl">📊</span>
        )}
      </button>

      {/* Expanded Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Your Learning Journey</h3>
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

          {/* Stats Grid */}
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="bg-navy-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-xs text-navy-400">Day Streak</div>
            </div>
            <div className="bg-navy-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="bg-navy-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-2xl font-bold text-white">{stats.coursesViewed}</div>
              <div className="text-xs text-navy-400">Courses Viewed</div>
            </div>
            <div className="bg-navy-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">📖</div>
              <div className="text-2xl font-bold text-white">{stats.lessonsViewed}</div>
              <div className="text-xs text-navy-400">Lessons Read</div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Achievements</span>
              <span className="text-xs text-navy-400">{unlockedCount}/{totalAchievements}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-navy-800 rounded-full mb-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
                const isUnlocked = stats.achievements.includes(key)
                return (
                  <div
                    key={key}
                    className={`relative group cursor-pointer transition-all duration-200 ${
                      isUnlocked ? 'hover:scale-110' : 'opacity-40 grayscale'
                    }`}
                    title={`${achievement.name}: ${achievement.description}`}
                  >
                    <span className="text-2xl">{achievement.emoji}</span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {achievement.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Motivational Footer */}
          <div className="bg-navy-800/50 px-4 py-3 border-t border-navy-700">
            <p className="text-xs text-navy-300 text-center">
              {stats.currentStreak === 0 && "Start your learning streak today! 🚀"}
              {stats.currentStreak === 1 && "Great start! Come back tomorrow to build your streak! ⭐"}
              {stats.currentStreak >= 2 && stats.currentStreak < 7 && `${7 - stats.currentStreak} more days to Week Warrior! 💪`}
              {stats.currentStreak >= 7 && stats.currentStreak < 14 && "Amazing dedication! Keep going! 🌟"}
              {stats.currentStreak >= 14 && "You're a learning legend! 👑"}
            </p>
          </div>
        </div>
      )}
    </>
  )
}