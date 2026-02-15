'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  coursesViewed: number
  lessonsCompleted: number
  currentStreak: number
  longestStreak: number
  totalTimeMinutes: number
  lastActivity?: string
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_view', title: 'Curious Mind', description: 'View your first course', icon: '👀' },
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { id: 'five_lessons', title: 'Getting Serious', description: 'Complete 5 lessons', icon: '📚' },
  { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥' },
  { id: 'streak_7', title: 'Unstoppable', description: 'Maintain a 7-day streak', icon: '⚡' },
  { id: 'night_owl', title: 'Night Owl', description: 'Study after 10 PM', icon: '🦉' },
  { id: 'early_bird', title: 'Early Bird', description: 'Study before 7 AM', icon: '🐦' },
  { id: 'explorer', title: 'Explorer', description: 'View courses in 3 categories', icon: '🧭' },
]

const MOTIVATIONAL_MESSAGES = [
  "You're doing amazing! 🌟",
  "Knowledge is power! 💪",
  "Every expert was once a beginner 🌱",
  "Your future self will thank you! 🚀",
  "Learning is a superpower! ⚡",
  "One lesson at a time! 📖",
  "You've got this! 💫",
]

export default function LearningProgress() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<LearningStats>({
    coursesViewed: 0,
    lessonsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTimeMinutes: 0,
  })
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub_stats')
    const savedAchievements = localStorage.getItem('learnhub_achievements')
    
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    } else {
      // Initialize with demo data for delight
      const initialStats: LearningStats = {
        coursesViewed: 3,
        lessonsCompleted: 7,
        currentStreak: 2,
        longestStreak: 5,
        totalTimeMinutes: 127,
        lastActivity: new Date().toISOString(),
      }
      setStats(initialStats)
      localStorage.setItem('learnhub_stats', JSON.stringify(initialStats))
    }

    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    } else {
      // Initialize achievements with some unlocked for demo
      const initialAchievements: Achievement[] = ACHIEVEMENTS.map((a, idx) => ({
        ...a,
        unlocked: idx < 3, // First 3 unlocked for demo
        unlockedAt: idx < 3 ? new Date(Date.now() - (3 - idx) * 86400000).toISOString() : undefined,
      }))
      setAchievements(initialAchievements)
      localStorage.setItem('learnhub_achievements', JSON.stringify(initialAchievements))
    }

    // Set random motivational message
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  const simulateProgress = () => {
    // Simulate completing a lesson for demo
    const newStats = {
      ...stats,
      lessonsCompleted: stats.lessonsCompleted + 1,
      totalTimeMinutes: stats.totalTimeMinutes + Math.floor(Math.random() * 20) + 10,
      currentStreak: stats.currentStreak + 1,
      lastActivity: new Date().toISOString(),
    }
    
    if (newStats.currentStreak > stats.longestStreak) {
      newStats.longestStreak = newStats.currentStreak
    }
    
    setStats(newStats)
    localStorage.setItem('learnhub_stats', JSON.stringify(newStats))

    // Check for new achievements
    const updatedAchievements = [...achievements]
    let achievementUnlocked = false
    
    // Check five_lessons achievement
    if (newStats.lessonsCompleted >= 5) {
      const fiveIdx = updatedAchievements.findIndex(a => a.id === 'five_lessons')
      if (fiveIdx !== -1 && !updatedAchievements[fiveIdx].unlocked) {
        updatedAchievements[fiveIdx].unlocked = true
        updatedAchievements[fiveIdx].unlockedAt = new Date().toISOString()
        setNewAchievement(updatedAchievements[fiveIdx])
        achievementUnlocked = true
      }
    }

    // Check streak achievements
    if (newStats.currentStreak >= 3) {
      const streak3Idx = updatedAchievements.findIndex(a => a.id === 'streak_3')
      if (streak3Idx !== -1 && !updatedAchievements[streak3Idx].unlocked) {
        updatedAchievements[streak3Idx].unlocked = true
        updatedAchievements[streak3Idx].unlockedAt = new Date().toISOString()
        if (!achievementUnlocked) {
          setNewAchievement(updatedAchievements[streak3Idx])
          achievementUnlocked = true
        }
      }
    }

    if (achievementUnlocked) {
      setShowConfetti(true)
      setAchievements(updatedAchievements)
      localStorage.setItem('learnhub_achievements', JSON.stringify(updatedAchievements))
      
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <>
      {/* Floating Progress Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="View learning progress"
      >
        <div className="relative">
          <span className="text-2xl">🎯</span>
          {stats.currentStreak > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {stats.currentStreak}
            </span>
          )}
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-navy-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          🔥 {stats.currentStreak} day streak!
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-navy-900 border border-navy-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-500 p-6 rounded-t-2xl">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white mb-1">Your Learning Journey</h2>
              <p className="text-white/80 text-sm">{motivationalMessage}</p>
            </div>

            {/* Stats Grid */}
            <div className="p-6 border-b border-navy-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary-400">{stats.currentStreak}</div>
                  <div className="text-navy-400 text-sm">Day Streak 🔥</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-white">{stats.lessonsCompleted}</div>
                  <div className="text-navy-400 text-sm">Lessons Done</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-white">{formatTime(stats.totalTimeMinutes)}</div>
                  <div className="text-navy-400 text-sm">Time Learned</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-white">{stats.longestStreak}</div>
                  <div className="text-navy-400 text-sm">Best Streak</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Achievements</h3>
                <span className="text-sm text-navy-400">
                  {unlockedCount}/{achievements.length} unlocked
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-navy-800 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative group cursor-pointer ${
                      achievement.unlocked 
                        ? 'opacity-100' 
                        : 'opacity-40 grayscale'
                    }`}
                  >
                    <div className={`
                      w-full aspect-square rounded-xl flex items-center justify-center text-3xl
                      ${achievement.unlocked 
                        ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30' 
                        : 'bg-navy-800/50 border border-navy-700'
                      }
                      transition-transform group-hover:scale-110
                    `}>
                      {achievement.icon}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-navy-800 border border-navy-700 rounded-lg p-2 text-center min-w-[120px] shadow-xl">
                        <div className="text-white text-xs font-semibold">{achievement.title}</div>
                        <div className="text-navy-400 text-[10px]">{achievement.description}</div>
                        {achievement.unlocked && (
                          <div className="text-primary-400 text-[10px] mt-1">✓ Unlocked!</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Action */}
            <div className="p-6 pt-0">
              <button
                onClick={simulateProgress}
                className="w-full btn-primary"
              >
                ✨ Simulate Lesson Complete (Demo)
              </button>
              <p className="text-center text-navy-500 text-xs mt-2">
                Click to see achievement animations!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] animate-in slide-in-from-top fade-in duration-500">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl animate-bounce">{newAchievement.icon}</span>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-white/90 text-sm">{newAchievement.title}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}