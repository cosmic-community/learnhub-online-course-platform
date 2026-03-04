'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { emoji: '🧠', tip: "Space your learning sessions - review material over several days for better retention!" },
  { emoji: '✍️', tip: "Try teaching what you learn to someone else - it's one of the best ways to solidify knowledge." },
  { emoji: '🎯', tip: "Set specific goals for each study session - 'Complete 2 lessons' is better than 'Study coding'." },
  { emoji: '☕', tip: "Take breaks! The Pomodoro technique (25 min work, 5 min break) can boost productivity." },
  { emoji: '📝', tip: "Don't just watch - code along! Hands-on practice is essential for programming skills." },
  { emoji: '🔄', tip: "Stuck on a problem? Take a walk. Your brain continues processing in the background." },
  { emoji: '💡', tip: "Build projects with what you learn. Real-world application cements understanding." },
  { emoji: '📚', tip: "Review yesterday's lesson before starting today's - it strengthens neural connections." },
  { emoji: '🌙', tip: "Quality sleep consolidates learning. Don't sacrifice sleep for extra study time!" },
  { emoji: '🤝', tip: "Join a learning community. Discussing with peers accelerates understanding." },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get today's tip based on date (changes daily)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Check if dismissed today
    const dismissedDate = localStorage.getItem('learnhub-tip-dismissed')
    if (dismissedDate === new Date().toDateString()) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
  }

  if (!tip || !isVisible) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20 rounded-xl px-5 py-4 flex items-center gap-4">
        <div className="text-3xl">{tip.emoji}</div>
        <div className="flex-1">
          <div className="text-xs font-medium text-primary-400 mb-1">💡 Daily Learning Tip</div>
          <p className="text-sm text-navy-200">{tip.tip}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-navy-500 hover:text-navy-300 transition-colors p-1"
          aria-label="Dismiss tip"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}