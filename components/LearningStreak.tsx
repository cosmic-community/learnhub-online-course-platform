'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day visit
        setStreak(data)
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken
        const newStreak: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
      }
    } else {
      // First visit ever
      const newStreak: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streak) return null

  const getStreakEmoji = (count: number): string => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '⭐'
    if (count >= 7) return '🔥'
    if (count >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (count: number): string => {
    if (count >= 30) return 'Legendary learner!'
    if (count >= 14) return 'On fire! 2 weeks strong!'
    if (count >= 7) return 'Week warrior!'
    if (count >= 3) return 'Building momentum!'
    return 'Every journey starts here!'
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && streak.currentStreak > 1 && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-center">
            <div className="text-6xl mb-2">🎉</div>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              {streak.currentStreak} Day Streak!
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className="fixed bottom-24 right-5 z-40"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div 
          className={`
            bg-gradient-to-br from-navy-800 to-navy-900 
            border border-navy-700 rounded-2xl shadow-xl 
            transition-all duration-300 ease-out cursor-pointer
            ${isExpanded ? 'p-4 min-w-[200px]' : 'p-3'}
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className={`
              flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500
              transition-all duration-300
              ${isExpanded ? 'w-12 h-12 text-2xl' : 'w-10 h-10 text-xl'}
            `}>
              {getStreakEmoji(streak.currentStreak)}
            </div>
            
            <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              <div className="text-white font-bold text-lg">
                {streak.currentStreak} Day{streak.currentStreak !== 1 ? 's' : ''}
              </div>
              <div className="text-navy-400 text-xs">
                {getStreakMessage(streak.currentStreak)}
              </div>
            </div>
            
            {!isExpanded && (
              <div className="text-white font-bold text-sm">
                {streak.currentStreak}🔥
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-navy-700 grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-primary-400 font-bold">{streak.longestStreak}</div>
                <div className="text-navy-500 text-xs">Best Streak</div>
              </div>
              <div>
                <div className="text-primary-400 font-bold">{streak.totalVisits}</div>
                <div className="text-navy-500 text-xs">Total Visits</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}