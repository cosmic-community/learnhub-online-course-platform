'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const motivationalMessages: Record<number, string> = {
  1: "Great start! Every expert was once a beginner. 🌱",
  2: "You're building momentum! Keep it up! 💪",
  3: "3 days strong! You're on fire! 🔥",
  5: "5 day streak! You're unstoppable! ⚡",
  7: "A full week! You're dedicated! 🏆",
  14: "2 weeks! You're a learning machine! 🤖",
  30: "30 days! You're legendary! 👑",
  50: "50 day streak! You're inspiring! ✨",
  100: "100 DAYS! You're a true champion! 🎯",
}

const dailyTips = [
  "💡 Tip: Practice coding for at least 30 minutes daily for best retention.",
  "💡 Tip: Take breaks every 25 minutes using the Pomodoro technique.",
  "💡 Tip: Teach what you learn to solidify your understanding.",
  "💡 Tip: Build projects to apply what you learn in courses.",
  "💡 Tip: Join developer communities to stay motivated.",
  "💡 Tip: Write comments in your code - future you will thank you!",
  "💡 Tip: Debug by explaining your code to a rubber duck 🦆",
  "💡 Tip: Consistent small steps beat occasional big leaps.",
  "💡 Tip: Read documentation - it's a superpower!",
  "💡 Tip: Embrace errors - they're learning opportunities.",
  "💡 Tip: Version control early, version control often.",
  "💡 Tip: Sleep helps consolidate what you've learned!",
  "💡 Tip: Code reviews help you grow faster.",
  "💡 Tip: Don't copy-paste blindly - understand the code first.",
  "💡 Tip: Keyboard shortcuts save hours over time ⌨️",
]

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '👑'
  if (streak >= 50) return '💎'
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '⭐'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '✨'
  return '🎯'
}

function getMotivationalMessage(streak: number): string {
  const milestones = Object.keys(motivationalMessages)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const milestone of milestones) {
    if (streak >= milestone) {
      return motivationalMessages[milestone]
    }
  }
  return "Start your learning journey today! 🚀"
}

function getDailyTip(): string {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return dailyTips[dayOfYear % dailyTips.length]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      
      if (isSameDay(lastVisitDate, today)) {
        // Already visited today
        setStreakData(data)
      } else if (isYesterday(lastVisitDate)) {
        // Continuing streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today.toISOString(),
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for milestones
        const milestones = [3, 5, 7, 14, 30, 50, 100]
        if (milestones.includes(newStreak)) {
          setShowConfetti(true)
          setIsNewMilestone(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today.toISOString(),
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today.toISOString(),
        longestStreak: 1,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [])

  if (!streakData) return null

  const emoji = getStreakEmoji(streakData.currentStreak)
  const message = getMotivationalMessage(streakData.currentStreak)
  const tip = getDailyTip()

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6],
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-orange-500 to-red-500
            text-white font-semibold shadow-lg
            hover:from-orange-600 hover:to-red-600
            transition-all duration-300 transform hover:scale-105
            ${isNewMilestone ? 'animate-pulse' : ''}
          `}
        >
          <span className="text-lg animate-bounce-slow">{emoji}</span>
          <span className="text-sm">{streakData.currentStreak} day streak</span>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-14 left-0 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Learning Streak</h3>
                  <p className="text-orange-100 text-sm">Keep the momentum going!</p>
                </div>
                <div className="text-4xl">{emoji}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{streakData.currentStreak}</div>
                  <div className="text-navy-400 text-xs">Current</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400">{streakData.longestStreak}</div>
                  <div className="text-navy-400 text-xs">Longest</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{streakData.totalVisits}</div>
                  <div className="text-navy-400 text-xs">Total Visits</div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="bg-navy-800/50 rounded-xl p-4 mb-4">
                <p className="text-navy-200 text-sm">{message}</p>
              </div>

              {/* Daily Tip */}
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
                <p className="text-primary-300 text-sm">{tip}</p>
              </div>

              {/* Streak Calendar Preview */}
              <div className="mt-5">
                <p className="text-navy-400 text-xs mb-2">This week</p>
                <div className="flex gap-1.5">
                  {[...Array(7)].map((_, i) => {
                    const dayOffset = 6 - i
                    const isActive = dayOffset < streakData.currentStreak
                    return (
                      <div
                        key={i}
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-xs
                          ${isActive 
                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                            : 'bg-navy-800 text-navy-500'
                          }
                        `}
                      >
                        {isActive ? '🔥' : '·'}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}