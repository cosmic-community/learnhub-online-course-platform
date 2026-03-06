'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalDaysLearned: number
}

const motivationalMessages = [
  "You're on fire! 🔥",
  "Keep up the momentum! 💪",
  "Learning legend in the making! ⭐",
  "Consistency is key! 🗝️",
  "You're crushing it! 🎯",
  "Future expert loading... 📈",
  "Brain gains incoming! 🧠",
  "Unstoppable learner! 🚀",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [motivationalMsg, setMotivationalMsg] = useState('')

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastDate = new Date(data.lastActiveDate).toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastDate === today) {
          // Already logged today
          setStreakData(data)
        } else if (lastDate === yesterday) {
          // Continue streak
          const newData = {
            ...data,
            currentStreak: data.currentStreak + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
            lastActiveDate: today,
            totalDaysLearned: data.totalDaysLearned + 1,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
          
          // Celebrate milestones
          if ([3, 7, 14, 30, 50, 100].includes(newData.currentStreak)) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
        } else {
          // Streak broken, start fresh but keep total
          const newData = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            lastActiveDate: today,
            totalDaysLearned: data.totalDaysLearned + 1,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
        }
      } else {
        // First time user
        const newData = {
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
          totalDaysLearned: 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }

    loadStreakData()
    
    // Set random motivational message
    setMotivationalMsg(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
  }, [])

  if (!streakData) return null

  return (
    <div className="relative">
      {/* Confetti celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl animate-bounce">🔥</span>
            Learning Streak
          </h3>
          <div className="text-sm text-primary-400 font-medium">
            {motivationalMsg}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-navy-800/50">
            <div className="text-4xl font-bold text-primary-400 mb-1 tabular-nums streak-number">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400 uppercase tracking-wide">Day Streak</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-navy-800/50">
            <div className="text-4xl font-bold text-yellow-400 mb-1 tabular-nums">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-navy-400 uppercase tracking-wide">Best Streak</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-navy-800/50">
            <div className="text-4xl font-bold text-green-400 mb-1 tabular-nums">
              {streakData.totalDaysLearned}
            </div>
            <div className="text-xs text-navy-400 uppercase tracking-wide">Total Days</div>
          </div>
        </div>
        
        {/* Streak visualization */}
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(7)].map((_, i) => {
            const isActive = i < Math.min(streakData.currentStreak, 7)
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-500 text-white scale-110' 
                    : 'bg-navy-800 text-navy-500'
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {isActive ? '✓' : '○'}
              </div>
            )
          })}
        </div>
        
        {streakData.currentStreak >= 7 && (
          <div className="mt-3 text-center text-sm text-primary-400">
            + {streakData.currentStreak - 7} more days! 🎉
          </div>
        )}
      </div>
    </div>
  )
}