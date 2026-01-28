'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningStats {
  streak: number
  lessonsCompleted: number
  totalMinutes: number
  lastVisit: string
  achievements: string[]
}

const ACHIEVEMENTS = {
  first_lesson: { icon: '🎯', title: 'First Step', description: 'Completed your first lesson' },
  streak_3: { icon: '🔥', title: 'On Fire', description: '3-day learning streak' },
  streak_7: { icon: '⚡', title: 'Unstoppable', description: '7-day learning streak' },
  streak_30: { icon: '🏆', title: 'Champion', description: '30-day learning streak' },
  lessons_5: { icon: '📚', title: 'Bookworm', description: 'Completed 5 lessons' },
  lessons_10: { icon: '🎓', title: 'Scholar', description: 'Completed 10 lessons' },
  lessons_25: { icon: '🌟', title: 'Master', description: 'Completed 25 lessons' },
  hour_1: { icon: '⏱️', title: 'Dedicated', description: '1 hour of learning' },
  hour_5: { icon: '💪', title: 'Committed', description: '5 hours of learning' },
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const checkAndUpdateStreak = useCallback((currentStats: LearningStats): LearningStats => {
    const today = new Date().toDateString()
    const lastVisit = currentStats.lastVisit ? new Date(currentStats.lastVisit).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = currentStats.streak

    if (lastVisit === today) {
      // Already visited today, no change
      return currentStats
    } else if (lastVisit === yesterday) {
      // Visited yesterday, increment streak
      newStreak = currentStats.streak + 1
    } else if (!lastVisit) {
      // First visit
      newStreak = 1
    } else {
      // Missed a day, reset streak
      newStreak = 1
    }

    return {
      ...currentStats,
      streak: newStreak,
      lastVisit: new Date().toISOString(),
    }
  }, [])

  const checkAchievements = useCallback((currentStats: LearningStats): string[] => {
    const newAchievements: string[] = [...currentStats.achievements]
    
    // Check streak achievements
    if (currentStats.streak >= 3 && !newAchievements.includes('streak_3')) {
      newAchievements.push('streak_3')
    }
    if (currentStats.streak >= 7 && !newAchievements.includes('streak_7')) {
      newAchievements.push('streak_7')
    }
    if (currentStats.streak >= 30 && !newAchievements.includes('streak_30')) {
      newAchievements.push('streak_30')
    }

    // Check lesson achievements
    if (currentStats.lessonsCompleted >= 1 && !newAchievements.includes('first_lesson')) {
      newAchievements.push('first_lesson')
    }
    if (currentStats.lessonsCompleted >= 5 && !newAchievements.includes('lessons_5')) {
      newAchievements.push('lessons_5')
    }
    if (currentStats.lessonsCompleted >= 10 && !newAchievements.includes('lessons_10')) {
      newAchievements.push('lessons_10')
    }
    if (currentStats.lessonsCompleted >= 25 && !newAchievements.includes('lessons_25')) {
      newAchievements.push('lessons_25')
    }

    // Check time achievements
    if (currentStats.totalMinutes >= 60 && !newAchievements.includes('hour_1')) {
      newAchievements.push('hour_1')
    }
    if (currentStats.totalMinutes >= 300 && !newAchievements.includes('hour_5')) {
      newAchievements.push('hour_5')
    }

    return newAchievements
  }, [])

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub_stats')
    let currentStats: LearningStats = savedStats 
      ? JSON.parse(savedStats) 
      : {
          streak: 0,
          lessonsCompleted: 0,
          totalMinutes: 0,
          lastVisit: '',
          achievements: [],
        }

    // Update streak
    const updatedStats = checkAndUpdateStreak(currentStats)
    
    // Check for new achievements
    const newAchievements = checkAchievements(updatedStats)
    const latestAchievement = newAchievements.find(a => !updatedStats.achievements.includes(a))
    
    if (latestAchievement) {
      setNewAchievement(latestAchievement)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }

    const finalStats = { ...updatedStats, achievements: newAchievements }
    setStats(finalStats)
    localStorage.setItem('learnhub_stats', JSON.stringify(finalStats))
  }, [checkAndUpdateStreak, checkAchievements])

  // Simulate completing a lesson (for demo purposes)
  const simulateProgress = () => {
    if (!stats) return
    
    const updatedStats: LearningStats = {
      ...stats,
      lessonsCompleted: stats.lessonsCompleted + 1,
      totalMinutes: stats.totalMinutes + Math.floor(Math.random() * 20) + 10,
    }

    const newAchievements = checkAchievements(updatedStats)
    const latestAchievement = newAchievements.find(a => !stats.achievements.includes(a))
    
    if (latestAchievement) {
      setNewAchievement(latestAchievement)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }

    const finalStats = { ...updatedStats, achievements: newAchievements }
    setStats(finalStats)
    localStorage.setItem('learnhub_stats', JSON.stringify(finalStats))
  }

  if (!stats) return null

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
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '✨', '⭐', '🌟', '💫', '🎊'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-4">
            <span className="text-4xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].icon}</span>
            <div>
              <p className="font-bold">Achievement Unlocked!</p>
              <p className="text-primary-100">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].title}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Widget */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
        >
          {/* Streak Badge */}
          <div className={`
            bg-gradient-to-br from-navy-800 to-navy-900 
            border border-navy-700 rounded-2xl p-4 
            shadow-xl shadow-navy-950/50
            transition-all duration-300 
            ${isExpanded ? 'rounded-b-none border-b-0' : 'hover:scale-105 hover:border-primary-500/50'}
          `}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-3xl">{stats.streak > 0 ? '🔥' : '💤'}</span>
                {stats.streak > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {stats.streak}
                  </span>
                )}
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  {stats.streak > 0 ? `${stats.streak} Day Streak!` : 'Start Learning!'}
                </p>
                <p className="text-navy-400 text-xs">
                  {stats.lessonsCompleted} lessons completed
                </p>
              </div>
              <svg 
                className={`w-4 h-4 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 border-t-0 rounded-b-2xl p-4 shadow-xl shadow-navy-950/50 w-72 animate-slide-up">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-navy-900/50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary-400">{stats.streak}</p>
                <p className="text-navy-400 text-xs">Day Streak</p>
              </div>
              <div className="bg-navy-900/50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary-400">{stats.lessonsCompleted}</p>
                <p className="text-navy-400 text-xs">Lessons</p>
              </div>
              <div className="bg-navy-900/50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary-400">{Math.floor(stats.totalMinutes / 60)}h</p>
                <p className="text-navy-400 text-xs">Learning</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-4">
              <p className="text-white font-semibold text-sm mb-2">Achievements</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
                  const unlocked = stats.achievements.includes(key)
                  return (
                    <div
                      key={key}
                      className={`
                        relative group/badge w-10 h-10 rounded-xl flex items-center justify-center
                        ${unlocked 
                          ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30' 
                          : 'bg-navy-900/50 border border-navy-800 opacity-50'
                        }
                      `}
                      title={`${achievement.title}: ${achievement.description}`}
                    >
                      <span className={`text-lg ${unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/badge:block">
                        <div className="bg-navy-950 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                          {achievement.title}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Demo Button */}
            <button
              onClick={simulateProgress}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm"
            >
              ✨ Simulate Lesson Complete
            </button>
            <p className="text-navy-500 text-xs text-center mt-2">
              (Demo: Click to simulate progress)
            </p>
          </div>
        )}
      </div>
    </>
  )
}