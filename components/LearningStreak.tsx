'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  milestonesReached: number[]
}

const MILESTONES = [3, 7, 14, 30, 60, 100]

const DAILY_TIPS = [
  { emoji: '🎯', tip: 'Set a specific learning goal for today - even 15 minutes counts!' },
  { emoji: '📝', tip: 'Take notes while learning - it improves retention by 40%!' },
  { emoji: '🧠', tip: 'Review yesterday\'s lesson before starting a new one.' },
  { emoji: '💪', tip: 'Struggling is part of learning - embrace the challenge!' },
  { emoji: '🔄', tip: 'Teach what you\'ve learned to someone else to solidify knowledge.' },
  { emoji: '☕', tip: 'Take short breaks every 25 minutes to stay focused.' },
  { emoji: '🎮', tip: 'Apply what you learn with a mini-project today!' },
  { emoji: '📚', tip: 'Read documentation - it\'s a superpower most skip!' },
  { emoji: '🤝', tip: 'Join a community to learn with others.' },
  { emoji: '🌟', tip: 'Celebrate small wins - you\'re making progress!' },
]

const STREAK_MESSAGES = [
  { min: 0, max: 2, message: 'Just getting started!', color: 'text-navy-400' },
  { min: 3, max: 6, message: 'Building momentum!', color: 'text-green-400' },
  { min: 7, max: 13, message: 'On fire! 🔥', color: 'text-yellow-400' },
  { min: 14, max: 29, message: 'Learning machine!', color: 'text-orange-400' },
  { min: 30, max: 59, message: 'Incredible dedication!', color: 'text-red-400' },
  { min: 60, max: 99, message: 'Legendary learner!', color: 'text-purple-400' },
  { min: 100, max: Infinity, message: 'Absolute champion! 👑', color: 'text-primary-400' },
]

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
            width: '10px',
            height: '10px',
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newMilestone, setNewMilestone] = useState<number | null>(null)
  const [dailyTip, setDailyTip] = useState(DAILY_TIPS[0])

  const getStreakMessage = useCallback((streak: number) => {
    const message = STREAK_MESSAGES.find(m => streak >= m.min && streak <= m.max)
    return message || STREAK_MESSAGES[0]
  }, [])

  useEffect(() => {
    // Get daily tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(DAILY_TIPS[dayOfYear % DAILY_TIPS.length])

    // Load and update streak data
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      milestonesReached: [],
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate !== today) {
      // New day visit
      data.totalVisits += 1
      
      if (lastVisitDate === yesterday) {
        // Consecutive day - increase streak
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        // Streak broken - reset to 1
        data.currentStreak = 1
      }
      
      data.lastVisit = today
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }

      // Check for new milestones
      const newMilestoneReached = MILESTONES.find(
        m => data.currentStreak >= m && !data.milestonesReached.includes(m)
      )
      
      if (newMilestoneReached) {
        data.milestonesReached.push(newMilestoneReached)
        setNewMilestone(newMilestoneReached)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) return null

  const streakMessage = getStreakMessage(streakData.currentStreak)

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Milestone celebration modal */}
      {newMilestone && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 animate-fadeIn"
          onClick={() => setNewMilestone(null)}
        >
          <div 
            className="bg-navy-900 border border-primary-500/50 rounded-2xl p-8 max-w-md mx-4 text-center transform animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {newMilestone} Day Streak!
            </h3>
            <p className="text-navy-300 mb-6">
              Amazing dedication! You've been learning for {newMilestone} consecutive days. Keep up the incredible work!
            </p>
            <button
              onClick={() => setNewMilestone(null)}
              className="btn-primary"
            >
              Thanks! Let's Keep Going
            </button>
          </div>
        </div>
      )}

      {/* Floating streak widget */}
      <div className="fixed bottom-5 left-5 z-30">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative bg-navy-900/95 backdrop-blur-sm border border-navy-700 
            rounded-2xl shadow-xl transition-all duration-300 overflow-hidden
            hover:border-primary-500/50 hover:shadow-primary-500/10
            ${isExpanded ? 'w-72' : 'w-auto'}
          `}
        >
          {/* Collapsed view */}
          <div className={`flex items-center gap-3 p-4 ${isExpanded ? 'border-b border-navy-800' : ''}`}>
            <div className="relative">
              <span className="text-3xl">🔥</span>
              {streakData.currentStreak > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {streakData.currentStreak > 99 ? '99+' : streakData.currentStreak}
                </span>
              )}
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">
                {streakData.currentStreak} day streak
              </div>
              <div className={`text-sm ${streakMessage.color}`}>
                {streakMessage.message}
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-navy-400 ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>

          {/* Expanded view */}
          {isExpanded && (
            <div className="p-4 space-y-4 animate-fadeIn">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Longest Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Milestone progress */}
              <div>
                <div className="text-xs text-navy-400 mb-2">Milestones</div>
                <div className="flex gap-1">
                  {MILESTONES.map((milestone) => (
                    <div
                      key={milestone}
                      className={`
                        flex-1 h-2 rounded-full transition-colors
                        ${streakData.currentStreak >= milestone ? 'bg-primary-500' : 'bg-navy-700'}
                      `}
                      title={`${milestone} days`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-navy-500">3</span>
                  <span className="text-xs text-navy-500">100</span>
                </div>
              </div>

              {/* Daily tip */}
              <div className="bg-gradient-to-r from-primary-500/10 to-transparent rounded-lg p-3 border-l-2 border-primary-500">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{dailyTip.emoji}</span>
                  <p className="text-xs text-navy-300 leading-relaxed">{dailyTip.tip}</p>
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  )
}