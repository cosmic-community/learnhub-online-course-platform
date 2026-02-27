'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '🌱', threshold: 1, description: 'Started your learning journey' },
  { id: 'week_warrior', name: 'Week Warrior', icon: '⚔️', threshold: 7, description: '7-day learning streak' },
  { id: 'fortnight_focus', name: 'Fortnight Focus', icon: '🎯', threshold: 14, description: '14-day learning streak' },
  { id: 'month_master', name: 'Month Master', icon: '👑', threshold: 30, description: '30-day learning streak' },
  { id: 'dedicated_learner', name: 'Dedicated Learner', icon: '📚', threshold: 10, description: '10 total visits' },
  { id: 'knowledge_seeker', name: 'Knowledge Seeker', icon: '🔮', threshold: 50, description: '50 total visits' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([])

  const triggerConfetti = useCallback(() => {
    const colors = ['#22d3ee', '#a855f7', '#f472b6', '#facc15', '#4ade80']
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }))
    setConfetti(newConfetti)
    setTimeout(() => setConfetti([]), 3000)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: '',
      totalVisits: 0,
      achievements: [],
    }

    // Check if this is a new day
    if (data.lastVisitDate !== today) {
      const lastVisit = data.lastVisitDate ? new Date(data.lastVisitDate) : null
      const todayDate = new Date(today)
      
      if (lastVisit) {
        const diffTime = todayDate.getTime() - lastVisit.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          data.currentStreak += 1
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        }
      } else {
        // First visit ever
        data.currentStreak = 1
      }
      
      data.totalVisits += 1
      data.lastVisitDate = today
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      // Check for new achievements
      const newAchievements: string[] = []
      ACHIEVEMENTS.forEach(achievement => {
        const meetsThreshold = 
          achievement.id.includes('visit') 
            ? data.totalVisits >= achievement.threshold 
            : data.currentStreak >= achievement.threshold
        
        if (meetsThreshold && !data.achievements.includes(achievement.id)) {
          newAchievements.push(achievement.id)
          data.achievements.push(achievement.id)
        }
      })
      
      // Show celebration for new achievements
      if (newAchievements.length > 0) {
        const latestAchievement = ACHIEVEMENTS.find(a => a.id === newAchievements[newAchievements.length - 1])
        if (latestAchievement) {
          setNewAchievement(latestAchievement)
          setShowCelebration(true)
          triggerConfetti()
        }
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [triggerConfetti])

  if (!streakData) return null

  const nextStreakAchievement = ACHIEVEMENTS
    .filter(a => !a.id.includes('visit') && !streakData.achievements.includes(a.id))
    .sort((a, b) => a.threshold - b.threshold)[0]

  const progress = nextStreakAchievement 
    ? (streakData.currentStreak / nextStreakAchievement.threshold) * 100 
    : 100

  return (
    <>
      {/* Confetti Animation */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 animate-confetti"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Celebration Modal */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-[90] bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-primary-500/50 rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce-in shadow-2xl shadow-primary-500/20">
            <div className="text-6xl mb-4 animate-pulse">{newAchievement.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-xl text-primary-400 font-semibold mb-2">{newAchievement.name}</p>
            <p className="text-navy-300 mb-6">{newAchievement.description}</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-primary"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Streak Badge */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 bg-navy-800/80 hover:bg-navy-700/80 border border-navy-700 rounded-full transition-all duration-200 group"
        >
          <span className="text-lg">🔥</span>
          <span className="text-sm font-semibold text-white">{streakData.currentStreak}</span>
          <span className="text-xs text-navy-400 hidden sm:inline">day streak</span>
          <svg 
            className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Stats Panel */}
        {isExpanded && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-navy-900 border border-navy-700 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-down">
            <div className="p-4 bg-gradient-to-r from-primary-500/10 to-navy-900 border-b border-navy-700">
              <h4 className="text-lg font-bold text-white mb-1">Your Learning Journey</h4>
              <p className="text-sm text-navy-400">Keep the momentum going!</p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-navy-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                  <div className="text-xs text-navy-400">Current</div>
                </div>
                <div className="text-center p-3 bg-navy-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best</div>
                </div>
                <div className="text-center p-3 bg-navy-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Visits</div>
                </div>
              </div>

              {/* Progress to Next Achievement */}
              {nextStreakAchievement && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-navy-300">Next: {nextStreakAchievement.name}</span>
                    <span className="text-navy-400">{streakData.currentStreak}/{nextStreakAchievement.threshold}</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Achievements */}
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">Achievements</h5>
                <div className="flex flex-wrap gap-2">
                  {ACHIEVEMENTS.map((achievement) => {
                    const unlocked = streakData.achievements.includes(achievement.id)
                    return (
                      <div
                        key={achievement.id}
                        className={`group relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                          unlocked 
                            ? 'bg-primary-500/20 border border-primary-500/50' 
                            : 'bg-navy-800 border border-navy-700 grayscale opacity-50'
                        }`}
                        title={`${achievement.name}: ${achievement.description}`}
                      >
                        <span className={unlocked ? '' : 'opacity-50'}>{achievement.icon}</span>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-navy-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {achievement.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}