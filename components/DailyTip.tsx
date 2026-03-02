'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '💡',
    tip: "Practice coding for at least 30 minutes daily to build muscle memory.",
    category: "Productivity"
  },
  {
    emoji: '🎯',
    tip: "Break large projects into smaller, manageable tasks to avoid overwhelm.",
    category: "Project Management"
  },
  {
    emoji: '📝',
    tip: "Write comments in your code as if explaining it to a friend.",
    category: "Best Practices"
  },
  {
    emoji: '🔍',
    tip: "Read error messages carefully - they often tell you exactly what's wrong.",
    category: "Debugging"
  },
  {
    emoji: '🧪',
    tip: "Test your code frequently. Small bugs are easier to fix than big ones.",
    category: "Testing"
  },
  {
    emoji: '📚',
    tip: "Don't just copy code - understand what each line does.",
    category: "Learning"
  },
  {
    emoji: '🤝',
    tip: "Join coding communities - learning with others accelerates progress.",
    category: "Community"
  },
  {
    emoji: '🔄',
    tip: "Refactor your code regularly. Clean code is easier to maintain.",
    category: "Best Practices"
  },
  {
    emoji: '⌨️',
    tip: "Learn keyboard shortcuts for your IDE - they save hours over time.",
    category: "Productivity"
  },
  {
    emoji: '🎓',
    tip: "Teaching others what you've learned is the best way to solidify knowledge.",
    category: "Learning"
  },
  {
    emoji: '🌙',
    tip: "Take breaks! Your brain processes information while you rest.",
    category: "Wellness"
  },
  {
    emoji: '📊',
    tip: "Use version control from day one - even for small projects.",
    category: "Best Practices"
  }
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % learningTips.length)
  }, [])

  const currentTip = learningTips[tipIndex]

  const getNextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % learningTips.length)
      setIsVisible(true)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <div 
      className={`daily-tip-container transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent rounded-xl border border-primary-500/20">
        <div className={`text-3xl transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12' : ''}`}>
          {currentTip.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
              💡 Daily Learning Tip
            </span>
            <span className="px-2 py-0.5 text-xs bg-navy-800 text-navy-300 rounded-full">
              {currentTip.category}
            </span>
          </div>
          <p className="text-navy-200 text-sm sm:text-base">
            {currentTip.tip}
          </p>
        </div>
        <button
          onClick={getNextTip}
          className="flex-shrink-0 p-2 text-navy-400 hover:text-primary-400 hover:bg-navy-800/50 rounded-lg transition-all duration-200 group"
          title="Get another tip"
        >
          <svg 
            className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}