'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Break your learning into small, achievable milestones. Complete one lesson a day to build momentum!'
  },
  {
    emoji: '⏰',
    title: 'Consistent Practice',
    tip: 'Just 30 minutes of focused learning daily is more effective than occasional long sessions.'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    tip: 'Writing things down helps you remember. Try explaining concepts in your own words!'
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review what you learned after 1 day, 3 days, and 1 week to lock it into long-term memory.'
  },
  {
    emoji: '💡',
    title: 'Learn by Doing',
    tip: 'Apply what you learn immediately. Build projects, even small ones, to reinforce concepts.'
  },
  {
    emoji: '🤝',
    title: 'Teach Others',
    tip: 'The best way to learn is to teach. Explain concepts to others or write about what you learned.'
  },
  {
    emoji: '😴',
    title: 'Rest is Productive',
    tip: 'Your brain consolidates learning during sleep. Get enough rest for optimal retention!'
  },
  {
    emoji: '🎮',
    title: 'Gamify Learning',
    tip: 'Challenge yourself with coding exercises. Treat learning like a game with levels to unlock!'
  }
]

export default function LearningTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a "random" tip based on the current day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setCurrentTip(learningTips[tipIndex])
  }, [])

  const getNextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const currentIndex = learningTips.indexOf(currentTip)
      const nextIndex = (currentIndex + 1) % learningTips.length
      setCurrentTip(learningTips[nextIndex])
      setIsVisible(true)
    }, 300)
  }

  return (
    <div className={`flex items-center justify-between gap-6 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
          {currentTip.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
              💡 Learning Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-400">{currentTip.title}</span>
          </div>
          <p className="text-navy-200 text-sm sm:text-base">
            {currentTip.tip}
          </p>
        </div>
      </div>
      <button
        onClick={getNextTip}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-navy-800 text-navy-400 hover:text-white transition-colors"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}