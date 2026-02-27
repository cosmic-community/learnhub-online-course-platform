'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    emoji: "🎯",
    tip: "Set specific learning goals",
    detail: "Instead of 'learn JavaScript', try 'complete 2 lessons on arrays today'"
  },
  {
    emoji: "⏰",
    tip: "Use the Pomodoro Technique",
    detail: "Study for 25 minutes, then take a 5-minute break. Repeat!"
  },
  {
    emoji: "✍️",
    tip: "Practice active recall",
    detail: "After each lesson, close it and write down what you remember"
  },
  {
    emoji: "🔄",
    tip: "Spaced repetition works",
    detail: "Review yesterday's lesson before starting today's new material"
  },
  {
    emoji: "💻",
    tip: "Code along, don't just watch",
    detail: "Type every line of code yourself - muscle memory matters!"
  },
  {
    emoji: "📝",
    tip: "Teach what you learn",
    detail: "Explain concepts to a friend or rubber duck - it deepens understanding"
  },
  {
    emoji: "🌙",
    tip: "Sleep consolidates learning",
    detail: "Your brain processes new information while you sleep - rest well!"
  },
  {
    emoji: "🏃",
    tip: "Consistency beats intensity",
    detail: "30 minutes daily is better than 5 hours once a week"
  },
  {
    emoji: "❌",
    tip: "Embrace errors and bugs",
    detail: "Every bug you fix teaches you something new about coding"
  },
  {
    emoji: "🤝",
    tip: "Join a learning community",
    detail: "Learning with others keeps you motivated and accountable"
  },
  {
    emoji: "📚",
    tip: "Build projects, not just tutorials",
    detail: "Apply what you learn by building something you care about"
  },
  {
    emoji: "🧘",
    tip: "Take breaks when stuck",
    detail: "Step away when frustrated - solutions often come during rest"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get today's tip based on day of year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
    
    // Check if dismissed today
    const dismissed = localStorage.getItem('learnhub-tip-dismissed')
    const today = new Date().toDateString()
    if (dismissed === today) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
  }

  if (!tip || !isVisible) return null

  return (
    <div className="relative bg-navy-900/50 backdrop-blur-sm border border-primary-500/20 rounded-xl p-4 flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
        <span className="text-2xl">{tip.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">
            💡 Daily Learning Tip
          </span>
        </div>
        <p className="text-white font-medium">{tip.tip}</p>
        <p className="text-sm text-navy-400 truncate">{tip.detail}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-2 text-navy-500 hover:text-navy-300 transition-colors"
        aria-label="Dismiss tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}