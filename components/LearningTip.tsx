'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '💡',
    tip: "Consistency beats intensity. 20 minutes daily is better than 3 hours once a week!",
    category: 'Habit'
  },
  {
    emoji: '🧠',
    tip: "Take notes by hand — studies show it improves retention by 25%!",
    category: 'Memory'
  },
  {
    emoji: '🎯',
    tip: "Set specific goals. 'Learn React' becomes 'Build a todo app with React'.",
    category: 'Goals'
  },
  {
    emoji: '☕',
    tip: "The Pomodoro Technique: 25 min focus + 5 min break = maximum retention.",
    category: 'Productivity'
  },
  {
    emoji: '🔄',
    tip: "Teaching others is the best way to learn. Explain concepts to a rubber duck!",
    category: 'Technique'
  },
  {
    emoji: '😴',
    tip: "Sleep is crucial for learning. Your brain processes new info during rest.",
    category: 'Wellness'
  },
  {
    emoji: '🏃',
    tip: "Exercise before studying increases focus and memory formation.",
    category: 'Wellness'
  },
  {
    emoji: '📝',
    tip: "Active recall > passive reading. Test yourself frequently!",
    category: 'Memory'
  },
]

export default function LearningTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(true)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Get a random starting tip based on the day
    const today = new Date().getDate()
    const startIndex = today % learningTips.length
    setTipIndex(startIndex)
    setCurrentTip(learningTips[startIndex])
  }, [])

  const handleNextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const nextIndex = (tipIndex + 1) % learningTips.length
      setTipIndex(nextIndex)
      setCurrentTip(learningTips[nextIndex])
      setIsVisible(true)
    }, 300)
  }

  return (
    <div className="mb-8">
      <div 
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="text-xl animate-bounce-subtle">{currentTip.emoji}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
            Tip of the Day
          </span>
          <span className="text-navy-400">•</span>
          <span className="text-sm text-navy-200">{currentTip.tip}</span>
        </div>
        <button 
          onClick={handleNextTip}
          className="ml-2 p-1 rounded-full hover:bg-primary-500/20 transition-colors"
          aria-label="Next tip"
        >
          <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}