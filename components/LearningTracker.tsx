'use client'

import { useState, useEffect, useCallback } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  coursesViewed: number
  lessonsViewed: number
  streak: number
  lastVisit: string
  totalVisits: number
  achievements: Achievement[]
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first-visit', name: 'Welcome!', description: 'Started your learning journey', icon: '🎉' },
  { id: 'curious-learner', name: 'Curious Learner', description: 'Viewed 3 courses', icon: '🔍' },
  { id: 'course-explorer', name: 'Course Explorer', description: 'Viewed 5 courses', icon: '🗺️' },
  { id: 'lesson-starter', name: 'First Lesson', description: 'Viewed your first lesson', icon: '📖' },
  { id: 'dedicated-student', name: 'Dedicated Student', description: 'Viewed 10 lessons', icon: '🎓' },
  { id: 'streak-3', name: '3-Day Streak', description: 'Visited 3 days in a row', icon: '🔥' },
  { id: 'streak-7', name: 'Week Warrior', description: 'Visited 7 days in a row', icon: '⚡' },
  { id: 'explorer-10', name: 'Super Explorer', description: '10 total visits', icon: '🚀' },
]

function createConfetti() {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
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
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 5000)
  }
}

export default function LearningTracker() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showPulse, setShowPulse] = useState(false)

  const checkAchievements = useCallback((currentStats: LearningStats): Achievement[] => {
    const newUnlocks: Achievement[] = []
    
    const updatedAchievements = currentStats.achievements.map(achievement => {
      if (achievement.unlocked) return achievement
      
      let shouldUnlock = false
      
      switch (achievement.id) {
        case 'first-visit':
          shouldUnlock = currentStats.totalVisits >= 1
          break
        case 'curious-learner':
          shouldUnlock = currentStats.coursesViewed >= 3
          break
        case 'course-explorer':
          shouldUnlock = currentStats.coursesViewed >= 5
          break
        case 'lesson-starter':
          shouldUnlock = currentStats.lessonsViewed >= 1
          break
        case 'dedicated-student':
          shouldUnlock = currentStats.lessonsViewed >= 10
          break
        case 'streak-3':
          shouldUnlock = currentStats.streak >= 3
          break
        case 'streak-7':
          shouldUnlock = currentStats.streak >= 7
          break
        case 'explorer-10':
          shouldUnlock = currentStats.totalVisits >= 10
          break
      }
      
      if (shouldUnlock) {
        const unlockedAchievement = { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
        newUnlocks.push(unlockedAchievement)
        return unlockedAchievement
      }
      
      return achievement
    })
    
    if (newUnlocks.length > 0) {
      setNewAchievement(newUnlocks[0] ?? null)
      createConfetti()
      setShowPulse(true)
      setTimeout(() => {
        setNewAchievement(null)
        setShowPulse(false)
      }, 4000)
    }
    
    return updatedAchievements
  }, [])

  useEffect(() => {
    // Load stats from localStorage
    const stored = localStorage.getItem('learnhub-stats')
    const today = new Date().toDateString()
    
    let currentStats: LearningStats
    
    if (stored) {
      currentStats = JSON.parse(stored) as LearningStats
      const lastVisitDate = new Date(currentStats.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      // Update streak
      if (lastVisitDate !== today) {
        if (lastVisitDate === yesterday) {
          currentStats.streak += 1
        } else if (lastVisitDate !== today) {
          currentStats.streak = 1
        }
        currentStats.totalVisits += 1
        currentStats.lastVisit = new Date().toISOString()
      }
    } else {
      // First visit
      currentStats = {
        coursesViewed: 0,
        lessonsViewed: 0,
        streak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1,
        achievements: ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
      }
    }
    
    // Check achievements
    currentStats.achievements = checkAchievements(currentStats)
    
    // Save and set state
    localStorage.setItem('learnhub-stats', JSON.stringify(currentStats))
    setStats(currentStats)
  }, [checkAchievements])

  // Track page views
  useEffect(() => {
    const trackPageView = () => {
      const path = window.location.pathname
      const stored = localStorage.getItem('learnhub-stats')
      if (!stored) return
      
      const currentStats = JSON.parse(stored) as LearningStats
      let updated = false
      
      if (path.includes('/courses/') && !path.includes('/lessons/')) {
        currentStats.coursesViewed += 1
        updated = true
      } else if (path.includes('/lessons/')) {
        currentStats.lessonsViewed += 1
        updated = true
      }
      
      if (updated) {
        currentStats.achievements = checkAchievements(currentStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(currentStats))
        setStats(currentStats)
      }
    }
    
    // Track on navigation
    const observer = new MutationObserver(() => {
      trackPageView()
    })
    
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => observer.disconnect()
  }, [checkAchievements])

  if (!stats) return null

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const progressPercent = (unlockedCount / stats.achievements.length) * 100

  return (
    <>
      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl animate-wiggle">{newAchievement.icon}</span>
            <div>
              <p className="text-sm font-medium opacity-90">Achievement Unlocked!</p>
              <p className="font-bold text-lg">{newAchievement.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${showPulse ? 'animate-pulse-ring' : ''}`}
      >
        <span className="text-2xl">🏆</span>
        {stats.streak > 1 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-bounce">
            {stats.streak}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-5 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span className="text-2xl">📚</span> Your Learning Journey
            </h3>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-white text-sm font-medium">{unlockedCount}/{stats.achievements.length}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-4 border-b border-navy-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.streak}</div>
              <div className="text-xs text-navy-400">Day Streak 🔥</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.coursesViewed}</div>
              <div className="text-xs text-navy-400">Courses 📚</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.lessonsViewed}</div>
              <div className="text-xs text-navy-400">Lessons 📖</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="p-4 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-semibold text-navy-300 mb-3">Achievements</h4>
            <div className="grid grid-cols-4 gap-2">
              {stats.achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`relative group cursor-pointer transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'opacity-100 transform hover:scale-110' 
                      : 'opacity-40 grayscale'
                  }`}
                  title={achievement.unlocked ? `${achievement.name}: ${achievement.description}` : '???'}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30' 
                      : 'bg-navy-800 border border-navy-700'
                  }`}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {achievement.unlocked ? achievement.name : 'Keep learning!'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-navy-800/50 text-center">
            <p className="text-xs text-navy-400">
              ✨ Keep exploring to unlock more achievements!
            </p>
          </div>
        </div>
      )}

      {/* Confetti Animation Styles */}
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
            transform: translateX(-50%) scale(0) translateY(-50px);
            opacity: 0;
          }
          50% {
            transform: translateX(-50%) scale(1.1) translateY(0);
          }
          100% {
            transform: translateX(-50%) scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-pulse-ring {
          animation: pulse-ring 1s ease-out infinite;
        }
      `}</style>
    </>
  )
}