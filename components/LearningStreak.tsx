'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  totalVisits: number
  lastVisit: string
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', emoji: '👣', description: 'Visited LearnHub for the first time', threshold: 1 },
  { id: 'curious_learner', name: 'Curious Learner', emoji: '🔍', description: 'Explored 3 courses', threshold: 3 },
  { id: 'dedicated', name: 'Dedicated', emoji: '🎯', description: 'Visited 5 times', threshold: 5 },
  { id: 'knowledge_seeker', name: 'Knowledge Seeker', emoji: '📚', description: 'Explored 10 courses', threshold: 10 },
  { id: 'streak_master', name: 'Streak Master', emoji: '🔥', description: '7-day learning streak', threshold: 7 },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      totalVisits: 0,
      lastVisit: '',
      achievements: []
    }

    // Update streak logic
    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate !== today) {
      data.totalVisits += 1
      
      if (lastVisitDate === yesterday) {
        // Consecutive day - increase streak
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        // Streak broken - reset to 1
        data.currentStreak = 1
      }
      
      data.lastVisit = new Date().toISOString()

      // Check for new achievements
      const newAchievements: string[] = []
      
      if (data.totalVisits >= 1 && !data.achievements.includes('first_visit')) {
        newAchievements.push('first_visit')
      }
      if (data.totalVisits >= 5 && !data.achievements.includes('dedicated')) {
        newAchievements.push('dedicated')
      }
      if (data.currentStreak >= 7 && !data.achievements.includes('streak_master')) {
        newAchievements.push('streak_master')
      }

      if (newAchievements.length > 0) {
        data.achievements = [...data.achievements, ...newAchievements]
        const achievement = ACHIEVEMENTS.find(a => a.id === newAchievements[0])
        if (achievement) {
          setNewAchievement(achievement)
          setShowCelebration(true)
          setTimeout(() => {
            setShowCelebration(false)
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
  const nextAchievement = ACHIEVEMENTS.find(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {/* Confetti Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '⭐', '🌟', '✨', '🎊', '💫'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-center shadow-2xl shadow-primary-500/50">
            <div className="text-6xl mb-4 animate-wiggle">{newAchievement.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-xl text-primary-100 font-semibold">{newAchievement.name}</p>
            <p className="text-primary-200 mt-2">{newAchievement.description}</p>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`card p-4 cursor-pointer transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary-500' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`text-4xl ${streakData.currentStreak >= 3 ? 'animate-pulse' : ''}`}>
                🔥
              </div>
              {streakData.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
                {streakData.currentStreak >= 3 && <span className="text-sm">🔥</span>}
              </div>
              <div className="text-navy-400 text-sm">Learning Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {earnedAchievements.slice(-3).map((achievement) => (
              <div 
                key={achievement.id} 
                className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-lg hover:scale-125 transition-transform"
                title={achievement.name}
              >
                {achievement.emoji}
              </div>
            ))}
            <svg 
              className={`w-5 h-5 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-navy-700 space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                <div className="text-navy-400 text-xs">Total Visits</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{earnedAchievements.length}</div>
                <div className="text-navy-400 text-xs">Achievements</div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-sm font-semibold text-navy-300 mb-3">Your Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map((achievement) => {
                  const earned = streakData.achievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        earned 
                          ? 'bg-primary-500/20 text-primary-300' 
                          : 'bg-navy-800/50 text-navy-500 opacity-50'
                      }`}
                      title={achievement.description}
                    >
                      <span className={earned ? '' : 'grayscale'}>{achievement.emoji}</span>
                      <span>{achievement.name}</span>
                      {earned && <span className="text-green-400">✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next Achievement */}
            {nextAchievement && (
              <div className="bg-gradient-to-r from-navy-800 to-navy-800/50 rounded-lg p-3">
                <div className="text-xs text-navy-400 mb-1">Next Achievement</div>
                <div className="flex items-center gap-2">
                  <span className="text-xl opacity-50">{nextAchievement.emoji}</span>
                  <div>
                    <div className="text-white font-medium">{nextAchievement.name}</div>
                    <div className="text-navy-400 text-xs">{nextAchievement.description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}