'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const motivationalTips = [
  { emoji: '🧠', tip: "Learning 20 minutes a day adds up to 120+ hours per year!" },
  { emoji: '🚀', tip: "Consistency beats intensity. Small daily progress leads to mastery." },
  { emoji: '💡', tip: "Teaching what you learn reinforces your understanding by 90%." },
  { emoji: '🎯', tip: "Focus on understanding concepts, not just memorizing syntax." },
  { emoji: '⚡', tip: "Take breaks! The Pomodoro Technique boosts retention." },
  { emoji: '🌱', tip: "Every expert was once a beginner. Keep going!" },
  { emoji: '🔥', tip: "Debugging is like being a detective in a crime movie where you're also the murderer." },
  { emoji: '✨', tip: "The best time to start learning was yesterday. The second best time is now." },
  { emoji: '🎨', tip: "Code is poetry. Clean code reads like a well-written story." },
  { emoji: '🏆', tip: "Celebrate small wins. Completed a lesson? That's an achievement!" },
  { emoji: '🔮', tip: "Build projects, not just tutorials. Real learning happens by doing." },
  { emoji: '🌟', tip: "Errors are not failures—they're opportunities to understand better." },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [tipOfDay, setTipOfDay] = useState(motivationalTips[0])
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)

  useEffect(() => {
    // Get tip based on the day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTipOfDay(motivationalTips[dayOfYear % motivationalTips.length])

    // Load and update streak
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Consecutive day! Increase streak
        const newData: StreakData = {
          currentStreak: data.currentStreak + 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1)
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setIsNewStreak(true)
        // Trigger celebration for milestones
        if (newData.currentStreak >= 3 || newData.currentStreak % 7 === 0) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start over
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setIsNewStreak(true)
    }
  }, [])

  if (!streakData) {
    return null // Don't render until we have data
  }

  return (
    <>
      {/* Celebration confetti overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
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
              <span className="text-2xl">
                {['🎉', '⭐', '🔥', '✨', '🎊', '💫'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main streak card */}
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 via-navy-900/60 to-primary-900/20 border-primary-500/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Streak counter */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 ${isNewStreak ? 'animate-pulse-slow' : ''}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{streakData.currentStreak}</div>
                <div className="text-xs text-primary-100 font-medium">
                  {streakData.currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
            {/* Fire emoji for active streak */}
            {streakData.currentStreak >= 3 && (
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce-slow">🔥</div>
            )}
          </div>

          {/* Stats and tip */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">
                {streakData.currentStreak >= 7 ? '🌟 Amazing Streak!' : 
                 streakData.currentStreak >= 3 ? '🔥 You\'re on Fire!' : 
                 '👋 Welcome Back!'}
              </h3>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-navy-300 mb-4">
              <span className="flex items-center gap-1">
                <span className="text-primary-400">📊</span>
                {streakData.totalVisits} total visits
              </span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">🏆</span>
                Best: {streakData.longestStreak} days
              </span>
            </div>

            {/* Tip of the day */}
            <div className="bg-navy-800/50 rounded-lg p-4 border border-navy-700/50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tipOfDay.emoji}</span>
                <div>
                  <div className="text-xs text-primary-400 font-semibold uppercase tracking-wide mb-1">
                    Tip of the Day
                  </div>
                  <p className="text-navy-200 text-sm leading-relaxed">
                    {tipOfDay.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {streakData.currentStreak < 7 && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-navy-400">Progress to 7-day streak</span>
              <span className="text-primary-400 font-medium">{streakData.currentStreak}/7 days</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${(streakData.currentStreak / 7) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}