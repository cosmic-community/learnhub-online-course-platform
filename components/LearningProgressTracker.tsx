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

interface ProgressData {
  coursesViewed: string[]
  categoriesViewed: string[]
  instructorsViewed: string[]
  lessonsViewed: string[]
  achievements: Achievement[]
  totalPoints: number
  lastVisit: string
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', title: 'Welcome Explorer', description: 'Visited LearnHub for the first time', icon: '👋', unlocked: false },
  { id: 'course_curious', title: 'Course Curious', description: 'Viewed your first course', icon: '📚', unlocked: false },
  { id: 'category_explorer', title: 'Category Explorer', description: 'Explored a category', icon: '🗂️', unlocked: false },
  { id: 'meet_instructor', title: 'Meet the Expert', description: 'Checked out an instructor profile', icon: '👨‍🏫', unlocked: false },
  { id: 'lesson_learner', title: 'Lesson Learner', description: 'Started your first lesson', icon: '📖', unlocked: false },
  { id: 'explorer_5', title: 'Avid Explorer', description: 'Viewed 5 different courses', icon: '🔍', unlocked: false },
  { id: 'category_master', title: 'Category Master', description: 'Explored 3 categories', icon: '🏷️', unlocked: false },
  { id: 'dedicated_learner', title: 'Dedicated Learner', description: 'Earned 100 exploration points', icon: '🌟', unlocked: false },
  { id: 'super_explorer', title: 'Super Explorer', description: 'Earned 250 exploration points', icon: '🚀', unlocked: false },
]

const STORAGE_KEY = 'learnhub_progress'

function createConfetti() {
  const colors = ['#29ABE2', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899']
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
      opacity: 1;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 4000)
  }
}

