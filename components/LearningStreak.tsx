'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
  weeklyActivity: boolean[] // Last 7 days
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_day', name: 'First Steps', icon: '🌱', requirement: 1, description: 'Started your learning journey' },
  { id: 'week_warrior', name: 'Week Warrior', icon: '⚔️', requirement: 7, description: '7 day streak' },
  { id: 'fortnight_fighter', name: 'Fortnight Fighter', icon: '🛡️', requirement: 14, description: '14 day streak' },
  { id: 'monthly_master', name: 'Monthly Master', icon: '👑', requirement: 30, description: '30 day streak' },
  { id: 'century_scholar', name: 'Century Scholar', icon: '🎓', requirement: 100, description: '100 day streak' },
]

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Start your learning journey today! 🚀" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going! 💪" },
  { min: 3, max: 6, message: "You're building a habit! Amazing progress! ⭐" },
  { min: 7, max: 13, message: "A full week! You're unstoppable! 🔥" },
  { min: 14, max: 29, message: "Two weeks strong! You're a learning machine! 🤖" },
  { min: 30, max: 99, message: "A whole month! You're inspiring! 🌟" },
  { min: 100, max: Infinity, message: "Legendary learner! You're a true master! 👑" },
]

function getMotivationalMessage(streak: number): string {
  const message = MOTIVATIONAL_MESSAGES.find(m => streak >= m.min && streak <= m.max)
  return message?.message || "Keep learning! 📚"
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date1, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date()
    const todayStr = today.toDateString()

    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)

      if (isSameDay(lastVisitDate, today)) {
        // Already visited today, no changes needed
        setStreakData(data)
      } else if (isYesterday(lastVisitDate, today)) {
        // Visited yesterday, increment streak!
        const newStreak = data.currentStreak + 1
        const newLongest = Math.max(newStreak, data.longestStreak)
        
        // Update weekly activity
        const newWeekly = [...data.weeklyActivity.slice(1), true]
        
        // Check for new achievements
        const newAchievements = [...data.achievements]
        const unlockedAchievement = ACHIEVEMENTS.find(
          a => newStreak >= a.requirement && !data.achievements.includes(a.id)
        )
        
        if (unlockedAchievement) {
          newAchievements.push(unlockedAchievement.id)
          setNewAchievement(unlockedAchievement.name)
          setTimeout(() => setNewAchievement(null), 4000)
        }

        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastVisit: todayStr,
          totalDays: data.totalDays + 1,
          weeklyActivity: newWeekly,
          achievements: newAchievements,
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      } else {
        // Streak broken, reset to 1
        const daysSinceLastVisit = Math.floor(
          (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        
        // Fill in missed days as false
        const missedDays = Math.min(daysSinceLastVisit - 1, 6)
        const newWeekly = [
          ...data.weeklyActivity.slice(missedDays + 1),
          ...Array(missedDays).fill(false),
          true
        ].slice(-7)

        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: todayStr,
          totalDays: data.totalDays + 1,
          weeklyActivity: newWeekly,
          achievements: data.achievements,
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: todayStr,
        totalDays: 1,
        weeklyActivity: [false, false, false, false, false, false, true],
        achievements: ['first_day'],
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setNewAchievement('First Steps')
      setTimeout(() => setNewAchievement(null), 4000)
    }
  }, [])

  if (!streakData) return null

  const unlockedAchievements = ACHIEVEMENTS.filter(a => 
    streakData.achievements.includes(a.id)
  )

  const nextAchievement = ACHIEVEMENTS.find(a => 
    !streakData.achievements.includes(a.id)
  )

  const progressToNext = nextAchievement 
    ? Math.min((streakData.currentStreak / nextAchievement.requirement) * 100, 100)
    : 100

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const todayIndex = new Date().getDay()
  const orderedWeekDays = [
    ...weekDays.slice(todayIndex + 1),
    ...weekDays.slice(0, todayIndex + 1)
  ]

  return (
    <>
      {/* Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-sm font-medium opacity-90">Achievement Unlocked!</p>
              <p className="font-bold text-lg">{newAchievement}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Streak Card */}
      <div 
        className={`card cursor-pointer transition-all duration-500 ${
          isExpanded ? 'p-6' : 'p-4'
        } ${showCelebration ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-navy-950' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Flame Icon with Animation */}
            <div className={`relative ${showCelebration ? 'animate-bounce' : ''}`}>
              <span className="text-4xl">🔥</span>
              {streakData.currentStreak >= 7 && (
                <span className="absolute -top-1 -right-1 text-lg animate-pulse">✨</span>
              )}
            </div>
            
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  {streakData.currentStreak}
                </span>
                <span className="text-navy-400 text-sm">
                  day{streakData.currentStreak !== 1 ? 's' : ''} streak
                </span>
              </div>
              <p className="text-sm text-primary-400 mt-1">
                {getMotivationalMessage(streakData.currentStreak)}
              </p>
            </div>
          </div>

          {/* Weekly Heatmap */}
          <div className="hidden sm:flex items-center gap-1">
            {streakData.weeklyActivity.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs text-navy-500">{orderedWeekDays[i]}</span>
                <div
                  className={`w-6 h-6 rounded-md transition-all duration-300 ${
                    active
                      ? 'bg-primary-500 shadow-lg shadow-primary-500/30'
                      : 'bg-navy-800'
                  } ${i === 6 ? 'ring-2 ring-primary-400/50' : ''}`}
                />
              </div>
            ))}
          </div>

          {/* Expand Indicator */}
          <div className="ml-4 text-navy-500">
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-navy-800 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{streakData.totalDays}</p>
                <p className="text-xs text-navy-400">Total Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{streakData.longestStreak}</p>
                <p className="text-xs text-navy-400">Best Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{unlockedAchievements.length}</p>
                <p className="text-xs text-navy-400">Achievements</p>
              </div>
            </div>

            {/* Progress to Next Achievement */}
            {nextAchievement && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-navy-300">
                    Next: {nextAchievement.icon} {nextAchievement.name}
                  </span>
                  <span className="text-sm text-navy-400">
                    {streakData.currentStreak}/{nextAchievement.requirement} days
                  </span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}

            {/* Achievements */}
            <div>
              <p className="text-sm text-navy-400 mb-3">Achievements</p>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map((achievement) => {
                  const unlocked = streakData.achievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`group relative px-3 py-2 rounded-lg transition-all duration-300 ${
                        unlocked
                          ? 'bg-navy-800 border border-primary-500/30'
                          : 'bg-navy-900 border border-navy-800 opacity-50'
                      }`}
                      title={achievement.description}
                    >
                      <span className={`text-xl ${unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <p className="font-semibold">{achievement.name}</p>
                        <p className="text-navy-400">{achievement.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}