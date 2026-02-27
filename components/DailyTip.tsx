'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    tip: "Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).",
    icon: "🍅",
    category: "Productivity"
  },
  {
    tip: "Teach what you learn to someone else – it's the best way to solidify knowledge.",
    icon: "👥",
    category: "Retention"
  },
  {
    tip: "Code along with videos instead of just watching. Active learning beats passive consumption.",
    icon: "⌨️",
    category: "Practice"
  },
  {
    tip: "Take handwritten notes – research shows it improves memory retention by 30%.",
    icon: "📝",
    category: "Memory"
  },
  {
    tip: "Review what you learned yesterday before starting something new today.",
    icon: "🔄",
    category: "Spaced Repetition"
  },
  {
    tip: "Build a small project after each module to apply what you've learned immediately.",
    icon: "🛠️",
    category: "Application"
  },
  {
    tip: "Join online communities related to what you're learning for support and networking.",
    icon: "🌐",
    category: "Community"
  },
  {
    tip: "Set specific, measurable goals like 'Complete 2 lessons' instead of vague ones like 'Learn more'.",
    icon: "🎯",
    category: "Goals"
  },
  {
    tip: "Learn at your peak energy time – morning for most people, but find what works for you.",
    icon: "⏰",
    category: "Timing"
  },
  {
    tip: "Don't multitask while learning. Single-tasking improves comprehension by up to 40%.",
    icon: "🧘",
    category: "Focus"
  },
  {
    tip: "Sleep well! Your brain consolidates memories and learning during deep sleep.",
    icon: "😴",
    category: "Rest"
  },
  {
    tip: "Embrace confusion – it's a sign you're at the edge of your knowledge, ready to grow.",
    icon: "🤔",
    category: "Mindset"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Check if dismissed today
    const dismissedDate = localStorage.getItem('learnhub-tip-dismissed')
    const today = new Date().toISOString().split('T')[0]
    if (dismissedDate === today) {
      setIsDismissed(true)
    }

    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem('learnhub-tip-dismissed', today)
    setIsDismissed(true)
  }

  if (isDismissed) return null

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5
        bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent
        border border-primary-500/20
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0 animate-bounce-slow">
          {tip.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">
              💡 Daily Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-500">{tip.category}</span>
          </div>
          <p className="text-navy-200 text-sm leading-relaxed">
            {tip.tip}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-navy-500 hover:text-navy-300 transition-colors"
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