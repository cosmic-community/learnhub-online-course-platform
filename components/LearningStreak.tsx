'use client'

import { useState, useEffect } from 'react'

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [lastVisit, setLastVisit] = useState<string | null>(null)
  const [isNewVisit, setIsNewVisit] = useState(false)

  useEffect(() => {
    // Check localStorage for streak data
    const storedStreak = localStorage.getItem('learningStreak')
    const storedLastVisit = localStorage.getItem('lastLearningVisit')
    
    const today = new Date().toDateString()
    
    if (storedLastVisit) {
      setLastVisit(storedLastVisit)
      
      if (storedLastVisit === today) {
        // Same day visit
        setStreak(parseInt(storedStreak || '1'))
      } else {
        // Check if yesterday
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (storedLastVisit === yesterday.toDateString()) {
          // Consecutive day - increase streak
          const newStreak = parseInt(storedStreak || '0') + 1
          setStreak(newStreak)
          localStorage.setItem('learningStreak', newStreak.toString())
          setIsNewVisit(true)
        } else {
          // Streak broken - reset
          setStreak(1)
          localStorage.setItem('learningStreak', '1')
          setIsNewVisit(true)
        }
      }
    } else {
      // First visit ever
      setStreak(1)
      localStorage.setItem('learningStreak', '1')
      setIsNewVisit(true)
    }
    
    localStorage.setItem('lastLearningVisit', today)
  }, [])

  const getStreakMessage = () => {
    if (streak >= 30) return "🏆 Legendary! You're a learning machine!"
    if (streak >= 14) return "🌟 Amazing! Two weeks strong!"
    if (streak >= 7) return "🔥 On fire! A full week of learning!"
    if (streak >= 3) return "⚡ Great momentum! Keep it up!"
    if (streak >= 1) return "🌱 Every journey starts with a single step!"
    return "👋 Welcome! Start your streak today!"
  }

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🌟'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '⚡'
    return '🌱'
  }

  return (
    <div className="card p-6 relative overflow-hidden group hover:border-primary-500/30 transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStreakEmoji()}</span>
            <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
          </div>
          {isNewVisit && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 animate-pulse">
              +1 Today!
            </span>
          )}
        </div>
        
        <div className="flex items-end gap-2 mb-3">
          <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            {streak}
          </span>
          <span className="text-navy-400 mb-2">{streak === 1 ? 'day' : 'days'}</span>
        </div>
        
        <p className="text-navy-300 text-sm">{getStreakMessage()}</p>
        
        {/* Streak visualization */}
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < Math.min(streak, 7) 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                  : 'bg-navy-700'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <p className="text-xs text-navy-500 mt-2">Last 7 days</p>
      </div>
    </div>
  )
}