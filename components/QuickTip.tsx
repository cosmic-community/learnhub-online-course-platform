'use client'

import { useState, useEffect } from 'react'

const TIPS = [
  { emoji: '💡', tip: 'Start with fundamentals before diving into advanced topics' },
  { emoji: '🎯', tip: 'Set small, achievable learning goals each day' },
  { emoji: '📝', tip: 'Take notes while watching lessons to boost retention' },
  { emoji: '🔄', tip: 'Review what you learned yesterday before starting new content' },
  { emoji: '⏰', tip: 'Learning for 25 minutes with short breaks is most effective' },
  { emoji: '🤝', tip: 'Teaching others helps solidify your understanding' },
  { emoji: '🧪', tip: 'Practice coding along with video lessons' },
  { emoji: '🌟', tip: 'Celebrate small wins to stay motivated' },
]

export default function QuickTip() {
  const [currentTip, setCurrentTip] = useState(TIPS[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Pick a random tip on mount
    const randomIndex = Math.floor(Math.random() * TIPS.length)
    setCurrentTip(TIPS[randomIndex])

    // Rotate tips every 10 seconds
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        const newIndex = Math.floor(Math.random() * TIPS.length)
        setCurrentTip(TIPS[newIndex])
        setIsAnimating(false)
      }, 300)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className={`text-2xl transition-all duration-300 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
          {currentTip.emoji}
        </div>
        <div>
          <div className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-1">
            Learning Tip
          </div>
          <p className={`text-navy-200 text-sm transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {currentTip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}