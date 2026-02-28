'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalCategories: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface ProgressData {
  streak: number
  lastVisit: string
  coursesViewed: string[]
  lessonsCompleted: string[]
  categoriesExplored: string[]
  achievements: Achievement[]
  totalXP: number
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_visit', name: 'Welcome!', description: 'Visit LearnHub for the first time', icon: '👋' },
  { id: 'explorer', name: 'Explorer', description: 'View 3 different courses', icon: '🔍' },
  { id: 'curious', name: 'Curious Mind', description: 'Explore 2 categories', icon: '🧠' },
  { id: 'dedicated', name: 'Dedicated Learner', description: 'Visit 3 days in a row', icon: '🔥' },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚔️' },
  { id: 'scholar', name: 'Scholar', description: 'View 5 different lessons', icon: '📚' },
  { id: 'completionist', name: 'Completionist', description: 'Earn 500 XP', icon: '🏆' },
]

export default function LearningProgress({ totalCourses, totalLessons, totalCategories }: LearningProgressProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const checkAchievements = useCallback((data: ProgressData): Achievement[] => {
    const updatedAchievements = ACHIEVEMENTS.map(achievement => {
      const existing = data.achievements.find(a => a.id === achievement.id)
      if (existing?.unlocked) return existing

      let shouldUnlock = false
      switch (achievement.id) {
        case 'first_visit':
          shouldUnlock = true
          break
        case 'explorer':
          shouldUnlock = data.coursesViewed.length >= 3
          break
        case 'curious':
          shouldUnlock = data.categoriesExplored.length >= 2
          break
        case 'dedicated':
          shouldUnlock = data.streak >= 3
          break
        case 'week_warrior':
          shouldUnlock = data.streak >= 7
          break
        case 'scholar':
          shouldUnlock = data.lessonsCompleted.length >= 5
          break
        case 'completionist':
          shouldUnlock = data.totalXP >= 500
          break
      }

      return {
        ...achievement,
        unlocked: shouldUnlock,
        unlockedAt: shouldUnlock ? new Date().toISOString() : undefined
      }
    })

    return updatedAchievements
  }, [])

  useEffect(() => {
    // Load progress from localStorage
    const stored = localStorage.getItem('learnhub-progress')
    const today = new Date().toDateString()
    
    let data: ProgressData = stored ? JSON.parse(stored) : {
      streak: 0,
      lastVisit: '',
      coursesViewed: [],
      lessonsCompleted: [],
      categoriesExplored: [],
      achievements: [],
      totalXP: 0
    }

    // Update streak
    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate !== today) {
      if (lastVisitDate === yesterday) {
        data.streak += 1
        data.totalXP += 10 // Bonus XP for maintaining streak
      } else if (lastVisitDate !== today) {
        data.streak = 1
      }
      data.lastVisit = new Date().toISOString()
      data.totalXP += 5 // XP for visiting
    }

    // Check and update achievements
    const oldAchievements = data.achievements.filter(a => a.unlocked)
    data.achievements = checkAchievements(data)
    const newUnlocked = data.achievements.find(
      a => a.unlocked && !oldAchievements.find(oa => oa.id === a.id)
    )

    if (newUnlocked) {
      data.totalXP += 50 // XP for unlocking achievement
      setNewAchievement(newUnlocked)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }

    localStorage.setItem('learnhub-progress', JSON.stringify(data))
    setProgress(data)
    
    // Trigger animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [checkAchievements])

  if (!progress) return null

  const unlockedCount = progress.achievements.filter(a => a.unlocked).length
  const progressPercent = Math.min((progress.totalXP / 1000) * 100, 100)

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 shadow-2xl shadow-primary-500/30">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-bounce">{newAchievement.icon}</div>
              <div>
                <div className="text-primary-100 text-sm font-medium">Achievement Unlocked!</div>
                <div className="text-white text-xl font-bold">{newAchievement.name}</div>
                <div className="text-primary-200 text-sm">{newAchievement.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Learning Journey</h2>
        <p className="text-navy-400">Track your progress and earn achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak Card */}
        <div className="card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Daily Streak</h3>
              <div className="text-3xl">🔥</div>
            </div>
            <div className="flex items-end gap-2">
              <span 
                className={`text-5xl font-bold text-orange-400 transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                {progress.streak}
              </span>
              <span className="text-navy-400 mb-2">days</span>
            </div>
            <div className="mt-4 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    i < Math.min(progress.streak, 7)
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                      : 'bg-navy-700'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <p className="text-navy-400 text-sm mt-3">
              {progress.streak >= 7 
                ? "🎉 Amazing! You're on fire!" 
                : `${7 - progress.streak} more days to Week Warrior!`}
            </p>
          </div>
        </div>

        {/* XP Progress Card */}
        <div className="card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Experience Points</h3>
              <div className="text-3xl">⚡</div>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-navy-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (isAnimating ? progressPercent : 0) / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold text-white transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
                    {progress.totalXP}
                  </div>
                  <div className="text-navy-400 text-xs">XP</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-navy-400 text-sm">
                Level {Math.floor(progress.totalXP / 100) + 1} • {1000 - progress.totalXP} XP to next milestone
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Achievements</h3>
              <div className="text-sm text-navy-400">{unlockedCount}/{ACHIEVEMENTS.length}</div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {progress.achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className={`relative group/achievement cursor-pointer transition-all duration-300 ${
                    isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-purple-500/30 to-primary-500/30 border border-purple-500/50'
                        : 'bg-navy-800 grayscale opacity-40'
                    } ${achievement.unlocked ? 'hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20' : ''}`}
                  >
                    {achievement.icon}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover/achievement:opacity-100 transition-opacity z-10">
                    <div className="bg-navy-800 rounded-lg p-2 text-xs whitespace-nowrap shadow-xl border border-navy-700">
                      <div className="font-semibold text-white">{achievement.name}</div>
                      <div className="text-navy-400">{achievement.description}</div>
                      {!achievement.unlocked && (
                        <div className="text-primary-400 mt-1">🔒 Locked</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-navy-400 text-sm mt-4 text-center">
              {unlockedCount === ACHIEVEMENTS.length 
                ? "🏆 All achievements unlocked!" 
                : "Keep learning to unlock more!"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">📖</div>
          <div className="text-xl font-bold text-white">{progress.coursesViewed.length}</div>
          <div className="text-navy-400 text-xs">Courses Explored</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xl font-bold text-white">{progress.lessonsCompleted.length}</div>
          <div className="text-navy-400 text-xs">Lessons Viewed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-1">🗂️</div>
          <div className="text-xl font-bold text-white">{progress.categoriesExplored.length}</div>
          <div className="text-navy-400 text-xs">Categories Explored</div>
        </div>
      </div>
    </div>
  )
}