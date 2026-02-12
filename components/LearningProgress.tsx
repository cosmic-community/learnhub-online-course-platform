'use client'

import { useState, useEffect, useCallback } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  coursesViewed: string[]
  lessonsCompleted: string[]
  currentStreak: number
  lastVisit: string
  totalVisits: number
  achievements: Achievement[]
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', title: 'Welcome!', description: 'Started your learning journey', icon: '🎉', unlocked: false },
  { id: 'first_course', title: 'Explorer', description: 'Viewed your first course', icon: '🔍', unlocked: false },
  { id: 'three_courses', title: 'Curious Mind', description: 'Explored 3 different courses', icon: '🧠', unlocked: false },
  { id: 'five_courses', title: 'Knowledge Seeker', description: 'Explored 5 different courses', icon: '📚', unlocked: false },
  { id: 'first_lesson', title: 'Student', description: 'Completed your first lesson', icon: '✏️', unlocked: false },
  { id: 'five_lessons', title: 'Dedicated Learner', description: 'Completed 5 lessons', icon: '🌟', unlocked: false },
  { id: 'ten_lessons', title: 'Scholar', description: 'Completed 10 lessons', icon: '🎓', unlocked: false },
  { id: 'streak_3', title: 'On Fire!', description: '3-day learning streak', icon: '🔥', unlocked: false },
  { id: 'streak_7', title: 'Unstoppable', description: '7-day learning streak', icon: '💪', unlocked: false },
]

const STORAGE_KEY = 'learnhub_progress'

