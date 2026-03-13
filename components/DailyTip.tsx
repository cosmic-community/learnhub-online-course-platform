'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  { emoji: '🎯', tip: 'Set specific learning goals for each session to stay focused and motivated.' },
  { emoji: '⏰', tip: 'The Pomodoro Technique: Study for 25 minutes, then take a 5-minute break.' },
  { emoji: '📝', tip: 'Taking handwritten notes improves retention by 29% compared to typing.' },
  { emoji: '🧠', tip: 'Spaced repetition: Review material at increasing intervals to boost long-term memory.' },
  { emoji: '💡', tip: 'Teach what you learn to someone else — it\'s the best way to master a concept.' },
  { emoji: '🌙', tip: 'Sleep consolidates learning. Review key concepts before bed for better retention.' },
  { emoji: '🏃', tip: 'A 20-minute walk can boost creativity and problem-solving by 60%.' },
  { emoji: '🎮', tip: 'Gamify your learning: Set challenges and reward yourself for completing modules.' },
  { emoji: '📚', tip: 'Active recall: Test yourself instead of re-reading to learn 50% faster.' },
  { emoji: '🤝', tip: 'Join a study group or community — social learning accelerates progress.' },
]

export default function DailyTip() {
  const [tip, setTip] = useState(LEARNING_TIPS[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])

    // Check if dismissed today
    const dismissed = localStorage.getItem('tip-dismissed-date')
    if (dismissed === now.toDateString()) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('tip-dismissed-date', new Date().toDateString())
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-xl p-4 mb-8 relative group">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-navy-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Dismiss tip"
      >
        ×
      </button>
      <div className="flex items-start gap-4">
        <div className="text-3xl">{tip.emoji}</div>
        <div>
          <div className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-1">
            💡 Daily Learning Tip
          </div>
          <p className="text-navy-200 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}