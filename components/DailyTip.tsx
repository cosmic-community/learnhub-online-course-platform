'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: '💡',
    title: 'Start Small',
    tip: 'Break large topics into smaller chunks. Learning 15 minutes daily beats 2-hour weekend sessions.',
  },
  {
    icon: '🎯',
    title: 'Practice Actively',
    tip: 'Don\'t just watch — code along! Active practice helps concepts stick 3x better.',
  },
  {
    icon: '🔄',
    title: 'Review Regularly',
    tip: 'Revisit completed lessons after a week. Spaced repetition strengthens memory.',
  },
  {
    icon: '🤝',
    title: 'Teach Others',
    tip: 'Explaining concepts to others is the best way to solidify your understanding.',
  },
  {
    icon: '🚀',
    title: 'Build Projects',
    tip: 'Apply what you learn immediately. Real projects create real skills.',
  },
  {
    icon: '📝',
    title: 'Take Notes',
    tip: 'Write down key concepts in your own words. It\'s like a conversation with your future self.',
  },
  {
    icon: '😴',
    title: 'Rest Well',
    tip: 'Your brain consolidates learning during sleep. Don\'t skip rest!',
  },
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    setTipIndex(dayOfYear % learningTips.length)
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const tip = learningTips[tipIndex]

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-800/50 to-navy-900/50 border border-primary-500/20 p-6">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{tip.icon}</span>
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              Daily Learning Tip
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            {tip.title}
          </h3>
          
          <p className="text-navy-300 text-sm leading-relaxed">
            {tip.tip}
          </p>
        </div>
        
        {/* Sparkle decoration */}
        <div className="absolute bottom-2 right-2 text-primary-500/30 text-4xl">
          ✨
        </div>
      </div>
    </div>
  )
}