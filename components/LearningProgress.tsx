'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const MOTIVATIONAL_MESSAGES = [
  "🚀 You're on fire! Keep that momentum going!",
  "💪 Every expert was once a beginner. You've got this!",
  "🌟 Your dedication is inspiring. Amazing progress!",
  "🎯 Focus leads to success. You're proving it!",
  "⚡ Learning is a superpower, and you're leveling up!",
  "🏆 Champions are built one day at a time. Great work!",
  "🌈 Your future self will thank you for this!",
  "✨ Small steps lead to big achievements. Keep going!",
]

export default function LearningProgress({ totalCourses, totalLessons, totalInstructors }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [completedLessons, setCompletedLessons] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Initialize from localStorage on client
  useEffect(() => {
    const savedStreak = localStorage.getItem('learnhub_streak')
    const savedXp = localStorage.getItem('learnhub_xp')
    const savedLastVisit = localStorage.getItem('learnhub_last_visit')
    const savedCompletedLessons = localStorage.getItem('learnhub_completed_lessons')
    
    const today = new Date().toDateString()
    const lastVisit = savedLastVisit ? new Date(savedLastVisit).toDateString() : null
    
    // Calculate streak
    let currentStreak = parseInt(savedStreak || '0')
    if (lastVisit === today) {
      // Same day, keep streak
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increment streak
        currentStreak += 1
        localStorage.setItem('learnhub_streak', currentStreak.toString())
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        // Streak broken - but give a welcome back bonus
        currentStreak = 1
        localStorage.setItem('learnhub_streak', '1')
      }
    } else {
      // First visit
      currentStreak = 1
      localStorage.setItem('learnhub_streak', '1')
    }
    
    localStorage.setItem('learnhub_last_visit', new Date().toISOString())
    
    setStreak(currentStreak)
    setXp(parseInt(savedXp || '0'))
    setCompletedLessons(parseInt(savedCompletedLessons || '0'))
    
    // Calculate level based on XP
    const currentXp = parseInt(savedXp || '0')
    setLevel(Math.floor(currentXp / 100) + 1)
    
    // Set random motivational message
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[randomIndex])

    // Initialize achievements
    initializeAchievements(currentStreak, currentXp, parseInt(savedCompletedLessons || '0'))
  }, [])

  const initializeAchievements = (currentStreak: number, currentXp: number, lessons: number) => {
    const achievementList: Achievement[] = [
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Start your learning journey',
        icon: '👶',
        unlocked: true,
        progress: 1,
        target: 1,
        rarity: 'common'
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: '7-day learning streak',
        icon: '🔥',
        unlocked: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        target: 7,
        rarity: 'rare'
      },
      {
        id: 'lesson_master',
        title: 'Lesson Master',
        description: 'Complete 10 lessons',
        icon: '📚',
        unlocked: lessons >= 10,
        progress: Math.min(lessons, 10),
        target: 10,
        rarity: 'rare'
      },
      {
        id: 'xp_hunter',
        title: 'XP Hunter',
        description: 'Earn 500 XP',
        icon: '💎',
        unlocked: currentXp >= 500,
        progress: Math.min(currentXp, 500),
        target: 500,
        rarity: 'epic'
      },
      {
        id: 'dedication',
        title: 'True Dedication',
        description: '30-day learning streak',
        icon: '🏆',
        unlocked: currentStreak >= 30,
        progress: Math.min(currentStreak, 30),
        target: 30,
        rarity: 'legendary'
      },
    ]
    setAchievements(achievementList)
  }

  const addXp = (amount: number) => {
    const newXp = xp + amount
    setXp(newXp)
    localStorage.setItem('learnhub_xp', newXp.toString())
    
    const newLevel = Math.floor(newXp / 100) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
    
    // Trigger animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const xpToNextLevel = 100 - (xp % 100)
  const xpProgress = (xp % 100) / 100

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/20'
      case 'rare': return 'shadow-blue-500/30'
      case 'epic': return 'shadow-purple-500/40'
      case 'legendary': return 'shadow-yellow-500/50'
      default: return ''
    }
  }

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
        {/* Header with Motivational Message */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Your Learning Journey</h3>
          <p className="text-primary-400 text-sm animate-pulse">{motivationalMessage}</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Streak Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-sm group-hover:blur-md transition-all" />
            <div className="relative bg-navy-800/50 rounded-xl p-4 border border-orange-500/30 group-hover:border-orange-500/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl animate-bounce-slow">🔥</span>
                <span className="text-2xl font-bold text-orange-400">{streak}</span>
              </div>
              <p className="text-xs text-navy-400">Day Streak</p>
              <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-md transition-all" />
            <div className={`relative bg-navy-800/50 rounded-xl p-4 border border-primary-500/30 group-hover:border-primary-500/50 transition-all ${isAnimating ? 'scale-105' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⚡</span>
                <span className="text-2xl font-bold text-primary-400">{xp}</span>
              </div>
              <p className="text-xs text-navy-400">Total XP</p>
              <div className="mt-2 h-1 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${xpProgress * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm group-hover:blur-md transition-all" />
            <div className="relative bg-navy-800/50 rounded-xl p-4 border border-purple-500/30 group-hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🎖️</span>
                <span className="text-2xl font-bold text-purple-400">{level}</span>
              </div>
              <p className="text-xs text-navy-400">Level</p>
              <p className="text-xs text-purple-400/70 mt-1">{xpToNextLevel} XP to next</p>
            </div>
          </div>

          {/* Courses Available */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-sm group-hover:blur-md transition-all" />
            <div className="relative bg-navy-800/50 rounded-xl p-4 border border-blue-500/30 group-hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📚</span>
                <span className="text-2xl font-bold text-blue-400">{totalCourses}</span>
              </div>
              <p className="text-xs text-navy-400">Courses</p>
              <p className="text-xs text-blue-400/70 mt-1">{totalLessons} lessons</p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="border-t border-navy-700 pt-6">
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏅</span> Achievements
          </h4>
          <div className="flex flex-wrap gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  achievement.unlocked ? 'hover:scale-110' : 'opacity-50 grayscale'
                }`}
              >
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${
                    achievement.unlocked ? `shadow-lg ${getRarityGlow(achievement.rarity)} animate-glow` : ''
                  }`}
                >
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <p className="text-xs font-semibold text-white">{achievement.title}</p>
                  <p className="text-xs text-navy-400">{achievement.description}</p>
                  {!achievement.unlocked && (
                    <p className="text-xs text-primary-400 mt-1">
                      {achievement.progress}/{achievement.target}
                    </p>
                  )}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => addXp(10)}
            className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>✨</span> Claim Daily Bonus (+10 XP)
          </button>
        </div>
      </div>
    </div>
  )
}