'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  coursesViewed: string[]
  lessonsCompleted: number
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisitDate: '',
  totalVisits: 0,
  coursesViewed: [],
  lessonsCompleted: 0,
}

export default function LearningStreakWidget() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : DEFAULT_STREAK_DATA
    
    if (data.lastVisitDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = data.lastVisitDate === yesterday.toDateString()
      
      if (wasYesterday) {
        // Continue streak
        data.currentStreak += 1
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        // Celebrate milestones
        if (data.currentStreak % 7 === 0 || data.currentStreak === 3 || data.currentStreak === 30) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else if (data.lastVisitDate === '') {
        // First visit
        data.currentStreak = 1
        data.longestStreak = 1
      } else {
        // Streak broken
        data.currentStreak = 1
      }
      
      data.lastVisitDate = today
      data.totalVisits += 1
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [])

  useEffect(() => {
    setMounted(true)
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!mounted) return null

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return '🏆'
    if (streakData.currentStreak >= 14) return '⭐'
    if (streakData.currentStreak >= 7) return '🔥'
    if (streakData.currentStreak >= 3) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = () => {
    if (streakData.currentStreak >= 30) return "You're a learning legend!"
    if (streakData.currentStreak >= 14) return "Two weeks strong! Amazing!"
    if (streakData.currentStreak >= 7) return "One week streak! Keep it up!"
    if (streakData.currentStreak >= 3) return "Nice momentum! You're on fire!"
    if (streakData.currentStreak === 1) return "Great start! Come back tomorrow!"
    return "Start your learning journey!"
  }

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && (
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
                {['🎉', '🎊', '⭐', '🔥', '💫', '✨'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
          aria-label="Learning streak"
        >
          {/* Main Button */}
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-orange-500 to-amber-500
            text-white font-bold shadow-lg shadow-orange-500/30
            transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50
            ${isExpanded ? 'rounded-b-none' : ''}
          `}>
            <span className="text-xl animate-pulse">{getStreakEmoji()}</span>
            <span className="text-lg">{streakData.currentStreak}</span>
            <span className="text-xs opacity-80">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          </div>

          {/* Expanded Panel */}
          {isExpanded && (
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
              <div className="p-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20">
                <div className="text-center">
                  <div className="text-4xl mb-2">{getStreakEmoji()}</div>
                  <div className="text-2xl font-bold text-white">
                    {streakData.currentStreak} Day Streak!
                  </div>
                  <p className="text-sm text-navy-300 mt-1">
                    {getMotivationalMessage()}
                  </p>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">Longest Streak</span>
                  <span className="text-white font-semibold">
                    {streakData.longestStreak} days 🏆
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">Total Visits</span>
                  <span className="text-white font-semibold">
                    {streakData.totalVisits} visits 📚
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">Lessons Completed</span>
                  <span className="text-white font-semibold">
                    {streakData.lessonsCompleted} lessons ✅
                  </span>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="bg-navy-800/50 rounded-lg p-3">
                  <p className="text-xs text-navy-400 text-center">
                    Come back tomorrow to keep your streak going! 🔥
                  </p>
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  )
}