'use client'

import { useState, useEffect } from 'react'

const motivationalMessages = [
  { emoji: '🔥', message: "You're on fire! Keep the momentum going." },
  { emoji: '⭐', message: "Great things take time. You're doing amazing!" },
  { emoji: '💪', message: "Every expert was once a beginner. Keep learning!" },
  { emoji: '🎯', message: "Focus on progress, not perfection." },
  { emoji: '🚀', message: "The only way to do great work is to love what you do." },
  { emoji: '✨', message: "Learning is a journey, not a destination." },
  { emoji: '🌟', message: "Small steps lead to big achievements." },
  { emoji: '💡', message: "Curiosity is the spark of learning." },
]

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [todayMessage, setTodayMessage] = useState(motivationalMessages[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get or initialize streak from localStorage
    const savedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisit')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      // Same day, keep streak
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day, increment streak
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learningStreak', newStreak.toString())
        setIsAnimating(true)
      } else {
        // Streak broken, reset
        setStreak(1)
        localStorage.setItem('learningStreak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learningStreak', '1')
    }

    localStorage.setItem('lastVisit', today)

    // Pick a message based on the day
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTodayMessage(motivationalMessages[dayOfYear % motivationalMessages.length] || motivationalMessages[0])
  }, [])

  return (
    <div className="card p-6 relative overflow-hidden group hover:border-primary-500/30 transition-all duration-500">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Sparkle effects */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-yellow-400 animate-pulse">✨</span>
      </div>
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className={`text-4xl ${isAnimating ? 'animate-bounce' : ''}`}>
            {todayMessage.emoji}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Daily Motivation</h3>
            <p className="text-sm text-navy-400">Keep your learning streak alive!</p>
          </div>
        </div>
        
        <p className="text-navy-200 mb-6 italic">
          "{todayMessage.message}"
        </p>
        
        {/* Streak Counter */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(Math.min(streak, 7))].map((_, i) => (
                <span 
                  key={i} 
                  className="text-2xl animate-flame"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  🔥
                </span>
              ))}
              {streak > 7 && (
                <span className="text-lg text-navy-400 ml-1">+{streak - 7}</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {streak} day{streak !== 1 ? 's' : ''}
            </div>
            <div className="text-sm text-navy-400">Learning streak</div>
          </div>
        </div>
        
        {/* Milestone badges */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {streak >= 3 && (
            <span className="badge bg-orange-500/20 text-orange-400 animate-fade-in">
              🏅 3 Day Streak!
            </span>
          )}
          {streak >= 7 && (
            <span className="badge bg-purple-500/20 text-purple-400 animate-fade-in">
              🏆 Week Warrior
            </span>
          )}
          {streak >= 30 && (
            <span className="badge bg-yellow-500/20 text-yellow-400 animate-fade-in">
              👑 Monthly Master
            </span>
          )}
        </div>
      </div>
    </div>
  )
}