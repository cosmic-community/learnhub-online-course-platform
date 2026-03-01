'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const milestones = [3, 7, 14, 30, 50, 100]

const motivationalMessages = [
  "Keep going! Every day counts! 🚀",
  "You're building great habits! 💪",
  "Consistency is key to mastery! 🔑",
  "Amazing dedication! Keep it up! ⭐",
  "You're on fire! Don't stop now! 🔥",
]

const milestoneMessages: Record<number, string> = {
  3: "3 days! You're getting started! 🌱",
  7: "1 week streak! Fantastic! 🎯",
  14: "2 weeks! You're unstoppable! 🏆",
  30: "30 days! A true learner! 👑",
  50: "50 days! Legendary status! 🌟",
  100: "100 days! You're a master! 🎓",
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#29ABE2', '#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#22C55E']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#29ABE2',
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
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learning-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (data.lastVisit !== today) {
        if (diffDays === 1) {
          // Consecutive day
          const newStreak = data.currentStreak + 1
          const hitMilestone = milestones.includes(newStreak)
          
          data = {
            currentStreak: newStreak,
            longestStreak: Math.max(data.longestStreak, newStreak),
            lastVisit: today,
            totalVisits: data.totalVisits + 1,
          }
          
          if (hitMilestone) {
            setIsNewMilestone(true)
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }
        } else if (diffDays > 1) {
          // Streak broken
          data = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            lastVisit: today,
            totalVisits: data.totalVisits + 1,
          }
        }
        localStorage.setItem('learning-streak', JSON.stringify(data))
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learning-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [])

  if (!streakData) return null

  const currentMilestone = milestones.find(m => streakData.currentStreak >= m) ?? 0
  const nextMilestone = milestones.find(m => m > streakData.currentStreak) ?? milestones[milestones.length - 1] ?? 100
  const progress = nextMilestone ? ((streakData.currentStreak % nextMilestone) / nextMilestone) * 100 : 100
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <div 
          className="bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Collapsed View */}
          <div className="p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              {isNewMilestone && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </div>
            
            <div className={`${isExpanded ? 'block' : 'hidden sm:block'}`}>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
              </div>
              <div className="text-xs text-navy-400">Learning Streak</div>
            </div>
            
            <div className={`ml-auto text-navy-500 ${isExpanded ? 'rotate-180' : ''} transition-transform`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
          
          {/* Expanded View */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4">
              {/* Milestone Message */}
              {isNewMilestone && milestoneMessages[streakData.currentStreak] && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                  <span className="text-yellow-300 text-sm font-medium">
                    {milestoneMessages[streakData.currentStreak]}
                  </span>
                </div>
              )}
              
              {/* Progress to Next Milestone */}
              <div>
                <div className="flex justify-between text-xs text-navy-400 mb-1">
                  <span>Progress to {nextMilestone} days</span>
                  <span>{streakData.currentStreak}/{nextMilestone}</span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>
              
              {/* Motivational Message */}
              <p className="text-center text-sm text-navy-300 italic">
                {randomMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}