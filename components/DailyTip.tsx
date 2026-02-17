'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    tip: "Break your learning into 25-minute focused sessions (Pomodoro Technique) for better retention.",
    icon: "🍅",
    category: "Productivity"
  },
  {
    tip: "Teaching others what you learn reinforces your own understanding - try explaining concepts out loud!",
    icon: "🎓",
    category: "Learning"
  },
  {
    tip: "Code along with tutorials instead of just watching - active learning beats passive consumption.",
    icon: "⌨️",
    category: "Coding"
  },
  {
    tip: "Take handwritten notes - studies show it improves comprehension and memory.",
    icon: "📝",
    category: "Study Tips"
  },
  {
    tip: "Review what you learned yesterday before starting new material - spaced repetition works!",
    icon: "🔄",
    category: "Memory"
  },
  {
    tip: "Build projects as you learn - practical application cements theoretical knowledge.",
    icon: "🛠️",
    category: "Practice"
  },
  {
    tip: "Join a study group or community - discussing concepts deepens understanding.",
    icon: "👥",
    category: "Community"
  },
  {
    tip: "Set specific learning goals for each session - clarity improves focus and outcomes.",
    icon: "🎯",
    category: "Goals"
  },
  {
    tip: "Take breaks! Your brain processes and consolidates information during rest periods.",
    icon: "☕",
    category: "Wellness"
  },
  {
    tip: "Challenge yourself with problems slightly above your current skill level - that's where growth happens.",
    icon: "📈",
    category: "Growth"
  },
  {
    tip: "Debug errors yourself before looking up solutions - struggle leads to deeper learning.",
    icon: "🐛",
    category: "Problem Solving"
  },
  {
    tip: "Celebrate small wins! Acknowledging progress keeps motivation high.",
    icon: "🎉",
    category: "Motivation"
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    const tip = learningTips[tipIndex]
    if (tip) {
      setCurrentTip(tip)
    }
    
    // Check if user dismissed the tip today
    const dismissedDate = localStorage.getItem('tipDismissedDate')
    const today = new Date().toDateString()
    
    if (dismissedDate !== today) {
      setIsVisible(true)
    }
  }, [])

  const dismissTip = () => {
    setIsDismissed(true)
    localStorage.setItem('tipDismissedDate', new Date().toDateString())
    setTimeout(() => setIsVisible(false), 300)
  }

  const getNewTip = () => {
    const currentIndex = learningTips.indexOf(currentTip)
    const nextIndex = (currentIndex + 1) % learningTips.length
    const nextTip = learningTips[nextIndex]
    if (nextTip) {
      setCurrentTip(nextTip)
    }
  }

  if (!isVisible) return null

  return (
    <section className={`py-6 transition-all duration-300 ${isDismissed ? 'opacity-0 transform -translate-y-4' : 'opacity-100'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-2xl">
                {currentTip?.icon}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary-400 text-sm font-medium">💡 Daily Learning Tip</span>
                <span className="text-navy-500 text-xs">• {currentTip?.category}</span>
              </div>
              <p className="text-white text-lg leading-relaxed">
                {currentTip?.tip}
              </p>
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-2">
              <button
                onClick={getNewTip}
                className="p-2 text-navy-400 hover:text-primary-400 hover:bg-navy-800/50 rounded-lg transition-colors"
                title="Get another tip"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={dismissTip}
                className="p-2 text-navy-400 hover:text-white hover:bg-navy-800/50 rounded-lg transition-colors"
                title="Dismiss for today"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}