'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    icon: '💡',
    category: 'Learning',
    tip: 'Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).',
  },
  {
    icon: '🎯',
    category: 'Coding',
    tip: 'Write code every day, even if it\'s just for 15 minutes. Consistency beats intensity.',
  },
  {
    icon: '🔧',
    category: 'Debugging',
    tip: 'When stuck on a bug, try explaining the problem out loud – rubber duck debugging really works!',
  },
  {
    icon: '📝',
    category: 'Note-taking',
    tip: 'Take notes while watching lessons and review them within 24 hours to boost retention by 60%.',
  },
  {
    icon: '🚀',
    category: 'Projects',
    tip: 'Build projects while learning. Applied knowledge sticks 3x better than passive watching.',
  },
  {
    icon: '🤝',
    category: 'Community',
    tip: 'Join a coding community or find a study buddy. Learning is better together!',
  },
  {
    icon: '😴',
    category: 'Rest',
    tip: 'Sleep is crucial for memory consolidation. Don\'t skip sleep to code more!',
  },
  {
    icon: '📚',
    category: 'Reading',
    tip: 'Read documentation before Stack Overflow. You\'ll learn more and become self-sufficient.',
  },
  {
    icon: '⌨️',
    category: 'Practice',
    tip: 'Type out code examples instead of copy-pasting. Muscle memory helps recall.',
  },
  {
    icon: '🎨',
    category: 'Creativity',
    tip: 'Recreate websites and apps you love. Reverse engineering is a powerful learning tool.',
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    setCurrentTip(tips[dayOfYear % tips.length])
  }, [])
  
  const getNextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = tips.indexOf(currentTip)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex])
      setIsAnimating(false)
    }, 300)
  }
  
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div 
          className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 
            flex items-center justify-center text-2xl border border-primary-500/20
            transition-transform duration-300 ${isAnimating ? 'scale-90 rotate-12' : 'scale-100 rotate-0'}`}
        >
          {currentTip.icon}
        </div>
        <div className={`flex-1 min-w-0 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
              Daily Tip
            </span>
            <span className="text-navy-600">•</span>
            <span className="text-xs text-navy-500">{currentTip.category}</span>
          </div>
          <p className="text-navy-200 text-sm sm:text-base truncate sm:whitespace-normal">
            {currentTip.tip}
          </p>
        </div>
      </div>
      <button
        onClick={getNextTip}
        className="flex-shrink-0 p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 
          border border-navy-700 hover:border-navy-600 transition-all duration-200
          group"
        aria-label="Get next tip"
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
  )
}