'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  todayVisited: boolean
}

const motivationalMessages = [
  { minStreak: 0, messages: ["Welcome! Start your learning journey today! 🚀", "Every expert was once a beginner! 💡", "The best time to start is now! ⭐"] },
  { minStreak: 1, messages: ["Great start! Keep the momentum going! 🔥", "You're on your way! 💪", "Day 1 down, many more to come! 🌟"] },
  { minStreak: 3, messages: ["3 days strong! You're building a habit! 🏆", "Consistency is key, and you've got it! 🔑", "You're unstoppable! Keep going! 💫"] },
  { minStreak: 7, messages: ["A whole week! You're a learning machine! 🤖", "7 days of dedication! Amazing! 🎯", "Weekly warrior status achieved! ⚔️"] },
  { minStreak: 14, messages: ["Two weeks! You're seriously committed! 🏅", "Half a month of learning! Incredible! 🌈", "Your future self is thanking you! 🙏"] },
  { minStreak: 30, messages: ["A MONTH! You're a legend! 👑", "30 days of pure dedication! 🎖️", "You've mastered the art of consistency! 🎨"] },
  { minStreak: 60, messages: ["60 days! You're in the elite club now! 💎", "Two months strong! Phenomenal! 🌟", "Nothing can stop you! 🚀"] },
  { minStreak: 100, messages: ["100 DAYS! You're absolutely incredible! 🏆🏆🏆", "Century club member! Pure excellence! ✨", "You inspire us all! 👏"] },
]

const streakEmojis = ['🔥', '⚡', '💪', '🌟', '✨', '🎯', '🚀', '💎', '👑', '🏆']

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [message, setMessage] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([])

  const getMotivationalMessage = useCallback((streak: number): string => {
    const applicableMessages = motivationalMessages
      .filter(m => streak >= m.minStreak)
      .pop()
    
    if (!applicableMessages) return "Start your learning journey! 🚀"
    
    const randomIndex = Math.floor(Math.random() * applicableMessages.messages.length)
    return applicableMessages.messages[randomIndex] ?? "Keep learning! 📚"
  }, [])

  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: streakEmojis[Math.floor(Math.random() * streakEmojis.length)] ?? '🔥'
    }))
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 2000)
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learningStreak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        data.todayVisited = true
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        data.currentStreak += 1
        data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
        data.lastVisit = today
        data.totalVisits += 1
        data.todayVisited = true
        setShowCelebration(true)
        createParticles()
      } else {
        // Streak broken
        const wasStreaking = data.currentStreak > 1
        data.currentStreak = 1
        data.lastVisit = today
        data.totalVisits += 1
        data.todayVisited = true
        if (!wasStreaking) {
          setShowCelebration(true)
          createParticles()
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        todayVisited: true
      }
      setShowCelebration(true)
      createParticles()
    }
    
    localStorage.setItem('learningStreak', JSON.stringify(data))
    setStreakData(data)
    setMessage(getMotivationalMessage(data.currentStreak))
    
    // Hide celebration after animation
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [getMotivationalMessage, createParticles, showCelebration])

  if (!streakData) return null

  const progressToNextMilestone = () => {
    const milestones = [7, 14, 30, 60, 100, 365]
    const nextMilestone = milestones.find(m => m > streakData.currentStreak) ?? 365
    const prevMilestone = milestones.filter(m => m <= streakData.currentStreak).pop() ?? 0
    const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    return { progress: Math.min(progress, 100), nextMilestone }
  }

  const { progress, nextMilestone } = progressToNextMilestone()

  return (
    <>
      {/* Celebration Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50 text-2xl animate-float-up"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: 'floatUp 2s ease-out forwards'
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <div 
          className={`bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 backdrop-blur-md border border-orange-500/30 rounded-2xl shadow-xl shadow-orange-500/10 overflow-hidden transition-all duration-300 ${
            showCelebration ? 'animate-pulse ring-2 ring-orange-400/50' : ''
          }`}
        >
          {/* Compact View (always visible) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
          >
            <div className="relative">
              <span className="text-3xl animate-bounce-slow">🔥</span>
              {streakData.currentStreak >= 7 && (
                <span className="absolute -top-1 -right-1 text-xs">✨</span>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-orange-400">
                  {streakData.currentStreak}
                </span>
                <span className="text-sm text-orange-300/70">
                  day{streakData.currentStreak !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-amber-200/60">
                Learning Streak
              </p>
            </div>
            <svg 
              className={`w-5 h-5 text-orange-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded View */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-orange-500/20">
              {/* Motivational Message */}
              <div className="pt-3">
                <p className="text-sm text-amber-100 text-center leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Progress Bar to Next Milestone */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-orange-300/70">Progress</span>
                  <span className="text-orange-300/70">{nextMilestone} days</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-orange-300/50 mt-1">
                  {nextMilestone - streakData.currentStreak} days to next milestone
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-900/50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-amber-400">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-amber-400">
                    {streakData.totalVisits}
                  </div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Streak Calendar Preview */}
              <div className="flex justify-center gap-1">
                {Array.from({ length: 7 }, (_, i) => {
                  const isActive = i < Math.min(streakData.currentStreak, 7)
                  return (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                        isActive 
                          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30' 
                          : 'bg-navy-800 text-navy-500'
                      }`}
                    >
                      {isActive ? '🔥' : '○'}
                    </div>
                  )
                })}
              </div>

              {/* Achievement Badges */}
              {streakData.currentStreak >= 7 && (
                <div className="flex justify-center gap-2 pt-2">
                  {streakData.currentStreak >= 7 && <span className="text-xl" title="Week Warrior">🏅</span>}
                  {streakData.currentStreak >= 30 && <span className="text-xl" title="Monthly Master">🏆</span>}
                  {streakData.currentStreak >= 100 && <span className="text-xl" title="Century Legend">👑</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-float-up {
          animation: floatUp 2s ease-out forwards;
        }
      `}</style>
    </>
  )
}