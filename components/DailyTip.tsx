'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    tip: "Practice coding for at least 30 minutes every day. Consistency beats intensity!",
    emoji: "⌨️",
    category: "Productivity"
  },
  {
    tip: "When stuck on a problem, take a 15-minute break. Your brain processes information better after rest.",
    emoji: "🧠",
    category: "Mindset"
  },
  {
    tip: "Teach what you learn to someone else - it's the best way to solidify your knowledge.",
    emoji: "👥",
    category: "Learning"
  },
  {
    tip: "Build projects, not just tutorials. Real-world experience is invaluable.",
    emoji: "🏗️",
    category: "Projects"
  },
  {
    tip: "Don't compare your Chapter 1 to someone else's Chapter 20. Everyone's journey is different.",
    emoji: "🌱",
    category: "Mindset"
  },
  {
    tip: "Read documentation before Stack Overflow. Understanding the 'why' matters as much as the 'how'.",
    emoji: "📖",
    category: "Learning"
  },
  {
    tip: "Code reviews are gifts, not criticism. Embrace feedback to grow faster.",
    emoji: "🎁",
    category: "Growth"
  },
  {
    tip: "Take notes while learning. Writing helps encode information in long-term memory.",
    emoji: "📝",
    category: "Productivity"
  },
  {
    tip: "Learn keyboard shortcuts for your code editor. Small efficiencies compound over time.",
    emoji: "⚡",
    category: "Productivity"
  },
  {
    tip: "Join a community of learners. Accountability and support accelerate growth.",
    emoji: "🤝",
    category: "Community"
  },
  {
    tip: "Celebrate small wins! Every bug fixed and feature completed is progress.",
    emoji: "🎉",
    category: "Mindset"
  },
  {
    tip: "Sleep is crucial for learning. Your brain consolidates knowledge while you rest.",
    emoji: "😴",
    category: "Health"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(LEARNING_TIPS[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    const selectedTip = LEARNING_TIPS[tipIndex]
    if (selectedTip) {
      setTip(selectedTip)
    }
  }, [])

  const getNewTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const newTip = LEARNING_TIPS[Math.floor(Math.random() * LEARNING_TIPS.length)]
      if (newTip) {
        setTip(newTip)
      }
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="card p-6 relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-semibold text-white">Daily Learning Tip</h3>
          </div>
          <span className="text-xs text-navy-500 bg-navy-800 px-2 py-1 rounded-full">
            {tip?.category ?? 'Tip'}
          </span>
        </div>
        
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          <div className="flex items-start gap-3">
            <span className="text-3xl">{tip?.emoji ?? '💡'}</span>
            <p className="text-navy-300 leading-relaxed">{tip?.tip ?? 'Loading tip...'}</p>
          </div>
        </div>
        
        <button 
          onClick={getNewTip}
          className="mt-4 text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 group/btn"
        >
          <svg className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Get another tip</span>
        </button>
      </div>
    </div>
  )
}