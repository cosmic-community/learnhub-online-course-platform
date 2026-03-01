'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  coursesViewed: string[]
  lessonsCompleted: number
  joinDate: string
}

const MOTIVATIONAL_MESSAGES = [
  "🔥 You're on fire! Keep that momentum going!",
  "⭐ Amazing dedication! You're crushing it!",
  "🚀 To the moon! Your consistency is inspiring!",
  "💪 Champions show up every day. That's you!",
  "🎯 Focused and determined. Nothing can stop you!",
  "✨ Your future self will thank you for this!",
  "🌟 Small steps lead to big achievements!",
  "💎 Consistency is the key to mastery!",
]

const MILESTONES = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState('')

  const getRandomMessage = useCallback(() => {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  }, [])

  useEffect(() => {
    const initializeStreak = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastVisit = new Date(data.lastVisitDate).toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastVisit === today) {
          // Already visited today
          setStreakData(data)
          setMessage(getRandomMessage())
        } else if (lastVisit === yesterday) {
          // Continuing streak
          const newStreak = data.currentStreak + 1
          const newLongest = Math.max(newStreak, data.longestStreak)
          const newData: StreakData = {
            ...data,
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastVisitDate: today,
            totalVisits: data.totalVisits + 1,
          }
          
          // Check for milestones
          if (MILESTONES.includes(newStreak)) {
            setMilestoneReached(newStreak)
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 4000)
          }
          
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
          setMessage(getRandomMessage())
        } else {
          // Streak broken, reset
          const newData: StreakData = {
            ...data,
            currentStreak: 1,
            lastVisitDate: today,
            totalVisits: data.totalVisits + 1,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
          setMessage("Welcome back! Let's start a new streak! 💪")
        }
      } else {
        // First time visitor
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisitDate: today,
          totalVisits: 1,
          coursesViewed: [],
          lessonsCompleted: 0,
          joinDate: today,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setMessage("Welcome to LearnHub! 🎉 Your learning journey begins!")
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }

    initializeStreak()
  }, [getRandomMessage])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '👑'
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500'
    if (streak >= 14) return 'from-orange-400 to-red-500'
    if (streak >= 7) return 'from-primary-400 to-primary-600'
    return 'from-green-400 to-emerald-500'
  }

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
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb7185'][
                    Math.floor(Math.random() * 6)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Milestone Modal */}
      {milestoneReached && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Amazing! {milestoneReached} Day Streak!
            </h3>
            <p className="text-navy-300 mb-6">
              You&apos;ve learned for {milestoneReached} days in a row! Your dedication is truly inspiring.
            </p>
            <button
              onClick={() => setMilestoneReached(null)}
              className="btn-primary"
            >
              Keep Going! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`relative group cursor-pointer transition-all duration-300 ${
          isExpanded ? 'w-full max-w-sm' : 'w-auto'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-2xl overflow-hidden transition-all duration-300 ${
          isExpanded ? 'p-6' : 'p-4'
        }`}>
          {/* Main streak display */}
          <div className="flex items-center gap-3">
            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${getStreakColor(streakData.currentStreak)} flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
              {streakData.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xs">🔥</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} bg-clip-text text-transparent`}>
                  {streakData.currentStreak}
                </span>
                <span className="text-navy-400 text-sm">day streak</span>
              </div>
              <p className="text-navy-500 text-xs">
                {isExpanded ? message : 'Click for details'}
              </p>
            </div>
          </div>

          {/* Expanded details */}
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-navy-700 space-y-4 animate-fade-in">
              <p className="text-navy-300 text-sm italic">&quot;{message}&quot;</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
                  <div className="text-navy-500 text-xs">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{streakData.totalVisits}</div>
                  <div className="text-navy-500 text-xs">Total Visits</div>
                </div>
              </div>

              {/* Progress to next milestone */}
              {(() => {
                const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || 365
                const progress = (streakData.currentStreak / nextMilestone) * 100
                return (
                  <div>
                    <div className="flex justify-between text-xs text-navy-400 mb-1">
                      <span>Next milestone</span>
                      <span>{nextMilestone} days</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} transition-all duration-500`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-navy-500 mt-1">
                      {nextMilestone - streakData.currentStreak} days to go!
                    </p>
                  </div>
                )
              })()}

              <p className="text-center text-navy-600 text-xs">
                Learning since {new Date(streakData.joinDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}