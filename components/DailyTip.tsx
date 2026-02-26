'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: '💡',
    title: 'Consistency is Key',
    tip: 'Even 15-30 minutes of daily learning is more effective than occasional long sessions. Build a habit!',
  },
  {
    icon: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to achieve before starting a course. Having clear goals keeps you motivated.',
  },
  {
    icon: '✍️',
    title: 'Take Notes',
    tip: 'Writing down key concepts helps reinforce learning. Try explaining what you learned in your own words.',
  },
  {
    icon: '🔄',
    title: 'Practice Makes Perfect',
    tip: 'Apply what you learn immediately. Build projects, solve problems, and experiment with new concepts.',
  },
  {
    icon: '🧠',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals. This technique dramatically improves long-term retention.',
  },
  {
    icon: '🤝',
    title: 'Join the Community',
    tip: 'Learning with others accelerates growth. Share your progress and help fellow learners.',
  },
  {
    icon: '😴',
    title: 'Rest is Productive',
    tip: 'Your brain consolidates learning during sleep. Get enough rest for better retention and creativity.',
  },
  {
    icon: '📱',
    title: 'Minimize Distractions',
    tip: 'Turn off notifications and create a dedicated learning environment for focused study sessions.',
  },
  {
    icon: '🎮',
    title: 'Gamify Your Learning',
    tip: 'Set challenges, track streaks, and reward yourself for milestones. Make learning fun!',
  },
  {
    icon: '📊',
    title: 'Track Your Progress',
    tip: 'Keep a learning journal. Seeing how far you have come is incredibly motivating.',
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Get tip based on day of year for consistency
  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    setCurrentTip(dayOfYear % learningTips.length)
  }, [])

  const nextTip = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
      setIsAnimating(false)
    }, 300)
  }

  const prevTip = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + learningTips.length) % learningTips.length)
      setIsAnimating(false)
    }, 300)
  }

  const tip = learningTips[currentTip]
  
  if (!tip) return null

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={prevTip}
        className="p-2 rounded-full bg-navy-800/50 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
        aria-label="Previous tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={`flex-1 flex items-center gap-4 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-2xl">
          {tip.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider">Daily Learning Tip</span>
            <span className="text-navy-500 text-xs">#{currentTip + 1}/{learningTips.length}</span>
          </div>
          <p className="text-white font-medium">{tip.title}</p>
          <p className="text-navy-400 text-sm line-clamp-1 sm:line-clamp-none">{tip.tip}</p>
        </div>
      </div>

      <button
        onClick={nextTip}
        className="p-2 rounded-full bg-navy-800/50 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}