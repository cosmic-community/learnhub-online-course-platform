'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    tip: "Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).",
    icon: "⏰",
    category: "Productivity"
  },
  {
    tip: "Try to explain what you learned to someone else - teaching reinforces understanding.",
    icon: "💡",
    category: "Retention"
  },
  {
    tip: "Code along with tutorials instead of just watching. Active practice beats passive consumption.",
    icon: "⌨️",
    category: "Practice"
  },
  {
    tip: "Take handwritten notes - it improves memory retention by 40% compared to typing.",
    icon: "📝",
    category: "Memory"
  },
  {
    tip: "Review yesterday's lesson for 5 minutes before starting today's. Spaced repetition works!",
    icon: "🔄",
    category: "Review"
  },
  {
    tip: "Build a small project using what you learned - real application beats theory every time.",
    icon: "🏗️",
    category: "Application"
  },
  {
    tip: "Join study groups or Discord communities - learning with others boosts motivation.",
    icon: "👥",
    category: "Community"
  },
  {
    tip: "Sleep well! Your brain consolidates learning during sleep. No all-nighters!",
    icon: "😴",
    category: "Wellness"
  },
  {
    tip: "Start with the hardest topic when your energy is highest, usually in the morning.",
    icon: "🌅",
    category: "Timing"
  },
  {
    tip: "Create flashcards for key concepts and review them during idle moments.",
    icon: "🃏",
    category: "Memory"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Auto-reveal after a short delay
    const timer = setTimeout(() => setIsRevealed(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`card p-6 bg-gradient-to-br from-amber-500/10 via-navy-900/50 to-navy-900/50 border-amber-500/20 transition-all duration-500 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{tip.icon}</div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-semibold">💡 Daily Learning Tip</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              {tip.category}
            </span>
          </div>
          <p className="text-navy-200 leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}