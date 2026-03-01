'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningStats {
  currentStreak: number
  longestStreak: number
  totalMinutesThisWeek: number
  weeklyGoalMinutes: number
  lessonsCompleted: number
  lastActiveDate: string
  achievements: string[]
}

const DEFAULT_STATS: LearningStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalMinutesThisWeek: 0,
  weeklyGoalMinutes: 300, // 5 hours default
  lessonsCompleted: 0,
  lastActiveDate: '',
  achievements: [],
}

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', requirement: 1 },
  { id: 'streak_3', name: 'Getting Started', icon: '🔥', description: '3-day learning streak', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7-day learning streak', requirement: 7 },
  { id: 'streak_30', name: 'Dedicated Learner', icon: '🏆', description: '30-day learning streak', requirement: 30 },
  { id: 'lessons_5', name: 'Knowledge Seeker', icon: '📚', description: 'Complete 5 lessons', requirement: 5 },
  { id: 'lessons_10', name: 'Curious Mind', icon: '🧠', description: 'Complete 10 lessons', requirement: 10 },
  { id: 'goal_achieved', name: 'Goal Crusher', icon: '💪', description: 'Achieve your weekly goal', requirement: 1 },
]

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('learnhub-learning-stats')
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      
      // Check if streak should reset (missed a day)
      const lastActive = new Date(parsed.lastActiveDate)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays > 1) {
        // Streak broken
        parsed.currentStreak = 0
      }
      
      // Reset weekly minutes if it's a new week
      const lastActiveWeek = getWeekNumber(lastActive)
      const currentWeek = getWeekNumber(today)
      if (lastActiveWeek !== currentWeek) {
        parsed.totalMinutesThisWeek = 0
      }
      
      setStats(parsed)
    }
  }, [])

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (stats.lastActiveDate) {
      localStorage.setItem('learnhub-learning-stats', JSON.stringify(stats))
    }
  }, [stats])

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const checkAchievements = useCallback((currentStats: LearningStats): string[] => {
    const newAchievements: string[] = []
    
    if (currentStats.lessonsCompleted >= 1 && !currentStats.achievements.includes('first_lesson')) {
      newAchievements.push('first_lesson')
    }
    if (currentStats.currentStreak >= 3 && !currentStats.achievements.includes('streak_3')) {
      newAchievements.push('streak_3')
    }
    if (currentStats.currentStreak >= 7 && !currentStats.achievements.includes('streak_7')) {
      newAchievements.push('streak_7')
    }
    if (currentStats.currentStreak >= 30 && !currentStats.achievements.includes('streak_30')) {
      newAchievements.push('streak_30')
    }
    if (currentStats.lessonsCompleted >= 5 && !currentStats.achievements.includes('lessons_5')) {
      newAchievements.push('lessons_5')
    }
    if (currentStats.lessonsCompleted >= 10 && !currentStats.achievements.includes('lessons_10')) {
      newAchievements.push('lessons_10')
    }
    if (currentStats.totalMinutesThisWeek >= currentStats.weeklyGoalMinutes && !currentStats.achievements.includes('goal_achieved')) {
      newAchievements.push('goal_achieved')
    }
    
    return newAchievements
  }, [])

  // Simulate logging learning activity (in real app, would be called when viewing lessons)
  const logActivity = useCallback((minutes: number = 5) => {
    const today = new Date().toISOString().split('T')[0]
    
    setStats(prev => {
      const lastActiveDate = prev.lastActiveDate.split('T')[0]
      const isNewDay = lastActiveDate !== today
      
      const newStats: LearningStats = {
        ...prev,
        totalMinutesThisWeek: prev.totalMinutesThisWeek + minutes,
        lessonsCompleted: prev.lessonsCompleted + 1,
        lastActiveDate: new Date().toISOString(),
        currentStreak: isNewDay ? prev.currentStreak + 1 : prev.currentStreak,
        longestStreak: isNewDay 
          ? Math.max(prev.longestStreak, prev.currentStreak + 1) 
          : prev.longestStreak,
      }
      
      // Check for new achievements
      const achievementsToAdd = checkAchievements(newStats)
      if (achievementsToAdd.length > 0) {
        newStats.achievements = [...prev.achievements, ...achievementsToAdd]
        setNewAchievement(achievementsToAdd[0])
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          setNewAchievement(null)
        }, 3000)
      }
      
      return newStats
    })
  }, [checkAchievements])

  const progressPercentage = Math.min(100, (stats.totalMinutesThisWeek / stats.weeklyGoalMinutes) * 100)
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  const getMotivationalMessage = (): string => {
    if (stats.currentStreak === 0) return "Start your learning journey today! 🚀"
    if (stats.currentStreak < 3) return "Great start! Keep the momentum going! 💪"
    if (stats.currentStreak < 7) return "You're on fire! Don't break the streak! 🔥"
    if (stats.currentStreak < 30) return "Incredible dedication! You're a star! ⭐"
    return "Legendary commitment! You're unstoppable! 🏆"
  }

  return (
    <>
      {/* Floating Progress Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-24 right-5 z-40 group"
        aria-label="View learning progress"
      >
        <div className="relative">
          {/* Progress Ring */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-navy-800"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              className="text-primary-500 transition-all duration-1000 ease-out"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>
          {/* Inner content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-lg">🔥</span>
              <span className="block text-xs font-bold text-white">{stats.currentStreak}</span>
            </div>
          </div>
          {/* Pulse animation for active streak */}
          {stats.currentStreak > 0 && (
            <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
          )}
        </div>
      </button>

      {/* Expanded Progress Panel */}
      {isExpanded && (
        <div className="fixed bottom-44 right-5 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Your Progress</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-primary-100 text-sm mt-1">{getMotivationalMessage()}</p>
          </div>

          {/* Stats Grid */}
          <div className="p-4 grid grid-cols-2 gap-4">
            {/* Current Streak */}
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-xs text-navy-400">Day Streak</div>
            </div>

            {/* Lessons Completed */}
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-3xl mb-1">📖</div>
              <div className="text-2xl font-bold text-white">{stats.lessonsCompleted}</div>
              <div className="text-xs text-navy-400">Lessons Done</div>
            </div>

            {/* Weekly Goal Progress */}
            <div className="col-span-2 bg-navy-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-navy-300">Weekly Goal</span>
                <span className="text-sm font-medium text-primary-400">
                  {Math.round(stats.totalMinutesThisWeek)}m / {stats.weeklyGoalMinutes}m
                </span>
              </div>
              <div className="h-3 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {progressPercentage >= 100 && (
                <div className="text-center mt-2 text-sm text-green-400">
                  🎉 Goal achieved! Great work!
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="px-4 pb-4">
            <h4 className="text-sm font-medium text-navy-300 mb-3">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENTS.map(achievement => {
                const isUnlocked = stats.achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`relative group ${isUnlocked ? '' : 'opacity-40 grayscale'}`}
                    title={`${achievement.name}: ${achievement.description}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      isUnlocked 
                        ? 'bg-primary-500/20 border-2 border-primary-500' 
                        : 'bg-navy-800 border-2 border-navy-700'
                    }`}>
                      {achievement.icon}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-700 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-navy-300">{achievement.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Demo Button - for testing */}
          <div className="px-4 pb-4">
            <button
              onClick={() => logActivity(15)}
              className="w-full py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-sm font-medium transition-colors"
            >
              ✨ Log Learning Session (Demo)
            </button>
          </div>
        </div>
      )}

      {/* Achievement Celebration Popup */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-navy-900 border-2 border-primary-500 rounded-2xl p-8 text-center animate-in zoom-in-95 duration-500 shadow-2xl shadow-primary-500/25">
            <div className="text-6xl mb-4 animate-bounce">
              {ACHIEVEMENTS.find(a => a.id === newAchievement)?.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Achievement Unlocked!
            </h3>
            <p className="text-primary-400 font-medium">
              {ACHIEVEMENTS.find(a => a.id === newAchievement)?.name}
            </p>
            <p className="text-navy-400 text-sm mt-1">
              {ACHIEVEMENTS.find(a => a.id === newAchievement)?.description}
            </p>
            {/* Confetti particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'][i % 4],
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
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