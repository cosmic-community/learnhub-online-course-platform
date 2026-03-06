'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    tip: 'Set specific learning goals for each session',
    detail: 'Break down your learning into 25-minute focused blocks'
  },
  {
    emoji: '📝',
    tip: 'Take notes while watching lessons',
    detail: 'Writing helps encode information into long-term memory'
  },
  {
    emoji: '🔄',
    tip: 'Review previous lessons regularly',
    detail: 'Spaced repetition dramatically improves retention'
  },
  {
    emoji: '💻',
    tip: 'Practice coding along with tutorials',
    detail: 'Active learning beats passive watching every time'
  },
  {
    emoji: '🤝',
    tip: 'Teach what you learn to others',
    detail: 'The best way to solidify knowledge is to explain it'
  },
  {
    emoji: '☕',
    tip: 'Take regular breaks to stay sharp',
    detail: 'Your brain needs rest to consolidate new information'
  },
  {
    emoji: '🎮',
    tip: 'Build projects to apply your skills',
    detail: 'Real projects create lasting understanding'
  },
  {
    emoji: '📚',
    tip: 'Focus on fundamentals first',
    detail: 'Strong foundations make advanced topics easier'
  },
  {
    emoji: '🌙',
    tip: 'Get enough sleep',
    detail: 'Memory consolidation happens during sleep'
  },
  {
    emoji: '🚀',
    tip: 'Start with small wins',
    detail: 'Completing small tasks builds momentum for bigger challenges'
  }
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Select tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % learningTips.length)
    
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const tip = learningTips[tipIndex]
  if (!tip) return null

  return (
    <div 
      className={`bg-gradient-to-r from-navy-800/80 to-navy-900/80 border border-navy-700 rounded-xl p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{tip.emoji}</div>
        <div>
          <div className="text-xs text-primary-400 font-medium mb-1 uppercase tracking-wide">
            💡 Daily Learning Tip
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {tip.tip}
          </h3>
          <p className="text-navy-300 text-sm">
            {tip.detail}
          </p>
        </div>
      </div>
    </div>
  )
}