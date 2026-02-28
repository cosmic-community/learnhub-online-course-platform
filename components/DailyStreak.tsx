'use client'

import { useState, useEffect } from 'react'

export default function DailyStreak() {
  const [streak, setStreak] = useState<number>(0)
  const [isNew, setIsNew] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedProgress = localStorage.getItem('learnhub-progress')
    
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setStreak(parsed.currentStreak || 0)
      
      const today = new Date().toDateString()
      const lastVisit = new Date(parsed.lastVisit).toDateString()
      
      if (lastVisit !== today) {
        setIsNew(true)
      }
    } else {
      setStreak(1)
      setIsNew(true)
    }
  }, [])

  if (!mounted) {
    return null
  }

  if (streak === 0) return null

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-full text-orange-300 ${isNew ? 'animate-badge-popup' : 'animate-fade-in'}`}>
      <span className={`text-xl ${streak >= 7 ? 'animate-fire' : 'animate-bounce-subtle'}`}>
        🔥
      </span>
      <span className="font-semibold">
        {streak} Day{streak !== 1 ? 's' : ''} Streak
      </span>
      {isNew && streak > 1 && (
        <span className="text-xs bg-orange-500/30 px-2 py-0.5 rounded-full">
          +1 🎉
        </span>
      )}
    </div>
  )
}