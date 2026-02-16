'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    tip: 'Set specific learning goals for each session. Small wins build momentum!',
    category: 'Productivity'
  },
  {
    emoji: '🧠',
    tip: 'Take breaks every 25-30 minutes. Your brain needs time to consolidate information.',
    category: 'Focus'
  },
  {
    emoji: '✍️',
    tip: 'Teaching others what you learn is one of the most effective ways to retain knowledge.',
    category: 'Retention'
  },
  {
    emoji: '🔄',
    tip: 'Spaced repetition beats cramming. Review material at increasing intervals.',
    category: 'Memory'
  },
  {
    emoji: '💪',
    tip: 'Consistency trumps intensity. 30 minutes daily beats 4 hours once a week.',
    category: 'Habits'
  },
  {
    emoji: '🎨',
    tip: 'Apply what you learn immediately. Build projects to solidify your understanding.',
    category: 'Practice'
  },
  {
    emoji: '🤝',
    tip: 'Join a community of learners. Collaboration accelerates growth.',
    category: 'Community'
  },
  {
    emoji: '📝',
    tip: 'Take handwritten notes when possible. It improves comprehension and recall.',
    category: 'Study Tips'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTip(dayOfYear % learningTips.length)
  }, [])

  const nextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
      setIsVisible(true)
    }, 300)
  }

  const prevTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + learningTips.length) % learningTips.length)
      setIsVisible(true)
    }, 300)
  }

  const tip = learningTips[currentTip]

  if (!tip) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-600/5 to-navy-900/50 border border-primary-500/20 p-6 md:p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <span className="text-sm font-medium text-primary-400">Daily Learning Tip</span>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-primary-500/20 text-primary-300">
            {tip.category}
          </span>
        </div>
        
        <div 
          className={`transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">{tip.emoji}</span>
            <p className="text-lg text-white leading-relaxed">{tip.tip}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1">
            {learningTips.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(() => {
                    setCurrentTip(index)
                    setIsVisible(true)
                  }, 300)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTip 
                    ? 'bg-primary-400 w-4' 
                    : 'bg-navy-600 hover:bg-navy-500'
                }`}
                aria-label={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={prevTip}
              className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-300 hover:text-white transition-colors"
              aria-label="Previous tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTip}
              className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-300 hover:text-white transition-colors"
              aria-label="Next tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}