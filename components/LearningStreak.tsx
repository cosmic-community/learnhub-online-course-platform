'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const motivationalMessages = [
  { min: 0, max: 0, emoji: '🌱', message: "Welcome! Start your learning journey today!" },
  { min: 1, max: 2, emoji: '🔥', message: "Great start! Keep the momentum going!" },
  { min: 3, max: 6, emoji: '🚀', message: "You're on fire! Consistency is key!" },
  { min: 7, max: 13, emoji: '⭐', message: "One week strong! You're building great habits!" },
  { min: 14, max: 29, emoji: '💎', message: "Two weeks! You're becoming unstoppable!" },
  { min: 30, max: 59, emoji: '🏆', message: "A month of learning! You're a champion!" },
  { min: 60, max: 89, emoji: '👑', message: "Two months! You're in the top 1% of learners!" },
  { min: 90, max: Infinity, emoji: '🌟', message: "Legendary learner! You inspire us all!" },
]

function getMotivationalMessage(streak: number) {
  return motivationalMessages.find(m => streak >= m.min && streak <= m.max) || motivationalMessages[0]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date1, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      
      if (isSameDay(lastVisitDate, today)) {
        // Already visited today, no changes needed
        setStreakData(data)
        return
      } else if (isYesterday(lastVisitDate, today)) {
        // Visited yesterday, increment streak!
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = today.toISOString()
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
          // Show confetti for new record!
          if (data.currentStreak > 1) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }
        }
        
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, reset to 1
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = today.toISOString()
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today.toISOString(),
        longestStreak: 1,
        totalVisits: 1,
      }
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!streakData) {
    return null
  }

  const motivation = getMotivationalMessage(streakData.currentStreak)

  return (
    <div className="relative">
      {/* Confetti effect for new records */}
      {showConfetti && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="flex gap-1 animate-bounce">
            {['🎉', '✨', '🎊', '⭐', '🌟'].map((emoji, i) => (
              <span 
                key={i} 
                className="text-2xl"
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  animation: 'confetti 1s ease-out forwards'
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className={`card p-6 text-center transition-all duration-500 ${isAnimating ? 'scale-105 ring-2 ring-primary-500' : ''}`}>
        {/* Streak Fire Animation */}
        <div className="relative inline-block mb-4">
          <div className={`text-6xl transition-transform duration-300 ${isAnimating ? 'animate-pulse scale-125' : ''}`}>
            {motivation.emoji}
          </div>
          {streakData.currentStreak > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {streakData.currentStreak}
            </div>
          )}
        </div>

        {/* Streak Counter */}
        <div className="mb-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
              {streakData.currentStreak}
            </span>
            <span className="text-xl text-navy-300">
              {streakData.currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-sm text-navy-400 mt-1">Learning Streak</p>
        </div>

        {/* Motivational Message */}
        <p className="text-navy-200 text-sm mb-4 font-medium">
          {motivation.message}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 pt-4 border-t border-navy-800">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-500">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-500">Total Visits</div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {streakData.currentStreak > 0 && (
          <div className="mt-4">
            <StreakProgress currentStreak={streakData.currentStreak} />
          </div>
        )}
      </div>
    </div>
  )
}

function StreakProgress({ currentStreak }: { currentStreak: number }) {
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  const nextMilestone = milestones.find(m => m > currentStreak) || 365
  const prevMilestone = milestones.filter(m => m <= currentStreak).pop() || 0
  
  const progress = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100

  const milestoneRewards: Record<number, string> = {
    7: '🎯 Week Warrior',
    14: '💪 Fortnight Fighter', 
    30: '🏅 Month Master',
    60: '🎖️ Double Month Hero',
    90: '🏆 Quarter Champion',
    180: '👑 Half-Year Legend',
    365: '🌟 Year of Excellence',
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-navy-500">
        <span>{prevMilestone} days</span>
        <span className="text-primary-400 font-medium">{milestoneRewards[nextMilestone]}</span>
        <span>{nextMilestone} days</span>
      </div>
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-navy-500">
        {nextMilestone - currentStreak} days to next milestone!
      </p>
    </div>
  )
}