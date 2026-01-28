'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  streak: number
  xp: number
  level: number
  lessonsCompleted: number
  lastVisit: string
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000]

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1
  }
  return 1
}

function getXpForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  return LEVEL_THRESHOLDS[level]
}

function getLevelTitle(level: number): string {
  const titles = [
    'Newcomer', 'Learner', 'Student', 'Scholar', 'Expert',
    'Master', 'Guru', 'Sage', 'Legend', 'Grandmaster'
  ]
  return titles[Math.min(level - 1, titles.length - 1)]
}

export default function StreakWidget() {
  const [stats, setStats] = useState<LearningStats>({
    streak: 0,
    xp: 0,
    level: 1,
    lessonsCompleted: 0,
    lastVisit: ''
  })
  const [showDetails, setShowDetails] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    const today = new Date().toDateString()

    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      // Check streak
      if (lastVisitDate === today) {
        // Already visited today
        setStats(parsed)
      } else if (lastVisitDate === yesterday) {
        // Streak continues!
        const newStats = {
          ...parsed,
          streak: parsed.streak + 1,
          xp: parsed.xp + 10, // Bonus XP for streak
          lastVisit: today
        }
        newStats.level = calculateLevel(newStats.xp)
        setStats(newStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, but still award visit XP
        const newStats = {
          ...parsed,
          streak: 1,
          xp: parsed.xp + 5,
          lastVisit: today
        }
        newStats.level = calculateLevel(newStats.xp)
        setStats(newStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
      }
    } else {
      // First time visitor!
      const newStats: LearningStats = {
        streak: 1,
        xp: 25, // Welcome bonus
        level: 1,
        lessonsCompleted: 0,
        lastVisit: today
      }
      setStats(newStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  const xpForNext = getXpForNextLevel(stats.level)
  const xpProgress = stats.level >= LEVEL_THRESHOLDS.length 
    ? 100 
    : ((stats.xp - LEVEL_THRESHOLDS[stats.level - 1]) / (xpForNext - LEVEL_THRESHOLDS[stats.level - 1])) * 100

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 transition-all ${
          isAnimating ? 'animate-pulse ring-2 ring-primary-400' : ''
        }`}
      >
        <span className="text-lg" title="Current streak">🔥</span>
        <span className="text-sm font-semibold text-primary-400">{stats.streak}</span>
        <div className="w-px h-4 bg-navy-600" />
        <span className="text-xs text-navy-300">Lvl {stats.level}</span>
      </button>

      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-4 z-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl">
              {stats.level >= 5 ? '👑' : stats.level >= 3 ? '⭐' : '🌟'}
            </div>
            <div>
              <div className="text-white font-semibold">{getLevelTitle(stats.level)}</div>
              <div className="text-navy-400 text-sm">Level {stats.level}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-navy-400">XP Progress</span>
                <span className="text-primary-400">{stats.xp} / {xpForNext}</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-lg font-bold text-white">{stats.streak}</div>
                <div className="text-xs text-navy-400">Day Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-lg font-bold text-white">{stats.lessonsCompleted}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
            </div>

            <div className="pt-2 border-t border-navy-700">
              <div className="text-xs text-navy-500 text-center">
                Visit daily to maintain your streak and earn bonus XP!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}