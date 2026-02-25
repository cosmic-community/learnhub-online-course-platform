'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

function getInitialStreakData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalVisits: 0
  }
}

function calculateStreak(storedData: StreakData | null): StreakData {
  const today = new Date().toDateString()
  
  if (!storedData) {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastVisit: today,
      totalVisits: 1
    }
  }

  const lastVisitDate = new Date(storedData.lastVisit)
  const todayDate = new Date(today)
  const yesterday = new Date(todayDate)
  yesterday.setDate(yesterday.getDate() - 1)

  // Already visited today
  if (storedData.lastVisit === today) {
    return storedData
  }

  // Visited yesterday - continue streak
  if (lastVisitDate.toDateString() === yesterday.toDateString()) {
    const newStreak = storedData.currentStreak + 1
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, storedData.longestStreak),
      lastVisit: today,
      totalVisits: storedData.totalVisits + 1
    }
  }

  // Streak broken - start fresh
  return {
    currentStreak: 1,
    longestStreak: storedData.longestStreak,
    lastVisit: today,
    totalVisits: storedData.totalVisits + 1
  }
}

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>(getInitialStreakData())
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Load and update streak data
    const stored = localStorage.getItem('learning-streak')
    const parsedData = stored ? JSON.parse(stored) as StreakData : null
    const newData = calculateStreak(parsedData)
    
    // Check if we hit a milestone
    const milestones = [7, 14, 30, 50, 100, 365]
    const hitMilestone = milestones.includes(newData.currentStreak) && 
                         (!parsedData || parsedData.currentStreak !== newData.currentStreak)
    
    setStreakData(newData)
    localStorage.setItem('learning-streak', JSON.stringify(newData))

    // Show widget after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
      if (hitMilestone) {
        setShowCelebration(true)
        setIsOpen(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 365) return '🏆'
    if (streak >= 100) return '💎'
    if (streak >= 50) return '⭐'
    if (streak >= 30) return '🌟'
    if (streak >= 14) return '✨'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '🌱'
    return '🎯'
  }

  const getMotivationalMessage = (streak: number): string => {
    if (streak >= 365) return "Legendary! A full year of learning!"
    if (streak >= 100) return "Incredible dedication! Triple digits!"
    if (streak >= 50) return "Amazing! You're unstoppable!"
    if (streak >= 30) return "A whole month! You're on fire!"
    if (streak >= 14) return "Two weeks strong! Keep it up!"
    if (streak >= 7) return "One week streak! Fantastic!"
    if (streak >= 3) return "Building momentum! Great job!"
    return "Every day counts. Keep learning!"
  }

  if (!isVisible) return null

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Floating streak button */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-600 rounded-full px-4 py-2 shadow-lg transition-all duration-300 ${
            showCelebration ? 'animate-pulse ring-2 ring-primary-500 ring-offset-2 ring-offset-navy-950' : ''
          }`}
        >
          <span className="text-xl">{getStreakEmoji(streakData.currentStreak)}</span>
          <span className="text-white font-bold">{streakData.currentStreak}</span>
          <span className="text-navy-400 text-sm">day streak</span>
          
          {/* Pulse animation for active streaks */}
          {streakData.currentStreak >= 3 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-ping" />
          )}
        </button>

        {/* Expanded panel */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-72 bg-navy-800 border border-navy-600 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/10 p-4 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getStreakEmoji(streakData.currentStreak)}</span>
                <div>
                  <div className="text-2xl font-bold text-white">{streakData.currentStreak} Day Streak!</div>
                  <p className="text-navy-300 text-sm">{getMotivationalMessage(streakData.currentStreak)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-navy-400 text-sm">Longest Streak</span>
                <span className="text-white font-medium">{streakData.longestStreak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-navy-400 text-sm">Total Visits</span>
                <span className="text-white font-medium">{streakData.totalVisits}</span>
              </div>
              
              {/* Streak progress bar to next milestone */}
              {streakData.currentStreak < 365 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Progress to next milestone</span>
                    <span>
                      {streakData.currentStreak < 7 ? '7 days' :
                       streakData.currentStreak < 14 ? '14 days' :
                       streakData.currentStreak < 30 ? '30 days' :
                       streakData.currentStreak < 50 ? '50 days' :
                       streakData.currentStreak < 100 ? '100 days' : '365 days'}
                    </span>
                  </div>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          streakData.currentStreak < 7 ? (streakData.currentStreak / 7) * 100 :
                          streakData.currentStreak < 14 ? ((streakData.currentStreak - 7) / 7) * 100 :
                          streakData.currentStreak < 30 ? ((streakData.currentStreak - 14) / 16) * 100 :
                          streakData.currentStreak < 50 ? ((streakData.currentStreak - 30) / 20) * 100 :
                          streakData.currentStreak < 100 ? ((streakData.currentStreak - 50) / 50) * 100 :
                          ((streakData.currentStreak - 100) / 265) * 100
                        }%`
                      }}
                    />
                  </div>
                </div>
              )}
              
              <p className="text-navy-500 text-xs text-center mt-3">
                Keep visiting daily to maintain your streak! 🚀
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}