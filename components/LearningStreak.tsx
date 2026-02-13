'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '🌱', requirement: 1, description: 'Welcome to your learning journey!' },
  { id: 'streak_3', name: 'Getting Warmed Up', icon: '🔥', requirement: 3, description: '3 day streak!' },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', requirement: 7, description: '7 day streak!' },
  { id: 'streak_14', name: 'Dedicated Learner', icon: '🏆', requirement: 14, description: '14 day streak!' },
  { id: 'streak_30', name: 'Learning Machine', icon: '🚀', requirement: 30, description: '30 day streak!' },
  { id: 'visits_10', name: 'Regular', icon: '📚', requirement: 10, description: '10 total visits!' },
  { id: 'visits_50', name: 'Scholar', icon: '🎓', requirement: 50, description: '50 total visits!' },
]

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      achievements: []
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate !== today) {
      data.totalVisits += 1
      
      if (lastVisitDate === yesterday) {
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        data.currentStreak = 1
      }
      
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      data.lastVisit = new Date().toISOString()

      // Check for new achievements
      const newAchievements: string[] = []
      
      ACHIEVEMENTS.forEach(achievement => {
        if (data.achievements.includes(achievement.id)) return
        
        let earned = false
        if (achievement.id === 'first_visit' && data.totalVisits >= 1) earned = true
        if (achievement.id.startsWith('streak_')) {
          const req = parseInt(achievement.id.split('_')[1])
          if (data.currentStreak >= req) earned = true
        }
        if (achievement.id.startsWith('visits_')) {
          const req = parseInt(achievement.id.split('_')[1])
          if (data.totalVisits >= req) earned = true
        }
        
        if (earned) {
          newAchievements.push(achievement.id)
          data.achievements.push(achievement.id)
        }
      })

      if (newAchievements.length > 0) {
        const latestAchievement = ACHIEVEMENTS.find(a => a.id === newAchievements[newAchievements.length - 1])
        if (latestAchievement) {
          setNewAchievement(latestAchievement.name)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setNewAchievement(null)
          }, 4000)
        }
      }

      localStorage.setItem('learnhub_streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const lockedAchievements = ACHIEVEMENTS.filter(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
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
                {['🎉', '⭐', '🔥', '✨', '🎊', '💫'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[101] animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-sm opacity-90">Achievement Unlocked!</p>
              <p className="font-bold text-lg">{newAchievement}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Streak Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="View learning streak"
      >
        <div className="relative">
          <span className="text-2xl">🔥</span>
          <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
            {streakData.currentStreak}
          </span>
        </div>
      </button>

      {/* Streak Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-40 right-6 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Current Streak</p>
                  <p className="text-4xl font-bold">{streakData.currentStreak} days</p>
                </div>
                <span className="text-6xl">🔥</span>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="bg-navy-800 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{streakData.longestStreak}</p>
                <p className="text-xs text-navy-400">Longest Streak</p>
              </div>
              <div className="bg-navy-800 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{streakData.totalVisits}</p>
                <p className="text-xs text-navy-400">Total Visits</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-4 border-t border-navy-800">
              <p className="text-sm font-semibold text-white mb-3">
                Achievements ({earnedAchievements.length}/{ACHIEVEMENTS.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {earnedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="group relative"
                  >
                    <span className="text-2xl cursor-pointer hover:scale-125 transition-transform inline-block">
                      {achievement.icon}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-navy-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {achievement.name}
                    </div>
                  </div>
                ))}
                {lockedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="group relative"
                  >
                    <span className="text-2xl cursor-pointer opacity-30 grayscale hover:opacity-50 transition-opacity inline-block">
                      {achievement.icon}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-navy-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      🔒 {achievement.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational message */}
            <div className="p-4 bg-navy-800/50 text-center">
              <p className="text-sm text-navy-300">
                {streakData.currentStreak === 0 
                  ? "Start your streak today! 🚀"
                  : streakData.currentStreak < 3 
                    ? "Keep it up! You're building momentum! 💪"
                    : streakData.currentStreak < 7
                      ? "Amazing progress! You're on fire! 🔥"
                      : "Incredible dedication! You're a learning machine! 🏆"
                }
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}