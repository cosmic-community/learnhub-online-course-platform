'use client'

import { useEffect, useState } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MILESTONE_DAYS = [7, 14, 30, 60, 100, 365]

const MOTIVATIONAL_MESSAGES = [
  "Every expert was once a beginner! 🌱",
  "Consistency is the key to mastery! 🔑",
  "You're building something amazing! 🚀",
  "Small steps lead to big achievements! 👣",
  "Keep learning, keep growing! 📈",
  "Your future self will thank you! 🙏",
  "Progress, not perfection! ⭐",
  "The journey of a thousand miles begins with a single step! 🏃",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const updateStreak = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      let data: StreakData = stored 
        ? JSON.parse(stored) 
        : { currentStreak: 0, lastVisit: '', longestStreak: 0, totalVisits: 0 }
      
      if (data.lastVisit === today) {
        // Already visited today
        setStreakData(data)
        return
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (data.lastVisit === yesterdayString) {
        // Continuing streak!
        data.currentStreak += 1
        data.totalVisits += 1
        
        // Check for milestone
        if (MILESTONE_DAYS.includes(data.currentStreak)) {
          setMilestone(data.currentStreak)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 5000)
        }
      } else if (data.lastVisit === '') {
        // First visit ever
        data.currentStreak = 1
        data.totalVisits = 1
      } else {
        // Streak broken, but still a visit
        data.currentStreak = 1
        data.totalVisits += 1
      }
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      data.lastVisit = today
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
    }
    
    updateStreak()
  }, [])

  if (!streakData) return null

  const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]

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
                backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-navy-900/95 backdrop-blur-lg border border-primary-500 rounded-2xl p-8 text-center transform animate-bounce-in">
              <span className="text-6xl mb-4 block">🎉</span>
              <h3 className="text-2xl font-bold text-white mb-2">
                {milestone} Day Streak!
              </h3>
              <p className="text-navy-300">
                You're on fire! Keep up the amazing work!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Streak Badge */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-full hover:border-orange-500/50 transition-all group"
        >
          <span className="text-lg">🔥</span>
          <span className="text-sm font-semibold text-orange-400 group-hover:text-orange-300">
            {streakData.currentStreak}
          </span>
        </button>

        {/* Expanded Dropdown */}
        {isExpanded && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsExpanded(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-72 bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-xl shadow-2xl z-50 p-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full mb-3">
                  <span className="text-3xl">🔥</span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  {streakData.currentStreak} Day Streak!
                </h4>
                <p className="text-sm text-navy-400 mt-1">{randomMessage}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">
                    {streakData.totalVisits}
                  </div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Progress to next milestone */}
              {(() => {
                const nextMilestone = MILESTONE_DAYS.find(m => m > streakData.currentStreak) || 365
                const progress = (streakData.currentStreak / nextMilestone) * 100
                return (
                  <div>
                    <div className="flex justify-between text-xs text-navy-400 mb-1">
                      <span>Progress to {nextMilestone} days</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>
          </>
        )}
      </div>
    </>
  )
}