'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '🎯', requirement: 1, description: 'Made your first visit' },
  { id: 'streak_3', name: 'Getting Started', icon: '🔥', requirement: 3, description: '3 day streak' },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', requirement: 7, description: '7 day streak' },
  { id: 'streak_14', name: 'Dedicated Learner', icon: '🌟', requirement: 14, description: '14 day streak' },
  { id: 'streak_30', name: 'Learning Legend', icon: '👑', requirement: 30, description: '30 day streak' },
  { id: 'visits_10', name: 'Regular', icon: '📚', requirement: 10, description: '10 total visits' },
  { id: 'visits_50', name: 'Bookworm', icon: '🦉', requirement: 50, description: '50 total visits' },
]

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const today = getDateString(new Date())
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const daysSinceLastVisit = daysBetween(data.lastVisitDate, today)
      
      if (daysSinceLastVisit === 0) {
        // Same day, no update needed
        setStreakData(data)
        return
      } else if (daysSinceLastVisit === 1) {
        // Consecutive day - increase streak!
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisitDate = today
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
      } else {
        // Streak broken
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisitDate = today
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1,
        achievements: [],
      }
    }
    
    // Check for new achievements
    const newAchievements: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (data.achievements.includes(achievement.id)) return
      
      let earned = false
      if (achievement.id === 'first_visit' && data.totalVisits >= 1) earned = true
      if (achievement.id.startsWith('streak_') && data.currentStreak >= achievement.requirement) earned = true
      if (achievement.id.startsWith('visits_') && data.totalVisits >= achievement.requirement) earned = true
      
      if (earned) {
        data.achievements.push(achievement.id)
        newAchievements.push(achievement.id)
      }
    })
    
    // Show celebration for new achievements
    if (newAchievements.length > 0) {
      const latestAchievement = ACHIEVEMENTS.find(a => a.id === newAchievements[newAchievements.length - 1])
      if (latestAchievement) {
        setNewAchievement(latestAchievement.name)
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
          setNewAchievement(null)
        }, 3000)
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const nextAchievement = ACHIEVEMENTS.find(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-semibold">Achievement Unlocked: {newAchievement}!</span>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className="fixed bottom-24 left-5 z-40"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={`bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${isExpanded ? 'w-72' : 'w-auto'}`}>
          {/* Collapsed State */}
          <div className="flex items-center gap-3 p-3 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                🔥
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-navy-900 text-xs font-bold flex items-center justify-center shadow">
                {streakData.currentStreak}
              </div>
            </div>
            {!isExpanded && (
              <div className="pr-2">
                <div className="text-white font-semibold text-sm">
                  {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}
                </div>
                <div className="text-navy-400 text-xs">streak</div>
              </div>
            )}
          </div>

          {/* Expanded State */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4">
              <div>
                <div className="text-white font-bold text-lg">
                  {streakData.currentStreak} Day Streak! 🔥
                </div>
                <div className="text-navy-400 text-sm">
                  Keep learning to maintain your streak
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                  <div className="text-white font-bold">{streakData.longestStreak}</div>
                  <div className="text-navy-400 text-xs">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                  <div className="text-white font-bold">{streakData.totalVisits}</div>
                  <div className="text-navy-400 text-xs">Total Visits</div>
                </div>
              </div>

              {/* Achievements */}
              {earnedAchievements.length > 0 && (
                <div>
                  <div className="text-navy-300 text-xs font-medium mb-2">Achievements</div>
                  <div className="flex flex-wrap gap-1">
                    {earnedAchievements.map(achievement => (
                      <div
                        key={achievement.id}
                        className="w-8 h-8 rounded-lg bg-navy-800/50 flex items-center justify-center text-lg cursor-help"
                        title={`${achievement.name}: ${achievement.description}`}
                      >
                        {achievement.icon}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Achievement */}
              {nextAchievement && (
                <div className="bg-navy-800/30 rounded-lg p-3 border border-navy-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg opacity-50">{nextAchievement.icon}</span>
                    <span className="text-navy-300 text-sm font-medium">{nextAchievement.name}</span>
                  </div>
                  <div className="text-navy-500 text-xs">{nextAchievement.description}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}