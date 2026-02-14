'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { visits: 1, name: 'First Steps', emoji: '🌱', description: 'Started your learning journey' },
  { visits: 3, name: 'Getting Started', emoji: '📖', description: '3 days of learning' },
  { visits: 7, name: 'Week Warrior', emoji: '⚡', description: '7-day streak achieved' },
  { visits: 14, name: 'Dedicated Learner', emoji: '🔥', description: '2-week streak!' },
  { visits: 30, name: 'Knowledge Seeker', emoji: '🏆', description: '30-day streak!' },
  { visits: 50, name: 'Master Scholar', emoji: '👑', description: '50 visits milestone!' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showAchievement, setShowAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (savedData) {
      data = JSON.parse(savedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterday) {
        // Consecutive day - increase streak
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = today
      } else {
        // Streak broken - reset
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = today
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        achievements: []
      }
    }
    
    // Check for new achievements
    const newAchievement = ACHIEVEMENTS.find(
      a => data.totalVisits >= a.visits && !data.achievements.includes(a.name)
    )
    
    if (newAchievement) {
      data.achievements.push(newAchievement.name)
      setShowAchievement(newAchievement)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 3000)
    }
    
    // Save updated data
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!streakData) return null

  return (
    <>
      {/* Streak Badge - Fixed position */}
      <div className="fixed bottom-24 right-6 z-40">
        <div 
          className={`
            bg-gradient-to-br from-orange-500/20 to-red-500/20 
            backdrop-blur-lg border border-orange-500/30 
            rounded-2xl p-4 shadow-2xl shadow-orange-500/10
            transform transition-all duration-500 hover:scale-105
            ${isAnimating ? 'animate-bounce' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-3xl animate-pulse">🔥</span>
              {streakData.currentStreak >= 7 && (
                <span className="absolute -top-1 -right-1 text-xs">✨</span>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {streakData.currentStreak}
              </div>
              <div className="text-xs text-orange-300">
                day streak
              </div>
            </div>
          </div>
          
          {/* Mini achievements display */}
          {streakData.achievements.length > 0 && (
            <div className="mt-3 pt-3 border-t border-orange-500/20">
              <div className="flex gap-1">
                {ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.name))
                  .slice(-3)
                  .map((achievement, i) => (
                    <span 
                      key={achievement.name} 
                      className="text-lg"
                      title={achievement.name}
                    >
                      {achievement.emoji}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Popup */}
      {showAchievement && (
        <div 
          className={`
            fixed inset-0 z-50 flex items-center justify-center p-4
            bg-black/50 backdrop-blur-sm
            transition-opacity duration-500
            ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setShowAchievement(null)}
        >
          <div 
            className={`
              bg-gradient-to-br from-navy-900 to-navy-950
              border border-primary-500/50 rounded-3xl p-8
              text-center max-w-sm
              transform transition-all duration-500
              ${isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
            `}
          >
            <div className="text-6xl mb-4 animate-bounce">
              {showAchievement.emoji}
            </div>
            <div className="text-primary-400 text-sm font-medium mb-2">
              🎉 Achievement Unlocked!
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {showAchievement.name}
            </h3>
            <p className="text-navy-300">
              {showAchievement.description}
            </p>
            <button 
              onClick={() => setShowAchievement(null)}
              className="mt-6 btn-primary"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}
    </>
  )
}