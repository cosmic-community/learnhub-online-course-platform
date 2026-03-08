'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: "🎯",
    tip: "Focus on one concept at a time. Mastery comes from depth, not breadth.",
    category: "Study Strategy"
  },
  {
    emoji: "⏰",
    tip: "The best time to learn is when you're most alert. Find your peak hours!",
    category: "Productivity"
  },
  {
    emoji: "🧠",
    tip: "Teach what you learn to someone else. It's the fastest way to solidify knowledge.",
    category: "Learning Science"
  },
  {
    emoji: "💪",
    tip: "Stuck on a problem? Take a 10-minute walk. Your brain keeps working in the background.",
    category: "Problem Solving"
  },
  {
    emoji: "📝",
    tip: "Write code by hand occasionally. It strengthens your understanding of syntax.",
    category: "Coding Practice"
  },
  {
    emoji: "🔄",
    tip: "Spaced repetition beats cramming. Review yesterday's lesson before starting today's.",
    category: "Memory"
  },
  {
    emoji: "🤝",
    tip: "Join a study group or Discord. Explaining concepts to others deepens your own understanding.",
    category: "Community"
  },
  {
    emoji: "🎮",
    tip: "Build small projects as you learn. Applied knowledge sticks better than theoretical.",
    category: "Practice"
  },
  {
    emoji: "😴",
    tip: "Sleep consolidates learning. A well-rested mind learns 40% more effectively.",
    category: "Wellness"
  },
  {
    emoji: "🚀",
    tip: "Don't aim for perfection. Ship your projects, then iterate and improve.",
    category: "Mindset"
  },
  {
    emoji: "📚",
    tip: "Read documentation like a book, not a reference. You'll discover features you never knew existed.",
    category: "Research"
  },
  {
    emoji: "🔥",
    tip: "Consistency beats intensity. 30 minutes daily outperforms 5-hour weekend sessions.",
    category: "Habits"
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setCurrentTip(learningTips[tipIndex])
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getNextTip = () => {
    setIsChanging(true)
    setTimeout(() => {
      const currentIndex = learningTips.findIndex(t => t.tip === currentTip.tip)
      const nextIndex = (currentIndex + 1) % learningTips.length
      setCurrentTip(learningTips[nextIndex])
      setIsChanging(false)
    }, 300)
  }

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-start gap-4">
          <div 
            className={`text-4xl flex-shrink-0 transition-all duration-300 ${
              isChanging ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
            }`}
          >
            {currentTip.emoji}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
                💡 Daily Learning Tip
              </span>
              <span className="text-xs text-navy-500">•</span>
              <span className="text-xs text-navy-400">{currentTip.category}</span>
            </div>
            
            <p 
              className={`text-white text-lg font-medium leading-relaxed transition-all duration-300 ${
                isChanging ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
              }`}
            >
              {currentTip.tip}
            </p>
          </div>
          
          <button
            onClick={getNextTip}
            className="flex-shrink-0 p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-400 hover:text-white transition-all duration-200 group"
            title="Get another tip"
          >
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}