'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  longestStreak: number
  totalVisits: number
}

const MILESTONES = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newMilestone, setNewMilestone] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const createConfetti = useCallback(() => {
    const container = document.getElementById('confetti-container')
    if (!container) return

    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${Math.random() * 2 + 2}s ease-out forwards;
        animation-delay: ${Math.random() * 0.5}s;
        transform: rotate(${Math.random() * 360}deg);
      `
      container.appendChild(confetti)
      
      setTimeout(() => confetti.remove(), 4000)
    }
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learning-streak')
    
    let data: StreakData = stored 
      ? JSON.parse(stored)
      : { currentStreak: 0, lastVisitDate: '', longestStreak: 0, totalVisits: 0 }

    const lastVisit = data.lastVisitDate ? new Date(data.lastVisitDate) : null
    const todayDate = new Date(today)
    
    if (data.lastVisitDate !== today) {
      data.totalVisits += 1
      
      if (lastVisit) {
        const diffTime = todayDate.getTime() - lastVisit.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increment streak
          data.currentStreak += 1
        } else if (diffDays > 1) {
          // Streak broken - reset
          data.currentStreak = 1
        }
      } else {
        // First visit
        data.currentStreak = 1
      }
      
      data.lastVisitDate = today
      
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      // Check for milestone
      const hitMilestone = MILESTONES.find(m => m === data.currentStreak)
      if (hitMilestone) {
        setNewMilestone(hitMilestone)
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          setNewMilestone(null)
        }, 4000)
      }
      
      localStorage.setItem('learning-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [])

  useEffect(() => {
    if (showCelebration) {
      createConfetti()
    }
  }, [showCelebration, createConfetti])

  if (!streakData) return null

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 365) return '🏆'
    if (streak >= 100) return '👑'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '🌟'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = (streak: number): string => {
    if (streak >= 365) return "Legendary! A whole year of learning!"
    if (streak >= 100) return "Incredible dedication! You're unstoppable!"
    if (streak >= 50) return "50 days! You're a learning machine!"
    if (streak >= 30) return "30 day milestone! Amazing commitment!"
    if (streak >= 14) return "Two weeks strong! Keep it up!"
    if (streak >= 7) return "One week streak! You're on fire!"
    if (streak >= 3) return "3 days in a row! Building momentum!"
    if (streak >= 1) return "Great start! Come back tomorrow!"
    return "Start your learning journey today!"
  }

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || 365
  const progressToNext = streakData.currentStreak > 0 
    ? Math.min((streakData.currentStreak / nextMilestone) * 100, 100)
    : 0

  return (
    <>
      {/* Confetti Container */}
      <div 
        id="confetti-container" 
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        aria-hidden="true"
      />
      
      {/* Celebration Overlay */}
      {showCelebration && newMilestone && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-navy-900/95 backdrop-blur-sm border border-primary-500/50 rounded-2xl p-8 text-center animate-bounce-in shadow-2xl shadow-primary-500/20">
            <div className="text-6xl mb-4">{getStreakEmoji(newMilestone)}</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {newMilestone} Day Streak!
            </h3>
            <p className="text-primary-400 font-medium">
              {getMotivationalMessage(newMilestone)}
            </p>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center gap-3 bg-gradient-to-r from-primary-500/20 to-cyan-500/20 hover:from-primary-500/30 hover:to-cyan-500/30 border border-primary-500/30 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/10"
          aria-label={`Learning streak: ${streakData.currentStreak} days`}
        >
          <div className="relative">
            <span className="text-2xl animate-pulse-slow">{getStreakEmoji(streakData.currentStreak)}</span>
            {streakData.currentStreak > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {streakData.currentStreak > 99 ? '99+' : streakData.currentStreak}
              </span>
            )}
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">
              {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''} Streak
            </div>
            <div className="text-navy-400 text-xs">
              {streakData.currentStreak > 0 ? 'Keep learning!' : 'Start today!'}
            </div>
          </div>
          <svg 
            className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-navy-900 border border-navy-700 rounded-xl p-4 shadow-xl z-30 animate-fade-in-up">
            <div className="space-y-4">
              {/* Progress to next milestone */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-navy-400">Next milestone</span>
                  <span className="text-primary-400 font-medium">{nextMilestone} days</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <div className="text-xs text-navy-500 mt-1">
                  {nextMilestone - streakData.currentStreak} day{nextMilestone - streakData.currentStreak !== 1 ? 's' : ''} to go
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Longest Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Message */}
              <div className="text-center">
                <p className="text-sm text-navy-300 italic">
                  &quot;{getMotivationalMessage(streakData.currentStreak)}&quot;
                </p>
              </div>

              {/* Milestone badges */}
              <div>
                <div className="text-xs text-navy-500 mb-2">Milestones</div>
                <div className="flex gap-2 flex-wrap">
                  {MILESTONES.slice(0, 5).map((milestone) => (
                    <div 
                      key={milestone}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        streakData.currentStreak >= milestone
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'bg-navy-800/50 text-navy-500'
                      }`}
                    >
                      {milestone}d {streakData.currentStreak >= milestone ? '✓' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Styles for animations */}
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
        
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  )
}