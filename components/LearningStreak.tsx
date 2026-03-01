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

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  coursesViewed: string[]
  lessonsViewed: string[]
  achievements: Achievement[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', name: 'Welcome!', description: 'Visit LearnHub for the first time', icon: '👋', unlocked: false },
  { id: 'streak_3', name: 'Getting Started', description: 'Visit 3 days in a row', icon: '🔥', unlocked: false },
  { id: 'streak_7', name: 'Week Warrior', description: 'Visit 7 days in a row', icon: '⚡', unlocked: false },
  { id: 'explorer', name: 'Explorer', description: 'View 3 different courses', icon: '🧭', unlocked: false },
  { id: 'scholar', name: 'Scholar', description: 'View 5 different lessons', icon: '📚', unlocked: false },
  { id: 'dedicated', name: 'Dedicated Learner', description: 'Visit 10 times total', icon: '🎯', unlocked: false },
]

function createConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 4000)
  }
}

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const checkAndUnlockAchievements = useCallback((data: StreakData): { updatedData: StreakData; newlyUnlocked: Achievement | null } => {
    let newlyUnlocked: Achievement | null = null
    const updatedAchievements = data.achievements.map(achievement => {
      if (achievement.unlocked) return achievement
      
      let shouldUnlock = false
      
      switch (achievement.id) {
        case 'first_visit':
          shouldUnlock = data.totalVisits >= 1
          break
        case 'streak_3':
          shouldUnlock = data.currentStreak >= 3
          break
        case 'streak_7':
          shouldUnlock = data.currentStreak >= 7
          break
        case 'explorer':
          shouldUnlock = data.coursesViewed.length >= 3
          break
        case 'scholar':
          shouldUnlock = data.lessonsViewed.length >= 5
          break
        case 'dedicated':
          shouldUnlock = data.totalVisits >= 10
          break
      }
      
      if (shouldUnlock && !achievement.unlocked) {
        newlyUnlocked = { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
        return newlyUnlocked
      }
      
      return achievement
    })
    
    return {
      updatedData: { ...data, achievements: updatedAchievements },
      newlyUnlocked
    }
  }, [])

  useEffect(() => {
    // Load or initialize streak data
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate !== today) {
        // New day visit
        if (lastVisitDate === yesterday) {
          // Consecutive day - increment streak
          data.currentStreak += 1
          data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
        } else {
          // Streak broken - reset to 1
          data.currentStreak = 1
        }
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1,
        coursesViewed: [],
        lessonsViewed: [],
        achievements: DEFAULT_ACHIEVEMENTS
      }
    }
    
    // Check for new achievements
    const { updatedData, newlyUnlocked } = checkAndUnlockAchievements(data)
    
    localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
    setStreakData(updatedData)
    
    if (newlyUnlocked) {
      setTimeout(() => {
        setNewAchievement(newlyUnlocked)
        setShowCelebration(true)
        createConfetti()
      }, 1000)
    }
    
    // Track page views for courses and lessons
    const path = window.location.pathname
    if (path.includes('/courses/') && !path.includes('/lessons/')) {
      const courseSlug = path.split('/courses/')[1]?.split('/')[0]
      if (courseSlug && !updatedData.coursesViewed.includes(courseSlug)) {
        const newData = {
          ...updatedData,
          coursesViewed: [...updatedData.coursesViewed, courseSlug]
        }
        const { updatedData: finalData, newlyUnlocked: courseAchievement } = checkAndUnlockAchievements(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(finalData))
        setStreakData(finalData)
        
        if (courseAchievement) {
          setTimeout(() => {
            setNewAchievement(courseAchievement)
            setShowCelebration(true)
            createConfetti()
          }, 500)
        }
      }
    }
    
    if (path.includes('/lessons/')) {
      const lessonSlug = path.split('/lessons/')[1]?.split('/')[0]
      if (lessonSlug && !updatedData.lessonsViewed.includes(lessonSlug)) {
        const newData = {
          ...updatedData,
          lessonsViewed: [...updatedData.lessonsViewed, lessonSlug]
        }
        const { updatedData: finalData, newlyUnlocked: lessonAchievement } = checkAndUnlockAchievements(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(finalData))
        setStreakData(finalData)
        
        if (lessonAchievement) {
          setTimeout(() => {
            setNewAchievement(lessonAchievement)
            setShowCelebration(true)
            createConfetti()
          }, 500)
        }
      }
    }
  }, [checkAndUnlockAchievements])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
        setNewAchievement(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData) return null

  const unlockedCount = streakData.achievements.filter(a => a.unlocked).length
  const progressPercent = (unlockedCount / streakData.achievements.length) * 100

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
        
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.8);
          }
        }
      `}</style>

      {/* Achievement Celebration Modal */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-navy-900 border-2 border-primary-500 rounded-2xl p-8 text-center max-w-sm mx-4"
            style={{ animation: 'bounce-in 0.5s ease-out, pulse-glow 2s ease-in-out infinite' }}
          >
            <div className="text-6xl mb-4">{newAchievement.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-xl text-primary-400 font-semibold mb-2">{newAchievement.name}</p>
            <p className="text-navy-300">{newAchievement.description}</p>
          </div>
        </div>
      )}

      {/* Streak Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 left-5 z-40 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full p-3 shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-110"
        aria-label="View learning streak"
      >
        <div className="relative">
          <span className="text-2xl">🔥</span>
          {streakData.currentStreak > 1 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {streakData.currentStreak}
            </span>
          )}
        </div>
      </button>

      {/* Streak Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-5 z-40 w-80 bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-navy-700 bg-gradient-to-r from-primary-500/20 to-transparent">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🔥 Learning Streak
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Streak Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-navy-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Day Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-primary-400">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-navy-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${progressPercent * 1.76} 176`}
                    className="text-primary-500 transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{unlockedCount}/{streakData.achievements.length}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Achievements</p>
                <p className="text-xs text-navy-400">Keep exploring to unlock more!</p>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-3 gap-2">
              {streakData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative rounded-lg p-2 text-center transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-primary-500/20 border border-primary-500/50'
                      : 'bg-navy-800/50 border border-navy-700 opacity-50'
                  }`}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </span>
                  <p className="text-[10px] text-navy-300 mt-1 truncate">{achievement.name}</p>
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-navy-900/50 rounded-lg">
                      <span className="text-lg">🔒</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Exploration Stats */}
            <div className="text-xs text-navy-400 pt-2 border-t border-navy-700">
              <p>📚 {streakData.coursesViewed.length} courses explored</p>
              <p>📖 {streakData.lessonsViewed.length} lessons viewed</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}