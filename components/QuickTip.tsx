'use client'

import { useState, useEffect } from 'react'

const tips = [
  { icon: "💡", tip: "Set a specific learning goal for each session to stay focused." },
  { icon: "⏰", tip: "The best time to learn is when you're most alert - find your peak hours!" },
  { icon: "📝", tip: "Taking notes by hand improves retention more than typing." },
  { icon: "🎯", tip: "Break complex topics into smaller chunks - it's easier to absorb!" },
  { icon: "🔄", tip: "Review what you learned yesterday before starting new material." },
  { icon: "💪", tip: "Struggling is part of learning - embrace the challenge!" },
  { icon: "🎮", tip: "Teaching others is the best way to reinforce your own knowledge." },
  { icon: "☕", tip: "Take short breaks every 25-30 minutes to maintain focus." },
  { icon: "🌙", tip: "Sleep helps consolidate learning - don't skimp on rest!" },
  { icon: "🏃", tip: "A short walk can boost creativity and problem-solving." },
  { icon: "🎧", tip: "Instrumental music can help with focus - try lo-fi beats!" },
  { icon: "📚", tip: "Read course descriptions first to set expectations." },
]

export default function QuickTip() {
  const [currentTip, setCurrentTip] = useState<typeof tips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show a random tip
    const randomIndex = Math.floor(Math.random() * tips.length)
    setCurrentTip(tips[randomIndex])
    
    // Delay visibility for smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const getNewTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * tips.length)
      setCurrentTip(tips[randomIndex])
      setIsVisible(true)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <div 
      className={`bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{currentTip.icon}</span>
        <div className="flex-1">
          <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Quick Learning Tip
          </div>
          <p className="text-navy-200 text-sm">
            {currentTip.tip}
          </p>
        </div>
        <button
          onClick={getNewTip}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-amber-500/20 transition-colors group"
          aria-label="Get new tip"
          title="Get another tip"
        >
          <svg 
            className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition-transform duration-300" 
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