export default function LearningProgressTracker() {
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showPulse, setShowPulse] = useState(false)

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as ProgressData
      setProgress(parsed)
    } else {
      // First visit - initialize and unlock first achievement
      const initial: ProgressData = {
        coursesViewed: [],
        categoriesViewed: [],
        instructorsViewed: [],
        lessonsViewed: [],
        achievements: INITIAL_ACHIEVEMENTS.map(a => 
          a.id === 'first_visit' ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        ),
        totalPoints: 10,
        lastVisit: new Date().toISOString()
      }
      setProgress(initial)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      
      // Show first achievement after a brief delay
      setTimeout(() => {
        const firstVisit = initial.achievements.find(a => a.id === 'first_visit')
        if (firstVisit) {
          setNewAchievement(firstVisit)
          createConfetti()
        }
      }, 1500)
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (!progress) return

    const path = window.location.pathname
    let updated = { ...progress }
    let pointsEarned = 0
    let achievementUnlocked: Achievement | null = null

    // Track course views
    if (path.startsWith('/courses/') && path.split('/').length === 3) {
      const courseSlug = path.split('/')[2]
      if (courseSlug && !updated.coursesViewed.includes(courseSlug)) {
        updated.coursesViewed = [...updated.coursesViewed, courseSlug]
        pointsEarned += 15

        // Check for course achievements
        if (updated.coursesViewed.length === 1) {
          const achievement = updated.achievements.find(a => a.id === 'course_curious')
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date().toISOString()
            achievementUnlocked = achievement
          }
        }
        if (updated.coursesViewed.length >= 5) {
          const achievement = updated.achievements.find(a => a.id === 'explorer_5')
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date().toISOString()
            achievementUnlocked = achievement
          }
        }
      }
    }

    // Track category views
    if (path.startsWith('/categories/') && path.split('/').length === 3) {
      const categorySlug = path.split('/')[2]
      if (categorySlug && !updated.categoriesViewed.includes(categorySlug)) {
        updated.categoriesViewed = [...updated.categoriesViewed, categorySlug]
        pointsEarned += 10

        if (updated.categoriesViewed.length === 1) {
          const achievement = updated.achievements.find(a => a.id === 'category_explorer')
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date().toISOString()
            achievementUnlocked = achievement
          }
        }
        if (updated.categoriesViewed.length >= 3) {
          const achievement = updated.achievements.find(a => a.id === 'category_master')
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date().toISOString()
            achievementUnlocked = achievement
          }
        }
      }
    }

    // Track instructor views
    if (path.startsWith('/instructors/') && path.split('/').length === 3) {
      const instructorSlug = path.split('/')[2]
      if (instructorSlug && !updated.instructorsViewed.includes(instructorSlug)) {
        updated.instructorsViewed = [...updated.instructorsViewed, instructorSlug]
        pointsEarned += 10

        if (updated.instructorsViewed.length === 1) {
          const achievement = updated.achievements.find(a => a.id === 'meet_instructor')
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date().toISOString()
            achievementUnlocked = achievement
          }
        }
      }
    }

    // Track lesson views
    if (path.includes('/lessons/')) {
      const lessonSlug = path.split('/lessons/')[1]
      if (lessonSlug && !updated.lessonsViewed.includes(lessonSlug)) {
        updated.lessonsViewed = [...updated.lessonsViewed, lessonSlug]
        pointsEarned += 20

        if (updated.lessonsViewed.length === 1) {
          const achievement = updated.achievements.find(a => a.id === 'lesson_learner')
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date().toISOString()
            achievementUnlocked = achievement
          }
        }
      }
    }

    // Update points
    if (pointsEarned > 0) {
      updated.totalPoints += pointsEarned
      setShowPulse(true)
      setTimeout(() => setShowPulse(false), 1000)

      // Check points-based achievements
      if (updated.totalPoints >= 100) {
        const achievement = updated.achievements.find(a => a.id === 'dedicated_learner')
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true
          achievement.unlockedAt = new Date().toISOString()
          if (!achievementUnlocked) achievementUnlocked = achievement
        }
      }
      if (updated.totalPoints >= 250) {
        const achievement = updated.achievements.find(a => a.id === 'super_explorer')
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true
          achievement.unlockedAt = new Date().toISOString()
          if (!achievementUnlocked) achievementUnlocked = achievement
        }
      }

      updated.lastVisit = new Date().toISOString()
      setProgress(updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

      if (achievementUnlocked) {
        setTimeout(() => {
          setNewAchievement(achievementUnlocked)
          createConfetti()
        }, 500)
      }
    }
  }, [])

  const dismissAchievement = useCallback(() => {
    setNewAchievement(null)
  }, [])

  if (!progress) return null

  const unlockedCount = progress.achievements.filter(a => a.unlocked).length
  const totalCount = progress.achievements.length
  const progressPercent = Math.round((unlockedCount / totalCount) * 100)

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
            transform: scale(0.5) translateY(20px);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            transform: scale(1) translateY(0);
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
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      {/* Achievement Toast */}
      {newAchievement && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 max-w-md"
          style={{ animation: 'achievement-pop 0.5s ease-out forwards' }}
        >
          <button 
            onClick={dismissAchievement}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ×
          </button>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{newAchievement.icon}</div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80 mb-1">🎉 Achievement Unlocked!</div>
              <div className="font-bold text-lg">{newAchievement.title}</div>
              <div className="text-sm opacity-90">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary-500/40 ${showPulse ? 'ring-4 ring-primary-400/50' : ''}`}
        style={{ position: 'fixed' }}
      >
        {showPulse && (
          <span 
            className="absolute inset-0 rounded-full bg-primary-400"
            style={{ animation: 'pulse-ring 0.6s ease-out forwards' }}
          />
        )}
        <span className="text-2xl relative z-10">🏆</span>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-navy-900 text-xs font-bold rounded-full flex items-center justify-center">
          {unlockedCount}
        </span>
      </button>

      {/* Progress Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-44 right-5 z-40 w-80 max-h-[60vh] bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden"
          style={{ position: 'fixed' }}
        >
          {/* Header */}
          <div 
            className="p-4 border-b border-navy-700"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(41, 171, 226, 0.1), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s infinite linear'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-lg">Your Progress</h3>
              <button onClick={() => setIsOpen(false)} className="text-navy-400 hover:text-white">
                ✕
              </button>
            </div>
            
            {/* Points Display */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20">
                ⭐
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{progress.totalPoints}</div>
                <div className="text-xs text-navy-400">Exploration Points</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Achievements</span>
                <span>{unlockedCount}/{totalCount} ({progressPercent}%)</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-navy-800/50">
            <div className="text-center p-2">
              <div className="text-lg font-bold text-primary-400">{progress.coursesViewed.length}</div>
              <div className="text-[10px] text-navy-400">Courses</div>
            </div>
            <div className="text-center p-2">
              <div className="text-lg font-bold text-green-400">{progress.categoriesViewed.length}</div>
              <div className="text-[10px] text-navy-400">Categories</div>
            </div>
            <div className="text-center p-2">
              <div className="text-lg font-bold text-yellow-400">{progress.instructorsViewed.length}</div>
              <div className="text-[10px] text-navy-400">Instructors</div>
            </div>
            <div className="text-center p-2">
              <div className="text-lg font-bold text-purple-400">{progress.lessonsViewed.length}</div>
              <div className="text-[10px] text-navy-400">Lessons</div>
            </div>
          </div>

          {/* Achievements List */}
          <div className="overflow-y-auto max-h-64 p-3 space-y-2">
            {progress.achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  achievement.unlocked 
                    ? 'bg-primary-500/10 border border-primary-500/20' 
                    : 'bg-navy-800/50 opacity-50'
                }`}
              >
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm truncate ${achievement.unlocked ? 'text-white' : 'text-navy-400'}`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-navy-500 truncate">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-400 text-lg">✓</div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-navy-700 bg-navy-800/30">
            <p className="text-xs text-navy-500 text-center">
              Keep exploring to unlock more achievements! 🎮
            </p>
          </div>
        </div>
      )}
    </>
  )
}