'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  category: string
  content: string
}

const tips: Tip[] = [
  { emoji: '💡', category: 'Pro Tip', content: 'Break complex problems into smaller, manageable pieces. It makes coding less overwhelming!' },
  { emoji: '🎯', category: 'Focus', content: 'The Pomodoro Technique: 25 minutes of focused learning, then a 5-minute break.' },
  { emoji: '🔥', category: 'Motivation', content: 'Every expert was once a beginner. Keep pushing forward!' },
  { emoji: '⚡', category: 'Quick Win', content: 'Learn one new keyboard shortcut today. Small wins compound into mastery.' },
  { emoji: '🧠', category: 'Memory', content: 'Teaching others is the best way to solidify your own understanding.' },
  { emoji: '🚀', category: 'Career', content: 'Build projects, not just tutorials. Real experience beats theory.' },
  { emoji: '✨', category: 'Creativity', content: 'Stuck on a problem? Take a walk. Your brain processes in the background.' },
  { emoji: '📚', category: 'Learning', content: 'Consistency beats intensity. 30 minutes daily > 5 hours once a week.' },
  { emoji: '🎨', category: 'Design', content: 'Good code is like good design—it should be obvious, not clever.' },
  { emoji: '🔧', category: 'Debug', content: 'When debugging, explain the problem to a rubber duck. Seriously, it works!' },
  { emoji: '💪', category: 'Growth', content: 'Embrace errors—they\'re not failures, they\'re learning opportunities.' },
  { emoji: '🌟', category: 'Wisdom', content: 'The best time to start learning was yesterday. The second best time is now.' },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getNextTip = () => {
    setIsChanging(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * tips.length)
      setCurrentTip(tips[randomIndex])
      setIsChanging(false)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl 
        bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent
        border border-primary-500/20 
        p-4 sm:p-6 mt-8
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Animated background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-10 w-1 h-1 bg-primary-400 rounded-full animate-pulse" />
        <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-primary-300 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-3 left-1/4 w-1 h-1 bg-primary-500 rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative flex items-start gap-4">
        {/* Animated emoji */}
        <div 
          className={`
            flex-shrink-0 w-12 h-12 rounded-xl 
            bg-gradient-to-br from-primary-500/20 to-primary-600/20
            flex items-center justify-center text-2xl
            transition-transform duration-300
            ${isChanging ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
          `}
        >
          {currentTip.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
              {currentTip.category}
            </span>
            <span className="text-navy-600">•</span>
            <span className="text-xs text-navy-500">Daily Tip</span>
          </div>
          
          <p 
            className={`
              text-navy-200 text-sm sm:text-base leading-relaxed
              transition-all duration-300
              ${isChanging ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
            `}
          >
            {currentTip.content}
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={getNextTip}
          className="
            flex-shrink-0 p-2 rounded-lg
            text-navy-400 hover:text-primary-400
            hover:bg-primary-500/10
            transition-all duration-200
            group
          "
          aria-label="Get another tip"
          title="Get another tip"
        >
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>
    </div>
  )
}