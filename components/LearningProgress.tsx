'use client'

import { useState, useEffect, useCallback } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  streak: number
  totalLessonsCompleted: number
  totalMinutesLearned: number
  lastActiveDate: string
  achievements: Achievement[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', unlocked: false },
  { id: 'streak-3', title: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', unlocked: false },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', unlocked: false },
  { id: 'lessons-5', title: 'Quick Learner', description: 'Complete 5 lessons', icon: '📚', unlocked: false },
  { id: 'lessons-10', title: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '🧠', unlocked: false },
  { id: 'hour-1', title: 'Time Invested', description: 'Learn for 60 minutes', icon: '⏰', unlocked: false },
]

function ConfettiPiece({ delay, left }: { delay: number; left: number }) {
  const colors = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981']
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  return (
    <div
      className="absolute w-3 h-3 animate-confetti"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}ms`,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
      }}
    />
  )
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 50} left={Math.random() * 100} />
      ))}
    </div>
  )
}

function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-navy-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary-500 transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

function AchievementBadge({ achievement, isNew }: { achievement: Achievement; isNew: boolean }) {
  return (
    <div
      className={`
        relative p-3 rounded-xl border transition-all duration-300
        ${achievement.unlocked
          ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/10 border-primary-500/50'
          : 'bg-navy-800/50 border-navy-700 opacity-50'
        }
        ${isNew ? 'animate-achievement-pop' : ''}
      `}
    >
      {isNew && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-ping" />
      )}
      <div className="flex items-center gap-3">
        <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
          {achievement.icon}
        </span>
        <div>
          <p className={`text-sm font-medium ${achievement.unlocked ? 'text-white' : 'text-navy-400'}`}>
            {achievement.title}
          </p>
          <p className="text-xs text-navy-400">{achievement.description}</p>
        </div>
        {achievement.unlocked && (
          <svg className="w-5 h-5 text-primary-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  )
}

export default function LearningProgress() {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [stats, setStats] = useState<LearningStats>({
    streak: 0,
    totalLessonsCompleted: 0,
    totalMinutesLearned: 0,
    lastActiveDate: '',
    achievements: DEFAULT_ACHIEVEMENTS,
  })

  // Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('learnhub-progress')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LearningStats
        // Merge with default achievements to ensure new ones are included
        const mergedAchievements = DEFAULT_ACHIEVEMENTS.map(defaultAch => {
          const stored = parsed.achievements?.find(a => a.id === defaultAch.id)
          return stored || defaultAch
        })
        setStats({ ...parsed, achievements: mergedAchievements })
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [])

  // Check and update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString()
    const lastActive = stats.lastActiveDate

    if (lastActive === today) {
      return stats.streak // Already active today
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (lastActive === yesterday.toDateString()) {
      return stats.streak + 1 // Continuing streak
    }

    return 1 // Starting new streak
  }, [stats.lastActiveDate, stats.streak])

  // Check achievements
  const checkAchievements = useCallback((currentStats: LearningStats): Achievement[] => {
    const newUnlocks: string[] = []
    
    const updatedAchievements = currentStats.achievements.map(ach => {
      if (ach.unlocked) return ach

      let shouldUnlock = false

      switch (ach.id) {
        case 'first-lesson':
          shouldUnlock = currentStats.totalLessonsCompleted >= 1
          break
        case 'streak-3':
          shouldUnlock = currentStats.streak >= 3
          break
        case 'streak-7':
          shouldUnlock = currentStats.streak >= 7
          break
        case 'lessons-5':
          shouldUnlock = currentStats.totalLessonsCompleted >= 5
          break
        case 'lessons-10':
          shouldUnlock = currentStats.totalLessonsCompleted >= 10
          break
        case 'hour-1':
          shouldUnlock = currentStats.totalMinutesLearned >= 60
          break
      }

      if (shouldUnlock) {
        newUnlocks.push(ach.id)
        return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() }
      }

      return ach
    })

    if (newUnlocks.length > 0) {
      setNewAchievements(prev => [...prev, ...newUnlocks])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    return updatedAchievements
  }, [])

  // Simulate learning activity (in real app, this would be called when viewing lessons)
  const simulateLearning = () => {
    const newStreak = updateStreak()
    const newStats: LearningStats = {
      ...stats,
      streak: newStreak,
      totalLessonsCompleted: stats.totalLessonsCompleted + 1,
      totalMinutesLearned: stats.totalMinutesLearned + Math.floor(Math.random() * 20) + 10,
      lastActiveDate: new Date().toDateString(),
      achievements: stats.achievements,
    }
    
    newStats.achievements = checkAchievements(newStats)
    setStats(newStats)
    localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
  }

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const progressPercent = (unlockedCount / stats.achievements.length) * 100

  return (
    <>
      <Confetti show={showConfetti} />
      
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 group"
        aria-label="View learning progress"
      >
        <div className="relative">
          {/* Pulse animation for streak */}
          {stats.streak > 0 && (
            <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-25" />
          )}
          <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-110">
            <span className="text-2xl">🔥</span>
          </div>
          {/* Streak badge */}
          {stats.streak > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-navy-900">
              {stats.streak}
            </div>
          )}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="relative w-full max-w-md bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl animate-modal-pop overflow-hidden">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-primary-500/20 to-transparent border-b border-navy-800">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-xl font-bold text-white mb-1">Your Learning Journey</h2>
              <p className="text-navy-400 text-sm">Track your progress and earn achievements</p>
            </div>

            {/* Stats Grid */}
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ProgressRing progress={progressPercent} size={60} strokeWidth={5} />
                </div>
                <p className="text-xs text-navy-400">Progress</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🔥</span>
                </div>
                <p className="text-lg font-bold text-white">{stats.streak}</p>
                <p className="text-xs text-navy-400">Day Streak</p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">📖</span>
                </div>
                <p className="text-lg font-bold text-white">{stats.totalLessonsCompleted}</p>
                <p className="text-xs text-navy-400">Lessons</p>
              </div>
            </div>

            {/* Time Learned */}
            <div className="px-6 pb-4">
              <div className="bg-navy-800/50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    {Math.floor(stats.totalMinutesLearned / 60)}h {stats.totalMinutesLearned % 60}m
                  </p>
                  <p className="text-xs text-navy-400">Total time learning</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="px-6 pb-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span>🏆</span> Achievements ({unlockedCount}/{stats.achievements.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                {stats.achievements.map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isNew={newAchievements.includes(achievement.id)}
                  />
                ))}
              </div>
            </div>

            {/* Demo Button */}
            <div className="px-6 pb-6">
              <button
                onClick={simulateLearning}
                className="w-full btn-primary"
              >
                <span className="mr-2">✨</span>
                Simulate Learning (Demo)
              </button>
              <p className="text-xs text-navy-500 text-center mt-2">
                Click to simulate completing a lesson
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}