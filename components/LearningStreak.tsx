'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES: Record<number, string[]> = {
  0: ["🚀 Start your learning journey today!", "Ready to begin? Let's go!"],
  1: ["🌱 Great start! Day 1 complete!", "You've taken the first step!"],
  2: ["🔥 2 days strong! Keep it up!", "Building momentum!"],
  3: ["⭐ 3-day streak! You're on fire!", "Consistency is key!"],
  5: ["💪 5 days! You're unstoppable!", "Half way to legendary!"],
  7: ["🏆 One week streak! Amazing!", "You're a dedicated learner!"],
  14: ["👑 Two weeks! You're crushing it!", "Learning machine activated!"],
  30: ["🎯 30 days! You're a legend!", "Master learner status!"],
  60: ["💎 60 days! Incredible dedication!", "You inspire others!"],
  100: ["🌟 100 DAYS! LEGENDARY STATUS!", "You're absolutely amazing!"],
}

const MILESTONE_STREAKS = [3, 5, 7, 14, 30, 60, 100]

function createConfetti() {
  const colors = ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
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
      
      setTimeout(() => confetti.remove(), 5000)
    }, i * 10)
  }
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const getMessage = useCallback((streak: number): string => {
    const thresholds = Object.keys(MOTIVATIONAL_MESSAGES)
      .map(Number)
      .sort((a, b) => b - a)
    
    for (const threshold of thresholds) {
      if (streak >= threshold) {
        const messages = MOTIVATIONAL_MESSAGES[threshold]
        return messages[Math.floor(Math.random() * messages.length)]
      }
    }
    return MOTIVATIONAL_MESSAGES[0][0]
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = {
      currentStreak: 0,
      lastVisit: '',
      longestStreak: 0,
      totalVisits: 0
    }

    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))

      if (data.lastVisit === today) {
        // Already visited today
        setStreakData(data)
        return
      } else if (diffDays === 1) {
        // Consecutive day - increment streak
        data.currentStreak += 1
        data.totalVisits += 1
        
        // Check for milestone celebration
        if (MILESTONE_STREAKS.includes(data.currentStreak)) {
          setShowCelebration(true)
          createConfetti()
          setTimeout(() => setShowCelebration(false), 4000)
        }
      } else if (diffDays > 1) {
        // Streak broken
        data.currentStreak = 1
        data.totalVisits += 1
      } else {
        // Same day or edge case
        data.totalVisits += 1
      }
    } else {
      // First visit ever
      data.currentStreak = 1
      data.totalVisits = 1
    }

    data.lastVisit = today
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!streakData) return null

  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : 
                      streakData.currentStreak >= 3 ? '⭐' : 
                      streakData.currentStreak >= 1 ? '🌱' : '🚀'

  const progressToNextMilestone = () => {
    const nextMilestone = MILESTONE_STREAKS.find(m => m > streakData.currentStreak) || 100
    const prevMilestone = [...MILESTONE_STREAKS].reverse().find(m => m <= streakData.currentStreak) || 0
    const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    return { progress: Math.min(progress, 100), nextMilestone }
  }

  const { progress, nextMilestone } = progressToNextMilestone()

  return (
    <>
      {/* Confetti CSS */}
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
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes celebration-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(124, 58, 237, 0.4); }
        }
      `}</style>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div 
            className="bg-gradient-to-br from-primary-500/90 to-purple-600/90 backdrop-blur-lg rounded-3xl p-8 text-center transform"
            style={{ animation: 'celebration-glow 1s ease-in-out infinite' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {streakData.currentStreak} Day Streak!
            </h2>
            <p className="text-white/90 text-lg">You&apos;re on fire! Keep learning!</p>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`card cursor-pointer transition-all duration-300 ${
          isExpanded ? 'p-6' : 'p-4'
        } ${showCelebration ? 'ring-2 ring-primary-400' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={streakData.currentStreak >= 7 ? { animation: 'streak-pulse 2s ease-in-out infinite' } : {}}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{streakEmoji}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-navy-400 text-sm">day streak</span>
              </div>
              <p className="text-sm text-primary-400">{getMessage(streakData.currentStreak)}</p>
            </div>
          </div>
          <div className="text-navy-500">
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Stats */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-navy-700 space-y-4">
            {/* Progress to next milestone */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-navy-400">Next milestone: {nextMilestone} days</span>
                <span className="text-primary-400">{nextMilestone - streakData.currentStreak} to go</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-navy-800/50 rounded-lg p-3">
                <div className="text-xl font-bold text-white">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3">
                <div className="text-xl font-bold text-primary-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-400">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
            </div>

            {/* Milestone badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              {MILESTONE_STREAKS.map(milestone => (
                <div 
                  key={milestone}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    streakData.longestStreak >= milestone 
                      ? 'bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/50' 
                      : 'bg-navy-800/50 text-navy-500'
                  }`}
                >
                  {milestone}🔥
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}