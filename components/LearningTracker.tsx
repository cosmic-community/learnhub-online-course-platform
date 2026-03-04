'use client'

import { useState, useEffect, useCallback } from 'react'

interface Achievement {
  id: string
  title: string
  emoji: string
  description: string
  unlocked: boolean
  unlockedAt?: number
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_visit', title: 'Welcome Explorer', emoji: '🎉', description: 'Started your learning journey!' },
  { id: 'course_viewer', title: 'Course Curious', emoji: '👀', description: 'Viewed your first course' },
  { id: 'category_explorer', title: 'Path Finder', emoji: '🧭', description: 'Explored a category' },
  { id: 'lesson_starter', title: 'Knowledge Seeker', emoji: '📖', description: 'Started your first lesson' },
  { id: 'five_pages', title: 'Speed Reader', emoji: '⚡', description: 'Visited 5 pages' },
  { id: 'instructor_fan', title: 'Mentor Finder', emoji: '👨‍🏫', description: 'Checked out an instructor' },
  { id: 'night_owl', title: 'Night Owl', emoji: '🦉', description: 'Learning after 10 PM' },
  { id: 'early_bird', title: 'Early Bird', emoji: '🐦', description: 'Learning before 7 AM' },
]

function createConfetti() {
  const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444']
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
      z-index: 10000;
      animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 4000)
  }
}

export default function LearningTracker() {
  const [isOpen, setIsOpen] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [pageViews, setPageViews] = useState(0)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Initialize achievements from localStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('learnhub_achievements')
    const storedViews = localStorage.getItem('learnhub_page_views')
    const storedStreak = localStorage.getItem('learnhub_streak')
    const lastVisit = localStorage.getItem('learnhub_last_visit')
    
    if (stored) {
      setAchievements(JSON.parse(stored))
    } else {
      setAchievements(ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })))
    }
    
    if (storedViews) {
      setPageViews(parseInt(storedViews, 10))
    }
    
    // Calculate streak
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastVisit === today) {
      setStreak(parseInt(storedStreak || '1', 10))
    } else if (lastVisit === yesterday) {
      const newStreak = parseInt(storedStreak || '0', 10) + 1
      setStreak(newStreak)
      localStorage.setItem('learnhub_streak', newStreak.toString())
    } else {
      setStreak(1)
      localStorage.setItem('learnhub_streak', '1')
    }
    
    localStorage.setItem('learnhub_last_visit', today)
  }, [])

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === id && !a.unlocked) {
          const unlockedAchievement = { ...a, unlocked: true, unlockedAt: Date.now() }
          setNewAchievement(unlockedAchievement)
          createConfetti()
          return unlockedAchievement
        }
        return a
      })
      localStorage.setItem('learnhub_achievements', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Track page views and unlock achievements
  useEffect(() => {
    if (!mounted) return

    const newViews = pageViews + 1
    setPageViews(newViews)
    localStorage.setItem('learnhub_page_views', newViews.toString())

    // First visit achievement
    if (newViews === 1) {
      unlockAchievement('first_visit')
    }

    // Five pages achievement
    if (newViews >= 5) {
      unlockAchievement('five_pages')
    }

    // Time-based achievements
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 5) {
      unlockAchievement('night_owl')
    }
    if (hour >= 5 && hour < 7) {
      unlockAchievement('early_bird')
    }

    // Path-based achievements
    const path = window.location.pathname
    if (path.includes('/courses/') && !path.includes('/lessons/')) {
      unlockAchievement('course_viewer')
    }
    if (path.includes('/categories/')) {
      unlockAchievement('category_explorer')
    }
    if (path.includes('/lessons/')) {
      unlockAchievement('lesson_starter')
    }
    if (path.includes('/instructors/')) {
      unlockAchievement('instructor_fan')
    }
  }, [mounted, unlockAchievement]) // Removed pageViews from dependencies to prevent loops

  // Clear new achievement notification
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  if (!mounted) return null

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const progress = (unlockedCount / achievements.length) * 100

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
        
        @keyframes achievement-pop {
          0% {
            transform: scale(0) translateX(100%);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) translateX(0);
          }
          100% {
            transform: scale(1) translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      {/* New Achievement Toast */}
      {newAchievement && (
        <div 
          className="fixed top-20 right-5 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[60] max-w-sm"
          style={{ animation: 'achievement-pop 0.5s ease-out forwards' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl" style={{ animation: 'bounce-in 0.5s ease-out forwards' }}>
              {newAchievement.emoji}
            </span>
            <div>
              <p className="text-xs text-primary-200 uppercase tracking-wider">Achievement Unlocked!</p>
              <p className="font-bold">{newAchievement.title}</p>
              <p className="text-sm text-primary-100">{newAchievement.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Tracker Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white text-2xl z-50 hover:scale-110 transition-transform duration-200"
        aria-label="Learning Progress"
      >
        {newAchievement && (
          <span 
            className="absolute inset-0 rounded-full bg-primary-400"
            style={{ animation: 'pulse-ring 1s ease-out infinite' }}
          />
        )}
        <span className="relative">🏆</span>
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full text-xs font-bold flex items-center justify-center border-2 border-navy-950">
            {unlockedCount}
          </span>
        )}
      </button>

      {/* Tracker Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-5 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white">Your Learning Journey</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>🔥</span>
                <span className="text-white">{streak} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📄</span>
                <span className="text-white">{pageViews} pages</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-3 bg-navy-800/50">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-navy-400">Achievement Progress</span>
              <span className="text-primary-400 font-medium">{unlockedCount}/{achievements.length}</span>
            </div>
            <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative group cursor-pointer ${
                    achievement.unlocked ? '' : 'opacity-40 grayscale'
                  }`}
                  title={achievement.unlocked ? achievement.title : '???'}
                >
                  <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-2xl ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30' 
                      : 'bg-navy-800 border border-navy-700'
                  }`}>
                    {achievement.unlocked ? achievement.emoji : '🔒'}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-navy-700">
                    <p className="font-bold text-white">{achievement.unlocked ? achievement.title : '???'}</p>
                    <p className="text-navy-400">{achievement.unlocked ? achievement.description : 'Keep exploring!'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Footer */}
          <div className="px-4 py-3 bg-navy-800/30 border-t border-navy-700 text-center">
            <p className="text-sm text-navy-300">
              {unlockedCount < 3 ? "🌟 Keep exploring to unlock achievements!" :
               unlockedCount < 6 ? "🚀 You're on fire! Keep going!" :
               "🎯 Amazing! You're a true learner!"}
            </p>
          </div>
        </div>
      )}
    </>
  )
}