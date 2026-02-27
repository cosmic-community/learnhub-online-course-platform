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
  { id: 'first_visit', name: 'Explorer', emoji: '🎯', description: 'Visited LearnHub for the first time' },
  { id: 'streak_3', name: 'Getting Started', emoji: '🔥', description: '3 day learning streak' },
  { id: 'streak_7', name: 'Dedicated Learner', emoji: '⭐', description: '7 day learning streak' },
  { id: 'streak_14', name: 'Knowledge Seeker', emoji: '🏆', description: '14 day learning streak' },
  { id: 'streak_30', name: 'Learning Master', emoji: '👑', description: '30 day learning streak' },
  { id: 'visits_10', name: 'Regular', emoji: '📚', description: 'Visited 10 times' },
  { id: 'visits_50', name: 'Committed', emoji: '💎', description: 'Visited 50 times' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      achievements: []
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    // Update streak logic
    if (lastVisitDate !== today) {
      data.totalVisits += 1
      
      if (lastVisitDate === yesterday) {
        // Continuing streak
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        // Streak broken or first visit
        data.currentStreak = 1
      }
      
      data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
      data.lastVisit = today

      // Check for new achievements
      const newAchievements: string[] = []
      
      if (!data.achievements.includes('first_visit')) {
        newAchievements.push('first_visit')
      }
      if (data.currentStreak >= 3 && !data.achievements.includes('streak_3')) {
        newAchievements.push('streak_3')
      }
      if (data.currentStreak >= 7 && !data.achievements.includes('streak_7')) {
        newAchievements.push('streak_7')
      }
      if (data.currentStreak >= 14 && !data.achievements.includes('streak_14')) {
        newAchievements.push('streak_14')
      }
      if (data.currentStreak >= 30 && !data.achievements.includes('streak_30')) {
        newAchievements.push('streak_30')
      }
      if (data.totalVisits >= 10 && !data.achievements.includes('visits_10')) {
        newAchievements.push('visits_10')
      }
      if (data.totalVisits >= 50 && !data.achievements.includes('visits_50')) {
        newAchievements.push('visits_50')
      }

      if (newAchievements.length > 0) {
        data.achievements = [...data.achievements, ...newAchievements]
        const achievement = ACHIEVEMENTS.find(a => a.id === newAchievements[0])
        if (achievement) {
          setNewAchievement(achievement)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setNewAchievement(null)
          }, 4000)
        }
      }

      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full shadow-lg shadow-primary-500/30 animate-bounce-in z-10">
          <span className="text-2xl mr-2">{newAchievement.emoji}</span>
          <span className="font-semibold">Achievement Unlocked: {newAchievement.name}!</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Your Learning Streak</h3>
          <p className="text-navy-400 text-sm">Keep learning every day!</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary-400 flex items-center gap-2">
            <span className="animate-pulse">🔥</span>
            {streakData.currentStreak}
          </div>
          <div className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Streak Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-navy-400">Progress to next milestone</span>
          <span className="text-primary-400">
            {streakData.currentStreak < 7 ? `${streakData.currentStreak}/7 days` :
             streakData.currentStreak < 14 ? `${streakData.currentStreak}/14 days` :
             streakData.currentStreak < 30 ? `${streakData.currentStreak}/30 days` :
             '🏆 Master!'}
          </span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${Math.min(100, (streakData.currentStreak / (streakData.currentStreak < 7 ? 7 : streakData.currentStreak < 14 ? 14 : 30)) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-navy-800/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
          <div className="text-navy-400 text-xs">Total Visits</div>
        </div>
        <div className="text-center p-3 bg-navy-800/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
          <div className="text-navy-400 text-xs">Best Streak</div>
        </div>
        <div className="text-center p-3 bg-navy-800/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{earnedAchievements.length}</div>
          <div className="text-navy-400 text-xs">Achievements</div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="text-sm font-medium text-navy-300 mb-3">Your Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((achievement) => {
            const earned = streakData.achievements.includes(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`group relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  earned 
                    ? 'bg-primary-500/20 text-primary-300 hover:bg-primary-500/30' 
                    : 'bg-navy-800/50 text-navy-500'
                }`}
                title={achievement.description}
              >
                <span className={`mr-1 ${earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.emoji}
                </span>
                {achievement.name}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-navy-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {achievement.description}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}