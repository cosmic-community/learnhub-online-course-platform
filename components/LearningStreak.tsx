'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysLearned: number
  lastLearnedDate: string | null
  weekActivity: boolean[]
}

const STORAGE_KEY = 'learnhub_streak_data'

function getInitialStreakData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysLearned: 0,
    lastLearnedDate: null,
    weekActivity: [false, false, false, false, false, false, false],
  }
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function getDayOfWeek(): number {
  return new Date().getDay()
}

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>(getInitialStreakData())
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load streak data from localStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StreakData
        setStreakData(parsed)
      } catch {
        setStreakData(getInitialStreakData())
      }
    }
  }, [])

  // Save streak data to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(streakData))
    }
  }, [streakData, mounted])

  const recordLearning = () => {
    const today = getTodayString()
    const dayOfWeek = getDayOfWeek()

    if (streakData.lastLearnedDate === today) {
      // Already recorded today
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]

    let newStreak = streakData.currentStreak

    if (streakData.lastLearnedDate === yesterdayString) {
      // Continuing streak
      newStreak += 1
    } else if (streakData.lastLearnedDate !== today) {
      // Starting new streak (or first time)
      newStreak = 1
    }

    const newWeekActivity = [...streakData.weekActivity]
    newWeekActivity[dayOfWeek] = true

    const newLongestStreak = Math.max(streakData.longestStreak, newStreak)

    setStreakData({
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      totalDaysLearned: streakData.totalDaysLearned + 1,
      lastLearnedDate: today,
      weekActivity: newWeekActivity,
    })

    // Show celebration for milestones
    if (newStreak === 7 || newStreak === 30 || newStreak === 100 || newStreak % 50 === 0) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const hasLearnedToday = streakData.lastLearnedDate === getTodayString()

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 100) return '👑'
    if (streakData.currentStreak >= 50) return '💎'
    if (streakData.currentStreak >= 30) return '🏆'
    if (streakData.currentStreak >= 14) return '⭐'
    if (streakData.currentStreak >= 7) return '🔥'
    if (streakData.currentStreak >= 3) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = () => {
    if (!hasLearnedToday) {
      if (streakData.currentStreak > 0) {
        return `Don't break your ${streakData.currentStreak}-day streak! 💪`
      }
      return 'Start your learning journey today! 🚀'
    }
    if (streakData.currentStreak >= 100) return 'Legendary learner! 👑'
    if (streakData.currentStreak >= 50) return 'Unstoppable! Keep it up! 💎'
    if (streakData.currentStreak >= 30) return 'A month strong! Amazing! 🏆'
    if (streakData.currentStreak >= 14) return 'Two weeks! You\'re on fire! ⭐'
    if (streakData.currentStreak >= 7) return 'One week streak! Awesome! 🔥'
    if (streakData.currentStreak >= 3) return 'Great momentum! ✨'
    return 'Keep coming back daily! 🌱'
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  if (!mounted) return null

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
          <div className="animate-bounce text-center">
            <div className="text-8xl mb-4">🎉</div>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-2xl">
              {streakData.currentStreak} Day Streak!
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-2xl ${
          hasLearnedToday
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
            : 'bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 animate-pulse'
        }`}
        aria-label="Learning streak tracker"
      >
        {getStreakEmoji()}
        {streakData.currentStreak > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-navy-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
            {streakData.currentStreak}
          </span>
        )}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-4 border-b border-navy-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {getStreakEmoji()} Learning Streak
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-navy-300">{getMotivationalMessage()}</p>
          </div>

          {/* Stats */}
          <div className="p-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-400">{streakData.currentStreak}</div>
              <div className="text-xs text-navy-400">Current</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{streakData.totalDaysLearned}</div>
              <div className="text-xs text-navy-400">Total</div>
            </div>
          </div>

          {/* Week Activity */}
          <div className="px-4 pb-4">
            <div className="text-xs text-navy-400 mb-2">This Week</div>
            <div className="flex justify-between gap-1">
              {dayLabels.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-navy-500">{day}</span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      streakData.weekActivity[index]
                        ? 'bg-primary-500 text-white'
                        : index === getDayOfWeek()
                        ? 'bg-navy-700 border-2 border-dashed border-primary-500/50 text-navy-400'
                        : 'bg-navy-800 text-navy-600'
                    }`}
                  >
                    {streakData.weekActivity[index] ? '✓' : index === getDayOfWeek() ? '?' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 pt-0">
            <button
              onClick={recordLearning}
              disabled={hasLearnedToday}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                hasLearnedToday
                  ? 'bg-navy-800 text-navy-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-primary-500/25'
              }`}
            >
              {hasLearnedToday ? '✓ Learned Today!' : "I'm Learning Today! 📚"}
            </button>
          </div>

          {/* Achievements Preview */}
          <div className="px-4 pb-4">
            <div className="text-xs text-navy-400 mb-2">Next Milestones</div>
            <div className="flex gap-2">
              {[7, 14, 30, 50, 100].filter(m => m > streakData.currentStreak).slice(0, 3).map((milestone) => (
                <div
                  key={milestone}
                  className="flex-1 bg-navy-800/50 rounded-lg p-2 text-center"
                >
                  <div className="text-lg">
                    {milestone === 7 && '🔥'}
                    {milestone === 14 && '⭐'}
                    {milestone === 30 && '🏆'}
                    {milestone === 50 && '💎'}
                    {milestone === 100 && '👑'}
                  </div>
                  <div className="text-xs text-navy-400">{milestone} days</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}