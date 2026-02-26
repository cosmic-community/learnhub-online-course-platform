'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
}

interface ProgressData {
  completedLessons: number
  currentStreak: number
  longestStreak: number
  lastVisit: string
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', requirement: 1 },
  { id: 'five_lessons', name: 'Getting Serious', icon: '📚', description: 'Complete 5 lessons', requirement: 5 },
  { id: 'ten_lessons', name: 'Dedicated Learner', icon: '🌟', description: 'Complete 10 lessons', requirement: 10 },
  { id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3 day learning streak', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7 day learning streak', requirement: 7 },
  { id: 'streak_30', name: 'Month Master', icon: '👑', description: '30 day learning streak', requirement: 30 },
]

export default function LearningProgress({ totalCourses, totalLessons }: LearningProgressProps) {
  const [progress, setProgress] = useState<ProgressData>({
    completedLessons: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    achievements: [],
  })
  const [mounted, setMounted] = useState(false)
  const [showAchievement, setShowAchievement] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('learnhub-progress')
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress) as ProgressData
      
      // Check and update streak
      const today = new Date().toDateString()
      const lastVisit = parsed.lastVisit ? new Date(parsed.lastVisit).toDateString() : ''
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.currentStreak
      
      if (lastVisit === yesterday) {
        // Continuing streak!
        newStreak = parsed.currentStreak + 1
      } else if (lastVisit !== today) {
        // Streak broken
        newStreak = 1
      }
      
      const updatedProgress = {
        ...parsed,
        currentStreak: newStreak,
        longestStreak: Math.max(parsed.longestStreak, newStreak),
        lastVisit: today,
      }
      
      // Check for new achievements
      const newAchievements = checkAchievements(updatedProgress)
      if (newAchievements.length > updatedProgress.achievements.length) {
        const latestAchievement = newAchievements[newAchievements.length - 1]
        if (latestAchievement) {
          setShowAchievement(latestAchievement)
          setTimeout(() => setShowAchievement(null), 3000)
        }
      }
      
      updatedProgress.achievements = newAchievements
      
      setProgress(updatedProgress)
      localStorage.setItem('learnhub-progress', JSON.stringify(updatedProgress))
    } else {
      // First visit!
      const initialProgress: ProgressData = {
        completedLessons: 0,
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: new Date().toDateString(),
        achievements: [],
      }
      setProgress(initialProgress)
      localStorage.setItem('learnhub-progress', JSON.stringify(initialProgress))
    }
  }, [])

  const checkAchievements = (data: ProgressData): string[] => {
    const earned: string[] = []
    
    if (data.completedLessons >= 1) earned.push('first_lesson')
    if (data.completedLessons >= 5) earned.push('five_lessons')
    if (data.completedLessons >= 10) earned.push('ten_lessons')
    if (data.currentStreak >= 3 || data.longestStreak >= 3) earned.push('streak_3')
    if (data.currentStreak >= 7 || data.longestStreak >= 7) earned.push('streak_7')
    if (data.currentStreak >= 30 || data.longestStreak >= 30) earned.push('streak_30')
    
    return earned
  }

  const progressPercentage = totalLessons > 0 
    ? Math.min((progress.completedLessons / totalLessons) * 100, 100) 
    : 0

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Achievement Toast */}
      {showAchievement && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-10">
          <span className="text-lg mr-2">
            {ACHIEVEMENTS.find(a => a.id === showAchievement)?.icon}
          </span>
          Achievement Unlocked!
        </div>
      )}
      
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Your Learning Journey</h3>
          <p className="text-navy-400 text-sm">Keep up the momentum!</p>
        </div>
        
        {/* Streak Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-full border border-orange-500/30">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-white font-bold">{progress.currentStreak} day{progress.currentStreak !== 1 ? 's' : ''}</div>
            <div className="text-orange-400 text-xs">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-navy-800"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#progressGradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progressPercentage * 3.14} 314`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-white">{progress.completedLessons}</span>
            <span className="text-navy-400 text-xs">lessons</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-navy-300">Progress</span>
            <span className="text-white font-semibold">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-navy-400">{progress.completedLessons} completed</span>
            <span className="text-navy-400">{totalLessons} total</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-6 pt-6 border-t border-navy-800">
        <h4 className="text-sm font-semibold text-navy-300 mb-3">Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((achievement) => {
            const isEarned = progress.achievements.includes(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`group relative px-3 py-2 rounded-lg transition-all ${
                  isEarned
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                    : 'bg-navy-800/50 border border-navy-700 opacity-50'
                }`}
                title={achievement.description}
              >
                <span className={`text-xl ${!isEarned && 'grayscale'}`}>{achievement.icon}</span>
                <span className={`ml-2 text-sm ${isEarned ? 'text-white' : 'text-navy-400'}`}>
                  {achievement.name}
                </span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-navy-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {achievement.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Best Streak */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-navy-400">Best Streak</span>
        <span className="text-white font-medium">🏆 {progress.longestStreak} day{progress.longestStreak !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}