'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalLessonsViewed: number
  totalMinutesLearned: number
  achievements: string[]
}

const ACHIEVEMENTS = {
  FIRST_LESSON: { id: 'first_lesson', name: 'First Steps', emoji: '👶', description: 'Viewed your first lesson' },
  WEEK_STREAK: { id: 'week_streak', name: 'Week Warrior', emoji: '🗓️', description: '7-day learning streak' },
  MONTH_STREAK: { id: 'month_streak', name: 'Monthly Master', emoji: '🏆', description: '30-day learning streak' },
  TEN_LESSONS: { id: 'ten_lessons', name: 'Knowledge Seeker', emoji: '📚', description: 'Viewed 10 lessons' },
  HOUR_LEARNER: { id: 'hour_learner', name: 'Dedicated Learner', emoji: '⏰', description: 'Spent 60 minutes learning' },
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const getDefaultData = (): StreakData => ({
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    totalLessonsViewed: 0,
    totalMinutesLearned: 0,
    achievements: [],
  })

  const getTodayDate = () => new Date().toISOString().split('T')[0]

  const checkAndUpdateStreak = useCallback((data: StreakData): StreakData => {
    const today = getTodayDate()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let updatedData = { ...data }

    if (data.lastVisitDate === today) {
      // Already visited today, no streak update needed
      return updatedData
    }

    if (data.lastVisitDate === yesterdayStr) {
      // Visited yesterday, increment streak!
      updatedData.currentStreak += 1
      updatedData.lastVisitDate = today
      
      if (updatedData.currentStreak > updatedData.longestStreak) {
        updatedData.longestStreak = updatedData.currentStreak
      }

      // Check for streak achievements
      if (updatedData.currentStreak >= 7 && !updatedData.achievements.includes('week_streak')) {
        updatedData.achievements.push('week_streak')
        setNewAchievement('week_streak')
      }
      if (updatedData.currentStreak >= 30 && !updatedData.achievements.includes('month_streak')) {
        updatedData.achievements.push('month_streak')
        setNewAchievement('month_streak')
      }

      // Show celebration for milestones
      if (updatedData.currentStreak % 7 === 0 || updatedData.currentStreak === 3) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    } else if (data.lastVisitDate === '') {
      // First visit ever
      updatedData.currentStreak = 1
      updatedData.longestStreak = 1
      updatedData.lastVisitDate = today
    } else {
      // Streak broken, start fresh
      updatedData.currentStreak = 1
      updatedData.lastVisitDate = today
    }

    return updatedData
  }, [])

  useEffect(() => {
    // Load data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    let data: StreakData = stored ? JSON.parse(stored) : getDefaultData()
    
    // Check and update streak
    const updatedData = checkAndUpdateStreak(data)
    
    // Save updated data
    localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
    setStreakData(updatedData)
  }, [checkAndUpdateStreak])

  // Function to simulate learning activity (for demo purposes)
  const recordLessonView = useCallback((minutes: number = 5) => {
    if (!streakData) return

    const updatedData = {
      ...streakData,
      totalLessonsViewed: streakData.totalLessonsViewed + 1,
      totalMinutesLearned: streakData.totalMinutesLearned + minutes,
    }

    // Check for lesson achievements
    if (updatedData.totalLessonsViewed === 1 && !updatedData.achievements.includes('first_lesson')) {
      updatedData.achievements.push('first_lesson')
      setNewAchievement('first_lesson')
    }
    if (updatedData.totalLessonsViewed >= 10 && !updatedData.achievements.includes('ten_lessons')) {
      updatedData.achievements.push('ten_lessons')
      setNewAchievement('ten_lessons')
    }
    if (updatedData.totalMinutesLearned >= 60 && !updatedData.achievements.includes('hour_learner')) {
      updatedData.achievements.push('hour_learner')
      setNewAchievement('hour_learner')
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
    setStreakData(updatedData)
  }, [streakData])

  // Expose recordLessonView globally for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { recordLessonView?: (minutes?: number) => void }).recordLessonView = recordLessonView
    }
  }, [recordLessonView])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getAchievementById = (id: string) => {
    return Object.values(ACHIEVEMENTS).find(a => a.id === id)
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-6xl">🎉</div>
          <div className="absolute top-1/4 left-1/4 animate-ping text-4xl delay-100">⭐</div>
          <div className="absolute top-1/3 right-1/4 animate-ping text-4xl delay-200">🌟</div>
          <div className="absolute bottom-1/3 left-1/3 animate-ping text-4xl delay-300">✨</div>
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div 
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right flex items-center gap-4"
          onClick={() => setNewAchievement(null)}
        >
          <div className="text-4xl">{getAchievementById(newAchievement)?.emoji}</div>
          <div>
            <div className="font-bold text-lg">Achievement Unlocked!</div>
            <div className="text-primary-100">{getAchievementById(newAchievement)?.name}</div>
          </div>
          <button 
            onClick={() => setNewAchievement(null)}
            className="ml-2 text-primary-200 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-20 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="text-2xl animate-pulse">
              {getStreakEmoji(streakData.currentStreak)}
            </div>
            <div className="text-left">
              <div className="text-xs text-navy-400 uppercase tracking-wider">Learning Streak</div>
              <div className="text-xl font-bold text-white">
                {streakData.currentStreak} {streakData.currentStreak === 1 ? 'day' : 'days'}
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>

          {/* Expanded Stats */}
          {isExpanded && (
            <div className="border-t border-navy-700 px-4 py-4 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-left">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-lg font-bold text-white">{streakData.totalLessonsViewed}</div>
                  <div className="text-xs text-navy-400">Lessons Viewed</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-left">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-lg font-bold text-white">{streakData.totalMinutesLearned}m</div>
                  <div className="text-xs text-navy-400">Time Learning</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-left">
                  <div className="text-2xl mb-1">🏅</div>
                  <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-left">
                  <div className="text-2xl mb-1">🎖️</div>
                  <div className="text-lg font-bold text-white">{streakData.achievements.length}</div>
                  <div className="text-xs text-navy-400">Achievements</div>
                </div>
              </div>

              {/* Achievements */}
              {streakData.achievements.length > 0 && (
                <div>
                  <div className="text-xs text-navy-400 mb-2 text-left">ACHIEVEMENTS</div>
                  <div className="flex flex-wrap gap-2">
                    {streakData.achievements.map((achId) => {
                      const ach = getAchievementById(achId)
                      return ach ? (
                        <div 
                          key={achId} 
                          className="bg-primary-500/20 rounded-full px-3 py-1 text-sm flex items-center gap-1"
                          title={ach.description}
                        >
                          <span>{ach.emoji}</span>
                          <span className="text-primary-300">{ach.name}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Demo Button - In real app this would be triggered by actual lesson views */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  recordLessonView(Math.floor(Math.random() * 15) + 5)
                }}
                className="w-full bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 py-2 rounded-lg text-sm transition-colors"
              >
                + Simulate Lesson View
              </button>
            </div>
          )}
        </button>
      </div>
    </>
  )
}