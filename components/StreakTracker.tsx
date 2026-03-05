'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
}

const MILESTONES = [7, 14, 30, 50, 100, 365]

const MOTIVATIONAL_MESSAGES: Record<number, string> = {
  1: "Great start! 🌱",
  7: "One week strong! 🔥",
  14: "Two weeks! You're on fire! 💪",
  30: "One month! Incredible! 🏆",
  50: "50 days! You're unstoppable! ⭐",
  100: "100 days! Legendary! 👑",
  365: "One year! You're a master! 🎓",
}

function getMotivationalMessage(streak: number): string {
  if (streak >= 365) return MOTIVATIONAL_MESSAGES[365]
  if (streak >= 100) return MOTIVATIONAL_MESSAGES[100]
  if (streak >= 50) return MOTIVATIONAL_MESSAGES[50]
  if (streak >= 30) return MOTIVATIONAL_MESSAGES[30]
  if (streak >= 14) return MOTIVATIONAL_MESSAGES[14]
  if (streak >= 7) return MOTIVATIONAL_MESSAGES[7]
  if (streak >= 1) return MOTIVATIONAL_MESSAGES[1]
  return "Start your streak today! 🚀"
}

function createConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

export default function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [mounted, setMounted] = useState(false)

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const storedData = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = storedData 
      ? JSON.parse(storedData) 
      : {
          currentStreak: 0,
          longestStreak: 0,
          lastVisitDate: '',
          totalDaysLearned: 0
        }
    
    if (data.lastVisitDate === today) {
      setStreakData(data)
      return
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    const previousStreak = data.currentStreak
    
    if (data.lastVisitDate === yesterdayStr) {
      data.currentStreak += 1
    } else if (data.lastVisitDate === '') {
      data.currentStreak = 1
    } else {
      data.currentStreak = 1
    }
    
    data.totalDaysLearned += 1
    data.lastVisitDate = today
    
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    
    // Check for milestone
    const hitMilestone = MILESTONES.find(m => 
      data.currentStreak === m && previousStreak < m
    )
    
    if (hitMilestone) {
      setIsNewMilestone(true)
      createConfetti()
      setTimeout(() => setIsNewMilestone(false), 3000)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    updateStreak()
  }, [updateStreak])

  if (!mounted || !streakData) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 rounded-full">
        <span className="text-lg">🔥</span>
        <span className="text-sm font-medium text-navy-300">--</span>
      </div>
    )
  }

  const progress = Math.min((streakData.currentStreak % 7) / 7, 1)
  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - progress * circumference

  return (
    <>
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes streak-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.4);
          }
        }
        
        .streak-milestone {
          animation: streak-pulse 0.5s ease-in-out, glow 1s ease-in-out infinite;
        }
      `}</style>
      
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button 
          className={`flex items-center gap-2 px-3 py-1.5 bg-navy-800/50 hover:bg-navy-700/50 rounded-full transition-all duration-300 border border-navy-700/50 ${
            isNewMilestone ? 'streak-milestone' : ''
          }`}
          aria-label={`Learning streak: ${streakData.currentStreak} days`}
        >
          {/* Progress Ring */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 40 40">
              {/* Background circle */}
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-navy-700"
              />
              {/* Progress circle */}
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="url(#streak-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="streak-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            {/* Fire icon in center */}
            <span className="absolute inset-0 flex items-center justify-center text-sm">
              🔥
            </span>
          </div>
          
          {/* Streak count */}
          <span className="text-sm font-bold text-white">
            {streakData.currentStreak}
          </span>
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-navy-900 border border-navy-700 rounded-xl shadow-xl z-50 animate-fade-in">
            <div className="text-center mb-3">
              <div className="text-3xl mb-1">
                {streakData.currentStreak >= 100 ? '👑' : 
                 streakData.currentStreak >= 30 ? '🏆' : 
                 streakData.currentStreak >= 7 ? '🔥' : '🌱'}
              </div>
              <h3 className="text-lg font-bold text-white">
                {streakData.currentStreak} Day Streak!
              </h3>
              <p className="text-sm text-primary-400">
                {getMotivationalMessage(streakData.currentStreak)}
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-navy-300">
                <span>Longest streak</span>
                <span className="text-white font-medium">{streakData.longestStreak} days</span>
              </div>
              <div className="flex justify-between text-navy-300">
                <span>Total days learned</span>
                <span className="text-white font-medium">{streakData.totalDaysLearned} days</span>
              </div>
            </div>
            
            {/* Next milestone progress */}
            <div className="mt-3 pt-3 border-t border-navy-700">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Next milestone</span>
                <span>
                  {MILESTONES.find(m => m > streakData.currentStreak) || 'Max!'} days
                </span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(
                      (streakData.currentStreak / (MILESTONES.find(m => m > streakData.currentStreak) || streakData.currentStreak)) * 100,
                      100
                    )}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}