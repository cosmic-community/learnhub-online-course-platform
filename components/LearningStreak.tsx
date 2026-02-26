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

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_visit', title: 'Welcome!', description: 'Made your first visit', icon: '👋' },
  { id: 'explorer', title: 'Explorer', description: 'Visited 3 different pages', icon: '🧭' },
  { id: 'dedicated', title: 'Dedicated Learner', description: '3-day learning streak', icon: '🔥' },
  { id: 'week_warrior', title: 'Week Warrior', description: '7-day learning streak', icon: '⚡' },
  { id: 'curious', title: 'Curious Mind', description: 'Viewed 5 courses', icon: '🎯' },
  { id: 'night_owl', title: 'Night Owl', description: 'Learning after midnight', icon: '🦉' },
  { id: 'early_bird', title: 'Early Bird', description: 'Learning before 7 AM', icon: '🌅' },
]

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [pageViews, setPageViews] = useState(0)
  const [courseViews, setCourseViews] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === achievementId && !a.unlocked) {
          const unlockedAchievement = { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          setNewAchievement(unlockedAchievement)
          triggerConfetti()
          setTimeout(() => setNewAchievement(null), 4000)
          return unlockedAchievement
        }
        return a
      })
      localStorage.setItem('learnhub_achievements', JSON.stringify(updated))
      return updated
    })
  }, [triggerConfetti])

  useEffect(() => {
    // Initialize achievements
    const savedAchievements = localStorage.getItem('learnhub_achievements')
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    } else {
      const initial = ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
      setAchievements(initial)
      localStorage.setItem('learnhub_achievements', JSON.stringify(initial))
    }

    // Calculate streak
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('learnhub_last_visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub_streak') || '0')
    const visitHistory: string[] = JSON.parse(localStorage.getItem('learnhub_visit_history') || '[]')

    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      let newStreak = 1
      if (lastVisit === yesterday.toDateString()) {
        newStreak = currentStreak + 1
      }
      
      setStreak(newStreak)
      localStorage.setItem('learnhub_streak', newStreak.toString())
      localStorage.setItem('learnhub_last_visit', today)
      
      // Update visit history
      const updatedHistory = [...visitHistory, today].slice(-30)
      localStorage.setItem('learnhub_visit_history', JSON.stringify(updatedHistory))
    } else {
      setStreak(currentStreak)
    }

    // Track page views
    const savedPageViews = parseInt(localStorage.getItem('learnhub_page_views') || '0') + 1
    setPageViews(savedPageViews)
    localStorage.setItem('learnhub_page_views', savedPageViews.toString())

    // Track course views
    const savedCourseViews = parseInt(localStorage.getItem('learnhub_course_views') || '0')
    setCourseViews(savedCourseViews)

    setIsLoaded(true)
  }, [])

  // Check for achievements
  useEffect(() => {
    if (!isLoaded) return

    // First visit achievement
    const firstVisit = achievements.find(a => a.id === 'first_visit')
    if (firstVisit && !firstVisit.unlocked) {
      setTimeout(() => unlockAchievement('first_visit'), 1500)
    }

    // Explorer achievement (3 pages)
    if (pageViews >= 3) {
      unlockAchievement('explorer')
    }

    // Curious mind (5 course views)
    if (courseViews >= 5) {
      unlockAchievement('curious')
    }

    // Streak achievements
    if (streak >= 3) {
      unlockAchievement('dedicated')
    }
    if (streak >= 7) {
      unlockAchievement('week_warrior')
    }

    // Time-based achievements
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5) {
      unlockAchievement('night_owl')
    }
    if (hour >= 5 && hour < 7) {
      unlockAchievement('early_bird')
    }
  }, [isLoaded, pageViews, courseViews, streak, achievements, unlockAchievement])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (!isLoaded) return null

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] animate-slide-down">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-1 shadow-2xl shadow-amber-500/25">
            <div className="bg-navy-900 rounded-xl px-6 py-4 flex items-center gap-4">
              <div className="text-4xl animate-bounce-slow">{newAchievement.icon}</div>
              <div>
                <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Achievement Unlocked!</div>
                <div className="text-white font-bold">{newAchievement.title}</div>
                <div className="text-navy-300 text-sm">{newAchievement.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
        >
          <div className={`
            bg-gradient-to-br from-amber-500 to-orange-600 
            rounded-2xl p-0.5 shadow-lg shadow-amber-500/25
            transition-all duration-300
            ${isExpanded ? 'scale-100' : 'hover:scale-105'}
          `}>
            <div className="bg-navy-900 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="text-2xl">{streak > 0 ? '🔥' : '✨'}</div>
              <div className="text-left">
                <div className="text-xs text-amber-400 font-semibold">
                  {streak > 0 ? 'Learning Streak' : 'Start Streak'}
                </div>
                <div className="text-white font-bold text-lg leading-none">
                  {streak} {streak === 1 ? 'day' : 'days'}
                </div>
              </div>
              <div className="ml-2 text-navy-500 group-hover:text-navy-300 transition-colors">
                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Achievement badge */}
          {unlockedCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {unlockedCount}
            </div>
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-3 w-72 animate-slide-up">
            <div className="bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-navy-800">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span>🏆</span> Your Achievements
                </h3>
                <p className="text-navy-400 text-sm mt-1">
                  {unlockedCount} of {achievements.length} unlocked
                </p>
                <div className="mt-2 h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="p-3 max-h-64 overflow-y-auto custom-scrollbar">
                <div className="grid gap-2">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl transition-all
                        ${achievement.unlocked 
                          ? 'bg-navy-800/50' 
                          : 'bg-navy-800/20 opacity-50'
                        }
                      `}
                    >
                      <div className={`text-2xl ${!achievement.unlocked && 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${achievement.unlocked ? 'text-white' : 'text-navy-400'}`}>
                          {achievement.title}
                        </div>
                        <div className="text-navy-400 text-xs truncate">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-green-400 text-lg">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 bg-navy-800/50 border-t border-navy-800">
                <div className="text-center">
                  <div className="text-navy-400 text-xs">Keep exploring to unlock more!</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}