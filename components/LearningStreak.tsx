'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysLearned: number
  lastActiveDate: string
  weeklyProgress: boolean[]
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going! 💪", emoji: "⭐" },
  { min: 3, max: 6, message: "You're building a habit! Awesome work! 🔥", emoji: "🔥" },
  { min: 7, max: 13, message: "One week streak! You're unstoppable! 🏆", emoji: "🏆" },
  { min: 14, max: 29, message: "Two weeks strong! You're a learning machine! 🤖", emoji: "💎" },
  { min: 30, max: 59, message: "30 day streak! Legendary dedication! 👑", emoji: "👑" },
  { min: 60, max: Infinity, message: "You're in the hall of fame! 🏅", emoji: "🏅" },
]

const CONFETTI_COLORS = ['#7C3AED', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6']

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDaysLearned: 0,
    lastActiveDate: '',
    weeklyProgress: [false, false, false, false, false, false, false],
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])
  const [justUpdated, setJustUpdated] = useState(false)

  const triggerConfetti = useCallback(() => {
    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }))
    setConfettiPieces(pieces)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 4000)
  }, [])

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toISOString().split('T')[0]
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastDate = new Date(data.lastActiveDate)
        const todayDate = new Date(today)
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
          // Same day, just load data
          setStreakData(data)
        } else if (diffDays === 1) {
          // Next day - increment streak!
          const newStreak = data.currentStreak + 1
          const newData: StreakData = {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, data.longestStreak),
            totalDaysLearned: data.totalDaysLearned + 1,
            lastActiveDate: today,
            weeklyProgress: updateWeeklyProgress(data.weeklyProgress),
          }
          setStreakData(newData)
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setJustUpdated(true)
          
          // Celebrate milestones
          if ([7, 14, 30, 60, 100].includes(newStreak)) {
            setTimeout(triggerConfetti, 500)
          }
        } else {
          // Streak broken, but start fresh
          const newData: StreakData = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            totalDaysLearned: data.totalDaysLearned + 1,
            lastActiveDate: today,
            weeklyProgress: updateWeeklyProgress([false, false, false, false, false, false, false]),
          }
          setStreakData(newData)
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        }
      } else {
        // First time user
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          totalDaysLearned: 1,
          lastActiveDate: today,
          weeklyProgress: updateWeeklyProgress([false, false, false, false, false, false, false]),
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setJustUpdated(true)
      }
    }

    const timer = setTimeout(() => {
      loadStreakData()
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [triggerConfetti])

  const updateWeeklyProgress = (current: boolean[]): boolean[] => {
    const newProgress = [...current]
    const dayOfWeek = new Date().getDay()
    // Shift Sunday from 0 to 6, make Monday 0
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    newProgress[adjustedDay] = true
    return newProgress
  }

  const getMessage = () => {
    const streak = streakData.currentStreak
    const match = MOTIVATIONAL_MESSAGES.find(m => streak >= m.min && streak <= m.max)
    return match || MOTIVATIONAL_MESSAGES[0]
  }

  const getStreakColor = () => {
    const streak = streakData.currentStreak
    if (streak >= 30) return 'from-yellow-400 to-orange-500'
    if (streak >= 14) return 'from-purple-400 to-pink-500'
    if (streak >= 7) return 'from-blue-400 to-cyan-500'
    if (streak >= 3) return 'from-green-400 to-emerald-500'
    return 'from-primary-400 to-primary-600'
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  if (!isVisible) return null

  const motivationalData = getMessage()

  return (
    <>
      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm animate-confetti"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div
        className={`fixed bottom-24 left-5 z-40 transition-all duration-500 ease-out ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div
          className={`bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-72' : 'w-auto'
          }`}
        >
          {/* Main Button / Collapsed View */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 flex items-center gap-3 hover:bg-navy-800/50 transition-colors"
          >
            {/* Streak Fire Icon with Animation */}
            <div className={`relative ${justUpdated ? 'animate-bounce' : ''}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStreakColor()} flex items-center justify-center text-2xl shadow-lg`}>
                {motivationalData.emoji}
              </div>
              {streakData.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-navy-900 animate-pulse">
                  🔥
                </div>
              )}
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold bg-gradient-to-r ${getStreakColor()} bg-clip-text text-transparent`}>
                  {streakData.currentStreak}
                </span>
                <span className="text-navy-400 text-sm">day streak</span>
              </div>
              {!isExpanded && (
                <p className="text-navy-500 text-xs mt-0.5">Click to expand</p>
              )}
            </div>

            <svg
              className={`w-5 h-5 text-navy-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4 animate-fadeIn">
              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-navy-800/50 to-navy-700/30 rounded-xl p-3 border border-navy-700/50">
                <p className="text-sm text-navy-200 font-medium">{motivationalData.message}</p>
              </div>

              {/* Weekly Progress */}
              <div>
                <p className="text-xs text-navy-500 uppercase tracking-wider mb-2">This Week</p>
                <div className="flex justify-between gap-1">
                  {dayLabels.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                          streakData.weeklyProgress[index]
                            ? `bg-gradient-to-br ${getStreakColor()} text-white shadow-lg`
                            : 'bg-navy-800 text-navy-500'
                        }`}
                      >
                        {streakData.weeklyProgress[index] ? '✓' : day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Longest Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.totalDaysLearned}</div>
                  <div className="text-xs text-navy-400">Days Learned</div>
                </div>
              </div>

              {/* Progress to Next Milestone */}
              {streakData.currentStreak < 100 && (
                <div>
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Next milestone</span>
                    <span>{getNextMilestone(streakData.currentStreak)} days</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getStreakColor()} transition-all duration-500`}
                      style={{
                        width: `${getMilestoneProgress(streakData.currentStreak)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [7, 14, 30, 60, 100]
  return milestones.find(m => m > current) || 100
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 7, 14, 30, 60, 100]
  let prevMilestone = 0
  let nextMilestone = 100
  
  for (let i = 0; i < milestones.length - 1; i++) {
    if (current >= milestones[i] && current < milestones[i + 1]) {
      prevMilestone = milestones[i]
      nextMilestone = milestones[i + 1]
      break
    }
  }
  
  if (current >= 100) return 100
  
  const progress = ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100
  return Math.min(progress, 100)
}