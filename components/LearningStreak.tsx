'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalDaysLearning: number
}

const motivationalMessages = [
  // Day 1
  { min: 1, max: 1, messages: [
    "🌱 Welcome! Your learning journey begins today!",
    "🎯 Day 1 is always special. Let's make it count!",
    "✨ Every expert was once a beginner. You've started!"
  ]},
  // Days 2-6
  { min: 2, max: 6, messages: [
    "🔥 You're building momentum! Keep it up!",
    "💪 Consistency is key, and you're nailing it!",
    "🚀 Look at you go! Another day of learning!",
    "⭐ Small steps lead to big achievements!"
  ]},
  // Week 1 (Day 7)
  { min: 7, max: 7, messages: [
    "🎉 ONE WEEK STREAK! You're officially amazing!",
    "🏆 7 days strong! You're in the top 10% of learners!",
    "🌟 A whole week! That's dedication right there!"
  ]},
  // Days 8-13
  { min: 8, max: 13, messages: [
    "💎 Over a week! You're becoming unstoppable!",
    "🎯 The habit is forming. Science says 2 more weeks!",
    "🔥 Your future self will thank you for this!"
  ]},
  // Week 2 (Day 14)
  { min: 14, max: 14, messages: [
    "🎊 TWO WEEKS! You're a learning machine!",
    "🏅 14 days! Habits are being forged!",
    "⚡ Two weeks strong! Nothing can stop you now!"
  ]},
  // Days 15-29
  { min: 15, max: 29, messages: [
    "🌈 Halfway to a month! Incredible persistence!",
    "💪 You're in the elite learner club now!",
    "🚀 Your dedication is truly inspiring!"
  ]},
  // Month 1 (Day 30)
  { min: 30, max: 30, messages: [
    "🎆 ONE MONTH! You're officially legendary!",
    "👑 30 days! Crown yourself the learning champion!",
    "🌟 A FULL MONTH! You've mastered consistency!"
  ]},
  // Beyond
  { min: 31, max: Infinity, messages: [
    "🏆 You're an absolute legend! Keep inspiring us!",
    "💎 Your commitment is off the charts!",
    "🔥 You're proof that greatness comes from showing up!",
    "⭐ You're writing your own success story!"
  ]}
]

const milestones = [7, 14, 21, 30, 50, 100, 365]

function getMotivationalMessage(streak: number): string {
  const category = motivationalMessages.find(
    cat => streak >= cat.min && streak <= cat.max
  )
  if (!category) return "Keep learning! 📚"
  const messages = category.messages
  return messages[Math.floor(Math.random() * messages.length)]
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
  const [message, setMessage] = useState<string>('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [mounted, setMounted] = useState(false)

  const createConfetti = useCallback(() => {
    const container = document.getElementById('confetti-container')
    if (!container) return

    const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa']
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
        opacity: 1;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        transform: rotate(${Math.random() * 360}deg);
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        z-index: 9999;
        pointer-events: none;
      `
      container.appendChild(confetti)

      setTimeout(() => {
        confetti.remove()
      }, 5000)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    
    const stored = localStorage.getItem('learningStreak')
    const today = new Date()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      
      if (isSameDay(lastVisitDate, today)) {
        // Same day visit - no changes needed
      } else if (isYesterday(lastVisitDate, today)) {
        // Consecutive day - increase streak!
        const newStreak = data.currentStreak + 1
        data = {
          ...data,
          currentStreak: newStreak,
          lastVisit: today.toISOString(),
          totalDaysLearning: data.totalDaysLearning + 1,
          longestStreak: Math.max(data.longestStreak, newStreak)
        }
        
        // Check for milestone
        if (milestones.includes(newStreak)) {
          setIsNewMilestone(true)
          setShowConfetti(true)
        }
      } else {
        // Streak broken - reset
        data = {
          currentStreak: 1,
          lastVisit: today.toISOString(),
          totalDaysLearning: data.totalDaysLearning + 1,
          longestStreak: data.longestStreak
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today.toISOString(),
        totalDaysLearning: 1,
        longestStreak: 1
      }
    }
    
    localStorage.setItem('learningStreak', JSON.stringify(data))
    setStreakData(data)
    setMessage(getMotivationalMessage(data.currentStreak))
  }, [])

  useEffect(() => {
    if (showConfetti) {
      createConfetti()
      const timer = setTimeout(() => {
        setShowConfetti(false)
        setIsNewMilestone(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti, createConfetti])

  if (!mounted || !streakData) {
    return null
  }

  return (
    <>
      {/* Confetti container */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />
      
      {/* Confetti animation styles */}
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
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(20, 184, 166, 0.6);
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .streak-card {
          animation: bounce-in 0.5s ease-out;
        }
        
        .milestone-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Streak display card */}
      <div className={`streak-card relative overflow-hidden rounded-2xl p-6 ${isNewMilestone ? 'milestone-glow' : ''}`}
           style={{
             background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
             border: '1px solid rgba(20, 184, 166, 0.3)'
           }}>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-center gap-6">
          {/* Streak flame icon */}
          <div className="flex-shrink-0">
            <div className="relative">
              <span className="text-5xl" role="img" aria-label="streak fire">
                {streakData.currentStreak >= 30 ? '👑' : 
                 streakData.currentStreak >= 14 ? '🔥' : 
                 streakData.currentStreak >= 7 ? '⚡' : '🔥'}
              </span>
              {isNewMilestone && (
                <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</span>
              )}
            </div>
          </div>
          
          {/* Streak info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-white">
                {streakData.currentStreak}
              </span>
              <span className="text-lg text-navy-300">
                day{streakData.currentStreak !== 1 ? 's' : ''} streak
              </span>
            </div>
            
            <p className="text-primary-300 text-sm mb-2 truncate">
              {message}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-navy-400">
              <span className="flex items-center gap-1">
                <span>🏆</span> Best: {streakData.longestStreak} days
              </span>
              <span className="flex items-center gap-1">
                <span>📚</span> Total: {streakData.totalDaysLearning} days
              </span>
            </div>
          </div>
          
          {/* Progress to next milestone */}
          <div className="hidden sm:block flex-shrink-0 text-right">
            {(() => {
              const nextMilestone = milestones.find(m => m > streakData.currentStreak)
              if (!nextMilestone) return (
                <div className="text-primary-400 text-sm">
                  <span className="text-2xl">🌟</span>
                  <div>Legend!</div>
                </div>
              )
              const daysToGo = nextMilestone - streakData.currentStreak
              const progress = (streakData.currentStreak / nextMilestone) * 100
              return (
                <div>
                  <div className="text-navy-400 text-xs mb-1">
                    {daysToGo} day{daysToGo !== 1 ? 's' : ''} to {nextMilestone}-day badge
                  </div>
                  <div className="w-24 h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </>
  )
}