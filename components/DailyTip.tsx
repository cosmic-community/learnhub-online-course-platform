'use client'

import { useState, useEffect } from 'react'

const tips = [
  { icon: '💡', tip: 'Consistency beats intensity. Just 20 minutes of daily learning creates lasting habits.' },
  { icon: '🎯', tip: 'Focus on one concept at a time. Multitasking reduces retention by up to 40%.' },
  { icon: '📝', tip: 'Take notes while learning. Writing helps transfer knowledge to long-term memory.' },
  { icon: '🔄', tip: 'Review yesterday\'s lesson before starting new material. Spaced repetition works!' },
  { icon: '🧠', tip: 'Teach what you learn to someone else. It\'s the best way to solidify understanding.' },
  { icon: '⏰', tip: 'Your brain learns best in the morning. Schedule complex topics for early sessions.' },
  { icon: '🎮', tip: 'Gamify your learning! Set small goals and reward yourself when you hit them.' },
  { icon: '💪', tip: 'Struggle is good. When learning feels hard, that\'s when growth happens.' },
  { icon: '🌟', tip: 'Celebrate small wins. Each completed lesson is a step toward mastery.' },
  { icon: '🔗', tip: 'Connect new knowledge to what you already know. It makes recall much easier.' },
]

export default function DailyTip() {
  const [tip, setTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setTip(tips[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  return (
    <div 
      className={`bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{tip.icon}</div>
        <div>
          <div className="text-xs text-yellow-400/80 font-semibold uppercase tracking-wide mb-1">
            💫 Daily Learning Tip
          </div>
          <p className="text-navy-200 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}