'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  lessonsViewed: number
  milestones: number[]
}

const MOTIVATIONAL_MESSAGES = [
  "Every expert was once a beginner 🌱",
  "Learning is a superpower 💪",
  "You're doing amazing! 🌟",
  "Consistency beats intensity 🎯",
  "Keep the momentum going! 🚀",
  "Your future self will thank you 🙏",
  "Progress, not perfection ✨",
  "One lesson at a time 📚",
]

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "🎉 3-day streak! You're building momentum!",
  7: "🔥 1 week streak! You're on fire!",
  14: "⭐ 2 weeks! You're a learning machine!",
  30: "🏆 30 days! You're unstoppable!",
  50: "💎 50 days! Legendary dedication!",
  100: "👑 100 days! Learning royalty!",
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMilestone, setShowMilestone] = useState<string | null>(null)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const storedData = localStorage.getItem('learning-streak')
    
    let data: StreakData = storedData ? JSON.parse(storedData) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      lessonsViewed: 0,
      milestones: [],
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()

    if (lastVisitDate !== today) {
      data.totalVisits += 1
      
      if (lastVisitDate === yesterdayString) {
        // Continuing streak
        data.currentStreak += 1
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else if (lastVisitDate !== today) {
        // Streak broken or first visit
        if (data.currentStreak > 0 && lastVisitDate !== '') {
          // Streak was broken
          data.currentStreak = 1
        } else if (data.currentStreak === 0) {
          // First visit ever
          data.currentStreak = 1
        }
      }

      data.lastVisit = today

      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }

      // Check for milestones
      const milestoneKeys = Object.keys(MILESTONE_MESSAGES).map(Number)
      for (const milestone of milestoneKeys) {
        if (data.currentStreak === milestone && !data.milestones.includes(milestone)) {
          data.milestones.push(milestone)
          setShowMilestone(MILESTONE_MESSAGES[milestone])
          setTimeout(() => setShowMilestone(null), 5000)
          break
        }
      }

      localStorage.setItem('learning-streak', JSON.stringify(data))
    }

    setStreakData(data)
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  // Track lesson views
  useEffect(() => {
    const handleLessonView = () => {
      const storedData = localStorage.getItem('learning-streak')
      if (storedData) {
        const data: StreakData = JSON.parse(storedData)
        data.lessonsViewed += 1
        localStorage.setItem('learning-streak', JSON.stringify(data))
        setStreakData(data)
      }
    }

    // Listen for lesson page views
    if (typeof window !== 'undefined' && window.location.pathname.includes('/lessons/')) {
      handleLessonView()
    }
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '👑'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '🎯'
    return '🌱'
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-amber-500 to-orange-600'
    if (streak >= 14) return 'from-purple-500 to-pink-600'
    if (streak >= 7) return 'from-orange-500 to-red-600'
    if (streak >= 3) return 'from-blue-500 to-cyan-600'
    return 'from-green-500 to-emerald-600'
  }

  return (
    <>
      {/* Milestone Celebration */}
      {showMilestone && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="animate-bounce bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-2xl text-xl font-bold">
            {showMilestone}
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`group relative flex items-center gap-2 bg-navy-900/90 backdrop-blur-sm border border-navy-700 rounded-full px-4 py-3 shadow-lg transition-all duration-300 hover:border-navy-600 hover:shadow-xl ${
            isAnimating ? 'animate-pulse scale-110' : ''
          }`}
        >
          {/* Streak Fire Animation */}
          <div className={`relative text-2xl transition-transform duration-300 ${isAnimating ? 'animate-bounce' : 'group-hover:scale-110'}`}>
            {getStreakEmoji(streakData.currentStreak)}
            {streakData.currentStreak >= 3 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            )}
          </div>
          
          {/* Streak Counter */}
          <div className="flex flex-col items-start">
            <span className={`text-lg font-bold bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} bg-clip-text text-transparent`}>
              {streakData.currentStreak}
            </span>
            <span className="text-[10px] text-navy-400 -mt-1">day streak</span>
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-3 w-72 bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className={`bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} p-4`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getStreakEmoji(streakData.currentStreak)}</span>
                <div>
                  <h3 className="text-white font-bold text-lg">Learning Streak</h3>
                  <p className="text-white/80 text-sm">{motivationalMessage}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
                  <div className="text-xs text-navy-400">Current Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-amber-400">{streakData.lessonsViewed}</div>
                  <div className="text-xs text-navy-400">Lessons Viewed</div>
                </div>
              </div>

              {/* Progress to next milestone */}
              {streakData.currentStreak < 100 && (
                <div>
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Next milestone</span>
                    <span>
                      {(() => {
                        const milestones = [3, 7, 14, 30, 50, 100]
                        const next = milestones.find(m => m > streakData.currentStreak) || 100
                        return `${next - streakData.currentStreak} days to go`
                      })()}
                    </span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} transition-all duration-500`}
                      style={{
                        width: `${(() => {
                          const milestones = [0, 3, 7, 14, 30, 50, 100]
                          const currentMilestoneIndex = milestones.findIndex(m => m >= streakData.currentStreak)
                          const prevMilestone = milestones[Math.max(0, currentMilestoneIndex - 1)]
                          const nextMilestone = milestones[currentMilestoneIndex] || 100
                          const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
                          return Math.min(100, progress)
                        })()}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Achievements */}
              {streakData.milestones.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-navy-300 mb-2">Achievements Unlocked</h4>
                  <div className="flex flex-wrap gap-2">
                    {streakData.milestones.map((milestone) => (
                      <span
                        key={milestone}
                        className="px-2 py-1 bg-navy-800 rounded-lg text-xs text-amber-400"
                      >
                        {milestone} days {milestone >= 100 ? '👑' : milestone >= 50 ? '💎' : milestone >= 30 ? '🏆' : '🔥'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tip */}
              <p className="text-xs text-navy-500 text-center pt-2 border-t border-navy-800">
                Visit daily to maintain your streak! 🎯
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}