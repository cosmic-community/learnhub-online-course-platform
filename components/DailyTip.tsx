'use client'

import { useState, useEffect } from 'react'

interface Tip {
  id: number
  icon: string
  title: string
  content: string
  category: string
}

const tips: Tip[] = [
  {
    id: 1,
    icon: "💡",
    title: "Rubber Duck Debugging",
    content: "Explain your code to a rubber duck (or any object). The process of articulating your problem often leads to the solution!",
    category: "Debugging"
  },
  {
    id: 2,
    icon: "⚡",
    title: "Learn Keyboard Shortcuts",
    content: "Mastering shortcuts can save you hours each week. Start with Ctrl+D (duplicate line) and Ctrl+/ (comment).",
    category: "Productivity"
  },
  {
    id: 3,
    icon: "🎯",
    title: "The 20-Minute Rule",
    content: "Stuck on a bug? Spend 20 minutes trying to solve it yourself, then ask for help. This balance builds problem-solving skills.",
    category: "Learning"
  },
  {
    id: 4,
    icon: "📝",
    title: "Write Code Comments",
    content: "Write comments explaining WHY, not WHAT. Future you will thank present you when debugging at 2 AM.",
    category: "Best Practices"
  },
  {
    id: 5,
    icon: "🧪",
    title: "Test Early, Test Often",
    content: "Write tests before you need them. It's easier to write tests for new code than to add them to legacy code.",
    category: "Testing"
  },
  {
    id: 6,
    icon: "🔄",
    title: "Commit Frequently",
    content: "Small, focused commits make it easier to track changes and rollback if needed. Aim for commits every 30-60 minutes.",
    category: "Version Control"
  },
  {
    id: 7,
    icon: "☕",
    title: "Take Regular Breaks",
    content: "The Pomodoro Technique: 25 minutes of focus, 5 minutes break. Your brain needs rest to consolidate learning.",
    category: "Wellness"
  },
  {
    id: 8,
    icon: "🌐",
    title: "Read Other People's Code",
    content: "Study open-source projects on GitHub. You'll learn patterns, techniques, and best practices from experienced developers.",
    category: "Learning"
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<Tip>(tips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Get tip based on current date (changes daily)
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const nextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const currentIndex = tips.findIndex(t => t.id === currentTip.id)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex])
      setIsVisible(true)
    }, 300)
  }

  const prevTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const currentIndex = tips.findIndex(t => t.id === currentTip.id)
      const prevIndex = (currentIndex - 1 + tips.length) % tips.length
      setCurrentTip(tips[prevIndex])
      setIsVisible(true)
    }, 300)
  }

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5" />
      
      <div className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-4 p-6">
          {/* Navigation - Previous */}
          <button
            onClick={prevTip}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-navy-800/50 hover:bg-navy-700 border border-navy-700 flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Previous tip"
          >
            <svg className="w-5 h-5 text-navy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Tip Content */}
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center text-3xl">
              {currentTip.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
                  💡 Daily Tip
                </span>
                <span className="text-xs text-navy-500">
                  {currentTip.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1 truncate">
                {currentTip.title}
              </h3>
              <p className="text-sm text-navy-300 line-clamp-2">
                {currentTip.content}
              </p>
            </div>
          </div>

          {/* Navigation - Next */}
          <button
            onClick={nextTip}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-navy-800/50 hover:bg-navy-700 border border-navy-700 flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Next tip"
          >
            <svg className="w-5 h-5 text-navy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {tips.map((tip) => (
            <button
              key={tip.id}
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => {
                  setCurrentTip(tip)
                  setIsVisible(true)
                }, 300)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                tip.id === currentTip.id 
                  ? 'bg-primary-500 w-6' 
                  : 'bg-navy-700 hover:bg-navy-600'
              }`}
              aria-label={`Go to tip: ${tip.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}