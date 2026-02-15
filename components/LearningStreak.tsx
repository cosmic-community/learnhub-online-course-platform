'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Start your learning journey! 🚀", emoji: "🌱" },
  { min: 1, max: 2, message: "Great start! Keep it up! 💪", emoji: "🔥" },
  { min: 3, max: 6, message: "You're on fire! 🔥", emoji: "⚡" },
  { min: 7, max: 13, message: "One week strong! Amazing! 🌟", emoji: "🏆" },
  { min: 14, max: 29, message: "Two weeks! You're unstoppable! 💫", emoji: "🎯" },
  { min: 30, max: 59, message: "A month of learning! Legend! 👑", emoji: "💎" },
  { min: 60, max: 89, message: "60 days! You're incredible! 🦸", emoji: "🌈" },
  { min: 90, max: Infinity, message: "90+ days! Master learner! 🎓", emoji: "🏅" },
]

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 100, 150, 200, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  const getMotivationalMessage = useCallback((streak: number) => {
    const found = MOTIVATIONAL_MESSAGES.find(
      (m) => streak >= m.min && streak <= m.max
    )
    return found || MOTIVATIONAL_MESSAGES[0]
  }, [])

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday - increment streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))

        // Check for milestone
        if (MILESTONES.includes(newStreak)) {
          setMilestoneReached(newStreak)
          triggerConfetti()
          setIsExpanded(true)
        }
      } else {
        // Streak broken - reset to 1
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setMilestoneReached(1)
      triggerConfetti()
      setIsExpanded(true)
    }
  }, [triggerConfetti])

  // Clear milestone after showing
  useEffect(() => {
    if (milestoneReached) {
      const timer = setTimeout(() => {
        setMilestoneReached(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [milestoneReached])

  if (!streakData || !isVisible) return null

  const motivation = getMotivationalMessage(streakData.currentStreak)
  const nextMilestone = MILESTONES.find((m) => m > streakData.currentStreak)
  const progressToNext = nextMilestone
    ? ((streakData.currentStreak) / nextMilestone) * 100
    : 100

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span
                className="block w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899'][
                    Math.floor(Math.random() * 6)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div
        className={`fixed bottom-24 left-4 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        {/* Milestone Banner */}
        {milestoneReached && (
          <div className="absolute -top-16 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce-in text-center">
            <span className="text-xl">🎉</span>
            <span className="font-bold ml-2">{milestoneReached} Day Milestone!</span>
          </div>
        )}

        <div
          className={`bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
            isExpanded ? 'p-4' : 'p-3'
          }`}
        >
          {/* Collapsed View - Just the streak button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 w-full"
          >
            <div className="relative">
              <span className="text-2xl">{motivation.emoji}</span>
              {streakData.currentStreak > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {streakData.currentStreak > 99 ? '99+' : streakData.currentStreak}
                </span>
              )}
            </div>
            
            {isExpanded && (
              <div className="flex-1 text-left">
                <div className="text-white font-semibold">
                  {streakData.currentStreak} Day Streak
                </div>
                <div className="text-navy-400 text-xs">
                  {motivation.message}
                </div>
              </div>
            )}

            <svg
              className={`w-5 h-5 text-navy-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-4 space-y-4 animate-fade-in">
              {/* Progress to next milestone */}
              {nextMilestone && (
                <div>
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Progress to {nextMilestone} days</span>
                    <span>{Math.round(progressToNext)}%</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-navy-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-primary-400">
                    {streakData.currentStreak}
                  </div>
                  <div className="text-[10px] text-navy-400">Current</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-amber-400">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-[10px] text-navy-400">Best</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-purple-400">
                    {streakData.totalVisits}
                  </div>
                  <div className="text-[10px] text-navy-400">Visits</div>
                </div>
              </div>

              {/* Upcoming Milestones */}
              <div>
                <div className="text-xs text-navy-400 mb-2">Upcoming milestones</div>
                <div className="flex gap-1 flex-wrap">
                  {MILESTONES.filter((m) => m > streakData.currentStreak)
                    .slice(0, 4)
                    .map((milestone) => (
                      <span
                        key={milestone}
                        className={`text-xs px-2 py-1 rounded-full ${
                          milestone === nextMilestone
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'bg-navy-800 text-navy-400'
                        }`}
                      >
                        {milestone}d
                      </span>
                    ))}
                </div>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => setIsVisible(false)}
                className="text-xs text-navy-500 hover:text-navy-400 transition-colors"
              >
                Hide for this session
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}