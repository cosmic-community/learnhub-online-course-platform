'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    tip: 'Start with fundamentals before diving into advanced topics',
    category: 'Learning Strategy'
  },
  {
    emoji: '⏰',
    tip: 'Consistent 30-minute daily sessions beat occasional marathon learning',
    category: 'Time Management'
  },
  {
    emoji: '✍️',
    tip: 'Take notes while watching lessons to boost retention by 40%',
    category: 'Study Technique'
  },
  {
    emoji: '🔄',
    tip: 'Review what you learned yesterday before starting new material',
    category: 'Spaced Repetition'
  },
  {
    emoji: '💻',
    tip: 'Practice coding along with tutorials instead of just watching',
    category: 'Hands-on Learning'
  },
  {
    emoji: '🎯',
    tip: 'Set specific learning goals for each week to stay motivated',
    category: 'Goal Setting'
  },
  {
    emoji: '🧠',
    tip: 'Teach concepts to others - it\'s the best way to master them',
    category: 'Active Learning'
  },
  {
    emoji: '☕',
    tip: 'Take short breaks every 25 minutes to maintain focus',
    category: 'Pomodoro Technique'
  },
]

export default function DailyTip() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Select a "random" tip based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setCurrentTipIndex(dayOfYear % tips.length)
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length)
      setIsAnimating(false)
    }, 200)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
      setIsAnimating(false)
    }, 200)
  }

  const currentTip = tips[currentTipIndex]

  if (!currentTip) return null

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <button 
        onClick={prevTip}
        className="p-2 text-navy-400 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all duration-200 flex-shrink-0"
        aria-label="Previous tip"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className={`flex items-center gap-4 flex-1 justify-center transition-all duration-200 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary-500/10 to-transparent rounded-lg px-4 py-3">
          <span className="text-2xl flex-shrink-0">{currentTip.emoji}</span>
          <div className="min-w-0">
            <div className="text-xs text-primary-400 font-medium uppercase tracking-wider mb-0.5">
              {currentTip.category}
            </div>
            <p className="text-navy-200 text-sm sm:text-base">
              {currentTip.tip}
            </p>
          </div>
        </div>
      </div>

      <button 
        onClick={nextTip}
        className="p-2 text-navy-400 hover:text-white hover:bg-navy-800/50 rounded-lg transition-all duration-200 flex-shrink-0"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}