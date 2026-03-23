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
  coursesViewed: number
  lessonsViewed: number
  categoriesExplored: number
  totalTimeSpent: number
  achievements: Achievement[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', title: 'Welcome!', description: 'Started your learning journey', icon: '🎉', unlocked: false },
  { id: 'explorer', title: 'Explorer', description: 'Viewed 3 different courses', icon: '🔍', unlocked: false },
  { id: 'dedicated', title: 'Dedicated Learner', description: 'Visited for 3 days in a row', icon: '🔥', unlocked: false },
  { id: 'curious', title: 'Curious Mind', description: 'Explored 2 categories', icon: '🧠', unlocked: false },
  { id: 'scholar', title: 'Scholar', description: 'Viewed 5 lessons', icon: '📚', unlocked: false },
  { id: 'committed', title: 'Committed', description: '7-day streak!', icon: '⭐', unlocked: false },
]

const DEFAULT_STATS: LearningStats = {
  streak: 0,
  lastVisit: '',
  coursesViewed: 0,
  lessonsViewed: 0,
  categoriesExplored: 0,
  totalTimeSpent: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
}

function Confetti({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
            width: `${8 + Math.random() * 8}px`,
            height: `${8 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}

function AchievementToast({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-4 shadow-2xl shadow-primary-500/30 flex items-center gap-4 min-w-[300px]">
        <div className="text-4xl animate-bounce-slow">{achievement.icon}</div>
        <div>
          <div className="text-xs text-primary-200 font-medium uppercase tracking-wider">Achievement Unlocked!</div>
          <div className="text-white font-bold text-lg">{achievement.title}</div>
          <div className="text-primary-100 text-sm">{achievement.description}</div>
        </div>
      </div>
    </div>
  )
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [mounted, setMounted] = useState(false)

  const checkAndUnlockAchievement = useCallback((achievementId: string, currentStats: LearningStats): LearningStats => {
    const achievement = currentStats.achievements.find(a => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      const updatedAchievements = currentStats.achievements.map(a =>
        a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
      )
      const unlockedAchievement = updatedAchievements.find(a => a.id === achievementId)
      if (unlockedAchievement) {
        setNewAchievement(unlockedAchievement)
        setShowConfetti(true)
      }
      return { ...currentStats, achievements: updatedAchievements }
    }
    return currentStats
  }, [])

  const updateStreak = useCallback((currentStats: LearningStats): LearningStats => {
    const today = new Date().toDateString()
    const lastVisit = currentStats.lastVisit ? new Date(currentStats.lastVisit).toDateString() : ''
    
    if (lastVisit === today) {
      return currentStats
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    let newStreak = currentStats.streak
    if (lastVisit === yesterdayStr) {
      newStreak = currentStats.streak + 1
    } else if (lastVisit !== today) {
      newStreak = 1
    }
    
    return {
      ...currentStats,
      streak: newStreak,
      lastVisit: new Date().toISOString(),
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    let currentStats = savedStats ? JSON.parse(savedStats) : DEFAULT_STATS
    
    // Merge any new achievements
    const mergedAchievements = DEFAULT_ACHIEVEMENTS.map(defaultAch => {
      const saved = currentStats.achievements?.find((a: Achievement) => a.id === defaultAch.id)
      return saved || defaultAch
    })
    currentStats = { ...DEFAULT_STATS, ...currentStats, achievements: mergedAchievements }
    
    // Update streak
    currentStats = updateStreak(currentStats)
    
    // Check for first visit achievement
    currentStats = checkAndUnlockAchievement('first_visit', currentStats)
    
    // Check streak achievements
    if (currentStats.streak >= 3) {
      currentStats = checkAndUnlockAchievement('dedicated', currentStats)
    }
    if (currentStats.streak >= 7) {
      currentStats = checkAndUnlockAchievement('committed', currentStats)
    }
    
    setStats(currentStats)
    localStorage.setItem('learnhub-progress', JSON.stringify(currentStats))
  }, [updateStreak, checkAndUnlockAchievement])

  // Track page views
  useEffect(() => {
    if (!mounted) return
    
    const path = window.location.pathname
    let updatedStats = { ...stats }
    
    if (path.includes('/courses/') && !path.includes('/lessons/')) {
      updatedStats.coursesViewed = (updatedStats.coursesViewed || 0) + 1
      if (updatedStats.coursesViewed >= 3) {
        updatedStats = checkAndUnlockAchievement('explorer', updatedStats)
      }
    }
    
    if (path.includes('/lessons/')) {
      updatedStats.lessonsViewed = (updatedStats.lessonsViewed || 0) + 1
      if (updatedStats.lessonsViewed >= 5) {
        updatedStats = checkAndUnlockAchievement('scholar', updatedStats)
      }
    }
    
    if (path.includes('/categories/')) {
      updatedStats.categoriesExplored = (updatedStats.categoriesExplored || 0) + 1
      if (updatedStats.categoriesExplored >= 2) {
        updatedStats = checkAndUnlockAchievement('curious', updatedStats)
      }
    }
    
    setStats(updatedStats)
    localStorage.setItem('learnhub-progress', JSON.stringify(updatedStats))
  }, [mounted]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const totalAchievements = stats.achievements.length
  const progressPercent = (unlockedCount / totalAchievements) * 100

  return (
    <>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      {newAchievement && (
        <AchievementToast 
          achievement={newAchievement} 
          onClose={() => setNewAchievement(null)} 
        />
      )}
      
      {/* Floating Progress Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
        >
          {/* Streak Badge */}
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300
            ${stats.streak > 0 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
              : 'bg-navy-800 text-navy-300 border border-navy-700'}
            hover:scale-105 hover:shadow-xl
          `}>
            <span className={`text-xl ${stats.streak > 0 ? 'animate-pulse' : ''}`}>
              {stats.streak > 0 ? '🔥' : '💤'}
            </span>
            <span className="font-bold">{stats.streak}</span>
            <span className="text-sm opacity-80">day streak</span>
          </div>
          
          {/* Achievement Preview Dots */}
          <div className="absolute -top-2 -right-2 flex -space-x-1">
            {stats.achievements.filter(a => a.unlocked).slice(-3).map((a, i) => (
              <div 
                key={a.id}
                className="w-6 h-6 rounded-full bg-navy-900 border-2 border-primary-500 flex items-center justify-center text-xs shadow-lg"
                style={{ zIndex: 3 - i }}
              >
                {a.icon}
              </div>
            ))}
          </div>
        </button>
        
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-3 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4">
              <h3 className="text-white font-bold text-lg">Your Learning Journey</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-primary-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-primary-100 text-sm font-medium">
                  {unlockedCount}/{totalAchievements}
                </span>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-navy-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.coursesViewed}</div>
                <div className="text-xs text-navy-400">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.lessonsViewed}</div>
                <div className="text-xs text-navy-400">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.streak}</div>
                <div className="text-xs text-navy-400">Streak</div>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="p-4 max-h-60 overflow-y-auto">
              <h4 className="text-navy-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Achievements
              </h4>
              <div className="space-y-2">
                {stats.achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`
                      flex items-center gap-3 p-2 rounded-lg transition-all
                      ${achievement.unlocked 
                        ? 'bg-primary-500/10 border border-primary-500/20' 
                        : 'bg-navy-800/50 opacity-50'}
                    `}
                  >
                    <div className={`text-2xl ${!achievement.unlocked && 'grayscale'}`}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${achievement.unlocked ? 'text-white' : 'text-navy-400'}`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-navy-500 truncate">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-primary-400 text-lg">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-3 bg-navy-800/50 border-t border-navy-700">
              <p className="text-center text-navy-400 text-xs">
                Keep learning to unlock more achievements! 🚀
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}