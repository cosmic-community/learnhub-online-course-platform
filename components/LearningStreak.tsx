'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalLessonsViewed: number
  todayLessons: number
}

const motivationalMessages = [
  { min: 0, max: 0, messages: ["Start your learning journey today! 🚀", "Every expert was once a beginner! 💪"] },
  { min: 1, max: 2, messages: ["Great start! Keep it up! 🌟", "You're building momentum! 🔥"] },
  { min: 3, max: 6, messages: ["You're on fire! 🔥🔥", "Consistency is key, and you've got it! 💎"] },
  { min: 7, max: 13, messages: ["A whole week! You're unstoppable! 🏆", "Your dedication is inspiring! ⭐"] },
  { min: 14, max: 29, messages: ["Two weeks strong! Legend status! 👑", "You're in the top 1% of learners! 🎯"] },
  { min: 30, max: Infinity, messages: ["30+ days! You're a learning machine! 🤖✨", "Absolutely incredible commitment! 🌈"] },
]

function getMotivationalMessage(streak: number): string {
  const category = motivationalMessages.find(m => streak >= m.min && streak <= m.max)
  if (!category) return "Keep learning! 📚"
  return category.messages[Math.floor(Math.random() * category.messages.length)]
}

function createConfetti() {
  const colors = ['#29ABE2', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#EC4899']
  const confettiCount = 50
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;'
  document.body.appendChild(container)

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = Math.random() * 10 + 5
    const startX = Math.random() * window.innerWidth
    const rotation = Math.random() * 360

    confetti.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      background:${color};
      top:-20px;
      left:${startX}px;
      transform:rotate(${rotation}deg);
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation:confettiFall ${Math.random() * 2 + 2}s linear forwards;
      animation-delay:${Math.random() * 0.5}s;
    `
    container.appendChild(confetti)
  }

  setTimeout(() => container.remove(), 4000)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [message, setMessage] = useState('')

  const updateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalLessonsViewed: 0,
      todayLessons: 0,
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    if (lastVisitDate !== today) {
      if (lastVisitDate === yesterdayStr) {
        // Continuing streak!
        data.currentStreak += 1
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        // Celebrate milestones
        if ([3, 7, 14, 30, 50, 100].includes(data.currentStreak)) {
          setShowCelebration(true)
          createConfetti()
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else if (lastVisitDate === '') {
        // First visit
        data.currentStreak = 1
        data.longestStreak = 1
      } else {
        // Streak broken
        data.currentStreak = 1
      }
      data.lastVisit = today
      data.todayLessons = 0
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    setMessage(getMotivationalMessage(data.currentStreak))
  }, [])

  useEffect(() => {
    updateStreak()
    
    // Add confetti animation styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes streakPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      @keyframes celebrationGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(41, 171, 226, 0.3); }
        50% { box-shadow: 0 0 40px rgba(41, 171, 226, 0.6), 0 0 60px rgba(168, 85, 247, 0.4); }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [updateStreak])

  // Listen for lesson completions
  useEffect(() => {
    const handleLessonView = () => {
      if (!streakData) return
      const newData = {
        ...streakData,
        totalLessonsViewed: streakData.totalLessonsViewed + 1,
        todayLessons: streakData.todayLessons + 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      
      // Celebrate every 5 lessons
      if (newData.todayLessons === 5 || newData.totalLessonsViewed % 10 === 0) {
        createConfetti()
      }
    }

    window.addEventListener('lesson-viewed', handleLessonView)
    return () => window.removeEventListener('lesson-viewed', handleLessonView)
  }, [streakData])

  if (!streakData) return null

  return (
    <div className="fixed bottom-24 right-5 z-40">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-primary-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce shadow-lg">
          🎉 {streakData.currentStreak} Day Streak! 🎉
        </div>
      )}

      {/* Main Widget */}
      <div
        className={`transition-all duration-300 ease-out ${
          isExpanded ? 'w-72' : 'w-14'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-primary-500/50 ${
            showCelebration ? 'animate-[celebrationGlow_1s_ease-in-out_infinite]' : ''
          }`}
        >
          {isExpanded ? (
            <div className="p-4 text-left">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" style={{ animation: streakData.currentStreak > 0 ? 'streakPulse 2s ease-in-out infinite' : 'none' }}>
                    🔥
                  </span>
                  <div>
                    <div className="text-white font-bold text-lg">
                      {streakData.currentStreak} Day Streak
                    </div>
                    <div className="text-navy-400 text-xs">
                      Best: {streakData.longestStreak} days
                    </div>
                  </div>
                </div>
                <span className="text-navy-400 text-xl">×</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">
                    {streakData.todayLessons}
                  </div>
                  <div className="text-navy-400 text-xs">Today</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {streakData.totalLessonsViewed}
                  </div>
                  <div className="text-navy-400 text-xs">All Time</div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-lg p-3 border border-primary-500/20">
                <p className="text-sm text-navy-200 text-center">
                  {message}
                </p>
              </div>

              {/* Progress to next milestone */}
              {streakData.currentStreak > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Next milestone</span>
                    <span>{getNextMilestone(streakData.currentStreak)} days</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${getMilestoneProgress(streakData.currentStreak)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 flex flex-col items-center gap-1">
              <span className="text-2xl" style={{ animation: streakData.currentStreak > 0 ? 'streakPulse 2s ease-in-out infinite' : 'none' }}>
                🔥
              </span>
              <span className="text-white font-bold text-sm">
                {streakData.currentStreak}
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 50, 100, 200, 365]
  return milestones.find(m => m > current) ?? current + 30
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 3, 7, 14, 30, 50, 100, 200, 365]
  const nextIndex = milestones.findIndex(m => m > current)
  if (nextIndex <= 0) return 100
  const prev = milestones[nextIndex - 1] ?? 0
  const next = milestones[nextIndex] ?? current + 30
  return Math.min(100, ((current - prev) / (next - prev)) * 100)
}