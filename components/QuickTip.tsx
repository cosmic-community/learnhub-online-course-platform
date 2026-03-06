'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: "🧠",
    tip: "Take notes by hand! Studies show it improves retention by up to 30%.",
    category: "Study Hack"
  },
  {
    emoji: "⏰",
    tip: "Use the Pomodoro Technique: 25 min focused work, 5 min break.",
    category: "Productivity"
  },
  {
    emoji: "🎯",
    tip: "Set specific learning goals. 'Learn React hooks' beats 'Learn React'.",
    category: "Goal Setting"
  },
  {
    emoji: "💤",
    tip: "Sleep consolidates learning. Review material before bed!",
    category: "Science"
  },
  {
    emoji: "🗣️",
    tip: "Teach what you learn to someone else. It's the best way to master concepts.",
    category: "Technique"
  },
  {
    emoji: "🔄",
    tip: "Use spaced repetition. Review today, tomorrow, next week, next month.",
    category: "Memory"
  },
  {
    emoji: "💻",
    tip: "Code along with tutorials, then build something on your own!",
    category: "Practice"
  },
  {
    emoji: "📱",
    tip: "Remove distractions. Put your phone in another room while studying.",
    category: "Focus"
  },
]

export default function QuickTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on current hour (changes every few hours)
    const hourIndex = Math.floor(new Date().getHours() / 3)
    setTip(learningTips[hourIndex % learningTips.length])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  return (
    <div 
      className={`card p-5 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{tip.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              {tip.category}
            </span>
            <span className="text-emerald-500/50">•</span>
            <span className="text-xs text-navy-400">Quick Tip</span>
          </div>
          <p className="text-navy-200 text-sm leading-relaxed">
            {tip.tip}
          </p>
        </div>
        <button 
          onClick={() => {
            const newIndex = (learningTips.indexOf(tip) + 1) % learningTips.length
            setTip(learningTips[newIndex])
          }}
          className="text-navy-400 hover:text-emerald-400 transition-colors p-1"
          aria-label="Next tip"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}