function createConfetti() {
  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      opacity: 1;
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

export default function LearningProgress() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showPulse, setShowPulse] = useState(false)

  // Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as LearningStats
      setStats(parsed)
      checkStreak(parsed)
    } else {
      // Initialize new user
      const initial: LearningStats = {
        coursesViewed: [],
        lessonsCompleted: [],
        currentStreak: 1,
        lastVisit: new Date().toDateString(),
        totalVisits: 1,
        achievements: INITIAL_ACHIEVEMENTS,
      }
      // Unlock first visit achievement
      const firstVisitIndex = initial.achievements.findIndex(a => a.id === 'first_visit')
      if (firstVisitIndex !== -1) {
        initial.achievements[firstVisitIndex].unlocked = true
        initial.achievements[firstVisitIndex].unlockedAt = new Date().toISOString()
      }
      setStats(initial)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      
      // Show welcome achievement
      setTimeout(() => {
        setNewAchievement(initial.achievements[firstVisitIndex])
        createConfetti()
        setShowPulse(true)
      }, 1000)
    }
  }, [])

  const checkStreak = useCallback((currentStats: LearningStats) => {
    const today = new Date().toDateString()
    const lastVisit = new Date(currentStats.lastVisit).toDateString()
    
    if (today !== lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const updatedStats = { ...currentStats }
      
      if (yesterday.toDateString() === lastVisit) {
        // Consecutive day
        updatedStats.currentStreak += 1
        updatedStats.totalVisits += 1
      } else {
        // Streak broken
        updatedStats.currentStreak = 1
        updatedStats.totalVisits += 1
      }
      
      updatedStats.lastVisit = today
      setStats(updatedStats)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats))
      
      // Check streak achievements
      checkAchievements(updatedStats)
    }
  }, [])

  const checkAchievements = useCallback((currentStats: LearningStats) => {
    const updated = { ...currentStats }
    let newUnlock: Achievement | null = null

    updated.achievements = updated.achievements.map(achievement => {
      if (achievement.unlocked) return achievement

      let shouldUnlock = false

      switch (achievement.id) {
        case 'first_course':
          shouldUnlock = updated.coursesViewed.length >= 1
          break
        case 'three_courses':
          shouldUnlock = updated.coursesViewed.length >= 3
          break
        case 'five_courses':
          shouldUnlock = updated.coursesViewed.length >= 5
          break
        case 'first_lesson':
          shouldUnlock = updated.lessonsCompleted.length >= 1
          break
        case 'five_lessons':
          shouldUnlock = updated.lessonsCompleted.length >= 5
          break
        case 'ten_lessons':
          shouldUnlock = updated.lessonsCompleted.length >= 10
          break
        case 'streak_3':
          shouldUnlock = updated.currentStreak >= 3
          break
        case 'streak_7':
          shouldUnlock = updated.currentStreak >= 7
          break
      }

      if (shouldUnlock) {
        newUnlock = { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
        return newUnlock
      }
      return achievement
    })

    if (newUnlock) {
      setStats(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setNewAchievement(newUnlock)
      createConfetti()
      setShowPulse(true)
    }
  }, [])

  // Track page views (course pages)
  useEffect(() => {
    if (!stats) return

    const path = window.location.pathname
    const courseMatch = path.match(/^\/courses\/([^/]+)$/)
    const lessonMatch = path.match(/^\/courses\/[^/]+\/lessons\/([^/]+)$/)

    if (courseMatch) {
      const courseSlug = courseMatch[1]
      if (!stats.coursesViewed.includes(courseSlug)) {
        const updated = {
          ...stats,
          coursesViewed: [...stats.coursesViewed, courseSlug],
        }
        setStats(updated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        checkAchievements(updated)
      }
    }

    if (lessonMatch) {
      const lessonSlug = lessonMatch[1]
      if (!stats.lessonsCompleted.includes(lessonSlug)) {
        const updated = {
          ...stats,
          lessonsCompleted: [...stats.lessonsCompleted, lessonSlug],
        }
        setStats(updated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        checkAchievements(updated)
      }
    }
  }, [stats, checkAchievements])

  // Clear new achievement notification after delay
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => {
        setNewAchievement(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  // Clear pulse after animation
  useEffect(() => {
    if (showPulse) {
      const timer = setTimeout(() => setShowPulse(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showPulse])

  if (!stats) return null

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const totalAchievements = stats.achievements.length
  const progressPercent = (unlockedCount / totalAchievements) * 100

  return (
    <>
      {/* Achievement notification toast */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/50 flex items-center gap-4">
            <span className="text-4xl animate-wiggle">{newAchievement.icon}</span>
            <div>
              <div className="font-bold text-lg">Achievement Unlocked!</div>
              <div className="text-primary-100">{newAchievement.title}</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110 ${showPulse ? 'animate-pulse-ring' : ''}`}
        aria-label="Learning Progress"
      >
        <div className="relative">
          <span className="text-2xl">🎯</span>
          {stats.currentStreak > 1 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              🔥{stats.currentStreak}
            </span>
          )}
        </div>
      </button>

      {/* Progress panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-4 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span>📊</span> Your Progress
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-navy-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Streak display */}
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-navy-800/50 rounded-lg px-3 py-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-white font-bold">{stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''}</div>
                  <div className="text-navy-400 text-xs">Current streak</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-navy-800/50 rounded-lg px-3 py-2">
                <span className="text-2xl">📚</span>
                <div>
                  <div className="text-white font-bold">{stats.coursesViewed.length}</div>
                  <div className="text-navy-400 text-xs">Courses explored</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="p-4 border-b border-navy-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-navy-300 text-sm">Achievements</span>
              <span className="text-primary-400 text-sm font-medium">{unlockedCount}/{totalAchievements}</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Achievements list */}
          <div className="p-4 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative group flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-primary-500/10 border border-primary-500/30' 
                      : 'bg-navy-800/50 border border-navy-700 opacity-50'
                  }`}
                >
                  <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </span>
                  <span className="text-xs text-center mt-1 text-navy-300 line-clamp-1">
                    {achievement.title}
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-700 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {achievement.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-navy-800/30 border-t border-navy-700">
            <p className="text-navy-400 text-xs text-center">
              Keep learning to unlock more achievements! 🚀
            </p>
          </div>
        </div>
      )}

      {/* Global styles for animations */}
      <style jsx global>{`
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
        
        @keyframes bounce-in {
          0% {
            transform: translate(-50%, -100px);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, 10px);
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(20, 184, 166, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0);
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  )
}