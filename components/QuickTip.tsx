'use client'

import { useState, useEffect } from 'react'

const TIPS = [
  {
    icon: '💡',
    tip: 'Did you know? Consistent learning for just 15 minutes a day is more effective than cramming!',
  },
  {
    icon: '🎯',
    tip: 'Set small, achievable goals. Completing one lesson a day builds momentum!',
  },
  {
    icon: '📝',
    tip: 'Taking notes while learning improves retention by up to 40%.',
  },
  {
    icon: '🧠',
    tip: 'The Pomodoro Technique: 25 minutes of focus, then a 5-minute break works wonders!',
  },
  {
    icon: '🔄',
    tip: 'Spaced repetition is key! Review what you learned yesterday before starting something new.',
  },
  {
    icon: '💪',
    tip: 'Struggling is part of learning. Every expert was once a beginner!',
  },
  {
    icon: '🌟',
    tip: 'Teaching others what you learn is the best way to master any subject.',
  },
  {
    icon: '🎮',
    tip: 'Make learning fun! Try to apply new concepts in personal projects.',
  },
]

export default function QuickTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Pick a random tip on mount
    setTipIndex(Math.floor(Math.random() * TIPS.length))
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length)
      setIsAnimating(false)
    }, 200)
  }

  const dismissTip = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  const currentTip = TIPS[tipIndex]
  if (!currentTip) return null

  return (
    <div className="relative bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative flex items-start gap-4">
        <div className={`text-3xl transition-transform duration-200 ${isAnimating ? 'scale-75 opacity-50' : 'scale-100 opacity-100'}`}>
          {currentTip.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Quick Tip</span>
            <span className="text-navy-600">•</span>
            <span className="text-xs text-navy-500">{tipIndex + 1} of {TIPS.length}</span>
          </div>
          <p className={`text-navy-200 transition-all duration-200 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {currentTip.tip}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={nextTip}
            className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
            aria-label="Next tip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={dismissTip}
            className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}