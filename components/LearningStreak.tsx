'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  weekActivity: boolean[]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    weekActivity: [false, false, false, false, false, false, false]
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastVisitDate = new Date(data.lastVisit).toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastVisitDate === today) {
          // Already visited today
          setStreakData(data)
        } else if (lastVisitDate === yesterday) {
          // Continuing streak
          const newStreak = data.currentStreak + 1
          const newData: StreakData = {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, data.longestStreak),
            lastVisit: today,
            weekActivity: updateWeekActivity(data.weekActivity)
          }
          setStreakData(newData)
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          
          // Trigger celebration for milestone streaks
          if (newStreak % 7 === 0 || newStreak === 1) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
        } else {
          // Streak broken, start new
          const newData: StreakData = {
            currentStreak: 1,
            longestStreak: Math.max(1, data.longestStreak),
            lastVisit: today,
            weekActivity: updateWeekActivity([false, false, false, false, false, false, false])
          }
          setStreakData(newData)
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        }
      } else {
        // First visit
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: today,
          weekActivity: updateWeekActivity([false, false, false, false, false, false, false])
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }

    loadStreakData()
    setIsAnimating(true)
  }, [])

  const updateWeekActivity = (currentWeek: boolean[]): boolean[] => {
    const today = new Date().getDay()
    const newWeek = [...currentWeek]
    newWeek[today] = true
    return newWeek
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()

  return (
    <div className="relative">
      {/* Celebration confetti effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
        {/* Streak Counter */}
        <div className="flex items-center gap-4">
          <div className={`relative ${isAnimating ? 'animate-fire' : ''}`}>
            <span className="text-5xl filter drop-shadow-lg">🔥</span>
            {streakData.currentStreak >= 7 && (
              <span className="absolute -top-1 -right-1 text-xl animate-bounce-slow">⭐</span>
            )}
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              <span className="tabular-nums">{streakData.currentStreak}</span>
              <span className="text-lg font-normal text-navy-400 ml-2">
                day{streakData.currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-sm text-navy-400">
              {streakData.currentStreak >= 7 ? (
                <span className="text-primary-400">🎉 Amazing streak!</span>
              ) : (
                `Best: ${streakData.longestStreak} days`
              )}
            </div>
          </div>
        </div>

        {/* Week Activity */}
        <div className="flex items-center gap-1.5">
          {dayNames.map((day, index) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                  transition-all duration-300
                  ${index === today ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-950' : ''}
                  ${streakData.weekActivity[index] 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                    : 'bg-navy-800/50 text-navy-500'}
                  ${isAnimating ? 'animate-scale-in' : ''}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {streakData.weekActivity[index] ? '✓' : day.charAt(0)}
              </div>
              <span className="text-[10px] text-navy-500">{day}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Motivational message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-navy-400">
          {streakData.currentStreak === 1 && "Great start! Come back tomorrow to build your streak 💪"}
          {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && `${7 - streakData.currentStreak} more days until your first week! 🎯`}
          {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "You're on fire! Keep the momentum going 🔥"}
          {streakData.currentStreak >= 30 && "Legendary learner! You're unstoppable! 🏆"}
        </p>
      </div>
    </div>
  )
}