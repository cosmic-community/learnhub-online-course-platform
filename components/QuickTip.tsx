'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    emoji: "🧠",
    tip: "Take short breaks every 25 minutes using the Pomodoro technique for better retention.",
  },
  {
    emoji: "📝",
    tip: "Write notes by hand - it helps cement concepts in your memory better than typing.",
  },
  {
    emoji: "🎯",
    tip: "Set specific learning goals for each session to stay focused and motivated.",
  },
  {
    emoji: "🔄",
    tip: "Review what you learned yesterday before starting new material.",
  },
  {
    emoji: "💡",
    tip: "Teach what you learn to someone else - it's the best way to master a topic.",
  },
  {
    emoji: "🌙",
    tip: "Get enough sleep! Your brain consolidates learning while you rest.",
  },
  {
    emoji: "🏃",
    tip: "A quick walk before studying can boost your focus and creativity.",
  },
  {
    emoji: "🎵",
    tip: "Try lo-fi music or nature sounds while coding - it can help you concentrate.",
  },
]

export default function QuickTip() {
  const [tip, setTip] = useState(LEARNING_TIPS[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user dismissed the tip today
    const dismissedDate = localStorage.getItem('learnhub_tip_dismissed')
    const today = new Date().toDateString()
    
    if (dismissedDate === today) {
      setIsDismissed(true)
      return
    }

    // Get a random tip
    const randomTip = LEARNING_TIPS[Math.floor(Math.random() * LEARNING_TIPS.length)]
    setTip(randomTip)
    
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsDismissed(true)
      localStorage.setItem('learnhub_tip_dismissed', new Date().toDateString())
    }, 300)
  }

  if (isDismissed) return null

  return (
    <div 
      className={`transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-4 relative group">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-navy-500 hover:text-navy-300 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Dismiss tip"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-start gap-3">
          <span className="text-2xl">{tip.emoji}</span>
          <div>
            <div className="text-xs text-primary-400 font-semibold mb-1">💡 Learning Tip</div>
            <p className="text-sm text-navy-300">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}