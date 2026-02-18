'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_QUOTES = [
  { min: 0, max: 2, quotes: [
    "Every expert was once a beginner. Start your journey! 🌱",
    "The best time to start learning was yesterday. The second best time is now! ⚡",
    "Small steps every day lead to big changes. Keep going! 👣"
  ]},
  { min: 3, max: 6, quotes: [
    "You're building a habit! Amazing progress! 🔥",
    "Consistency is the mother of mastery. You're doing great! 💪",
    "Your future self will thank you for showing up today! 🎯"
  ]},
  { min: 7, max: 29, quotes: [
    "A whole week of learning! You're unstoppable! 🚀",
    "Your dedication is inspiring! Keep that fire burning! 🔥",
    "Winners are not people who never fail, but people who never quit! 🏆"
  ]},
  { min: 30, max: 99, quotes: [
    "30+ days! You've built a powerful habit! 💎",
    "A month of consistent learning - you're in the top 1%! 🌟",
    "Your commitment to growth is remarkable! 👑"
  ]},
  { min: 100, max: Infinity, quotes: [
    "100+ days! You're a true learning legend! 🦸",
    "Incredible dedication! You've mastered the art of consistency! 🏅",
    "Your learning journey is an inspiration to us all! ✨"
  ]}
]

const MILESTONES = [7, 14, 30, 50, 100, 200, 365]

function getQuote(streak: number): string {
  const tier = MOTIVATIONAL_QUOTES.find(t => streak >= t.min && streak <= t.max)
  const quotes = tier?.quotes || MOTIVATIONAL_QUOTES[0].quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date1, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [quote, setQuote] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const updateStreak = useCallback(() => {
    const stored = localStorage.getItem('learningStreak')
    const today = new Date()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      
      if (isSameDay(lastVisitDate, today)) {
        // Already visited today, no change needed
        setStreakData(data)
        setQuote(getQuote(data.currentStreak))
        return
      } else if (isYesterday(lastVisitDate, today)) {
        // Visited yesterday, increment streak
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = today.toISOString()
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for milestone
        if (MILESTONES.includes(data.currentStreak)) {
          setMilestoneReached(data.currentStreak)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 4000)
        }
      } else {
        // Streak broken, reset
        data = {
          currentStreak: 1,
          lastVisit: today.toISOString(),
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today.toISOString(),
        longestStreak: 1,
        totalVisits: 1
      }
      setMilestoneReached(1)
    }
    
    localStorage.setItem('learningStreak', JSON.stringify(data))
    setStreakData(data)
    setQuote(getQuote(data.currentStreak))
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }, [])

  useEffect(() => {
    updateStreak()
  }, [updateStreak])

  if (!streakData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1]
  const progressToNextMilestone = Math.min(100, (streakData.currentStreak / nextMilestone) * 100)

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}
      
      <div className={`card p-6 transition-all duration-300 ${isAnimating ? 'scale-105' : ''} ${milestoneReached && showConfetti ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}`}>
        <div className="flex items-start gap-6">
          {/* Streak Fire Icon */}
          <div className="relative">
            <div className={`text-5xl ${streakData.currentStreak >= 7 ? 'animate-bounce-slow' : ''}`}>
              {streakData.currentStreak >= 30 ? '🔥' : streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '✨' : '🌱'}
            </div>
            {streakData.currentStreak >= 7 && (
              <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {streakData.currentStreak}
              </div>
            )}
          </div>
          
          {/* Streak Info */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-white">{streakData.currentStreak}</span>
              <span className="text-navy-400">day streak</span>
              {streakData.currentStreak === streakData.longestStreak && streakData.currentStreak > 1 && (
                <span className="badge bg-yellow-500/20 text-yellow-400 text-xs">Personal Best! 🏆</span>
              )}
            </div>
            
            <p className="text-navy-300 text-sm mb-3">{quote}</p>
            
            {/* Progress to next milestone */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Progress to {nextMilestone} days</span>
                <span>{streakData.currentStreak}/{nextMilestone}</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNextMilestone}%` }}
                />
              </div>
            </div>
            
            {/* Stats row */}
            <div className="flex gap-4 text-xs text-navy-400">
              <span>Longest: <span className="text-white font-medium">{streakData.longestStreak} days</span></span>
              <span>Total visits: <span className="text-white font-medium">{streakData.totalVisits}</span></span>
            </div>
          </div>
        </div>
        
        {/* Milestone celebration banner */}
        {milestoneReached && showConfetti && (
          <div className="mt-4 p-3 bg-gradient-to-r from-primary-500/20 to-yellow-500/20 rounded-lg border border-primary-500/30 text-center animate-pulse">
            <span className="text-2xl mr-2">🎉</span>
            <span className="text-white font-semibold">
              {milestoneReached === 1 
                ? "Welcome! Your learning journey begins!" 
                : `Amazing! You've reached a ${milestoneReached}-day streak!`}
            </span>
            <span className="text-2xl ml-2">🎉</span>
          </div>
        )}
      </div>
    </div>
  )
}