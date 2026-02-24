'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  coursesViewed: string[]
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-visit', title: 'First Steps', description: 'Welcome to LearnHub!', icon: '👋' },
  { id: 'streak-3', title: 'Getting Started', description: '3-day learning streak', icon: '🔥' },
  { id: 'streak-7', title: 'Dedicated Learner', description: '7-day learning streak', icon: '⭐' },
  { id: 'streak-30', title: 'Learning Machine', description: '30-day learning streak', icon: '🏆' },
  { id: 'courses-3', title: 'Explorer', description: 'Explored 3 different courses', icon: '🧭' },
  { id: 'courses-5', title: 'Knowledge Seeker', description: 'Explored 5 different courses', icon: '📚' },
  { id: 'night-owl', title: 'Night Owl', description: 'Learning after midnight', icon: '🦉' },
  { id: 'early-bird', title: 'Early Bird', description: 'Learning before 7 AM', icon: '🐦' },
]

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  totalVisits: 0,
  coursesViewed: [],
  achievements: [],
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [showWidget, setShowWidget] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
      try {
        const stored = localStorage.getItem('learnhub-streak')
        const data: StreakData = stored ? JSON.parse(stored) : { ...DEFAULT_STREAK_DATA }
        
        const today = new Date().toDateString()
        const lastVisit = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        // Check if this is a new day
        if (lastVisit !== today) {
          if (lastVisit === yesterday) {
            // Continue streak
            data.currentStreak += 1
          } else if (lastVisit !== today) {
            // Reset streak (missed a day)
            data.currentStreak = 1
          }
          
          data.lastVisit = new Date().toISOString()
          data.totalVisits += 1
          
          // Update longest streak
          if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak
          }

          // Check for first visit achievement
          if (!data.achievements.find(a => a.id === 'first-visit')) {
            const achievement = ACHIEVEMENTS.find(a => a.id === 'first-visit')!
            data.achievements.push({ ...achievement, unlockedAt: new Date().toISOString() })
            setNewAchievement(achievement)
          }

          // Check streak achievements
          checkStreakAchievements(data)

          // Check time-based achievements
          checkTimeAchievements(data)

          localStorage.setItem('learnhub-streak', JSON.stringify(data))
        }

        setStreakData(data)
        setIsLoaded(true)
        
        // Show widget after a delay
        setTimeout(() => setShowWidget(true), 500)
      } catch (error) {
        console.error('Error loading streak data:', error)
        setIsLoaded(true)
      }
    }

    loadStreakData()
  }, [])

  const checkStreakAchievements = (data: StreakData) => {
    const streakMilestones = [
      { days: 3, id: 'streak-3' },
      { days: 7, id: 'streak-7' },
      { days: 30, id: 'streak-30' },
    ]

    for (const milestone of streakMilestones) {
      if (data.currentStreak >= milestone.days && !data.achievements.find(a => a.id === milestone.id)) {
        const achievement = ACHIEVEMENTS.find(a => a.id === milestone.id)!
        data.achievements.push({ ...achievement, unlockedAt: new Date().toISOString() })
        setNewAchievement(achievement)
      }
    }
  }

  const checkTimeAchievements = (data: StreakData) => {
    const hour = new Date().getHours()
    
    if (hour >= 0 && hour < 5 && !data.achievements.find(a => a.id === 'night-owl')) {
      const achievement = ACHIEVEMENTS.find(a => a.id === 'night-owl')!
      data.achievements.push({ ...achievement, unlockedAt: new Date().toISOString() })
      setNewAchievement(achievement)
    }
    
    if (hour >= 5 && hour < 7 && !data.achievements.find(a => a.id === 'early-bird')) {
      const achievement = ACHIEVEMENTS.find(a => a.id === 'early-bird')!
      data.achievements.push({ ...achievement, unlockedAt: new Date().toISOString() })
      setNewAchievement(achievement)
    }
  }

  // Close achievement notification after delay
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  if (!isLoaded) return null

  return (
    <>
      {/* Floating Streak Widget */}
      <div
        className={`fixed bottom-24 right-5 z-40 transition-all duration-500 ${
          showWidget ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl p-4 shadow-xl shadow-primary-500/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-3xl animate-pulse">🔥</span>
              {streakData.currentStreak > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {streakData.currentStreak}
                </span>
              )}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {streakData.currentStreak} day streak!
              </p>
              <p className="text-navy-400 text-xs">
                Keep learning daily
              </p>
            </div>
          </div>
          
          {/* Achievement Progress */}
          <div className="mt-3 pt-3 border-t border-navy-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Achievements</span>
              <span className="text-primary-400 font-medium">
                {streakData.achievements.length}/{ACHIEVEMENTS.length}
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              {ACHIEVEMENTS.slice(0, 6).map((achievement) => {
                const unlocked = streakData.achievements.find(a => a.id === achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                      unlocked 
                        ? 'bg-primary-500/20 border border-primary-500/50' 
                        : 'bg-navy-800 border border-navy-700 grayscale opacity-50'
                    }`}
                    title={unlocked ? achievement.title : '???'}
                  >
                    {unlocked ? achievement.icon : '?'}
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={() => setShowWidget(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-navy-700 hover:bg-navy-600 text-navy-300 rounded-full flex items-center justify-center text-xs transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl p-6 shadow-2xl shadow-primary-500/30 flex items-center gap-4">
            <div className="text-5xl animate-wiggle">{newAchievement.icon}</div>
            <div>
              <p className="text-primary-200 text-sm font-medium">Achievement Unlocked!</p>
              <p className="text-white font-bold text-lg">{newAchievement.title}</p>
              <p className="text-primary-100 text-sm">{newAchievement.description}</p>
            </div>
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    backgroundColor: ['#fbbf24', '#f472b6', '#a78bfa', '#34d399'][Math.floor(Math.random() * 4)],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Export function to track course views from other components
export function trackCourseView(courseSlug: string) {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem('learnhub-streak')
    if (!stored) return

    const data: StreakData = JSON.parse(stored)
    
    if (!data.coursesViewed.includes(courseSlug)) {
      data.coursesViewed.push(courseSlug)
      
      // Check course exploration achievements
      const courseMilestones = [
        { count: 3, id: 'courses-3' },
        { count: 5, id: 'courses-5' },
      ]
      
      for (const milestone of courseMilestones) {
        if (data.coursesViewed.length >= milestone.count && !data.achievements.find(a => a.id === milestone.id)) {
          const achievement = ACHIEVEMENTS.find(a => a.id === milestone.id)
          if (achievement) {
            data.achievements.push({ ...achievement, unlockedAt: new Date().toISOString() })
            // Dispatch custom event for achievement notification
            window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: achievement }))
          }
        }
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
  } catch (error) {
    console.error('Error tracking course view:', error)
  }
}