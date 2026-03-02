'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  totalVisits: number
  longestStreak: number
}

const motivationalMessages: Record<number, string> = {
  0: "Start your learning journey today! 🚀",
  1: "Great start! Keep the momentum going! 💪",
  2: "2 days strong! You're building a habit! 🌱",
  3: "3 day streak! You're on fire! 🔥",
  5: "5 days! You're unstoppable! ⚡",
  7: "A full week! Incredible dedication! 🏆",
  14: "2 weeks! You're a learning machine! 🤖",
  30: "30 days! You're a legend! 👑",
  50: "50 days! Master learner status! 🎓",
  100: "100 DAYS! You're absolutely incredible! 🌟",
}

function getMotivationalMessage(streak: number): string {
  const thresholds = Object.keys(motivationalMessages)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const threshold of thresholds) {
    if (streak >= threshold) {
      return motivationalMessages[threshold] ?? motivationalMessages[0] ?? "Keep learning!"
    }
  }
  return motivationalMessages[0] ?? "Keep learning!"
}

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '👑'
  if (streak >= 50) return '🎓'
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '⭐'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '💪'
  if (streak >= 1) return '✨'
  return '🌱'
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      lastVisitDate: '',
      totalVisits: 0,
      longestStreak: 0,
    }
    
    if (data.lastVisitDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = data.lastVisitDate === yesterday.toDateString()
      
      const previousStreak = data.currentStreak
      
      if (wasYesterday) {
        data.currentStreak += 1
      } else if (data.lastVisitDate === '') {
        data.currentStreak = 1
      } else {
        data.currentStreak = 1
      }
      
      data.lastVisitDate = today
      data.totalVisits += 1
      data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
      
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      
      // Show confetti on milestone streaks
      const milestones = [3, 7, 14, 30, 50, 100]
      if (milestones.includes(data.currentStreak) && data.currentStreak > previousStreak) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
    
    setStreakData(data)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    updateStreak()
  }, [updateStreak])

  if (!isMounted || !streakData) {
    return (
      <div className="fixed bottom-24 right-5 z-40">
        <div className="w-14 h-14 rounded-full bg-navy-800/80 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 right-5 z-40">
      <Confetti show={showConfetti} />
      
      {/* Expanded View */}
      <div
        className={`absolute bottom-0 right-0 transition-all duration-300 ease-out ${
          isExpanded 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-navy-900/95 backdrop-blur-md border border-navy-700 rounded-2xl p-5 shadow-xl min-w-[280px] mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-navy-400 hover:text-white transition-colors"
              aria-label="Close streak panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
              <span className="text-3xl">{getStreakEmoji(streakData.currentStreak)}</span>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">
                {streakData.currentStreak}
              </div>
              <div className="text-sm text-navy-400">day streak</div>
            </div>
          </div>
          
          <p className="text-primary-400 text-sm font-medium mb-4">
            {getMotivationalMessage(streakData.currentStreak)}
          </p>
          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-navy-700">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
          </div>
          
          {/* Streak Progress Bar */}
          <div className="mt-4 pt-3 border-t border-navy-700">
            <div className="flex justify-between text-xs text-navy-400 mb-2">
              <span>Next milestone</span>
              <span>
                {streakData.currentStreak < 7 ? '7 days 🔥' :
                 streakData.currentStreak < 14 ? '14 days ⭐' :
                 streakData.currentStreak < 30 ? '30 days 🏆' :
                 streakData.currentStreak < 50 ? '50 days 🎓' :
                 streakData.currentStreak < 100 ? '100 days 👑' : 'Legend! 🌟'}
              </span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, 
                    streakData.currentStreak < 7 ? (streakData.currentStreak / 7) * 100 :
                    streakData.currentStreak < 14 ? ((streakData.currentStreak - 7) / 7) * 100 :
                    streakData.currentStreak < 30 ? ((streakData.currentStreak - 14) / 16) * 100 :
                    streakData.currentStreak < 50 ? ((streakData.currentStreak - 30) / 20) * 100 :
                    streakData.currentStreak < 100 ? ((streakData.currentStreak - 50) / 50) * 100 : 100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Collapsed Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 shadow-lg hover:shadow-xl hover:border-primary-500/50 transition-all duration-300 ${
          isExpanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="View learning streak"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-primary-500/5 transition-all duration-300" />
        
        <div className="relative flex flex-col items-center">
          <span className="text-lg">{getStreakEmoji(streakData.currentStreak)}</span>
          <span className="text-xs font-bold text-white -mt-0.5">{streakData.currentStreak}</span>
        </div>
        
        {/* Pulse animation for active streaks */}
        {streakData.currentStreak >= 3 && (
          <div className="absolute inset-0 rounded-full border-2 border-primary-500/50 animate-ping opacity-20" />
        )}
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-navy-800 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {streakData.currentStreak} day streak!
        </div>
      </button>
    </div>
  )
}