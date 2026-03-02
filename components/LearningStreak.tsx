'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', emoji: '👋', description: 'Welcome to LearnHub!', threshold: 1 },
  { id: 'streak_3', name: 'Getting Started', emoji: '🔥', description: '3-day learning streak', threshold: 3 },
  { id: 'streak_7', name: 'Week Warrior', emoji: '⚡', description: '7-day learning streak', threshold: 7 },
  { id: 'streak_14', name: 'Dedicated Learner', emoji: '🌟', description: '14-day learning streak', threshold: 14 },
  { id: 'streak_30', name: 'Learning Legend', emoji: '🏆', description: '30-day learning streak', threshold: 30 },
  { id: 'visits_10', name: 'Regular', emoji: '📚', description: '10 total visits', threshold: 10 },
  { id: 'visits_50', name: 'Committed', emoji: '💎', description: '50 total visits', threshold: 50 },
  { id: 'visits_100', name: 'Super Learner', emoji: '🎯', description: '100 total visits', threshold: 100 },
]

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)

  const checkAchievements = useCallback((data: StreakData): string[] => {
    const newAchievements: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (data.achievements.includes(achievement.id)) return
      
      let earned = false
      if (achievement.id.startsWith('streak_')) {
        const threshold = parseInt(achievement.id.split('_')[1])
        earned = data.currentStreak >= threshold
      } else if (achievement.id.startsWith('visits_')) {
        const threshold = parseInt(achievement.id.split('_')[1])
        earned = data.totalVisits >= threshold
      } else if (achievement.id === 'first_visit') {
        earned = data.totalVisits >= 1
      }
      
      if (earned) {
        newAchievements.push(achievement.id)
      }
    })
    
    return newAchievements
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      
      if (lastVisitDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastVisitDate === yesterday.toDateString()) {
          // Continuing streak
          data.currentStreak += 1
          data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
        } else {
          // Streak broken
          data.currentStreak = 1
        }
        
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
        
        // Check for new achievements
        const earned = checkAchievements(data)
        if (earned.length > 0) {
          data.achievements = [...data.achievements, ...earned]
          const latestAchievement = ACHIEVEMENTS.find(a => a.id === earned[earned.length - 1])
          if (latestAchievement) {
            setNewAchievement(latestAchievement)
            setShowConfetti(true)
            setIsOpen(true)
            setTimeout(() => {
              setShowConfetti(false)
              setNewAchievement(null)
            }, 5000)
          }
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1,
        achievements: ['first_visit']
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setNewAchievement(ACHIEVEMENTS[0])
      setShowConfetti(true)
      setIsOpen(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 5000)
    }
    
    setStreakData(data)
    
    // Check if user minimized the widget
    const minimized = localStorage.getItem('learnhub-streak-minimized')
    if (minimized === 'true') {
      setIsMinimized(true)
    }
  }, [checkAchievements])

  const handleMinimize = () => {
    setIsMinimized(true)
    localStorage.setItem('learnhub-streak-minimized', 'true')
  }

  const handleExpand = () => {
    setIsMinimized(false)
    localStorage.removeItem('learnhub-streak-minimized')
  }

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))

  if (isMinimized) {
    return (
      <button
        onClick={handleExpand}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span className="text-lg">🔥</span>
        <span className="font-bold">{streakData.currentStreak}</span>
      </button>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Floating streak badge */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🔥</span>
            <div className="text-left">
              <div className="text-xs opacity-80">Learning Streak</div>
              <div className="font-bold text-lg leading-tight">{streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </button>

        {/* Expanded panel */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 relative">
              <button
                onClick={handleMinimize}
                className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm"
              >
                −
              </button>
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🔥</div>
                <div className="text-2xl font-bold">{streakData.currentStreak} Day Streak!</div>
                <div className="text-sm opacity-80">Keep it up!</div>
              </div>
            </div>

            {/* New Achievement Alert */}
            {newAchievement && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 border-b border-navy-700">
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-bounce">{newAchievement.emoji}</div>
                  <div>
                    <div className="text-yellow-400 text-sm font-medium">Achievement Unlocked!</div>
                    <div className="text-white font-bold">{newAchievement.name}</div>
                    <div className="text-navy-400 text-xs">{newAchievement.description}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="p-4 border-b border-navy-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
                  <div className="text-xs text-navy-400">Current</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-4">
              <div className="text-sm font-medium text-navy-300 mb-3">Achievements ({earnedAchievements.length}/{ACHIEVEMENTS.length})</div>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map(achievement => {
                  const earned = streakData.achievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`group relative w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                        earned 
                          ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 cursor-pointer hover:scale-110' 
                          : 'bg-navy-800 opacity-40'
                      }`}
                      title={earned ? `${achievement.name}: ${achievement.description}` : 'Locked'}
                    >
                      {earned ? achievement.emoji : '🔒'}
                      {earned && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {achievement.name}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4">
              <div className="text-xs text-center text-navy-500">
                Visit daily to maintain your streak! 🎯
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}