'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string | null
  totalVisits: number
  lessonsViewed: number
  coursesStarted: string[]
}

const STORAGE_KEY = 'learnhub-streak-data'

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: null,
      totalVisits: 0,
      lessonsViewed: 0,
      coursesStarted: [],
    }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: null,
      totalVisits: 0,
      lessonsViewed: 0,
      coursesStarted: [],
    }
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: null,
      totalVisits: 0,
      lessonsViewed: 0,
      coursesStarted: [],
    }
  }
}

function updateStreak(): StreakData {
  const data = getStreakData()
  const today = new Date().toDateString()
  
  if (data.lastVisit === today) {
    // Already visited today
    return data
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toDateString()
  
  let newStreak = 1
  if (data.lastVisit === yesterdayString) {
    // Continuing streak
    newStreak = data.currentStreak + 1
  }
  
  const newData: StreakData = {
    ...data,
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    lastVisit: today,
    totalVisits: data.totalVisits + 1,
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  return newData
}

export default function LearningStreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  
  useEffect(() => {
    const oldData = getStreakData()
    const newData = updateStreak()
    setStreakData(newData)
    
    // Check if streak increased
    if (newData.currentStreak > oldData.currentStreak && newData.currentStreak > 1) {
      setIsNewStreak(true)
      if (newData.currentStreak % 5 === 0 || newData.currentStreak === 3) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
  }, [])
  
  if (!streakData) return null
  
  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '🌟'
    return '✨'
  }
  
  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Learning Legend!'
    if (streak >= 14) return 'On Fire!'
    if (streak >= 7) return 'Week Warrior!'
    if (streak >= 3) return 'Building Momentum!'
    if (streak >= 1) return 'Keep Going!'
    return 'Start Your Journey!'
  }
  
  const getMotivationalQuote = () => {
    const quotes = [
      "Every expert was once a beginner.",
      "Small steps lead to big achievements.",
      "Learning is a superpower.",
      "Your future self will thank you.",
      "Consistency beats intensity.",
      "Progress, not perfection.",
    ]
    const index = streakData.totalVisits % quotes.length
    return quotes[index]
  }
  
  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="animate-bounce text-6xl">
            {getStreakEmoji(streakData.currentStreak)}
          </div>
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899'][i % 4],
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Streak Card */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl shadow-xl shadow-primary-500/25 text-white overflow-hidden transition-all duration-300 hover:shadow-primary-500/40 ${
            isNewStreak ? 'animate-pulse-once' : ''
          }`}
        >
          <div className="p-4 flex items-center gap-3">
            <div className="text-3xl">
              {getStreakEmoji(streakData.currentStreak)}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{streakData.currentStreak}</span>
                <span className="text-sm opacity-90">day streak</span>
              </div>
              <div className="text-xs opacity-75">{getStreakMessage(streakData.currentStreak)}</div>
            </div>
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
          
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4 animate-slideDown">
              <div className="h-px bg-white/20" />
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{streakData.longestStreak}</div>
                  <div className="text-xs opacity-75">Best Streak</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{streakData.totalVisits}</div>
                  <div className="text-xs opacity-75">Total Visits</div>
                </div>
              </div>
              
              {/* Progress to next milestone */}
              {streakData.currentStreak > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Next milestone</span>
                    <span>{getNextMilestone(streakData.currentStreak)} days</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ 
                        width: `${getProgressToNextMilestone(streakData.currentStreak)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Motivational Quote */}
              <div className="text-center text-sm italic opacity-75 px-2">
                &ldquo;{getMotivationalQuote()}&rdquo;
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 100, 365]
  for (const m of milestones) {
    if (current < m) return m
  }
  return Math.ceil(current / 100) * 100 + 100
}

function getProgressToNextMilestone(current: number): number {
  const next = getNextMilestone(current)
  const prev = getPrevMilestone(current)
  const range = next - prev
  const progress = current - prev
  return (progress / range) * 100
}

function getPrevMilestone(current: number): number {
  const milestones = [0, 3, 7, 14, 21, 30, 60, 90, 100]
  let prev = 0
  for (const m of milestones) {
    if (current >= m) prev = m
    else break
  }
  return prev
}