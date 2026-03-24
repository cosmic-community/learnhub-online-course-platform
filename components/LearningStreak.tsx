'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
}

const MILESTONE_DAYS = [3, 7, 14, 30, 60, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const createConfetti = useCallback(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
    const confettiContainer = document.getElementById('confetti-container')
    if (!confettiContainer) return

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
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `
      confettiContainer.appendChild(confetti)
      setTimeout(() => confetti.remove(), 5000)
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()

      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Continuing streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1
        }
        setStreakData(newData)
        localStorage.setItem('learning-streak', JSON.stringify(newData))

        // Check for milestone
        if (MILESTONE_DAYS.includes(newStreak)) {
          setMilestoneReached(newStreak)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setMilestoneReached(null)
          }, 5000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1
        }
        setStreakData(newData)
        localStorage.setItem('learning-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDaysLearned: 1
      }
      setStreakData(newData)
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setMilestoneReached(1)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setMilestoneReached(null)
      }, 3000)
    }
  }, [])

  useEffect(() => {
    if (showConfetti) {
      createConfetti()
    }
  }, [showConfetti, createConfetti])

  if (!streakData) return null

  const nextMilestone = MILESTONE_DAYS.find(m => m > streakData.currentStreak) || 365
  const progress = (streakData.currentStreak / nextMilestone) * 100

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 365) return '👑'
    if (streak >= 100) return '🏆'
    if (streak >= 60) return '💎'
    if (streak >= 30) return '🌟'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getMilestoneMessage = (days: number): string => {
    if (days === 1) return 'Welcome! Your learning journey begins! 🎉'
    if (days === 3) return '3 days strong! Building habits! 💪'
    if (days === 7) return 'One week streak! You\'re on fire! 🔥'
    if (days === 14) return 'Two weeks! Consistency is key! ⭐'
    if (days === 30) return 'ONE MONTH! You\'re unstoppable! 🌟'
    if (days === 60) return 'Two months! Diamond learner! 💎'
    if (days === 100) return '100 DAYS! Legendary status! 🏆'
    if (days === 365) return 'ONE YEAR! You\'re a Learning Champion! 👑'
    return `${days} day streak! Amazing! 🎊`
  }

  return (
    <>
      {/* Confetti Container */}
      <div 
        id="confetti-container" 
        className="fixed inset-0 pointer-events-none overflow-hidden z-50"
        style={{ display: showConfetti ? 'block' : 'none' }}
      />

      {/* Milestone Celebration Modal */}
      {milestoneReached && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-primary-500/50 rounded-2xl p-8 max-w-md mx-4 text-center transform animate-bounce-in shadow-2xl shadow-primary-500/20">
            <div className="text-6xl mb-4 animate-pulse">{getStreakEmoji(milestoneReached)}</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {milestoneReached === 1 ? 'Day 1!' : `${milestoneReached} Day Streak!`}
            </h2>
            <p className="text-navy-300 mb-6">{getMilestoneMessage(milestoneReached)}</p>
            <button
              onClick={() => setMilestoneReached(null)}
              className="btn-primary"
            >
              Keep Learning! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-30 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-auto'}`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center gap-2 bg-navy-900/95 backdrop-blur-sm border border-navy-700 
            rounded-xl shadow-lg shadow-navy-950/50 transition-all duration-300 hover:border-primary-500/50
            ${isExpanded ? 'w-full p-4' : 'px-4 py-3'}
          `}
        >
          <span className="text-2xl animate-pulse">{getStreakEmoji(streakData.currentStreak)}</span>
          <span className="text-xl font-bold text-white">{streakData.currentStreak}</span>
          <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          {!isExpanded && (
            <span className="text-navy-500 ml-1">▲</span>
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-xl p-4 shadow-lg animate-slide-up">
            <div className="space-y-4">
              {/* Progress to next milestone */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-navy-400">Next milestone</span>
                  <span className="text-primary-400">{nextMilestone} days</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-navy-500 mt-1 text-right">
                  {nextMilestone - streakData.currentStreak} days to go
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{streakData.totalDaysLearned}</div>
                  <div className="text-xs text-navy-400">Total Days</div>
                </div>
              </div>

              {/* Milestone badges */}
              <div>
                <div className="text-xs text-navy-400 mb-2">Milestones</div>
                <div className="flex flex-wrap gap-2">
                  {MILESTONE_DAYS.slice(0, 7).map(milestone => (
                    <div
                      key={milestone}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm
                        ${streakData.currentStreak >= milestone 
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' 
                          : 'bg-navy-800 text-navy-600 border border-navy-700'}
                      `}
                      title={`${milestone} day streak`}
                    >
                      {streakData.currentStreak >= milestone ? '✓' : milestone}
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational message */}
              <div className="text-center text-sm text-navy-300 italic">
                {streakData.currentStreak === 1 && "Every journey begins with a single step! 🌱"}
                {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && "You're building great habits! 💪"}
                {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "Consistency is your superpower! ⚡"}
                {streakData.currentStreak >= 30 && "You're truly dedicated! Keep it up! 🌟"}
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="w-full text-sm text-navy-500 hover:text-navy-300 transition-colors"
              >
                Collapse ▼
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
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

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}