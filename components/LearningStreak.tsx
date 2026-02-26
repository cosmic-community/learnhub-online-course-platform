'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  coursesViewed: string[]
  lessonsCompleted: number
  milestoneReached: number | null
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const initializeStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      let newStreak = data.currentStreak
      let milestoneReached: number | null = null
      
      if (diffDays === 0) {
        // Same day visit
        return data
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        newStreak = data.currentStreak + 1
        
        // Check for milestone
        if (MILESTONES.includes(newStreak)) {
          milestoneReached = newStreak
        }
      } else {
        // Streak broken - reset to 1
        newStreak = 1
      }
      
      const updatedData: StreakData = {
        ...data,
        currentStreak: newStreak,
        longestStreak: Math.max(data.longestStreak, newStreak),
        lastVisitDate: today,
        totalVisits: data.totalVisits + 1,
        milestoneReached,
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
      return updatedData
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1,
        coursesViewed: [],
        lessonsCompleted: 0,
        milestoneReached: null,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      return newData
    }
  }, [])

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => {
      const data = initializeStreak()
      setStreakData(data)
      setIsVisible(true)
      
      // Show celebration if milestone reached
      if (data.milestoneReached) {
        setTimeout(() => {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }, 500)
      }
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [initializeStreak])

  if (!streakData || !isVisible) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '⭐'
    if (streak >= 14) return '🚀'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return 'Legendary learner!'
    if (streak >= 50) return 'Learning master!'
    if (streak >= 30) return 'On fire!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'One week streak!'
    if (streak >= 3) return 'Building momentum!'
    return 'Keep it up!'
  }

  const getNextMilestone = (streak: number) => {
    return MILESTONES.find(m => m > streak) || null
  }

  const nextMilestone = getNextMilestone(streakData.currentStreak)
  const progress = nextMilestone 
    ? ((streakData.currentStreak) / nextMilestone) * 100 
    : 100

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="animate-bounce text-center">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-3xl font-bold text-white bg-gradient-to-r from-primary-500 to-yellow-500 bg-clip-text text-transparent">
              {streakData.milestoneReached} Day Streak!
            </div>
            <div className="text-xl text-white mt-2">Amazing dedication!</div>
          </div>
          {/* Confetti effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                {['🎊', '🎉', '⭐', '✨', '🔥'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div
        className={`fixed bottom-24 right-5 z-40 transition-all duration-500 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative group bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl shadow-xl shadow-primary-500/10 transition-all duration-300 hover:shadow-primary-500/20 hover:border-navy-600 ${
            isExpanded ? 'w-full' : 'px-4 py-3'
          }`}
        >
          {!isExpanded ? (
            /* Collapsed State */
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
                {streakData.currentStreak >= 3 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg leading-none">
                  {streakData.currentStreak}
                </div>
                <div className="text-navy-400 text-xs">day streak</div>
              </div>
            </div>
          ) : (
            /* Expanded State */
            <div className="p-4 text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Learning Streak</h3>
                <span className="text-navy-400 text-sm">×</span>
              </div>
              
              {/* Main Streak Display */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{getStreakEmoji(streakData.currentStreak)}</div>
                <div>
                  <div className="text-4xl font-bold text-white">
                    {streakData.currentStreak}
                  </div>
                  <div className="text-primary-400 text-sm font-medium">
                    {getStreakMessage(streakData.currentStreak)}
                  </div>
                </div>
              </div>

              {/* Progress to Next Milestone */}
              {nextMilestone && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Progress to {nextMilestone} days</span>
                    <span>{streakData.currentStreak}/{nextMilestone}</span>
                  </div>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-navy-700">
                <div className="text-center p-2 bg-navy-800/50 rounded-lg">
                  <div className="text-xl font-bold text-white">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="text-center p-2 bg-navy-800/50 rounded-lg">
                  <div className="text-xl font-bold text-white">
                    {streakData.totalVisits}
                  </div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <p className="text-xs text-primary-300 text-center">
                  {streakData.currentStreak === 1 
                    ? "🌱 Great start! Come back tomorrow to build your streak!"
                    : streakData.currentStreak < 7
                    ? "💪 You're building a habit! Keep showing up!"
                    : streakData.currentStreak < 30
                    ? "🔥 Incredible consistency! You're on your way to mastery!"
                    : "🏆 You're a learning machine! Keep up the amazing work!"}
                </p>
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  )
}