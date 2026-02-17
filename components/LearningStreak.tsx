'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearning: number
  lessonsCompleted: number
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Start your learning journey today! 🚀"
  if (streak === 1) return "Great start! Come back tomorrow to build your streak! 🌱"
  if (streak < 3) return "You're building momentum! Keep it up! 💪"
  if (streak < 7) return "Amazing dedication! A week is within reach! 🔥"
  if (streak < 14) return "You're on fire! Two weeks of learning! 🌟"
  if (streak < 30) return "Incredible consistency! You're unstoppable! ⚡"
  if (streak < 50) return "Learning champion! Over a month strong! 🏆"
  return "Legendary learner! You're an inspiration! 👑"
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#14b8a6', '#2dd4bf', '#fbbf24', '#f472b6', '#a78bfa', '#34d399']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [justHitMilestone, setJustHitMilestone] = useState<number | null>(null)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, just load data
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalDaysLearning: data.totalDaysLearning + 1,
          lessonsCompleted: data.lessonsCompleted
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Check for milestone celebration
        if (MILESTONES.includes(newStreak)) {
          setJustHitMilestone(newStreak)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, reset
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDaysLearning: data.totalDaysLearning + 1,
          lessonsCompleted: data.lessonsCompleted
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First time visitor
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDaysLearning: 1,
        lessonsCompleted: 0
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }, [])

  if (!streakData) return null

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1]
  const progressToMilestone = (streakData.currentStreak / nextMilestone) * 100

  return (
    <>
      {showCelebration && <Confetti />}
      
      <div className="fixed bottom-24 right-6 z-40">
        {/* Collapsed View - Streak Badge */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
          aria-label="View learning streak"
        >
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full 
            bg-gradient-to-r from-primary-500 to-primary-600
            shadow-lg shadow-primary-500/30 
            transition-all duration-300
            hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105
            ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}>
            <span className="text-2xl animate-pulse">🔥</span>
            <span className="text-white font-bold">{streakData.currentStreak}</span>
            <span className="text-white/80 text-sm">day streak</span>
          </div>
        </button>

        {/* Expanded View - Stats Card */}
        <div className={`
          absolute bottom-0 right-0 w-80
          bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl
          shadow-2xl shadow-primary-500/10
          transition-all duration-300 origin-bottom-right
          ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}>
          {/* Header */}
          <div className="p-4 border-b border-navy-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Learning Streak
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-navy-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-4">
            {/* Current Streak */}
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                {streakData.currentStreak}
              </div>
              <div className="text-navy-400 text-sm mt-1">Current Streak (days)</div>
            </div>

            {/* Progress to Next Milestone */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-navy-400">Next milestone</span>
                <span className="text-primary-400">{nextMilestone} days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToMilestone, 100)}%` }}
                />
              </div>
            </div>

            {/* Motivational Message */}
            <div className="p-3 bg-navy-800/50 rounded-lg text-center">
              <p className="text-sm text-navy-200">
                {getMotivationalMessage(streakData.currentStreak)}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-navy-800/50 rounded-lg text-center">
                <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Longest Streak</div>
              </div>
              <div className="p-3 bg-navy-800/50 rounded-lg text-center">
                <div className="text-xl font-bold text-white">{streakData.totalDaysLearning}</div>
                <div className="text-xs text-navy-400">Total Days</div>
              </div>
            </div>

            {/* Milestone Badges */}
            <div className="space-y-2">
              <div className="text-sm text-navy-400">Milestones</div>
              <div className="flex flex-wrap gap-2">
                {MILESTONES.map((milestone) => {
                  const achieved = streakData.longestStreak >= milestone
                  return (
                    <div
                      key={milestone}
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        transition-all duration-300
                        ${achieved 
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                          : 'bg-navy-800 text-navy-500 border border-navy-700'}
                        ${justHitMilestone === milestone ? 'animate-bounce' : ''}
                      `}
                    >
                      {achieved ? '✓ ' : ''}{milestone} days
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}