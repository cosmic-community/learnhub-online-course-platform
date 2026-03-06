'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-visit',
    title: 'Explorer',
    description: 'Visited LearnHub for the first time',
    icon: '🧭',
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'course-viewer',
    title: 'Curious Mind',
    description: 'Viewed your first course',
    icon: '👀',
    unlocked: false,
  },
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Visited 3 days in a row',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Visited 7 days in a row',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'category-explorer',
    title: 'Category Explorer',
    description: 'Browsed all categories',
    icon: '🗺️',
    unlocked: false,
  },
]

interface ProgressData {
  streak: number
  lastVisit: string
  totalVisits: number
  achievements: Achievement[]
  coursesViewed: string[]
}

function getStorageKey(): string {
  return 'learnhub-progress'
}

function loadProgress(): ProgressData {
  if (typeof window === 'undefined') {
    return {
      streak: 0,
      lastVisit: '',
      totalVisits: 0,
      achievements: ACHIEVEMENTS,
      coursesViewed: [],
    }
  }
  
  const stored = localStorage.getItem(getStorageKey())
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Invalid JSON, return default
    }
  }
  
  return {
    streak: 0,
    lastVisit: '',
    totalVisits: 0,
    achievements: ACHIEVEMENTS,
    coursesViewed: [],
  }
}

function saveProgress(data: ProgressData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(getStorageKey(), JSON.stringify(data))
}

function isToday(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isYesterday(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}

export default function LearningProgress() {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const data = loadProgress()
    const today = new Date().toISOString()
    
    let newStreak = data.streak
    let shouldCelebrate = false
    
    // Check if this is a new day visit
    if (!isToday(data.lastVisit)) {
      if (isYesterday(data.lastVisit)) {
        // Continue streak
        newStreak = data.streak + 1
        shouldCelebrate = newStreak === 3 || newStreak === 7 || newStreak === 30
      } else if (data.lastVisit === '') {
        // First visit ever
        newStreak = 1
        shouldCelebrate = true
      } else {
        // Streak broken
        newStreak = 1
      }
      
      data.totalVisits += 1
      data.lastVisit = today
      data.streak = newStreak
      
      // Check for streak achievements
      if (newStreak >= 3) {
        const achievement = data.achievements.find(a => a.id === 'streak-3')
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true
          achievement.unlockedAt = today
          setNewAchievement(achievement)
        }
      }
      if (newStreak >= 7) {
        const achievement = data.achievements.find(a => a.id === 'streak-7')
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true
          achievement.unlockedAt = today
          setNewAchievement(achievement)
        }
      }
      
      saveProgress(data)
    }
    
    setProgress(data)
    
    if (shouldCelebrate) {
      setTimeout(() => setShowConfetti(true), 500)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  if (!progress) return null

  const unlockedCount = progress.achievements.filter(a => a.unlocked).length
  const totalAchievements = progress.achievements.length
  const progressPercent = (unlockedCount / totalAchievements) * 100

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-4 shadow-2xl shadow-primary-500/25 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce-gentle">{newAchievement.icon}</div>
              <div>
                <p className="text-primary-100 text-xs uppercase tracking-wider font-semibold">Achievement Unlocked!</p>
                <p className="text-white font-bold">{newAchievement.title}</p>
                <p className="text-primary-100 text-sm">{newAchievement.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Progress Widget */}
      <div className="card overflow-visible">
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-primary-500/25">
                  {progress.streak >= 7 ? '⚡' : progress.streak >= 3 ? '🔥' : '✨'}
                </div>
                {progress.streak > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
                    {progress.streak}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Your Learning Journey</h3>
                <p className="text-navy-400 text-sm">
                  {progress.streak > 0 
                    ? `${progress.streak} day streak! Keep it up!` 
                    : 'Start your streak today!'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{unlockedCount}/{totalAchievements}</p>
                <p className="text-navy-400 text-xs">Achievements</p>
              </div>
              <svg 
                className={`w-5 h-5 text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full opacity-50 blur-sm transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Expanded Achievement Grid */}
        <div 
          className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-6 pb-6 pt-2 border-t border-navy-800">
              <h4 className="text-sm font-semibold text-navy-300 mb-4">Your Achievements</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {progress.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative p-3 rounded-xl text-center transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-primary-500/20 to-purple-600/20 border border-primary-500/30'
                        : 'bg-navy-800/50 border border-navy-700 opacity-50'
                    }`}
                  >
                    <div className={`text-2xl mb-1 ${achievement.unlocked ? 'animate-bounce-gentle' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <p className={`text-xs font-semibold ${achievement.unlocked ? 'text-white' : 'text-navy-500'}`}>
                      {achievement.title}
                    </p>
                    {achievement.unlocked && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Stats Row */}
              <div className="mt-4 pt-4 border-t border-navy-800 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{progress.totalVisits}</p>
                  <p className="text-navy-400 text-xs">Total Visits</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{progress.streak}</p>
                  <p className="text-navy-400 text-xs">Day Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{progress.coursesViewed.length}</p>
                  <p className="text-navy-400 text-xs">Courses Explored</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}