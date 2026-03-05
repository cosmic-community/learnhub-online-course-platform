'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const triggerConfetti = useCallback(() => {
    const colors = ['#29ABE2', '#FACC15', '#22C55E', '#EC4899', '#8B5CF6']
    const confettiCount = 50
    
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
        z-index: 9999;
        pointer-events: none;
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      `
      document.body.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 5000)
    }
  }, [])

  useEffect(() => {
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
        setIsVisible(true)
      } else if (lastVisitDate === yesterdayString) {
        // Streak continues!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: Math.max(data.longestStreak, newStreak)
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsVisible(true)
        
        // Check for milestone
        if (STREAK_MILESTONES.includes(newStreak)) {
          setMilestone(newStreak)
          setShowCelebration(true)
          triggerConfetti()
        }
      } else {
        // Streak broken, start new
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsVisible(true)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsVisible(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [triggerConfetti])

  const closeCelebration = () => {
    setShowCelebration(false)
    setMilestone(null)
  }

  if (!isVisible || !streakData) return null

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '🌟'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = (streak: number): string => {
    if (streak >= 100) return "Legendary learner! You're unstoppable!"
    if (streak >= 50) return "Incredible dedication! Keep shining!"
    if (streak >= 30) return "A whole month! You're on fire!"
    if (streak >= 14) return "Two weeks strong! Amazing!"
    if (streak >= 7) return "One week streak! Fantastic!"
    if (streak >= 3) return "Building momentum! Keep it up!"
    if (streak === 1) return "Welcome back! Start your streak!"
    return "Great start! Come back tomorrow!"
  }

  const nextMilestone = STREAK_MILESTONES.find(m => m > streakData.currentStreak) || null

  return (
    <>
      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce-subtle">{getStreakEmoji(streakData.currentStreak)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      {streakData.currentStreak} day streak
                    </span>
                    {streakData.currentStreak >= 7 && (
                      <span className="text-xs bg-primary-500/30 text-primary-300 px-2 py-0.5 rounded-full">
                        🔥 On fire!
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-navy-300">{getMotivationalMessage(streakData.currentStreak)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              {nextMilestone && (
                <div className="hidden sm:flex items-center gap-2 text-navy-300">
                  <span>Next milestone:</span>
                  <span className="font-semibold text-primary-400">{nextMilestone} days</span>
                  <div className="w-24 h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                      style={{ width: `${(streakData.currentStreak / nextMilestone) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 text-navy-400">
                <span title="Total visits">
                  👤 {streakData.totalVisits} visits
                </span>
                <span title="Longest streak" className="hidden sm:inline">
                  🏅 Best: {streakData.longestStreak}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && milestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-primary-500/30 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl shadow-primary-500/20 animate-scale-in">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {milestone} Day Streak!
            </h2>
            <p className="text-navy-300 mb-6">
              Incredible! You've been learning for {milestone} days in a row. 
              Your dedication is paying off!
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  ⭐
                </span>
              ))}
            </div>
            <button
              onClick={closeCelebration}
              className="btn-primary"
            >
              Keep Learning! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Add confetti keyframes to page */}
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
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}