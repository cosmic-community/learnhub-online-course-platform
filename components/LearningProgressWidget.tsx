'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  unlocked: boolean
}

interface LearningStats {
  streak: number
  xp: number
  lessonsCompleted: number
  coursesStarted: number
  lastVisit: string
}

const defaultStats: LearningStats = {
  streak: 0,
  xp: 0,
  lessonsCompleted: 0,
  coursesStarted: 0,
  lastVisit: ''
}

const achievements: Achievement[] = [
  { id: 'first-lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', unlocked: false },
  { id: 'week-streak', name: 'Week Warrior', icon: '🔥', description: '7 day learning streak', unlocked: false },
  { id: 'xp-100', name: 'Century Club', icon: '💯', description: 'Earn 100 XP', unlocked: false },
  { id: 'xp-500', name: 'Knowledge Seeker', icon: '📚', description: 'Earn 500 XP', unlocked: false },
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Start 3 different courses', unlocked: false },
  { id: 'dedicated', name: 'Dedicated', icon: '⭐', description: 'Complete 10 lessons', unlocked: false },
]

const dailyTips = [
  "💡 Consistency beats intensity. Even 15 minutes of daily learning compounds over time!",
  "🧠 Take breaks! Your brain consolidates learning during rest periods.",
  "✍️ Teaching others is the best way to solidify your own understanding.",
  "🎯 Set specific, achievable goals for each learning session.",
  "🔄 Spaced repetition helps move knowledge to long-term memory.",
  "💪 Struggle is good! It means your brain is forming new connections.",
  "📝 Write code by hand sometimes - it improves recall and understanding.",
  "🌟 Celebrate small wins - every lesson completed is progress!",
]

export default function LearningProgressWidget() {
  const [stats, setStats] = useState<LearningStats>(defaultStats)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [dailyTip, setDailyTip] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    const savedAchievements = localStorage.getItem('learnhub-achievements')
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      const today = new Date().toDateString()
      const lastVisit = parsed.lastVisit
      
      // Check if streak should continue, reset, or increment
      if (lastVisit !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const wasYesterday = lastVisit === yesterday.toDateString()
        
        const newStreak = wasYesterday ? parsed.streak + 1 : 1
        const xpBonus = newStreak > parsed.streak ? 10 : 0
        
        const updatedStats: LearningStats = {
          ...parsed,
          streak: newStreak,
          xp: parsed.xp + xpBonus,
          lastVisit: today
        }
        
        setStats(updatedStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(updatedStats))
        
        // Show confetti for streak continuation
        if (wasYesterday && newStreak > 1) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        setStats(parsed)
      }
    } else {
      // First visit - initialize stats
      const initialStats: LearningStats = {
        ...defaultStats,
        streak: 1,
        xp: 10,
        lastVisit: new Date().toDateString()
      }
      setStats(initialStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(initialStats))
    }
    
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements))
    }
    
    // Set random daily tip
    const tipIndex = new Date().getDate() % dailyTips.length
    setDailyTip(dailyTips[tipIndex] ?? dailyTips[0])
  }, [])

  // Check for new achievements
  useEffect(() => {
    if (!mounted) return
    
    const newUnlocked: string[] = [...unlockedAchievements]
    
    if (stats.lessonsCompleted >= 1 && !newUnlocked.includes('first-lesson')) {
      newUnlocked.push('first-lesson')
    }
    if (stats.streak >= 7 && !newUnlocked.includes('week-streak')) {
      newUnlocked.push('week-streak')
    }
    if (stats.xp >= 100 && !newUnlocked.includes('xp-100')) {
      newUnlocked.push('xp-100')
    }
    if (stats.xp >= 500 && !newUnlocked.includes('xp-500')) {
      newUnlocked.push('xp-500')
    }
    if (stats.coursesStarted >= 3 && !newUnlocked.includes('explorer')) {
      newUnlocked.push('explorer')
    }
    if (stats.lessonsCompleted >= 10 && !newUnlocked.includes('dedicated')) {
      newUnlocked.push('dedicated')
    }
    
    if (newUnlocked.length !== unlockedAchievements.length) {
      setUnlockedAchievements(newUnlocked)
      localStorage.setItem('learnhub-achievements', JSON.stringify(newUnlocked))
    }
  }, [stats, unlockedAchievements, mounted])

  // Calculate level from XP
  const level = Math.floor(stats.xp / 100) + 1
  const xpProgress = stats.xp % 100
  const xpToNextLevel = 100

  if (!mounted) return null

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Floating Widget */}
      <div className="fixed bottom-24 right-6 z-40">
        {/* Collapsed State - Streak Badge */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 rounded-2xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-2xl">🔥</span>
                {stats.streak > 1 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-navy-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.streak}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-xs opacity-80">Daily Streak</div>
                <div className="font-bold">{stats.streak} day{stats.streak !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="animate-bounce text-lg">✨</span>
            </div>
          </button>
        )}

        {/* Expanded State - Full Widget */}
        {isExpanded && (
          <div className="bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-2xl w-80 overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👨‍💻</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-navy-900 text-xs font-bold rounded-full px-2 py-0.5">
                      Lvl {level}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Learning Progress</div>
                    <div className="text-primary-100 text-sm">{stats.xp} XP Total</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/70 hover:text-white p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* XP Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-primary-100 mb-1">
                  <span>Level {level}</span>
                  <span>{xpProgress}/{xpToNextLevel} XP</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${(xpProgress / xpToNextLevel) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-white">{stats.streak}</div>
                <div className="text-xs text-navy-400">Day Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-2xl font-bold text-white">{stats.xp}</div>
                <div className="text-xs text-navy-400">Total XP</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">📖</div>
                <div className="text-2xl font-bold text-white">{stats.lessonsCompleted}</div>
                <div className="text-xs text-navy-400">Lessons</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">📚</div>
                <div className="text-2xl font-bold text-white">{stats.coursesStarted}</div>
                <div className="text-xs text-navy-400">Courses</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="px-4 pb-3">
              <div className="text-sm font-semibold text-white mb-2">Achievements</div>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement) => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`relative group cursor-pointer ${
                        isUnlocked ? '' : 'grayscale opacity-40'
                      }`}
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      <div className={`text-2xl p-2 rounded-lg ${
                        isUnlocked ? 'bg-primary-500/20' : 'bg-navy-800'
                      }`}>
                        {achievement.icon}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {achievement.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Daily Tip */}
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3">
                <div className="text-xs text-yellow-400/80 mb-1">Daily Learning Tip</div>
                <p className="text-sm text-navy-200">{dailyTip}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => {
                  // Simulate completing a lesson
                  const newStats: LearningStats = {
                    ...stats,
                    xp: stats.xp + 25,
                    lessonsCompleted: stats.lessonsCompleted + 1
                  }
                  setStats(newStats)
                  localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
                  setShowConfetti(true)
                  setTimeout(() => setShowConfetti(false), 2000)
                }}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                +25 XP Demo
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('learnhub-stats')
                  localStorage.removeItem('learnhub-achievements')
                  setStats({
                    ...defaultStats,
                    streak: 1,
                    xp: 10,
                    lastVisit: new Date().toDateString()
                  })
                  setUnlockedAchievements([])
                }}
                className="bg-navy-700 hover:bg-navy-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}