'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: '💡',
    tip: 'Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).',
    category: 'Productivity'
  },
  {
    icon: '🎯',
    tip: 'Set specific learning goals for each session. "Learn React hooks" beats "study React".',
    category: 'Goal Setting'
  },
  {
    icon: '✍️',
    tip: 'Teaching others what you learn helps you retain 90% of the information.',
    category: 'Retention'
  },
  {
    icon: '🔄',
    tip: 'Spaced repetition: Review material at increasing intervals for long-term retention.',
    category: 'Memory'
  },
  {
    icon: '💻',
    tip: 'Code along with tutorials, then try building something similar on your own.',
    category: 'Practice'
  },
  {
    icon: '🌙',
    tip: 'Sleep helps consolidate learning. A well-rested mind learns 40% more effectively.',
    category: 'Wellness'
  },
  {
    icon: '📝',
    tip: 'Take handwritten notes while watching lessons—it improves recall by 34%.',
    category: 'Note-Taking'
  },
  {
    icon: '🚀',
    tip: 'Build projects! Real-world application is the fastest path to mastery.',
    category: 'Application'
  },
  {
    icon: '🤝',
    tip: 'Join a community. Learning with others increases motivation and provides support.',
    category: 'Community'
  },
  {
    icon: '⏰',
    tip: 'Consistency beats intensity. 30 minutes daily outperforms 3 hours once a week.',
    category: 'Consistency'
  }
]

export default function DailyLearningTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(true)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - Date.UTC(new Date().getFullYear(), 0, 0)) / 86400000)
    const initialIndex = dayOfYear % learningTips.length
    setTipIndex(initialIndex)
    setCurrentTip(learningTips[initialIndex])
  }, [])

  const nextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const newIndex = (tipIndex + 1) % learningTips.length
      setTipIndex(newIndex)
      setCurrentTip(learningTips[newIndex])
      setIsVisible(true)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border border-primary-500/20 p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary-400 text-sm font-medium">💫 Daily Learning Tip</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-xs">
              {currentTip.category}
            </span>
          </div>
          <button
            onClick={nextTip}
            className="text-navy-400 hover:text-primary-400 transition-colors p-1 rounded-lg hover:bg-navy-800/50"
            aria-label="Next tip"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div 
          className={`transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">{currentTip.icon}</span>
            <p className="text-navy-200 text-lg leading-relaxed">
              {currentTip.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}