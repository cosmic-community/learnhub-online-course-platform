'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalLessonsCompleted: number
  lastActiveDate: string
}

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', requirement: 1 },
  { id: 'streak_3', name: 'Getting Warmed Up', icon: '🔥', description: '3 day streak', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7 day streak', requirement: 7 },
  { id: 'streak_14', name: 'Dedicated Learner', icon: '💪', description: '14 day streak', requirement: 14 },
  { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30 day streak', requirement: 30 },
  { id: 'lessons_5', name: 'Quick Study', icon: '📚', description: 'Complete 5 lessons', requirement: 5 },
  { id: 'lessons_10', name: 'Knowledge Seeker', icon: '🧠', description: 'Complete 10 lessons', requirement: 10 },
  { id: 'lessons_25', name: 'Scholar', icon: '🎓', description: 'Complete 25 lessons', requirement: 25 },
]

function ConfettiPiece({ delay, color }: { delay: number; color: string }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-confetti"
      style={{
        backgroundColor: color,
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
      }}
    />
  )
}

function Confetti() {
  const colors = ['#14b8a6', '#2dd4bf', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 500,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} color={piece.color} />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalLessonsCompleted: 0,
    lastActiveDate: '',
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const saved = localStorage.getItem('learningStreak')
    if (saved) {
      const data = JSON.parse(saved) as StreakData
      setStreakData(data)
      
      // Check if streak should continue or reset
      const today = new Date().toDateString()
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastActive !== today && lastActive !== yesterday) {
        // Streak broken, but don't reset total lessons
        setStreakData(prev => ({
          ...prev,
          currentStreak: 0,
        }))
      }
    } else {
      // Initialize with demo data for new users
      const demoData: StreakData = {
        currentStreak: 3,
        longestStreak: 5,
        totalLessonsCompleted: 7,
        lastActiveDate: new Date().toISOString(),
      }
      setStreakData(demoData)
      localStorage.setItem('learningStreak', JSON.stringify(demoData))
    }
  }, [])

  const recordActivity = () => {
    const today = new Date().toDateString()
    const lastActive = new Date(streakData.lastActiveDate).toDateString()
    
    if (lastActive === today) {
      // Already recorded today
      return
    }
    
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const newStreak = lastActive === yesterday ? streakData.currentStreak + 1 : 1
    const newLessons = streakData.totalLessonsCompleted + 1
    
    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(streakData.longestStreak, newStreak),
      totalLessonsCompleted: newLessons,
      lastActiveDate: new Date().toISOString(),
    }
    
    setStreakData(newData)
    localStorage.setItem('learningStreak', JSON.stringify(newData))
    
    // Check for new achievements
    checkAchievements(newStreak, newLessons)
  }

  const checkAchievements = (streak: number, lessons: number) => {
    const unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]') as string[]
    
    for (const achievement of ACHIEVEMENTS) {
      if (unlockedAchievements.includes(achievement.id)) continue
      
      let unlocked = false
      if (achievement.id === 'first_lesson' && lessons >= 1) unlocked = true
      if (achievement.id.startsWith('streak_') && streak >= achievement.requirement) unlocked = true
      if (achievement.id.startsWith('lessons_') && lessons >= achievement.requirement) unlocked = true
      
      if (unlocked) {
        unlockedAchievements.push(achievement.id)
        localStorage.setItem('achievements', JSON.stringify(unlockedAchievements))
        setNewAchievement(achievement)
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
          setNewAchievement(null)
        }, 3000)
        break
      }
    }
  }

  const unlockedAchievements = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('achievements') || '[]') as string[]
    : []

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return '🏆'
    if (streakData.currentStreak >= 14) return '💪'
    if (streakData.currentStreak >= 7) return '⚡'
    if (streakData.currentStreak >= 3) return '🔥'
    if (streakData.currentStreak >= 1) return '✨'
    return '💤'
  }

  const getMotivationalMessage = () => {
    if (streakData.currentStreak >= 30) return "Incredible dedication! You're a learning legend!"
    if (streakData.currentStreak >= 14) return "Two weeks strong! Keep pushing forward!"
    if (streakData.currentStreak >= 7) return "A whole week! You're building great habits!"
    if (streakData.currentStreak >= 3) return "Nice streak! Don't break the chain!"
    if (streakData.currentStreak >= 1) return "Great start! Come back tomorrow!"
    return "Start your streak today!"
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-navy-950/50 backdrop-blur-sm">
          <div className="bg-navy-900 border border-primary-500/50 rounded-2xl p-8 text-center animate-bounce-in shadow-2xl shadow-primary-500/20">
            <div className="text-6xl mb-4 animate-pulse">{newAchievement.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-primary-400 text-xl font-semibold mb-2">{newAchievement.name}</p>
            <p className="text-navy-400">{newAchievement.description}</p>
          </div>
        </div>
      )}
      
      {/* Main Streak Widget */}
      <div className="card overflow-hidden">
        <div 
          className="p-6 cursor-pointer hover:bg-navy-800/30 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="text-4xl animate-pulse-slow">{getStreakEmoji()}</div>
                {streakData.currentStreak > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
                    {streakData.currentStreak}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {streakData.currentStreak > 0 
                    ? `${streakData.currentStreak} Day Streak!` 
                    : 'Start Your Streak'}
                </h3>
                <p className="text-sm text-navy-400">{getMotivationalMessage()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  recordActivity()
                }}
                className="btn-primary text-sm py-2 px-4"
              >
                + Log Learning
              </button>
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
        </div>
        
        {/* Expanded Stats */}
        {isExpanded && (
          <div className="border-t border-navy-800 p-6 space-y-6 animate-slide-down">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-navy-800/50 rounded-xl">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current Streak</div>
              </div>
              <div className="text-center p-4 bg-navy-800/50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="text-center p-4 bg-navy-800/50 rounded-xl">
                <div className="text-2xl font-bold text-purple-400">{streakData.totalLessonsCompleted}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
            </div>
            
            {/* Week View */}
            <div>
              <h4 className="text-sm font-medium text-navy-300 mb-3">This Week</h4>
              <div className="flex justify-between gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                  const today = new Date().getDay()
                  const isToday = i === today
                  const isPast = i < today
                  const isActive = isPast || (isToday && streakData.currentStreak > 0)
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <span className="text-xs text-navy-500">{day}</span>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                          isToday 
                            ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' 
                            : ''
                        } ${
                          isActive 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-navy-800 text-navy-500'
                        }`}
                      >
                        {isActive ? '✓' : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Achievements */}
            <div>
              <h4 className="text-sm font-medium text-navy-300 mb-3">Achievements</h4>
              <div className="grid grid-cols-4 gap-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`relative group p-3 rounded-xl text-center transition-all ${
                        isUnlocked 
                          ? 'bg-primary-500/20 border border-primary-500/50' 
                          : 'bg-navy-800/50 border border-navy-700 opacity-50'
                      }`}
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="text-xs text-navy-400 mt-1 truncate">{achievement.name}</div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <p className="text-xs text-white font-medium">{achievement.name}</p>
                        <p className="text-xs text-navy-400">{achievement.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}