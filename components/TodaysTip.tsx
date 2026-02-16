'use client'

import { useState, useEffect } from 'react'

const tips = [
  { emoji: '💡', tip: 'Break learning into 25-minute focused sessions for better retention.' },
  { emoji: '📝', tip: 'Take notes by hand - it helps encode information more deeply.' },
  { emoji: '🔄', tip: 'Review yesterday\'s lesson before starting a new one.' },
  { emoji: '🎯', tip: 'Set a specific goal for each learning session.' },
  { emoji: '☕', tip: 'Stay hydrated! Your brain works better when properly hydrated.' },
  { emoji: '🌙', tip: 'Sleep helps consolidate learning. Don\'t skip rest!' },
  { emoji: '💪', tip: 'Struggle is part of learning - embrace challenging concepts.' },
  { emoji: '🗣️', tip: 'Teach what you learn to others - it deepens understanding.' },
  { emoji: '🧩', tip: 'Connect new concepts to things you already know.' },
  { emoji: '⏰', tip: 'Consistency beats intensity - learn a little every day.' },
]

export default function TodaysTip() {
  const [tip, setTip] = useState<typeof tips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setTip(tips[tipIndex])
  }, [])

  if (!tip || !isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-l-4 border-primary-500 rounded-r-xl p-4 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-navy-500 hover:text-navy-300 transition-colors"
        aria-label="Dismiss tip"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="flex items-start gap-3 pr-6">
        <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
        <div>
          <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
            Today's Learning Tip
          </span>
          <p className="text-navy-200 text-sm mt-1">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}