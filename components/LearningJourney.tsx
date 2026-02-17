'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
}

interface LearningJourneyProps {
  totalCourses: number
  totalCategories: number
  totalInstructors: number
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', title: 'Explorer', description: 'Welcome to LearnHub!', icon: '🎉' },
  { id: 'browse_courses', title: 'Course Curious', description: 'Browsed the courses page', icon: '📚' },
  { id: 'browse_categories', title: 'Category Hunter', description: 'Explored categories', icon: '🏷️' },
  { id: 'view_course', title: 'Deep Diver', description: 'Viewed a course in detail', icon: '🔍' },
  { id: 'night_owl', title: 'Night Owl', description: 'Learning after midnight!', icon: '🦉' },
  { id: 'early_bird', title: 'Early Bird', description: 'Learning before 7 AM!', icon: '🐦' },
  { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Learning on the weekend', icon: '⚔️' },
]

export default function LearningJourney({ totalCourses, totalCategories, totalInstructors }: LearningJourneyProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [streak, setStreak] = useState(1)
  const [randomTip, setRandomTip] = useState('')

  const tips = [
    "💡 Consistency beats intensity - learn a little every day!",
    "🎯 Set a specific learning goal for this week",
    "🧠 Teaching others is the best way to learn",
    "☕ Take breaks - your brain needs rest to consolidate knowledge",
    "📝 Write notes in your own words for better retention",
    "🎮 Make learning fun with mini-challenges",
    "👥 Join a study group or find a learning buddy",
    "🏆 Celebrate small wins along your learning journey",
  ]

  const unlockAchievement = useCallback((achievementId: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement) return

    const stored = localStorage.getItem('learnhub_achievements')
    const unlockedIds: string[] = stored ? JSON.parse(stored) : []

    if (!unlockedIds.includes(achievementId)) {
      unlockedIds.push(achievementId)
      localStorage.setItem('learnhub_achievements', JSON.stringify(unlockedIds))
      
      setNewAchievement({ ...achievement, unlockedAt: new Date() })
      setShowConfetti(true)
      
      setTimeout(() => {
        setNewAchievement(null)
        setShowConfetti(false)
      }, 4000)
    }
  }, [])

  useEffect(() => {
    // Load achievements from localStorage
    const stored = localStorage.getItem('learnhub_achievements')
    const unlockedIds: string[] = stored ? JSON.parse(stored) : []
    const unlockedAchievements = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id))
    setAchievements(unlockedAchievements)

    // First visit achievement
    if (!stored) {
      setTimeout(() => unlockAchievement('first_visit'), 2000)
    }

    // Time-based achievements
    const hour = new Date().getHours()
    const day = new Date().getDay()

    if (hour >= 0 && hour < 5) {
      unlockAchievement('night_owl')
    }
    if (hour >= 5 && hour < 7) {
      unlockAchievement('early_bird')
    }
    if (day === 0 || day === 6) {
      unlockAchievement('weekend_warrior')
    }

    // Calculate streak
    const lastVisit = localStorage.getItem('learnhub_last_visit')
    const today = new Date().toDateString()
    
    if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const daysDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        const currentStreak = parseInt(localStorage.getItem('learnhub_streak') || '1') + 1
        setStreak(currentStreak)
        localStorage.setItem('learnhub_streak', currentStreak.toString())
      } else if (daysDiff > 1) {
        setStreak(1)
        localStorage.setItem('learnhub_streak', '1')
      } else {
        setStreak(parseInt(localStorage.getItem('learnhub_streak') || '1'))
      }
    }
    
    localStorage.setItem('learnhub_last_visit', today)

    // Set random tip
    setRandomTip(tips[Math.floor(Math.random() * tips.length)])

    // Listen for page navigation to unlock achievements
    const handleRouteChange = () => {
      const path = window.location.pathname
      if (path.includes('/courses') && !path.includes('/courses/')) {
        unlockAchievement('browse_courses')
      }
      if (path.includes('/categories')) {
        unlockAchievement('browse_categories')
      }
      if (path.match(/\/courses\/[^/]+$/)) {
        unlockAchievement('view_course')
      }
    }

    // Check current path
    handleRouteChange()

    // Set up observer for SPA navigation
    const observer = new MutationObserver(handleRouteChange)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [unlockAchievement])

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
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
              {['🎉', '✨', '🌟', '💫', '🎊', '⭐'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[101] animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl">{newAchievement.icon}</span>
            <div>
              <div className="text-sm opacity-90">Achievement Unlocked!</div>
              <div className="font-bold text-lg">{newAchievement.title}</div>
              <div className="text-sm opacity-90">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110 group"
        aria-label="Learning Journey"
      >
        <span className="text-2xl group-hover:animate-wiggle">🎯</span>
        {achievements.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-navy-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {achievements.length}
          </span>
        )}
      </button>

      {/* Slide-out Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-navy-900 z-50 shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🎯 Your Learning Journey
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-navy-400 hover:text-white p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Streak Counter */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🔥</span>
                  <div>
                    <div className="text-2xl font-bold text-white">{streak} Day Streak!</div>
                    <div className="text-orange-300 text-sm">Keep learning to maintain your streak</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary-400">{totalCourses}</div>
                  <div className="text-navy-400 text-xs">Courses</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary-400">{totalCategories}</div>
                  <div className="text-navy-400 text-xs">Categories</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary-400">{totalInstructors}</div>
                  <div className="text-navy-400 text-xs">Instructors</div>
                </div>
              </div>

              {/* Daily Tip */}
              <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-4 mb-6">
                <div className="text-sm text-navy-400 mb-1">💡 Tip of the Day</div>
                <div className="text-white">{randomTip}</div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  🏆 Achievements
                  <span className="text-sm text-navy-400">({achievements.length}/{ACHIEVEMENTS.length})</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = achievements.some(a => a.id === achievement.id)
                    return (
                      <div
                        key={achievement.id}
                        className={`rounded-xl p-3 transition-all ${
                          isUnlocked
                            ? 'bg-primary-500/20 border border-primary-500/30'
                            : 'bg-navy-800/30 border border-navy-700/30 opacity-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{isUnlocked ? achievement.icon : '🔒'}</div>
                        <div className={`font-medium text-sm ${isUnlocked ? 'text-white' : 'text-navy-400'}`}>
                          {achievement.title}
                        </div>
                        <div className="text-xs text-navy-400">{achievement.description}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">🚀 Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="/courses"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors"
                  >
                    Browse All Courses
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-navy-800 hover:bg-navy-700 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors border border-navy-700"
                  >
                    Explore Categories
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}