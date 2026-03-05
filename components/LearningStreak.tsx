'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  weeklyActivity: boolean[]
  totalDays: number
  milestones: number[]
}

const MILESTONES = [3, 7, 14, 30, 50, 100, 365]

const getDefaultStreakData = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: '',
  weeklyActivity: [false, false, false, false, false, false, false],
  totalDays: 0,
  milestones: [],
})

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(getDefaultStreakData())
  const [showCelebration, setShowCelebration] = useState(false)
  const [newMilestone, setNewMilestone] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      let newStreak = data.currentStreak
      let newTotalDays = data.totalDays
      let newWeeklyActivity = [...data.weeklyActivity]
      const dayOfWeek = todayDate.getDay()
      
      if (data.lastVisit === today) {
        // Already visited today
        setStreakData(data)
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        newStreak = data.currentStreak + 1
        newTotalDays = data.totalDays + 1
        newWeeklyActivity[dayOfWeek] = true
        
        // Check for milestone
        const achievedMilestone = MILESTONES.find(
          m => newStreak === m && !data.milestones.includes(m)
        )
        
        if (achievedMilestone) {
          setNewMilestone(achievedMilestone)
          setShowCelebration(true)
          setTimeout(() => {
            setShowCelebration(false)
            setNewMilestone(null)
          }, 4000)
        }
        
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          weeklyActivity: newWeeklyActivity,
          totalDays: newTotalDays,
          milestones: achievedMilestone 
            ? [...data.milestones, achievedMilestone]
            : data.milestones,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      } else if (diffDays > 1) {
        // Streak broken - reset but keep records
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          weeklyActivity: [false, false, false, false, false, false, false].map(
            (_, i) => i === dayOfWeek
          ),
          totalDays: data.totalDays + 1,
          milestones: data.milestones,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      } else {
        setStreakData(data)
      }
    } else {
      // First visit ever
      const dayOfWeek = new Date().getDay()
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        weeklyActivity: [false, false, false, false, false, false, false].map(
          (_, i) => i === dayOfWeek
        ),
        totalDays: 1,
        milestones: [],
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    
    // Show the component after data loads
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date().getDay()

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '🏆'
    if (streak >= 30) return '⭐'
    if (streak >= 14) return '💪'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 100) return 'Legendary learner!'
    if (streak >= 30) return 'Incredible dedication!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return "You're on fire!"
    if (streak >= 3) return 'Building momentum!'
    return 'Keep it going!'
  }

  if (!isVisible) return null

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">
              {newMilestone ? '🎉' : '🎊'}
            </div>
            <div className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <p className="text-2xl font-bold">
                {newMilestone 
                  ? `${newMilestone} Day Milestone!` 
                  : 'Welcome to LearnHub!'}
              </p>
              <p className="text-sm opacity-90">
                {newMilestone 
                  ? "You're crushing it!" 
                  : 'Start your learning streak today!'}
              </p>
            </div>
          </div>
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-ping"
                style={{
                  backgroundColor: ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-navy-700/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Learning Streak {getStreakEmoji(streakData.currentStreak)}
            </h3>
            <p className="text-sm text-navy-400">{getStreakMessage(streakData.currentStreak)}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-500">
              {streakData.currentStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {/* Weekly Activity Heatmap */}
        <div className="mb-4">
          <p className="text-xs text-navy-500 mb-2">This Week</p>
          <div className="flex gap-1">
            {weekDays.map((day, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`
                    w-full aspect-square rounded-md mb-1 transition-all duration-300
                    ${streakData.weeklyActivity[index]
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25'
                      : index === today
                        ? 'bg-navy-700 ring-2 ring-primary-500/50'
                        : 'bg-navy-800'
                    }
                  `}
                />
                <span className={`text-xs ${index === today ? 'text-primary-400 font-bold' : 'text-navy-500'}`}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-700/50">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-500">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.totalDays}</div>
            <div className="text-xs text-navy-500">Total Days</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.milestones.length}</div>
            <div className="text-xs text-navy-500">Milestones</div>
          </div>
        </div>

        {/* Milestone Progress */}
        {streakData.currentStreak < 100 && (
          <div className="mt-4 pt-4 border-t border-navy-700/50">
            <div className="flex items-center justify-between text-xs text-navy-500 mb-2">
              <span>Next milestone</span>
              <span>
                {MILESTONES.find(m => m > streakData.currentStreak) || 365} days
              </span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (streakData.currentStreak / (MILESTONES.find(m => m > streakData.currentStreak) || 365)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}