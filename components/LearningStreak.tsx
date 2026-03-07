'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
  weeklyGoal: number
  weeklyProgress: number
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '🌱', requirement: 1, description: 'Started your learning journey' },
  { id: 'week_streak', name: 'Week Warrior', icon: '⚡', requirement: 7, description: '7 day learning streak' },
  { id: 'month_streak', name: 'Dedicated Learner', icon: '🔥', requirement: 30, description: '30 day learning streak' },
  { id: 'century', name: 'Century Club', icon: '💯', requirement: 100, description: '100 days of learning' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDaysLearned: 0,
    weeklyGoal: 5,
    weeklyProgress: 0,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  useEffect(() => {
    // Load and update streak data
    const loadStreakData = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastVisitDate = new Date(data.lastVisit).toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toDateString()
        
        let newStreak = data.currentStreak
        let newTotal = data.totalDaysLearned
        let shouldCelebrate = false
        
        if (lastVisitDate === today) {
          // Already visited today
          setStreakData(data)
        } else if (lastVisitDate === yesterdayString) {
          // Continuing streak
          newStreak += 1
          newTotal += 1
          shouldCelebrate = true
          
          // Check for new achievements
          const unlockedAchievement = ACHIEVEMENTS.find(
            a => a.requirement === newStreak || a.requirement === newTotal
          )
          if (unlockedAchievement) {
            setNewAchievement(unlockedAchievement.name)
          }
        } else if (lastVisitDate !== today) {
          // Streak broken
          newStreak = 1
          newTotal += 1
        }
        
        const weekStart = getWeekStart()
        const weeklyProgress = calculateWeeklyProgress(data.lastVisit, weekStart) + (lastVisitDate !== today ? 1 : 0)
        
        const updatedData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalDaysLearned: newTotal,
          weeklyGoal: data.weeklyGoal,
          weeklyProgress: Math.min(weeklyProgress, 7),
        }
        
        setStreakData(updatedData)
        localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
        
        if (shouldCelebrate) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 2000)
        }
      } else {
        // First visit
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: today,
          totalDaysLearned: 1,
          weeklyGoal: 5,
          weeklyProgress: 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setNewAchievement('First Steps')
      }
    }
    
    loadStreakData()
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])
  
  const getWeekStart = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    return new Date(now.setDate(diff)).toDateString()
  }
  
  const calculateWeeklyProgress = (lastVisit: string, weekStart: string) => {
    // Simplified weekly progress calculation
    return streakData.weeklyProgress
  }
  
  const progressPercentage = (streakData.weeklyProgress / streakData.weeklyGoal) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (Math.min(progressPercentage, 100) / 100) * circumference
  
  const unlockedAchievements = ACHIEVEMENTS.filter(
    a => streakData.currentStreak >= a.requirement || streakData.totalDaysLearned >= a.requirement
  )

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="absolute text-2xl font-bold text-primary-400 animate-pulse">
            Streak Extended!
          </div>
        </div>
      )}
      
      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">{newAchievement}</div>
            </div>
            <button 
              onClick={() => setNewAchievement(null)}
              className="ml-4 text-white/70 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Streak Fire */}
          <div className="relative">
            <div className="text-6xl animate-pulse-slow">
              {streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-navy-800 px-3 py-1 rounded-full text-sm font-bold text-primary-400 whitespace-nowrap">
              {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-navy-700"
              />
              <circle
                cx="56"
                cy="56"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 1s ease-out',
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{streakData.weeklyProgress}</span>
              <span className="text-xs text-navy-400">/{streakData.weeklyGoal} days</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4 text-center md:text-left">
            <div>
              <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-sm text-navy-400">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-sm text-navy-400">Best Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{streakData.totalDaysLearned}</div>
              <div className="text-sm text-navy-400">Total Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-navy-400">Weekly Goal</div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-navy-400 mb-1">Achievements</div>
            <div className="flex gap-2">
              {ACHIEVEMENTS.map((achievement) => {
                const unlocked = unlockedAchievements.some(a => a.id === achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`relative group w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                      unlocked 
                        ? 'bg-gradient-to-br from-primary-500/30 to-purple-500/30 scale-100' 
                        : 'bg-navy-800 grayscale opacity-40 scale-90'
                    }`}
                    title={achievement.description}
                  >
                    {achievement.icon}
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="font-bold">{achievement.name}</div>
                      <div className="text-navy-400">{achievement.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Motivational Message */}
        <div className="mt-4 pt-4 border-t border-navy-800 text-center">
          <p className="text-navy-300 text-sm">
            {streakData.currentStreak >= 30 
              ? "🏆 Incredible dedication! You're a learning machine!"
              : streakData.currentStreak >= 7 
              ? "🔥 Amazing! Keep that streak alive!"
              : streakData.currentStreak >= 3 
              ? "⚡ Great momentum! You're building a habit!"
              : "✨ Every journey starts with a single step. Keep going!"}
          </p>
        </div>
      </div>
    </div>
  )
}