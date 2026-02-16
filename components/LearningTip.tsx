'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '🎯',
    tip: 'Set specific learning goals for each session to stay focused and motivated.',
    category: 'Productivity'
  },
  {
    emoji: '⏰',
    tip: 'The Pomodoro Technique: 25 minutes of focused learning, then a 5-minute break.',
    category: 'Time Management'
  },
  {
    emoji: '📝',
    tip: 'Take notes while learning - it improves retention by up to 50%!',
    category: 'Study Tips'
  },
  {
    emoji: '🔄',
    tip: 'Review what you learned yesterday before starting something new.',
    category: 'Retention'
  },
  {
    emoji: '💻',
    tip: 'Practice coding daily, even for just 15 minutes. Consistency beats intensity.',
    category: 'Coding'
  },
  {
    emoji: '🧠',
    tip: 'Teach what you learn to others - it\'s the best way to solidify knowledge.',
    category: 'Learning'
  },
  {
    emoji: '🌙',
    tip: 'Get enough sleep! Your brain consolidates learning while you rest.',
    category: 'Wellness'
  },
  {
    emoji: '🎮',
    tip: 'Gamify your learning: set challenges and reward yourself for milestones.',
    category: 'Motivation'
  }
]

export default function LearningTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a consistent tip based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
  }, [])

  const getNextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = tips.findIndex(t => t.tip === currentTip.tip)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border border-primary-500/20 p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary-400 text-sm font-medium">💡 Learning Tip of the Day</span>
            <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 text-xs rounded-full">
              {currentTip.category}
            </span>
          </div>
          <button
            onClick={getNextTip}
            className="p-2 hover:bg-navy-800/50 rounded-lg transition-colors group"
            aria-label="Next tip"
          >
            <svg 
              className="w-4 h-4 text-navy-400 group-hover:text-primary-400 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{currentTip.emoji}</span>
            <p className="text-navy-200 text-lg leading-relaxed">
              {currentTip.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}