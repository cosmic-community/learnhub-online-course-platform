'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    tip: 'Set specific learning goals for each session',
    detail: 'Having clear objectives helps you stay focused and measure progress.'
  },
  {
    emoji: '⏰',
    tip: 'Use the Pomodoro Technique',
    detail: '25 minutes of focused learning, then a 5-minute break. Repeat 4 times, then take a longer break.'
  },
  {
    emoji: '📝',
    tip: 'Take notes by hand',
    detail: 'Writing engages different parts of your brain, improving retention and understanding.'
  },
  {
    emoji: '🔄',
    tip: 'Practice spaced repetition',
    detail: 'Review material at increasing intervals to move it into long-term memory.'
  },
  {
    emoji: '🏗️',
    tip: 'Build projects as you learn',
    detail: 'Applying knowledge immediately reinforces what you learn and builds your portfolio.'
  },
  {
    emoji: '🤝',
    tip: 'Teach what you learn',
    detail: 'Explaining concepts to others is one of the best ways to solidify your understanding.'
  },
  {
    emoji: '💪',
    tip: 'Embrace productive struggle',
    detail: 'Challenging yourself slightly beyond your comfort zone accelerates growth.'
  },
  {
    emoji: '🌙',
    tip: 'Get enough sleep',
    detail: 'Sleep is crucial for memory consolidation. Your brain processes what you learned while you rest.'
  },
  {
    emoji: '🎮',
    tip: 'Make learning fun',
    detail: 'Gamify your learning with challenges and rewards to stay motivated.'
  },
  {
    emoji: '📚',
    tip: 'Learn in multiple formats',
    detail: 'Watch videos, read docs, and practice coding. Different formats reinforce the same concepts.'
  },
  {
    emoji: '🧘',
    tip: 'Start with a clear mind',
    detail: 'A few minutes of meditation or deep breathing before learning improves focus.'
  },
  {
    emoji: '🎉',
    tip: 'Celebrate small wins',
    detail: 'Acknowledge your progress, no matter how small. It builds momentum and motivation.'
  },
  {
    emoji: '❓',
    tip: 'Ask questions constantly',
    detail: 'Curiosity drives deeper understanding. Never be afraid to ask "why?"'
  },
  {
    emoji: '🔍',
    tip: 'Review before you start',
    detail: 'Spend 5 minutes reviewing yesterday\'s lesson before starting something new.'
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
  }, [])

  if (!tip) return null

  return (
    <div 
      className="relative bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary-500/40"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0 animate-pulse-slow">
          {tip.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              Daily Learning Tip
            </span>
            <span className="text-xs text-navy-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {tip.tip}
          </h3>
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-navy-300 text-sm">
              {tip.detail}
            </p>
          </div>
          <button 
            className="text-xs text-primary-400 hover:text-primary-300 mt-2 flex items-center gap-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? 'Show less' : 'Learn more'}
            <svg 
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-2xl pointer-events-none" />
    </div>
  )
}