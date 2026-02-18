'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Code Review Magic',
    tip: 'Reading other developers\' code is one of the fastest ways to improve. Study open-source projects you admire!',
    category: 'Best Practice',
  },
  {
    emoji: '🎯',
    title: 'The 25-Minute Rule',
    tip: 'Focus on one concept for 25 minutes, then take a 5-minute break. This Pomodoro technique boosts retention by 40%!',
    category: 'Learning',
  },
  {
    emoji: '🔧',
    title: 'Debug Like a Pro',
    tip: 'When stuck, explain your code to a rubber duck (or any object). This "rubber duck debugging" often reveals the issue!',
    category: 'Debugging',
  },
  {
    emoji: '📝',
    title: 'Comment Wisely',
    tip: 'Write comments that explain "why", not "what". Good code should be self-documenting for the "what".',
    category: 'Best Practice',
  },
  {
    emoji: '🚀',
    title: 'Ship Early, Ship Often',
    tip: 'Don\'t wait for perfection. Deploy early, gather feedback, and iterate. Progress beats perfection!',
    category: 'Mindset',
  },
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    tip: 'Review what you learned yesterday, last week, and last month. Spaced repetition cements knowledge permanently.',
    category: 'Learning',
  },
  {
    emoji: '⚡',
    title: 'Keyboard Shortcuts',
    tip: 'Learning 5 new keyboard shortcuts per week can save you 8+ hours per month in your code editor!',
    category: 'Productivity',
  },
  {
    emoji: '🤝',
    title: 'Teach to Learn',
    tip: 'The best way to master a concept? Teach it to someone else. You\'ll discover gaps in your own understanding.',
    category: 'Learning',
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    // Select tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTip(tips[dayOfYear % tips.length])
  }, [])

  const getNextTip = () => {
    setIsAnimating(true)
    setShowTip(false)
    
    setTimeout(() => {
      const currentIndex = tips.findIndex(t => t.title === currentTip.title)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex])
      setShowTip(true)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-gradient-to-br from-navy-900/80 to-navy-800/80 backdrop-blur-sm border border-navy-700 rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Daily Learning Tip</h3>
              <p className="text-navy-400 text-sm">Fresh wisdom every day</p>
            </div>
          </div>
          <button
            onClick={getNextTip}
            disabled={isAnimating}
            className="px-4 py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <span>Next tip</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Tip Content */}
        <div className={`transition-all duration-300 ${showTip ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <div className="flex items-start gap-4">
            <div className="text-5xl flex-shrink-0 transform hover:scale-110 transition-transform cursor-default">
              {currentTip.emoji}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-semibold text-white">{currentTip.title}</h4>
                <span className="px-2 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                  {currentTip.category}
                </span>
              </div>
              <p className="text-navy-300 leading-relaxed">{currentTip.tip}</p>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {tips.map((tip, index) => (
            <button
              key={tip.title}
              onClick={() => {
                setIsAnimating(true)
                setShowTip(false)
                setTimeout(() => {
                  setCurrentTip(tips[index])
                  setShowTip(true)
                  setIsAnimating(false)
                }, 300)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                tip.title === currentTip.title 
                  ? 'w-6 bg-primary-500' 
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`View tip: ${tip.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}