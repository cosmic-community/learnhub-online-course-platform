'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
  weekActivity: boolean[]
}

const STREAK_KEY = 'learnhub-streak-data'

function getInitialStreakData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDaysLearned: 0,
    weekActivity: [false, false, false, false, false, false, false],
  }
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
  const [streakData, setStreakData] = useState<StreakData>(getInitialStreakData())
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STREAK_KEY)
    const today = new Date()
    const dayOfWeek = today.getDay()

    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisit)

      if (isSameDay(lastVisit, today)) {
        // Already visited today
        setStreakData(data)
      } else if (isYesterday(lastVisit, today)) {
        // Visited yesterday - continue streak!
        const newStreak = data.currentStreak + 1
        const newLongest = Math.max(newStreak, data.longestStreak)
        const newWeekActivity = [...data.weekActivity]
        newWeekActivity[dayOfWeek] = true

        const updatedData: StreakData = {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastVisit: today.toISOString(),
          totalDaysLearned: data.totalDaysLearned + 1,
          weekActivity: newWeekActivity,
        }

        // Check for milestone celebrations
        if ([7, 14, 30, 50, 100].includes(newStreak)) {
          setMilestone(newStreak)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }

        setStreakData(updatedData)
        localStorage.setItem(STREAK_KEY, JSON.stringify(updatedData))
      } else {
        // Streak broken - start over
        const newWeekActivity = [false, false, false, false, false, false, false]
        newWeekActivity[dayOfWeek] = true

        const updatedData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today.toISOString(),
          totalDaysLearned: data.totalDaysLearned + 1,
          weekActivity: newWeekActivity,
        }

        setStreakData(updatedData)
        localStorage.setItem(STREAK_KEY, JSON.stringify(updatedData))
      }
    } else {
      // First visit ever!
      const newWeekActivity = [false, false, false, false, false, false, false]
      newWeekActivity[dayOfWeek] = true

      const initialData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today.toISOString(),
        totalDaysLearned: 1,
        weekActivity: newWeekActivity,
      }

      setStreakData(initialData)
      localStorage.setItem(STREAK_KEY, JSON.stringify(initialData))
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date().getDay()

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-2">🎉</div>
            {milestone ? (
              <p className="text-xl font-bold text-primary-400">
                {milestone} Day Streak! Amazing!
              </p>
            ) : (
              <p className="text-xl font-bold text-primary-400">
                Welcome to LearnHub!
              </p>
            )}
          </div>
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][i % 5],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Your Learning Streak</h3>
          <p className="text-sm text-navy-400">Keep the momentum going!</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-4xl">🔥</span>
            <span className="text-4xl font-bold text-primary-400">{streakData.currentStreak}</span>
          </div>
          <p className="text-xs text-navy-400">day streak</p>
        </div>
      </div>

      {/* Week activity */}
      <div className="flex justify-between mb-6">
        {dayLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <span className={`text-xs ${index === today ? 'text-primary-400 font-bold' : 'text-navy-500'}`}>
              {label}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                streakData.weekActivity[index]
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : index === today
                  ? 'bg-navy-700 ring-2 ring-primary-500/50'
                  : 'bg-navy-800'
              }`}
            >
              {streakData.weekActivity[index] ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
          <div className="text-xs text-navy-400">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streakData.totalDaysLearned}</div>
          <div className="text-xs text-navy-400">Total Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {streakData.currentStreak >= 7 ? '🏆' : streakData.currentStreak >= 3 ? '⭐' : '🌱'}
          </div>
          <div className="text-xs text-navy-400">Status</div>
        </div>
      </div>

      {/* Motivational message */}
      <div className="mt-4 p-3 bg-navy-800/50 rounded-lg">
        <p className="text-sm text-center text-navy-300">
          {streakData.currentStreak === 0 && "Start your learning journey today! 🚀"}
          {streakData.currentStreak === 1 && "Great start! Come back tomorrow to build your streak! 💪"}
          {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && "You're on a roll! Keep it up! 🌟"}
          {streakData.currentStreak >= 7 && streakData.currentStreak < 14 && "One week strong! You're amazing! 🔥"}
          {streakData.currentStreak >= 14 && streakData.currentStreak < 30 && "Two weeks! You're building a habit! 🎯"}
          {streakData.currentStreak >= 30 && "30+ days! You're a learning machine! 🏆"}
        </p>
      </div>
    </div>
  )
}