'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Welcome! Start your learning journey today 🚀", emoji: "👋" },
  { min: 1, max: 1, message: "Great start! Come back tomorrow to build your streak 🌱", emoji: "🔥" },
  { min: 2, max: 4, message: "You're on fire! Keep the momentum going 💪", emoji: "🔥" },
  { min: 5, max: 9, message: "Amazing dedication! You're a learning machine 🎯", emoji: "⚡" },
  { min: 10, max: 19, message: "Incredible! 10+ days of consistent learning 🏆", emoji: "🌟" },
  { min: 20, max: 29, message: "Legendary learner! You're unstoppable 👑", emoji: "💎" },
  { min: 30, max: 49, message: "30+ days! You're a true knowledge seeker 🧠", emoji: "🚀" },
  { min: 50, max: 99, message: "50+ days! You're inspiring others 🌈", emoji: "✨" },
  { min: 100, max: Infinity, message: "100+ days! You've achieved mastery mode 🎓", emoji: "🏅" },
]

function getMotivationalMessage(streak: number): { message: string; emoji: string } {
  const found = MOTIVATIONAL_MESSAGES.find(m => streak >= m.min && streak <= m.max)
  return found || MOTIVATIONAL_MESSAGES[0]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date1, yesterday)
}

// Confetti particle component
function Confetti({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    delay: number
    duration: number
    color: string
  }>>([])

  useEffect(() => {
    if (isActive) {
      const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
      setParticles(newParticles)
      
      const timer = setTimeout(() => setParticles([]), 4000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const updateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisit)
      
      if (isSameDay(lastVisit, today)) {
        // Already visited today, just show the data
        setStreakData(data)
        return
      }
      
      if (isYesterday(lastVisit, today)) {
        // Consecutive day! Increment streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today.toISOString(),
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewStreak(true)
        
        // Show confetti for milestones (every 5 days or specific achievements)
        if (newStreak % 5 === 0 || newStreak === 1 || newStreak === 7 || newStreak === 30 || newStreak === 100) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 4000)
        }
        return
      }
      
      // Streak broken - reset but keep records
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today.toISOString(),
        longestStreak: data.longestStreak,
        totalVisits: data.totalVisits + 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      return
    }
    
    // First visit ever
    const newData: StreakData = {
      currentStreak: 1,
      lastVisit: today.toISOString(),
      longestStreak: 1,
      totalVisits: 1,
    }
    localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    setStreakData(newData)
    setIsNewStreak(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 4000)
  }, [])

  useEffect(() => {
    // Small delay to prevent flash
    const timer = setTimeout(updateStreak, 500)
    return () => clearTimeout(timer)
  }, [updateStreak])

  if (!streakData) return null

  const { message, emoji } = getMotivationalMessage(streakData.currentStreak)

  return (
    <>
      <Confetti isActive={showConfetti} />
      
      {/* Floating Streak Badge */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            group relative flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-orange-500 to-amber-500
            text-white font-bold shadow-lg shadow-orange-500/25
            hover:shadow-orange-500/40 hover:scale-105
            transition-all duration-300 ease-out
            ${isNewStreak ? 'animate-bounce-subtle' : ''}
          `}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-lg">{streakData.currentStreak}</span>
          <span className="text-xs opacity-90">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          
          {/* Pulse ring for new streak */}
          {isNewStreak && (
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-30" />
          )}
        </button>
        
        {/* Expanded Card */}
        {isExpanded && (
          <div 
            className="absolute top-full right-0 mt-2 w-72 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-4 animate-slide-down"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{emoji}</div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {streakData.currentStreak} Day Streak!
                </div>
                <div className="text-navy-400 text-sm">Keep it going!</div>
              </div>
            </div>
            
            <p className="text-navy-300 text-sm mb-4">{message}</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-primary-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Total Visits</div>
              </div>
            </div>
            
            {/* Progress to next milestone */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Next milestone</span>
                <span>{getNextMilestone(streakData.currentStreak)} days</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${getMilestoneProgress(streakData.currentStreak)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [5, 10, 20, 30, 50, 100, 200, 365]
  return milestones.find(m => m > current) || current + 100
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 5, 10, 20, 30, 50, 100, 200, 365]
  const currentMilestoneIndex = milestones.findIndex(m => m > current)
  if (currentMilestoneIndex === -1) return 100
  
  const prevMilestone = milestones[currentMilestoneIndex - 1] || 0
  const nextMilestone = milestones[currentMilestoneIndex]
  
  return ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100
}