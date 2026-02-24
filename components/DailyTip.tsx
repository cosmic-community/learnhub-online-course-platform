'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: '💡',
    title: 'Set Clear Goals',
    tip: 'Break your learning into small, achievable milestones. Complete one lesson a day to build momentum!'
  },
  {
    icon: '🎯',
    title: 'Practice Makes Perfect',
    tip: 'Apply what you learn immediately. Code along with tutorials and build projects to reinforce concepts.'
  },
  {
    icon: '📝',
    title: 'Take Notes',
    tip: 'Writing things down helps retention. Keep a learning journal to track your progress and insights.'
  },
  {
    icon: '🤝',
    title: 'Join the Community',
    tip: 'Connect with fellow learners. Teaching others is one of the best ways to solidify your knowledge.'
  },
  {
    icon: '⏰',
    title: 'Consistent Schedule',
    tip: 'Learn at the same time each day. Even 30 minutes of focused study compounds over time!'
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review concepts after 1 day, 3 days, and 1 week. This scientifically-proven method boosts retention.'
  },
  {
    icon: '🧘',
    title: 'Take Breaks',
    tip: 'The Pomodoro Technique works! Study for 25 minutes, then take a 5-minute break to stay fresh.'
  },
]

export default function DailyTip() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Set initial tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTipIndex(dayOfYear % learningTips.length)
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % learningTips.length)
      setIsAnimating(false)
    }, 150)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev - 1 + learningTips.length) % learningTips.length)
      setIsAnimating(false)
    }, 150)
  }

  const currentTip = learningTips[currentTipIndex]

  return (
    <div className="flex items-center justify-between gap-4">
      <button 
        onClick={prevTip}
        className="p-2 rounded-full bg-navy-800/50 hover:bg-navy-800 text-navy-400 hover:text-white transition-colors"
        aria-label="Previous tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div 
        className={`flex-1 flex items-center justify-center gap-4 transition-all duration-150 ${
          isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        }`}
      >
        <div className="text-3xl">{currentTip.icon}</div>
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-primary-400 text-xs font-semibold uppercase tracking-wide">Daily Learning Tip</span>
            <span className="text-navy-600">•</span>
            <span className="text-navy-500 text-xs">{currentTipIndex + 1} of {learningTips.length}</span>
          </div>
          <p className="text-white font-medium">
            <span className="text-primary-400">{currentTip.title}:</span>{' '}
            <span className="text-navy-200">{currentTip.tip}</span>
          </p>
        </div>
      </div>

      <button 
        onClick={nextTip}
        className="p-2 rounded-full bg-navy-800/50 hover:bg-navy-800 text-navy-400 hover:text-white transition-colors"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}