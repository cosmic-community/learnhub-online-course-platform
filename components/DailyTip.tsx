'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    tip: "Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).",
    category: "Productivity",
    icon: "🍅"
  },
  {
    tip: "Teach what you learn to someone else - it's the best way to solidify knowledge.",
    category: "Learning",
    icon: "👥"
  },
  {
    tip: "Code along with tutorials instead of just watching. Active learning beats passive consumption.",
    category: "Coding",
    icon: "⌨️"
  },
  {
    tip: "Review yesterday's material before starting something new - spaced repetition works!",
    category: "Memory",
    icon: "🧠"
  },
  {
    tip: "Build projects that solve your own problems - motivation comes naturally.",
    category: "Projects",
    icon: "🛠️"
  },
  {
    tip: "Join a community of learners. Accountability partners increase completion rates by 65%.",
    category: "Community",
    icon: "🤝"
  },
  {
    tip: "Take handwritten notes - studies show it improves retention compared to typing.",
    category: "Notes",
    icon: "📝"
  },
  {
    tip: "Sleep is crucial for learning. Your brain consolidates new information during rest.",
    category: "Health",
    icon: "😴"
  },
  {
    tip: "Don't multitask while learning. Deep focus leads to faster progress.",
    category: "Focus",
    icon: "🎯"
  },
  {
    tip: "Celebrate small wins! Completing a lesson is an achievement worth recognizing.",
    category: "Motivation",
    icon: "🎉"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`card p-5 bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20 transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{tip.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-400 bg-primary-500/20 px-2 py-0.5 rounded-full">
              💡 Daily Tip • {tip.category}
            </span>
          </div>
          <p className="text-navy-200 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}