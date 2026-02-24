'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearning: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { days: 3, emoji: '🌱', title: 'Seedling', description: '3 day streak!' },
  { days: 7, emoji: '🔥', title: 'On Fire', description: '7 day streak!' },
  { days: 14, emoji: '⭐', title: 'Rising Star', description: '2 week streak!' },
  { days: 30, emoji: '🏆', title: 'Champion', description: '30 day streak!' },
  { days: 60, emoji: '💎', title: 'Diamond', description: '60 day streak!' },
  { days: 100, emoji: '🦄', title: 'Legend', description: '100 day streak!' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisit === yesterday) {
        // Continuing streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisitDate: today,
          totalDaysLearning: data.totalDaysLearning + 1,
        }
        
        // Check for new achievements
        const newAch = ACHIEVEMENTS.find(
          a => a.days === newStreak && !data.achievements.includes(a.title)
        )
        
        if (newAch) {
          newData.achievements = [...data.achievements, newAch.title]
          setNewAchievement(newAch)
          setShowCelebration(true)
          setTimeout(() => {
            setShowCelebration(false)
            setNewAchievement(null)
          }, 4000)
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalDaysLearning: data.totalDaysLearning + 1,
          achievements: data.achievements,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDaysLearning: 1,
        achievements: [],
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) return null

  const currentAchievement = ACHIEVEMENTS
    .filter(a => streakData.currentStreak >= a.days)
    .pop()

  const nextAchievement = ACHIEVEMENTS.find(a => a.days > streakData.currentStreak)

  return (
    <>
      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
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
                {['🎉', '✨', '⭐', '🌟', '💫', '🎊'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-navy-900/95 backdrop-blur-lg border border-primary-500/50 rounded-2xl p-8 text-center animate-achievement-popup shadow-2xl shadow-primary-500/20">
            <div className="text-6xl mb-4 animate-bounce">{newAchievement.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-primary-400 text-lg font-semibold">{newAchievement.title}</p>
            <p className="text-navy-300 mt-2">{newAchievement.description}</p>
          </div>
        </div>
      )}

      {/* Streak Badge */}
      <div 
        className="inline-flex items-center gap-3 bg-gradient-to-r from-navy-800/80 to-navy-900/80 backdrop-blur-sm border border-navy-700 hover:border-primary-500/50 rounded-full px-5 py-3 mb-6 cursor-pointer transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <span className="text-3xl">{currentAchievement?.emoji || '🔥'}</span>
          {streakData.currentStreak > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-500 text-[10px] font-bold text-white items-center justify-center">
                {streakData.currentStreak > 99 ? '99+' : streakData.currentStreak}
              </span>
            </span>
          )}
        </div>
        
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{streakData.currentStreak} day streak</span>
            {streakData.currentStreak >= 7 && (
              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                {currentAchievement?.title}
              </span>
            )}
          </div>
          <div className="text-navy-400 text-xs">
            {nextAchievement 
              ? `${nextAchievement.days - streakData.currentStreak} days until ${nextAchievement.emoji} ${nextAchievement.title}`
              : 'Maximum streak achieved! 🦄'
            }
          </div>
        </div>
        
        {/* Progress Ring */}
        {nextAchievement && (
          <div className="relative w-10 h-10 hidden sm:block">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-navy-700"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={100}
                strokeDashoffset={100 - (streakData.currentStreak / nextAchievement.days) * 100}
                className="text-primary-500 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-navy-300">
              {Math.round((streakData.currentStreak / nextAchievement.days) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Expanded Stats on Hover */}
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-navy-800/95 backdrop-blur-lg border border-navy-700 rounded-xl p-4 shadow-xl z-20 animate-fade-in-down min-w-[280px]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-xs text-navy-400">Current</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{streakData.totalDaysLearning}</div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
          </div>
          {streakData.achievements.length > 0 && (
            <div className="mt-3 pt-3 border-t border-navy-700">
              <div className="text-xs text-navy-400 mb-2">Achievements</div>
              <div className="flex gap-2 flex-wrap">
                {ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.title)).map(a => (
                  <span key={a.title} className="text-lg" title={a.title}>{a.emoji}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}