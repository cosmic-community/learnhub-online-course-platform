'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
}

const MILESTONES = [
  { days: 3, emoji: '🌱', title: 'Seedling', message: 'Great start!' },
  { days: 7, emoji: '🔥', title: 'On Fire', message: 'One week strong!' },
  { days: 14, emoji: '⚡', title: 'Unstoppable', message: 'Two weeks!' },
  { days: 30, emoji: '🏆', title: 'Champion', message: 'One month!' },
  { days: 60, emoji: '💎', title: 'Diamond', message: 'Incredible dedication!' },
  { days: 100, emoji: '🚀', title: 'Legend', message: '100 days!' },
]

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '🚀'
  if (streak >= 60) return '💎'
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '⚡'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '🌱'
  return '✨'
}

function getMilestone(streak: number) {
  return MILESTONES.filter(m => m.days <= streak).pop()
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newMilestone, setNewMilestone] = useState<typeof MILESTONES[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, continue streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for new milestone
        const milestone = MILESTONES.find(m => m.days === newStreak)
        if (milestone) {
          setNewMilestone(milestone)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 4000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDays: 1,
      }
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) return null

  const milestone = getMilestone(streakData.currentStreak)
  const nextMilestone = MILESTONES.find(m => m.days > streakData.currentStreak)
  const progressToNext = nextMilestone 
    ? ((streakData.currentStreak / nextMilestone.days) * 100)
    : 100

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-center">
            <div className="text-6xl mb-2">{newMilestone?.emoji || '🎉'}</div>
            <div className="bg-navy-900/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-primary-500/50">
              <p className="text-xl font-bold text-white">
                {newMilestone ? newMilestone.title : 'Welcome!'}
              </p>
              <p className="text-primary-400 text-sm">
                {newMilestone ? newMilestone.message : 'Start your learning journey!'}
              </p>
            </div>
          </div>
          {/* Confetti-like particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: '1s',
                }}
              >
                {['⭐', '✨', '🔥', '💫'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group"
        >
          {/* Main Button */}
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-orange-500 to-red-500
            shadow-lg shadow-orange-500/25
            transition-all duration-300
            ${isExpanded ? 'rounded-t-full rounded-b-none' : 'hover:scale-105'}
          `}>
            <span className={`text-xl ${streakData.currentStreak >= 7 ? 'animate-pulse' : ''}`}>
              {getStreakEmoji(streakData.currentStreak)}
            </span>
            <span className="font-bold text-white">
              {streakData.currentStreak}
            </span>
            <span className="text-white/80 text-sm">
              day{streakData.currentStreak !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Expanded Panel */}
          {isExpanded && (
            <div className="absolute bottom-full right-0 mb-0 w-64 bg-navy-900 border border-navy-700 rounded-xl rounded-br-none shadow-xl p-4 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{milestone?.emoji || '✨'}</div>
                <div>
                  <p className="font-semibold text-white">{milestone?.title || 'Just Started'}</p>
                  <p className="text-navy-400 text-xs">{milestone?.message || 'Keep it up!'}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-navy-400">Current Streak</span>
                  <span className="text-white font-medium">{streakData.currentStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">Longest Streak</span>
                  <span className="text-primary-400 font-medium">{streakData.longestStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">Total Learning Days</span>
                  <span className="text-white font-medium">{streakData.totalDays}</span>
                </div>
              </div>

              {nextMilestone && (
                <div className="mt-4 pt-3 border-t border-navy-700">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-navy-400">Next: {nextMilestone.emoji} {nextMilestone.title}</span>
                    <span className="text-navy-400">{nextMilestone.days - streakData.currentStreak} days</span>
                  </div>
                  <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-navy-500 text-xs mt-3 text-center">
                Visit daily to maintain your streak! 🔥
              </p>
            </div>
          )}
        </button>
      </div>
    </>
  )
}