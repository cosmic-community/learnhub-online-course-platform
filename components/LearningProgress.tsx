'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  streak: number
  lastVisit: string
  lessonsCompleted: string[]
  totalMinutesLearned: number
}

const DEFAULT_STATS: LearningStats = {
  streak: 0,
  lastVisit: '',
  lessonsCompleted: [],
  totalMinutesLearned: 0
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const savedStats = localStorage.getItem('learning-progress')
    const today = new Date().toDateString()
    
    if (savedStats) {
      const parsed: LearningStats = JSON.parse(savedStats)
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      let newStreak = parsed.streak
      
      if (lastVisitDate === today) {
        // Same day, keep streak
        newStreak = parsed.streak
      } else if (lastVisitDate === yesterdayString) {
        // Consecutive day, increment streak
        newStreak = parsed.streak + 1
        setShowWelcome(true)
      } else if (parsed.lastVisit) {
        // Streak broken
        newStreak = 1
        setShowWelcome(true)
      }
      
      const updatedStats = {
        ...parsed,
        streak: newStreak,
        lastVisit: new Date().toISOString()
      }
      
      setStats(updatedStats)
      localStorage.setItem('learning-progress', JSON.stringify(updatedStats))
    } else {
      // First visit
      const newStats: LearningStats = {
        streak: 1,
        lastVisit: new Date().toISOString(),
        lessonsCompleted: [],
        totalMinutesLearned: 0
      }
      setStats(newStats)
      localStorage.setItem('learning-progress', JSON.stringify(newStats))
      setShowWelcome(true)
    }
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return "You're on fire!"
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  if (!isVisible) return null

  return (
    <>
      {/* Welcome Back Toast */}
      {showWelcome && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 rounded-xl shadow-2xl shadow-primary-500/30 max-w-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getStreakEmoji(stats.streak)}</span>
              <div>
                <p className="font-bold text-lg">
                  {stats.streak > 1 ? 'Welcome back!' : 'Welcome!'}
                </p>
                <p className="text-primary-100 text-sm">
                  {stats.streak} day streak • {getStreakMessage(stats.streak)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <div className="bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl p-4 shadow-xl shadow-navy-950/50 w-56 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-400 text-xs font-medium uppercase tracking-wider">Your Progress</span>
            <span className="text-2xl">{getStreakEmoji(stats.streak)}</span>
          </div>
          
          {/* Streak Display */}
          <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{stats.streak}</p>
                <p className="text-primary-400 text-xs font-medium">Day Streak</p>
              </div>
              <div className="flex gap-1">
                {[...Array(Math.min(stats.streak, 7))].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-navy-800/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-white">{stats.lessonsCompleted.length}</p>
              <p className="text-navy-400 text-xs">Lessons</p>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-white">{stats.totalMinutesLearned}</p>
              <p className="text-navy-400 text-xs">Minutes</p>
            </div>
          </div>
          
          {/* Motivational Message */}
          <p className="text-center text-navy-300 text-xs mt-3 italic">
            "{getStreakMessage(stats.streak)}"
          </p>
        </div>
      </div>
    </>
  )
}

// Export a function to mark lessons as complete (can be called from lesson pages)
export function markLessonComplete(lessonSlug: string, durationMinutes: number): void {
  const savedStats = localStorage.getItem('learning-progress')
  if (savedStats) {
    const stats: LearningStats = JSON.parse(savedStats)
    if (!stats.lessonsCompleted.includes(lessonSlug)) {
      stats.lessonsCompleted.push(lessonSlug)
      stats.totalMinutesLearned += durationMinutes
      localStorage.setItem('learning-progress', JSON.stringify(stats))
      
      // Trigger confetti celebration
      triggerConfetti()
    }
  }
}

// Confetti celebration function
function triggerConfetti(): void {
  const colors = ['#29ABE2', '#4ADE80', '#FBBF24', '#F472B6', '#A78BFA']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 4000)
  }
}