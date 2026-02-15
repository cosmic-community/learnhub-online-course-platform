'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const STREAK_STORAGE_KEY = 'learnhub_streak_data'

const milestones = [3, 7, 14, 30, 60, 100]

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '🏆'
  if (streak >= 60) return '💎'
  if (streak >= 30) return '🌟'
  if (streak >= 14) return '🔥'
  if (streak >= 7) return '⚡'
  if (streak >= 3) return '✨'
  return '🌱'
}

function getStreakMessage(streak: number): string {
  if (streak >= 100) return "Legendary learner! You're unstoppable!"
  if (streak >= 60) return "Diamond status! Your dedication is inspiring!"
  if (streak >= 30) return "Amazing! A whole month of learning!"
  if (streak >= 14) return "Two weeks strong! Keep the momentum!"
  if (streak >= 7) return "One week streak! You're on fire!"
  if (streak >= 3) return "Great start! Keep it going!"
  if (streak >= 1) return "Welcome back! Let's learn something new!"
  return "Start your learning journey today!"
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  if (hour < 21) return "Good evening"
  return "Happy late night learning"
}

function createConfetti() {
  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
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
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(STREAK_STORAGE_KEY)
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just load data
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = today
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for milestone celebration
        if (milestones.includes(data.currentStreak)) {
          setShowCelebration(true)
          setCelebrationMessage(`🎉 ${data.currentStreak} day streak! ${getStreakMessage(data.currentStreak)}`)
          createConfetti()
          setTimeout(() => setShowCelebration(false), 5000)
        }
      } else {
        // Streak broken, reset
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = today
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1
      }
    }
    
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  useEffect(() => {
    // Add confetti animation styles
    const style = document.createElement('style')
    style.textContent = `
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
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes celebration-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!streakData) return null

  const nextMilestone = milestones.find(m => m > streakData.currentStreak) || 100
  const progressToNext = ((streakData.currentStreak % (nextMilestone - (milestones[milestones.indexOf(nextMilestone) - 1] || 0))) / (nextMilestone - (milestones[milestones.indexOf(nextMilestone) - 1] || 0))) * 100

  return (
    <>
      {/* Celebration Banner */}
      {showCelebration && (
        <div 
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl"
          style={{ animation: 'celebration-bounce 0.5s ease-in-out infinite' }}
        >
          <p className="text-lg font-bold text-center">{celebrationMessage}</p>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 right-4 z-40 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-auto'}`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-xl hover:border-primary-500/50 transition-all duration-300 overflow-hidden"
          style={{ animation: streakData.currentStreak >= 3 ? 'streak-pulse 2s ease-in-out infinite' : 'none' }}
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getStreakEmoji(streakData.currentStreak)}</div>
              <div className="text-left flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
                  <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
                </div>
                {!isExpanded && (
                  <p className="text-xs text-navy-500">Click to expand</p>
                )}
              </div>
              <div className="text-2xl">🔥</div>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-navy-700 space-y-3">
                <p className="text-sm text-primary-400 font-medium">
                  {getTimeOfDayGreeting()}! {getStreakMessage(streakData.currentStreak)}
                </p>
                
                {/* Progress to next milestone */}
                <div>
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Next milestone: {nextMilestone} days</span>
                    <span>{nextMilestone - streakData.currentStreak} to go</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressToNext, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-navy-800/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-white">{streakData.totalVisits}</div>
                    <div className="text-xs text-navy-400">Total Visits</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
                    <div className="text-xs text-navy-400">Best Streak</div>
                  </div>
                </div>

                <p className="text-xs text-navy-500 text-center">
                  Come back tomorrow to keep your streak! 🎯
                </p>
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  )
}