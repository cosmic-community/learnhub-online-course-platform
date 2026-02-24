'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const motivationalMessages = [
  { threshold: 0, emoji: '🌱', message: "Welcome! Start your learning journey today!" },
  { threshold: 1, emoji: '🔥', message: "You're on fire! 1 day streak!" },
  { threshold: 3, emoji: '⚡', message: "Amazing momentum! Keep it going!" },
  { threshold: 7, emoji: '🚀', message: "One week strong! You're unstoppable!" },
  { threshold: 14, emoji: '💎', message: "Two weeks! You're building great habits!" },
  { threshold: 30, emoji: '🏆', message: "A whole month! You're a learning champion!" },
  { threshold: 60, emoji: '👑', message: "60 days! You're absolutely legendary!" },
  { threshold: 100, emoji: '🌟', message: "100 day streak! Master learner status!" },
]

const celebrations = ['🎉', '✨', '🎊', '💫', '🌈', '⭐']

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isNewDay, setIsNewDay] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Same day, no update needed
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Consecutive day - increment streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: new Date().toISOString(),
          totalVisits: data.totalVisits + 1,
          longestStreak: Math.max(data.longestStreak, newStreak),
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewDay(true)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } else {
        // Streak broken - start fresh
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: new Date().toISOString(),
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak,
        }
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewDay(true)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1,
        longestStreak: 1,
      }
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsNewDay(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) return null

  const getMessage = () => {
    const sorted = [...motivationalMessages].sort((a, b) => b.threshold - a.threshold)
    const match = sorted.find(m => streakData.currentStreak >= m.threshold)
    return match || motivationalMessages[0]
  }

  const { emoji, message } = getMessage()

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {celebrations.map((c, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${10 + i * 15}%`,
                top: '-50px',
                animation: `fall ${2 + Math.random()}s ease-in forwards`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 
            text-white rounded-2xl shadow-lg shadow-orange-500/30 
            transition-all duration-300 hover:shadow-orange-500/50 hover:scale-105
            ${isExpanded ? 'w-full p-4' : 'px-4 py-3'}
            ${isNewDay ? 'animate-pulse' : ''}
          `}
        >
          <div className="text-2xl">{emoji}</div>
          <div className={`flex-1 text-left ${isExpanded ? '' : 'hidden sm:block'}`}>
            <div className="font-bold text-lg flex items-center gap-2">
              {streakData.currentStreak} Day Streak
              {isNewDay && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+1!</span>}
            </div>
            {isExpanded && (
              <div className="text-sm text-white/80 mt-1">{message}</div>
            )}
          </div>
          <div className={`text-2xl ${isExpanded ? '' : 'hidden'}`}>
            {isExpanded ? '✕' : '▼'}
          </div>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-2 bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-xl p-4 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-navy-800/50 rounded-lg">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current Streak</div>
              </div>
              <div className="text-center p-3 bg-navy-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="text-center p-3 bg-navy-800/50 rounded-lg col-span-2">
                <div className="text-2xl font-bold text-green-400">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Learning Days</div>
              </div>
            </div>
            
            {/* Progress to next milestone */}
            <div className="mt-4">
              <div className="text-xs text-navy-400 mb-2">Next Milestone</div>
              {(() => {
                const nextMilestone = motivationalMessages.find(m => m.threshold > streakData.currentStreak)
                if (!nextMilestone) return <div className="text-sm text-primary-400">You&apos;ve reached the top! 🎉</div>
                const progress = (streakData.currentStreak / nextMilestone.threshold) * 100
                return (
                  <>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{streakData.currentStreak} days</span>
                      <span>{nextMilestone.threshold} days {nextMilestone.emoji}</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-navy-500">
                Keep learning daily to maintain your streak! 🔥
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CSS for falling animation */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}