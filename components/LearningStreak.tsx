'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
]

function getRandomQuote() {
  // Use date as seed for consistent daily quote
  const today = new Date().toDateString()
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = seed % motivationalQuotes.length
  return motivationalQuotes[index]
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])
  
  useEffect(() => {
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
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
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
            width: '10px',
            height: '10px',
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [quote] = useState(getRandomQuote())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    let streakData: StreakData
    
    if (savedStreak) {
      streakData = JSON.parse(savedStreak)
      const lastVisit = new Date(streakData.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today, no changes
        setStreak(streakData)
        return
      } else if (lastVisit === yesterday) {
        // Consecutive day! Increment streak
        const newStreak = streakData.currentStreak + 1
        const newLongest = Math.max(newStreak, streakData.longestStreak)
        
        streakData = {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastVisit: today,
          totalVisits: streakData.totalVisits + 1
        }
        
        // Check for milestones
        if ([3, 7, 14, 30, 50, 100].includes(newStreak)) {
          setShowConfetti(true)
          setIsNewMilestone(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset to 1
        streakData = {
          currentStreak: 1,
          longestStreak: streakData.longestStreak,
          lastVisit: today,
          totalVisits: streakData.totalVisits + 1
        }
      }
    } else {
      // First visit ever
      streakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1
      }
      setShowConfetti(true)
      setIsNewMilestone(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
    
    localStorage.setItem('learning-streak', JSON.stringify(streakData))
    setStreak(streakData)
  }, [])

  if (!mounted || !streak) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-24 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const getMilestoneMessage = (days: number) => {
    if (days >= 100) return "🏆 Legendary Learner!"
    if (days >= 50) return "🌟 Learning Champion!"
    if (days >= 30) return "💪 Dedicated Scholar!"
    if (days >= 14) return "🔥 On Fire!"
    if (days >= 7) return "⭐ One Week Strong!"
    if (days >= 3) return "🎯 Great Start!"
    return "🚀 Keep Going!"
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="card overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-yellow-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Learning Streak</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">{streak.currentStreak}</span>
                <span className="text-white/80 text-lg">
                  {streak.currentStreak === 1 ? 'day' : 'days'}
                </span>
              </div>
              <p className="text-white/90 text-sm mt-2 font-medium">
                {getMilestoneMessage(streak.currentStreak)}
              </p>
            </div>
            <div className="text-6xl animate-bounce-slow">
              {streak.currentStreak >= 7 ? '🔥' : streak.currentStreak >= 3 ? '⭐' : '✨'}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="p-6 bg-navy-900/50">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-primary-400">{streak.longestStreak}</div>
              <div className="text-navy-400 text-xs">Best Streak</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{streak.totalVisits}</div>
              <div className="text-navy-400 text-xs">Total Visits</div>
            </div>
          </div>
          
          {/* Milestone Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-navy-400 mb-2">
              <span>Progress to next milestone</span>
              <span>{getNextMilestone(streak.currentStreak)} days</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-yellow-500 rounded-full transition-all duration-1000"
                style={{ width: `${getMilestoneProgress(streak.currentStreak)}%` }}
              />
            </div>
          </div>
          
          {/* Daily Quote */}
          <div className="border-t border-navy-800 pt-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-navy-200 text-sm italic leading-relaxed">
                  &ldquo;{quote?.text}&rdquo;
                </p>
                <p className="text-navy-500 text-xs mt-2">— {quote?.author}</p>
              </div>
            </div>
          </div>
          
          {isNewMilestone && (
            <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg text-center">
              <span className="text-primary-400 text-sm font-medium">
                🎉 Congratulations on your learning streak!
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 50, 100, 200, 365]
  for (const m of milestones) {
    if (current < m) return m
  }
  return Math.ceil(current / 100) * 100 + 100
}

function getMilestoneProgress(current: number): number {
  const milestones = [3, 7, 14, 30, 50, 100, 200, 365]
  let prevMilestone = 0
  
  for (const m of milestones) {
    if (current < m) {
      const progress = ((current - prevMilestone) / (m - prevMilestone)) * 100
      return Math.min(100, Math.max(0, progress))
    }
    prevMilestone = m
  }
  
  return 100
}