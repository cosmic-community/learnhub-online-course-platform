'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    tip: "Break down complex topics into smaller chunks. Your brain retains information better in bite-sized pieces.",
    icon: "🧠",
    category: "Learning Science"
  },
  {
    tip: "Practice active recall by closing your eyes and trying to explain what you just learned.",
    icon: "💭",
    category: "Memory"
  },
  {
    tip: "Take a 5-minute break every 25 minutes. The Pomodoro Technique boosts focus and retention.",
    icon: "⏱️",
    category: "Productivity"
  },
  {
    tip: "Write code by hand sometimes. It forces you to think through every character.",
    icon: "✍️",
    category: "Coding"
  },
  {
    tip: "Teach what you learn to someone else (or a rubber duck). Teaching is the best way to learn.",
    icon: "🦆",
    category: "Learning Science"
  },
  {
    tip: "Don't just watch - code along! Active participation beats passive watching every time.",
    icon: "⌨️",
    category: "Practice"
  },
  {
    tip: "Sleep is crucial for memory consolidation. Your brain organizes knowledge while you rest.",
    icon: "😴",
    category: "Health"
  },
  {
    tip: "Embrace errors! Each bug you fix teaches you more than code that works the first time.",
    icon: "🐛",
    category: "Mindset"
  },
  {
    tip: "Build projects that excite you. Passion-driven learning is 10x more effective.",
    icon: "🚀",
    category: "Motivation"
  },
  {
    tip: "Connect new concepts to things you already know. Your brain loves building on existing knowledge.",
    icon: "🔗",
    category: "Learning Science"
  },
  {
    tip: "Stay hydrated! Your brain is 75% water, and dehydration hurts cognitive performance.",
    icon: "💧",
    category: "Health"
  },
  {
    tip: "Read documentation like a story. Understanding the 'why' makes the 'how' stick.",
    icon: "📖",
    category: "Practice"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a consistent tip for the day based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex] ?? learningTips[0])
  }, [])

  if (!tip || !isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6 overflow-hidden group">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-navy-500 hover:text-navy-300 transition-colors"
        aria-label="Dismiss tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
          {tip.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              💡 Daily Learning Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-400">{tip.category}</span>
          </div>
          <p className="text-navy-200 leading-relaxed">
            {tip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}