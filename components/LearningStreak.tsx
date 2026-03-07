'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const motivationalQuotes = [
  { streak: 1, message: "Every journey begins with a single step. Welcome back! 🚀" },
  { streak: 3, message: "Three days strong! You're building momentum! 💪" },
  { streak: 7, message: "A full week! You're officially committed! 🔥" },
  { streak: 14, message: "Two weeks! Champions are made through consistency! 🏆" },
  { streak: 30, message: "30 days! You're unstoppable! 🌟" },
  { streak: 60, message: "60 days! You've achieved mastery mindset! 🧠" },
  { streak: 100, message: "100 DAYS! You're a learning legend! 👑" },
]

const getQuote = (streak: number): string => {
  const sortedQuotes = [...motivationalQuotes].sort((a, b) => b.streak - a.streak)
  const quote = sortedQuotes.find(q => streak >= q.streak)
  return quote?.message || "Start your learning journey today! ✨"
}

const createConfetti = () => {
  const colors = ['#29ABE2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const confettiCount = 50
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;'
  document.body.appendChild(container)

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = Math.random() * 10 + 5
    const left = Math.random() * 100
    const animationDuration = Math.random() * 3 + 2
    const delay = Math.random() * 0.5

    confetti.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      animation: confetti-fall ${animationDuration}s ease-out ${delay}s forwards;
    `
    container.appendChild(confetti)
  }

  setTimeout(() => container.remove(), 5000)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  const milestones = [1, 3, 7, 14, 30, 60, 100]

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toISOString().split('T')[0]
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffTime = Math.abs(todayDate.getTime() - lastVisitDate.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (data.lastVisit === today) {
        // Already visited today
        setStreakData(data)
        return
      } else if (diffDays === 1) {
        // Consecutive day!
        const newStreak = data.currentStreak + 1
        const wasAtMilestone = milestones.includes(data.currentStreak)
        const isAtMilestone = milestones.includes(newStreak)
        
        data = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1,
        }
        
        if (isAtMilestone && !wasAtMilestone) {
          setIsNewMilestone(true)
          setShowCelebration(true)
          createConfetti()
          setTimeout(() => setShowCelebration(false), 4000)
        }
      } else {
        // Streak broken
        data = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1,
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1,
      }
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [milestones])

  useEffect(() => {
    // Add confetti animation keyframes
    const style = document.createElement('style')
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes streak-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes celebration-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(41, 171, 226, 0.3); }
        50% { box-shadow: 0 0 40px rgba(41, 171, 226, 0.6); }
      }
    `
    document.head.appendChild(style)
    
    checkAndUpdateStreak()
    
    return () => {
      document.head.removeChild(style)
    }
  }, [checkAndUpdateStreak])

  if (!streakData) return null

  const quote = getQuote(streakData.currentStreak)
  const nextMilestone = milestones.find(m => m > streakData.currentStreak) || streakData.currentStreak + 10
  const progress = ((streakData.currentStreak % (nextMilestone - (milestones.find(m => m <= streakData.currentStreak && m < nextMilestone) || 0))) / (nextMilestone - (milestones.find(m => m <= streakData.currentStreak && m < nextMilestone) || 0))) * 100

  return (
    <div 
      className={`card p-6 relative overflow-hidden transition-all duration-500 ${
        showCelebration ? 'ring-2 ring-primary-500' : ''
      }`}
      style={{
        animation: showCelebration ? 'celebration-glow 1s ease-in-out infinite' : 'none'
      }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-green-500/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="text-4xl"
              style={{
                animation: streakData.currentStreak >= 7 ? 'streak-pulse 2s ease-in-out infinite' : 'none'
              }}
            >
              🔥
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Learning Streak</h3>
              <p className="text-navy-400 text-sm">Keep the momentum going!</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {streakData.currentStreak}
              <span className="text-lg text-navy-400 ml-1">
                {streakData.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            {streakData.longestStreak > streakData.currentStreak && (
              <p className="text-navy-500 text-xs">
                Best: {streakData.longestStreak} days
              </p>
            )}
          </div>
        </div>

        {/* Progress to next milestone */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Progress to {nextMilestone} day streak</span>
            <span>{streakData.currentStreak}/{nextMilestone}</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((streakData.currentStreak / nextMilestone) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Motivational quote */}
        <div className={`p-3 bg-navy-800/50 rounded-lg border border-navy-700 transition-all duration-500 ${
          showCelebration && isNewMilestone ? 'border-primary-500 bg-primary-500/10' : ''
        }`}>
          <p className="text-sm text-navy-200 italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {/* Stats row */}
        <div className="flex justify-between mt-4 pt-4 border-t border-navy-800">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {milestones.filter(m => streakData.currentStreak >= m).length}
            </div>
            <div className="text-xs text-navy-400">Milestones</div>
          </div>
        </div>

        {/* Celebration message */}
        {showCelebration && isNewMilestone && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm rounded-2xl z-20">
            <div className="text-center p-6 animate-bounce">
              <div className="text-6xl mb-2">🎉</div>
              <h4 className="text-xl font-bold text-white mb-1">Milestone Achieved!</h4>
              <p className="text-primary-400">{streakData.currentStreak} Day Streak!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}