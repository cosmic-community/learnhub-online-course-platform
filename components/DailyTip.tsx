'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    tip: "Set aside dedicated learning time each day, even if it's just 20 minutes.",
    emoji: "⏰",
    category: "Habit Building"
  },
  {
    tip: "Practice coding by building projects, not just following tutorials.",
    emoji: "🛠️",
    category: "Practice"
  },
  {
    tip: "Take breaks using the Pomodoro technique: 25 minutes of focus, 5 minutes rest.",
    emoji: "🍅",
    category: "Productivity"
  },
  {
    tip: "Teach what you learn to others - it's the best way to solidify knowledge.",
    emoji: "🎓",
    category: "Learning Strategy"
  },
  {
    tip: "Don't compare your chapter 1 to someone else's chapter 20.",
    emoji: "📖",
    category: "Mindset"
  },
  {
    tip: "Write code comments for your future self - you'll thank yourself later.",
    emoji: "💬",
    category: "Best Practices"
  },
  {
    tip: "Join developer communities - learning is better together.",
    emoji: "👥",
    category: "Community"
  },
  {
    tip: "Debug by explaining your code to a rubber duck (or anyone who'll listen).",
    emoji: "🦆",
    category: "Debugging"
  },
  {
    tip: "Celebrate small wins - every line of code you understand is progress.",
    emoji: "🎉",
    category: "Motivation"
  },
  {
    tip: "Read documentation before Stack Overflow - it's often better than you think.",
    emoji: "📚",
    category: "Research"
  },
  {
    tip: "Version control everything, even personal projects. Future you will be grateful.",
    emoji: "🔄",
    category: "Best Practices"
  },
  {
    tip: "Learn keyboard shortcuts - they add up to hours saved over time.",
    emoji: "⌨️",
    category: "Efficiency"
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a "random" tip based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    const tip = learningTips[tipIndex]
    if (tip) {
      setCurrentTip(tip)
    }
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const refreshTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * learningTips.length)
      const newTip = learningTips[randomIndex]
      if (newTip) {
        setCurrentTip(newTip)
      }
      setIsVisible(true)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <section className="py-8 bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-primary-500/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-3xl animate-bounce-subtle">
              {currentTip.emoji}
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider">
                💡 Daily Learning Tip
              </span>
              <span className="text-navy-500">•</span>
              <span className="text-navy-400 text-xs">{currentTip.category}</span>
            </div>
            <p className="text-white text-lg font-medium">
              "{currentTip.tip}"
            </p>
          </div>
          
          <button
            onClick={refreshTip}
            className="flex-shrink-0 p-3 rounded-xl bg-navy-800/50 hover:bg-navy-700/50 text-navy-300 hover:text-white transition-all duration-200 group"
            title="Get another tip"
          >
            <svg 
              className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}