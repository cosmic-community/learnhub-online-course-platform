'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: "💡",
    tip: "Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).",
    category: "Productivity"
  },
  {
    icon: "🎯",
    tip: "Set specific learning goals for each session. 'Learn React hooks' is better than 'Learn React'.",
    category: "Goal Setting"
  },
  {
    icon: "✍️",
    tip: "Take handwritten notes—studies show it improves retention by up to 29%!",
    category: "Memory"
  },
  {
    icon: "🔄",
    tip: "Review what you learned yesterday before starting something new. Spaced repetition works!",
    category: "Retention"
  },
  {
    icon: "🛠️",
    tip: "Build a small project with each new concept you learn. Practice beats passive watching.",
    category: "Practice"
  },
  {
    icon: "🤝",
    tip: "Teach what you learn to someone else—it's the fastest way to identify gaps in your knowledge.",
    category: "Teaching"
  },
  {
    icon: "😴",
    tip: "Get enough sleep! Your brain consolidates learning during deep sleep cycles.",
    category: "Health"
  },
  {
    icon: "🏃",
    tip: "A 20-minute walk before studying can improve focus and memory by 20%.",
    category: "Exercise"
  },
  {
    icon: "📱",
    tip: "Put your phone in another room while learning. Even seeing it reduces cognitive capacity.",
    category: "Focus"
  },
  {
    icon: "🎵",
    tip: "Try ambient sounds or lo-fi music. Lyrics can interfere with reading and coding.",
    category: "Environment"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a "daily" tip based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
          {tip.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 font-semibold text-sm">💡 Daily Learning Tip</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full">
              {tip.category}
            </span>
          </div>
          <p className="text-navy-200 leading-relaxed">
            {tip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}