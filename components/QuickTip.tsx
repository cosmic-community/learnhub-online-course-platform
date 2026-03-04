'use client'

import { useState, useEffect } from 'react'

const tips = [
  { emoji: '💡', tip: 'Consistency beats intensity. Even 15 minutes daily compounds into mastery.' },
  { emoji: '🎯', tip: 'Set specific learning goals. "Learn React" is vague; "Build a todo app" is actionable.' },
  { emoji: '✍️', tip: 'Take notes while learning. Writing reinforces memory better than passive watching.' },
  { emoji: '🔄', tip: 'Spaced repetition works. Review concepts after 1 day, 1 week, and 1 month.' },
  { emoji: '🏃', tip: 'Apply immediately. Build something with new knowledge within 24 hours.' },
  { emoji: '🤝', tip: 'Teach others. Explaining concepts reveals gaps in your understanding.' },
  { emoji: '🧘', tip: 'Rest is productive. Your brain consolidates learning during breaks and sleep.' },
  { emoji: '🎮', tip: 'Make it fun. Gamify your learning with streaks, challenges, and rewards.' },
  { emoji: '📚', tip: 'Mix topics. Interleaving different subjects improves long-term retention.' },
  { emoji: '🚀', tip: 'Embrace confusion. Struggle is where real learning happens.' },
]

export default function QuickTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Select random tip on mount
    const randomIndex = Math.floor(Math.random() * tips.length)
    setCurrentTip(tips[randomIndex])
  }, [])

  const getNewTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * tips.length)
      } while (tips[newIndex] === currentTip)
      setCurrentTip(tips[newIndex])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
      <div className="flex items-start gap-4">
        <div 
          className={`text-4xl transform transition-all duration-300 ${
            isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
          }`}
        >
          {currentTip.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
              Learning Tip
            </h4>
            <button
              onClick={getNewTip}
              className="text-navy-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Tip
            </button>
          </div>
          <p 
            className={`text-white leading-relaxed transition-opacity duration-300 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {currentTip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}