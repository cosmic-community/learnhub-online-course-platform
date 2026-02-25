'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const LEARNING_TIPS = [
  { emoji: '🧠', tip: "Take breaks every 25 minutes - your brain consolidates learning during rest!" },
  { emoji: '✍️', tip: "Teaching others what you learn helps you retain 90% of the material." },
  { emoji: '🎯', tip: "Set small, achievable goals. Completing them releases dopamine!" },
  { emoji: '💪', tip: "Struggling with a concept? That's your brain growing stronger!" },
  { emoji: '🔄', tip: "Spaced repetition: Review material after 1 day, 3 days, then 7 days." },
  { emoji: '📝', tip: "Handwriting notes activates more brain regions than typing." },
  { emoji: '😴', tip: "Sleep is when your brain moves learning from short to long-term memory." },
  { emoji: '🚶', tip: "A 10-minute walk can boost creativity and problem-solving by 60%!" },
  { emoji: '🎵', tip: "Instrumental music can help focus - try lo-fi beats while coding!" },
  { emoji: '💬', tip: "Explain concepts out loud, even to yourself. It reveals gaps in understanding." },
  { emoji: '🌟', tip: "Celebrate small wins! Each lesson completed is progress." },
  { emoji: '🔍', tip: "Curiosity is a superpower. Ask 'why' and 'how' constantly." },
  { emoji: '⏰', tip: "Your brain is sharpest 2-4 hours after waking. Use it for hard topics!" },
  { emoji: '🎮', tip: "Gamify your learning - give yourself points for completed lessons." },
  { emoji: '📚', tip: "Reading code is just as important as writing it. Study others' work!" },
]

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "🎉 3-day streak! You're building a habit!",
  7: "🔥 One week strong! You're on fire!",
  14: "⭐ Two weeks! You're a learning machine!",
  30: "🏆 30 days! You're absolutely unstoppable!",
  50: "💎 50 days! You're in the top 1% of learners!",
  100: "🚀 100 DAYS! You're a legend!",
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [dailyTip, setDailyTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  useEffect(() => {
    // Get today's tip based on the date
    const today = new Date()
    const dayIndex = (today.getFullYear() * 365 + today.getMonth() * 30 + today.getDate()) % LEARNING_TIPS.length
    setDailyTip(LEARNING_TIPS[dayIndex])

    // Load and update streak data
    const storedData = localStorage.getItem('learnhub-streak')
    const todayStr = today.toISOString().split('T')[0]
    
    let data: StreakData
    
    if (storedData) {
      data = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit)
      const daysDiff = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (data.lastVisit !== todayStr) {
        if (daysDiff === 1) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          data.totalVisits += 1
          data.lastVisit = todayStr
          
          // Check for milestone
          if (MILESTONE_MESSAGES[data.currentStreak]) {
            setMilestoneMessage(MILESTONE_MESSAGES[data.currentStreak])
            triggerConfetti()
          }
        } else if (daysDiff > 1) {
          // Streak broken
          data.currentStreak = 1
          data.totalVisits += 1
          data.lastVisit = todayStr
        }
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        lastVisit: todayStr,
        totalVisits: 1,
        longestStreak: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
    
    // Delay showing the widget for a nice entrance
    setTimeout(() => setIsVisible(true), 500)
  }, [triggerConfetti])

  const dismissMilestone = () => {
    setMilestoneMessage(null)
  }

  if (!streakData || !dailyTip) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '💪'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-orange-500 to-red-500'
    if (streak >= 14) return 'from-yellow-500 to-orange-500'
    if (streak >= 7) return 'from-green-500 to-emerald-500'
    if (streak >= 3) return 'from-blue-500 to-cyan-500'
    return 'from-primary-500 to-primary-600'
  }

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '💪', '✨', '🎊'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Milestone Popup */}
      {milestoneMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-[90] bg-black/50 backdrop-blur-sm">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce-in shadow-2xl">
            <div className="text-6xl mb-4">🎊</div>
            <h3 className="text-2xl font-bold text-white mb-2">Milestone Reached!</h3>
            <p className="text-xl text-primary-400 mb-6">{milestoneMessage}</p>
            <button onClick={dismissMilestone} className="btn-primary">
              Keep Learning! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Floating Streak Widget */}
      <div
        className={`fixed bottom-24 left-5 z-40 transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div
          className={`bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-80' : 'w-auto'
          }`}
        >
          {/* Collapsed State - Just the streak badge */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-3 p-4 w-full text-left hover:bg-navy-800/50 transition-colors ${
              isExpanded ? 'border-b border-navy-700' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStreakColor(streakData.currentStreak)} flex items-center justify-center text-2xl shadow-lg`}>
              {getStreakEmoji(streakData.currentStreak)}
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-lg">
                {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
              </div>
              <div className="text-navy-400 text-sm">Learning Streak</div>
            </div>
            <svg
              className={`w-5 h-5 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="p-4 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-navy-400 text-xs">Total Visits</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
                  <div className="text-navy-400 text-xs">Best Streak</div>
                </div>
              </div>

              {/* Daily Tip */}
              <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{dailyTip.emoji}</div>
                  <div>
                    <div className="text-primary-400 text-xs font-semibold mb-1">💡 Daily Learning Tip</div>
                    <p className="text-navy-200 text-sm leading-relaxed">{dailyTip.tip}</p>
                  </div>
                </div>
              </div>

              {/* Progress to next milestone */}
              {(() => {
                const milestones = Object.keys(MILESTONE_MESSAGES).map(Number).sort((a, b) => a - b)
                const nextMilestone = milestones.find(m => m > streakData.currentStreak)
                if (!nextMilestone) return null
                
                const prevMilestone = milestones.filter(m => m <= streakData.currentStreak).pop() || 0
                const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
                
                return (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-navy-400">Next milestone</span>
                      <span className="text-primary-400">{nextMilestone} days</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-center text-xs text-navy-500 mt-1">
                      {nextMilestone - streakData.currentStreak} day{nextMilestone - streakData.currentStreak !== 1 ? 's' : ''} to go!
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  )
}