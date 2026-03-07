'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '🎯',
    tip: 'Set a specific learning goal for today - even 15 minutes counts!',
    category: 'Focus',
  },
  {
    emoji: '🧠',
    tip: 'The best time to review is 24 hours after learning something new.',
    category: 'Memory',
  },
  {
    emoji: '💪',
    tip: 'Struggling is part of learning - embrace the challenge!',
    category: 'Mindset',
  },
  {
    emoji: '📝',
    tip: 'Teaching others what you learn doubles your retention.',
    category: 'Technique',
  },
  {
    emoji: '☕',
    tip: 'Take a 5-minute break every 25 minutes for peak focus.',
    category: 'Productivity',
  },
  {
    emoji: '🌟',
    tip: 'Consistency beats intensity - show up daily, even for a little.',
    category: 'Habit',
  },
  {
    emoji: '🔄',
    tip: 'Spaced repetition is 4x more effective than cramming.',
    category: 'Science',
  },
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a consistent tip based on the day
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    setTipIndex(dayOfYear % tips.length)
  }, [])

  const currentTip = tips[tipIndex]

  const nextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
      setIsVisible(true)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10 animate-pulse" />
      <div className="relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div 
              className={`text-4xl transition-all duration-300 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              {currentTip.emoji}
            </div>
            <div className={`transition-all duration-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Daily Learning Tip
                </span>
                <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full text-xs">
                  {currentTip.category}
                </span>
              </div>
              <p className="text-lg text-white font-medium leading-relaxed">
                {currentTip.tip}
              </p>
            </div>
          </div>
          <button
            onClick={nextTip}
            className="flex-shrink-0 p-2 hover:bg-navy-800 rounded-lg transition-colors group"
            aria-label="Next tip"
          >
            <svg 
              className="w-5 h-5 text-navy-400 group-hover:text-primary-400 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}