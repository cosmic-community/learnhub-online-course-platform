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
  streak: number
  lastVisit: string
  coursesViewed: string[]
  lessonsStarted: string[]
  categoriesExplored: string[]
  totalTimeSpent: number
  achievements: Achievement[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', title: 'Welcome!', description: 'Started your learning journey', icon: '👋', unlocked: false },
  { id: 'explorer', title: 'Explorer', description: 'Viewed 3 different courses', icon: '🔍', unlocked: false },
  { id: 'curious', title: 'Curious Mind', description: 'Explored 2 categories', icon: '🧠', unlocked: false },
  { id: 'dedicated', title: 'Dedicated', description: 'Maintained a 3-day streak', icon: '🔥', unlocked: false },
  { id: 'scholar', title: 'Scholar', description: 'Started 5 lessons', icon: '📚', unlocked: false },
  { id: 'night_owl', title: 'Night Owl', description: 'Learning after 10 PM', icon: '🦉', unlocked: false },
  { id: 'early_bird', title: 'Early Bird', description: 'Learning before 7 AM', icon: '🐦', unlocked: false },
]

const STORAGE_KEY = 'learnhub_progress'

function createConfetti() {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
  const confettiCount = 50
  
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
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 5000)
  }
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)

  // Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const today = new Date().toDateString()
    
    if (stored) {
      const parsed: LearningStats = JSON.parse(stored)
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.streak
      
      if (lastVisitDate !== today) {
        if (lastVisitDate === yesterday) {
          newStreak = parsed.streak + 1
          setShowStreakAnimation(true)
          setTimeout(() => setShowStreakAnimation(false), 3000)
        } else if (lastVisitDate !== today) {
          newStreak = 1
        }
      }
      
      const updatedStats = {
        ...parsed,
        streak: newStreak,
        lastVisit: new Date().toISOString(),
        totalTimeSpent: parsed.totalTimeSpent + 1,
      }
      
      setStats(updatedStats)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats))
    } else {
      // First visit
      const initial: LearningStats = {
        streak: 1,
        lastVisit: new Date().toISOString(),
        coursesViewed: [],
        lessonsStarted: [],
        categoriesExplored: [],
        totalTimeSpent: 1,
        achievements: DEFAULT_ACHIEVEMENTS.map(a => 
          a.id === 'first_visit' 
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        ),
      }
      setStats(initial)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      
      // Show welcome achievement
      setTimeout(() => {
        const welcomeAchievement = initial.achievements.find(a => a.id === 'first_visit')
        if (welcomeAchievement) {
          setNewAchievement(welcomeAchievement)
          createConfetti()
        }
      }, 2000)
    }
  }, [])

  // Check for time-based achievements
  useEffect(() => {
    if (!stats) return
    
    const hour = new Date().getHours()
    let achievementToUnlock: string | null = null
    
    if (hour >= 22 || hour < 5) {
      achievementToUnlock = 'night_owl'
    } else if (hour >= 5 && hour < 7) {
      achievementToUnlock = 'early_bird'
    }
    
    if (achievementToUnlock) {
      unlockAchievement(achievementToUnlock)
    }
  }, [stats])

  // Check streak achievement
  useEffect(() => {
    if (stats && stats.streak >= 3) {
      unlockAchievement('dedicated')
    }
  }, [stats?.streak])

  const unlockAchievement = useCallback((achievementId: string) => {
    if (!stats) return
    
    const achievement = stats.achievements.find(a => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      const updatedAchievements = stats.achievements.map(a =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      )
      
      const updatedStats = { ...stats, achievements: updatedAchievements }
      setStats(updatedStats)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats))
      
      const unlockedAchievement = updatedAchievements.find(a => a.id === achievementId)
      if (unlockedAchievement) {
        setNewAchievement(unlockedAchievement)
        createConfetti()
      }
    }
  }, [stats])

  // Track page views
  useEffect(() => {
    if (!stats) return
    
    const path = window.location.pathname
    let updated = false
    const newStats = { ...stats }
    
    if (path.startsWith('/courses/') && path.split('/').length >= 3) {
      const courseSlug = path.split('/')[2]
      if (courseSlug && !stats.coursesViewed.includes(courseSlug)) {
        newStats.coursesViewed = [...stats.coursesViewed, courseSlug]
        updated = true
        
        if (newStats.coursesViewed.length >= 3) {
          setTimeout(() => unlockAchievement('explorer'), 500)
        }
      }
      
      // Check for lessons
      if (path.includes('/lessons/')) {
        const lessonSlug = path.split('/').pop()
        if (lessonSlug && !stats.lessonsStarted.includes(lessonSlug)) {
          newStats.lessonsStarted = [...stats.lessonsStarted, lessonSlug]
          updated = true
          
          if (newStats.lessonsStarted.length >= 5) {
            setTimeout(() => unlockAchievement('scholar'), 500)
          }
        }
      }
    }
    
    if (path.startsWith('/categories/')) {
      const categorySlug = path.split('/')[2]
      if (categorySlug && !stats.categoriesExplored.includes(categorySlug)) {
        newStats.categoriesExplored = [...stats.categoriesExplored, categorySlug]
        updated = true
        
        if (newStats.categoriesExplored.length >= 2) {
          setTimeout(() => unlockAchievement('curious'), 500)
        }
      }
    }
    
    if (updated) {
      setStats(newStats)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats))
    }
  }, [stats, unlockAchievement])

  // Dismiss achievement notification
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  if (!stats) return null

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const totalAchievements = stats.achievements.length

  return (
    <>
      {/* Confetti animation styles */}
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
        
        @keyframes streak-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes achievement-slide {
          0% { transform: translateX(100%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.6); }
        }
      `}</style>

      {/* Achievement Notification */}
      {newAchievement && (
        <div 
          className="fixed top-24 right-4 z-50 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-4 shadow-2xl max-w-sm"
          style={{ animation: 'achievement-slide 5s ease-in-out forwards' }}
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">{newAchievement.icon}</div>
            <div>
              <p className="text-xs text-primary-200 uppercase tracking-wider font-semibold">Achievement Unlocked!</p>
              <p className="text-white font-bold text-lg">{newAchievement.title}</p>
              <p className="text-primary-100 text-sm">{newAchievement.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        style={showStreakAnimation ? { animation: 'glow 1s ease-in-out infinite' } : {}}
        aria-label="View learning progress"
      >
        <div className="relative">
          <span className="text-2xl">🎯</span>
          {stats.streak > 1 && (
            <span 
              className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              style={showStreakAnimation ? { animation: 'streak-pulse 0.5s ease-in-out infinite' } : {}}
            >
              {stats.streak}
            </span>
          )}
        </div>
      </button>

      {/* Progress Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-5 z-40 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Your Progress</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl mb-1" style={showStreakAnimation ? { animation: 'streak-pulse 0.5s ease-in-out infinite' } : {}}>
                🔥
              </div>
              <div className="text-xl font-bold text-white">{stats.streak}</div>
              <div className="text-xs text-navy-400">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl mb-1">📖</div>
              <div className="text-xl font-bold text-white">{stats.coursesViewed.length}</div>
              <div className="text-xs text-navy-400">Courses</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xl font-bold text-white">{unlockedCount}/{totalAchievements}</div>
              <div className="text-xs text-navy-400">Badges</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="px-4 pb-4">
            <h4 className="text-sm font-semibold text-navy-300 mb-3">Achievements</h4>
            <div className="grid grid-cols-7 gap-2">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative group cursor-pointer transition-transform hover:scale-110 ${
                    achievement.unlocked ? '' : 'grayscale opacity-40'
                  }`}
                  title={`${achievement.title}: ${achievement.description}`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-navy-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-navy-300">{achievement.description}</p>
                      {achievement.unlocked && (
                        <p className="text-green-400 text-xs mt-1">✓ Unlocked!</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-lg p-3 border border-primary-500/20">
              <p className="text-sm text-navy-200 text-center">
                {stats.streak >= 7 
                  ? "🌟 You're on fire! Keep the momentum going!"
                  : stats.streak >= 3
                  ? "🚀 Great streak! You're building a habit!"
                  : "💪 Every day counts. Keep learning!"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}