'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

const milestones = [
  { days: 3, emoji: "🌱", label: "Seedling" },
  { days: 7, emoji: "🌿", label: "Growing" },
  { days: 14, emoji: "🌳", label: "Blooming" },
  { days: 30, emoji: "🔥", label: "On Fire" },
  { days: 60, emoji: "⭐", label: "Star Learner" },
  { days: 100, emoji: "🏆", label: "Champion" },
]

function getStreakEmoji(days: number): { emoji: string; label: string } {
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (days >= milestones[i].days) {
      return milestones[i]
    }
  }
  return { emoji: "✨", label: "Just Starting" }
}

function getDailyQuote(): { text: string; author: string } {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return motivationalQuotes[dayOfYear % motivationalQuotes.length]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    // Get streak data from localStorage
    const stored = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just show data
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          totalDays: data.totalDays + 1,
        }
        
        // Check for new milestone
        const oldMilestone = getStreakEmoji(data.currentStreak)
        const newMilestone = getStreakEmoji(newStreak)
        if (oldMilestone.label !== newMilestone.label) {
          setIsNewMilestone(true)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
        
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
      } else {
        // Streak broken, reset to 1
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDays: 1,
      }
      localStorage.setItem('learnhub_streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [])

  if (!streakData) {
    return null
  }

  const quote = getDailyQuote()
  const currentMilestone = getStreakEmoji(streakData.currentStreak)
  const nextMilestone = milestones.find(m => m.days > streakData.currentStreak)
  const progressToNext = nextMilestone 
    ? ((streakData.currentStreak / nextMilestone.days) * 100)
    : 100

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#fbbf24', '#f472b6', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce-slow">{currentMilestone.emoji}</div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isNewMilestone ? '🎉 New Milestone!' : 'Learning Streak'}
                </h3>
                <p className="text-sm text-navy-400">{currentMilestone.label}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-400">
                {streakData.currentStreak}
              </div>
              <div className="text-xs text-navy-400">days</div>
            </div>
          </div>

          {/* Progress to next milestone */}
          {nextMilestone && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-navy-400 mb-2">
                <span>Progress to {nextMilestone.emoji} {nextMilestone.label}</span>
                <span>{streakData.currentStreak}/{nextMilestone.days} days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-navy-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{streakData.totalDays}</div>
              <div className="text-xs text-navy-400">Total Days</div>
            </div>
          </div>

          {/* Daily Quote */}
          <div className="border-t border-navy-800 pt-4">
            <p className="text-sm text-navy-300 italic mb-2">"{quote.text}"</p>
            <p className="text-xs text-navy-500">— {quote.author}</p>
          </div>
        </div>
      </div>
    </div>
  )
}