'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 1, max: 2, messages: ["Great start! 🌱", "You're on your way! 🚀", "Every journey begins with a single step! 👣"] },
  { min: 3, max: 6, messages: ["You're building momentum! 💪", "Keep that streak alive! 🔥", "Consistency is key! 🔑"] },
  { min: 7, max: 13, messages: ["One week strong! 🎯", "You're unstoppable! ⚡", "Knowledge is power! 📚"] },
  { min: 14, max: 29, messages: ["Two weeks of dedication! 🏆", "You're a learning machine! 🤖", "Champions never quit! 🥇"] },
  { min: 30, max: 59, messages: ["One month! Incredible! 🌟", "You're an inspiration! ✨", "Mastery in progress! 🎓"] },
  { min: 60, max: Infinity, messages: ["Legendary learner! 👑", "You're rewriting the rules! 🚀", "Absolute dedication! 💎"] }
]

const MILESTONES = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const getMotivationalMessage = useCallback((streak: number): string => {
    const category = MOTIVATIONAL_MESSAGES.find(cat => streak >= cat.min && streak <= cat.max)
    if (!category) return "Keep learning! 📖"
    const messages = category.messages
    return messages[Math.floor(Math.random() * messages.length)]
  }, [])

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day visit
        setStreakData(data)
        setMotivationalMessage(getMotivationalMessage(data.currentStreak))
      } else if (diffDays === 1) {
        // Consecutive day - increment streak!
        const newStreak = data.currentStreak + 1
        const isNewRecord = newStreak > data.longestStreak
        const hitMilestone = MILESTONES.includes(newStreak)
        
        data = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
        setStreakData(data)
        setMotivationalMessage(getMotivationalMessage(newStreak))
        
        if (hitMilestone || isNewRecord) {
          setIsNewMilestone(true)
          triggerConfetti()
          setTimeout(() => setIsNewMilestone(false), 5000)
        }
      } else {
        // Streak broken - reset
        data = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
        setStreakData(data)
        setMotivationalMessage("Welcome back! Let's start fresh! 🌅")
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      setStreakData(data)
      setMotivationalMessage("Welcome! Your learning journey begins! 🎉")
      triggerConfetti()
    }
  }, [getMotivationalMessage, triggerConfetti])

  if (!streakData) return null

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || streakData.currentStreak + 1
  const progressToMilestone = Math.min((streakData.currentStreak / nextMilestone) * 100, 100)

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            group flex items-center gap-2 px-4 py-3 
            bg-gradient-to-r from-orange-500 to-amber-500 
            rounded-full shadow-lg shadow-orange-500/30
            hover:shadow-orange-500/50 transition-all duration-300
            ${isNewMilestone ? 'animate-bounce' : ''}
          `}
        >
          <span className="text-2xl">🔥</span>
          <span className="text-white font-bold text-lg">{streakData.currentStreak}</span>
          <span className="text-white/80 text-sm hidden sm:inline">day streak</span>
          <svg 
            className={`w-4 h-4 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-3 w-72 bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl p-5 shadow-2xl animate-slideUp">
            {/* Motivational Message */}
            <div className="text-center mb-4">
              <p className="text-primary-400 font-medium text-lg">{motivationalMessage}</p>
            </div>

            {/* Progress to next milestone */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-navy-400 mb-2">
                <span>Progress to {nextMilestone} days</span>
                <span>{streakData.currentStreak}/{nextMilestone}</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressToMilestone}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-white font-bold">{streakData.currentStreak}</div>
                <div className="text-navy-400 text-xs">Current</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-white font-bold">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-white font-bold">{streakData.totalVisits}</div>
                <div className="text-navy-400 text-xs">Total Days</div>
              </div>
            </div>

            {/* Milestone badges */}
            <div className="mt-4 pt-4 border-t border-navy-700">
              <p className="text-navy-400 text-xs mb-2">Milestones</p>
              <div className="flex flex-wrap gap-2">
                {MILESTONES.slice(0, 5).map(milestone => (
                  <div
                    key={milestone}
                    className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${streakData.currentStreak >= milestone 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'bg-navy-800 text-navy-500'}
                    `}
                  >
                    {streakData.currentStreak >= milestone ? '✓' : ''} {milestone}d
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}