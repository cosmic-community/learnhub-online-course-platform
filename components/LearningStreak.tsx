'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalLessonsViewed: number
  dailyGoal: number
  lessonsToday: number
  todayDate: string
  milestonesCelebrated: number[]
}

const MILESTONES = [3, 7, 14, 30, 50, 100, 365]

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisitDate: '',
  totalLessonsViewed: 0,
  dailyGoal: 3,
  lessonsToday: 0,
  todayDate: '',
  milestonesCelebrated: [],
}

function createConfetti(): void {
  const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
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
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

// Add confetti animation styles
function addConfettiStyles(): void {
  if (document.getElementById('confetti-styles')) return
  
  const style = document.createElement('style')
  style.id = 'confetti-styles'
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
    @keyframes pulse-ring {
      0% {
        transform: scale(0.95);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(0.95);
      }
    }
    @keyframes flame-flicker {
      0%, 100% {
        transform: scale(1) rotate(-2deg);
      }
      50% {
        transform: scale(1.1) rotate(2deg);
      }
    }
  `
  document.head.appendChild(style)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')

  const getToday = (): string => {
    return new Date().toISOString().split('T')[0]
  }

  const checkMilestone = useCallback((streak: number, celebratedMilestones: number[]): { isMilestone: boolean; milestone: number } => {
    for (const milestone of MILESTONES) {
      if (streak === milestone && !celebratedMilestones.includes(milestone)) {
        return { isMilestone: true, milestone }
      }
    }
    return { isMilestone: false, milestone: 0 }
  }, [])

  const triggerCelebration = useCallback((milestone: number) => {
    addConfettiStyles()
    createConfetti()
    
    const messages: Record<number, string> = {
      3: '🔥 3 Day Streak! You\'re on fire!',
      7: '🌟 1 Week Streak! Incredible dedication!',
      14: '💪 2 Week Streak! Unstoppable!',
      30: '🏆 1 Month Streak! You\'re a champion!',
      50: '🚀 50 Day Streak! Legendary learner!',
      100: '👑 100 Day Streak! You\'re a master!',
      365: '🎉 1 YEAR STREAK! Absolutely incredible!',
    }
    
    setCelebrationMessage(messages[milestone] || `🎉 ${milestone} Day Streak!`)
    setShowCelebration(true)
    
    setTimeout(() => {
      setShowCelebration(false)
    }, 4000)
  }, [])

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = getToday()
    
    if (stored) {
      const parsed: StreakData = JSON.parse(stored)
      const lastVisit = new Date(parsed.lastVisitDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisit.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      let newStreak = parsed.currentStreak
      let lessonsToday = parsed.lessonsToday
      
      if (diffDays === 0) {
        // Same day - keep current data
        lessonsToday = parsed.lessonsToday
      } else if (diffDays === 1) {
        // Consecutive day - increment streak!
        newStreak = parsed.currentStreak + 1
        lessonsToday = 0
        
        // Check for milestone
        const { isMilestone, milestone } = checkMilestone(newStreak, parsed.milestonesCelebrated)
        if (isMilestone) {
          setTimeout(() => triggerCelebration(milestone), 500)
          parsed.milestonesCelebrated = [...parsed.milestonesCelebrated, milestone]
        }
      } else {
        // Streak broken
        newStreak = 1
        lessonsToday = 0
      }
      
      const updatedData: StreakData = {
        ...parsed,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, parsed.longestStreak),
        lastVisitDate: today,
        lessonsToday,
        todayDate: today,
      }
      
      setStreakData(updatedData)
      localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
    } else {
      // First visit - start streak!
      const newData: StreakData = {
        ...DEFAULT_STREAK_DATA,
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        todayDate: today,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    }
    
    setIsLoaded(true)
  }, [checkMilestone, triggerCelebration])

  // Progress ring calculation
  const progress = Math.min((streakData.lessonsToday / streakData.dailyGoal) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  if (!isLoaded) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-br from-navy-800 to-navy-900 border border-primary-500/50 rounded-3xl p-8 text-center transform scale-100 animate-bounce"
            style={{ animation: 'pulse-ring 0.5s ease-in-out infinite' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">{celebrationMessage}</h2>
            <p className="text-navy-300">Keep up the amazing work!</p>
          </div>
        </div>
      )}

      {/* Streak Card */}
      <div className="card p-6 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-orange-500/5 animate-pulse" style={{ animationDuration: '4s' }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span 
                className="text-2xl" 
                style={{ 
                  animation: streakData.currentStreak >= 3 ? 'flame-flicker 0.5s ease-in-out infinite' : 'none' 
                }}
              >
                🔥
              </span>
              Learning Streak
            </h3>
            <span className="text-sm text-navy-400">Best: {streakData.longestStreak} days</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Progress Ring */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-navy-800"
                />
                {/* Progress ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#00ff88" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-xs text-navy-400">days</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-navy-400">Today&apos;s Progress</span>
                  <span className="text-white font-medium">
                    {streakData.lessonsToday}/{streakData.dailyGoal} lessons
                  </span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-navy-400">Total Lessons</span>
                  <p className="text-white font-semibold">{streakData.totalLessonsViewed}</p>
                </div>
                <div>
                  <span className="text-navy-400">Daily Goal</span>
                  <p className="text-white font-semibold">{streakData.dailyGoal} lessons</p>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational message */}
          <div className="mt-4 pt-4 border-t border-navy-800">
            <p className="text-sm text-center">
              {progress >= 100 ? (
                <span className="text-green-400">🎯 Daily goal complete! Amazing work!</span>
              ) : streakData.currentStreak >= 7 ? (
                <span className="text-primary-400">🌟 You&apos;re on a roll! {7 - (streakData.currentStreak % 7)} days until next milestone!</span>
              ) : streakData.currentStreak >= 3 ? (
                <span className="text-orange-400">🔥 Great streak! Keep the momentum going!</span>
              ) : (
                <span className="text-navy-300">📚 Complete {streakData.dailyGoal - streakData.lessonsToday} more lessons to hit your daily goal!</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Export a function to increment lessons from other components
export function incrementLessonCount(): void {
  const stored = localStorage.getItem('learnhub-streak')
  if (!stored) return
  
  const data: StreakData = JSON.parse(stored)
  const today = new Date().toISOString().split('T')[0]
  
  // Only increment if it's the same day
  if (data.todayDate === today) {
    data.lessonsToday += 1
    data.totalLessonsViewed += 1
  } else {
    // New day
    data.lessonsToday = 1
    data.totalLessonsViewed += 1
    data.todayDate = today
  }
  
  localStorage.setItem('learnhub-streak', JSON.stringify(data))
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('streak-updated', { detail: data }))
}