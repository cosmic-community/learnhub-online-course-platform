'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    tip: 'Set specific learning goals for each session to stay focused and motivated.',
  },
  {
    emoji: '⏰',
    tip: 'The Pomodoro Technique: Study for 25 minutes, then take a 5-minute break.',
  },
  {
    emoji: '📝',
    tip: 'Teaching others is one of the best ways to solidify your understanding.',
  },
  {
    emoji: '🔄',
    tip: 'Spaced repetition helps move knowledge from short-term to long-term memory.',
  },
  {
    emoji: '💪',
    tip: 'Consistency beats intensity. 30 minutes daily is better than 3 hours once a week.',
  },
  {
    emoji: '🧠',
    tip: 'Take handwritten notes while learning. It improves retention by 29%.',
  },
  {
    emoji: '🌟',
    tip: 'Celebrate small wins! Completed a lesson? You\'re one step closer to mastery.',
  },
  {
    emoji: '🔍',
    tip: 'Don\'t just read code—type it out. Muscle memory accelerates learning.',
  },
  {
    emoji: '🤝',
    tip: 'Join a study group or community. Learning together keeps you accountable.',
  },
  {
    emoji: '😴',
    tip: 'Sleep consolidates learning. A good night\'s rest helps you retain more.',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get consistent daily tip based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Animate in after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <span className="text-4xl flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }}>
            {tip.emoji}
          </span>
          <div>
            <div className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-1">
              💡 Daily Learning Tip
            </div>
            <p className="text-navy-200 text-lg leading-relaxed">
              {tip.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}