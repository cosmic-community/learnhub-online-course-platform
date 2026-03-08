'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Quick Tip',
    content: 'Consistency beats intensity. 30 minutes of coding daily is better than 5 hours once a week.',
    category: 'Productivity'
  },
  {
    emoji: '🎯',
    title: 'Focus Hack',
    content: 'Use the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.',
    category: 'Focus'
  },
  {
    emoji: '🔧',
    title: 'Debug Wisdom',
    content: 'When stuck, explain your code to a rubber duck. Speaking problems aloud often reveals solutions.',
    category: 'Debugging'
  },
  {
    emoji: '📝',
    title: 'Learning Strategy',
    content: 'Take notes while watching tutorials. Writing reinforces memory and creates useful references.',
    category: 'Learning'
  },
  {
    emoji: '🚀',
    title: 'Project Advice',
    content: 'Build projects you actually want to use. Personal motivation leads to deeper learning.',
    category: 'Projects'
  },
  {
    emoji: '🤝',
    title: 'Community Tip',
    content: 'Join coding communities. Teaching others is one of the best ways to solidify your knowledge.',
    category: 'Community'
  },
  {
    emoji: '⚡',
    title: 'Speed Tip',
    content: 'Master keyboard shortcuts in your IDE. Small time savings compound into hours saved.',
    category: 'Efficiency'
  },
  {
    emoji: '🧠',
    title: 'Mental Model',
    content: 'Understand WHY code works, not just HOW. Deep understanding enables creative problem-solving.',
    category: 'Understanding'
  },
  {
    emoji: '🎨',
    title: 'Code Style',
    content: 'Write code for humans first, computers second. Clear code is maintainable code.',
    category: 'Best Practices'
  },
  {
    emoji: '🔄',
    title: 'Iteration Mindset',
    content: 'Your first version won\'t be perfect. Ship it, learn from it, improve it.',
    category: 'Mindset'
  }
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % tips.length)
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
      setIsAnimating(false)
    }, 150)
  }

  const tip = tips[tipIndex]

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className={`flex items-center gap-4 flex-1 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20 flex items-center justify-center text-2xl">
          {tip?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-white">{tip?.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
              {tip?.category}
            </span>
          </div>
          <p className="text-sm text-navy-300 truncate lg:whitespace-normal">
            {tip?.content}
          </p>
        </div>
      </div>
      <button
        onClick={nextTip}
        className="flex-shrink-0 p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 text-navy-400 hover:text-white transition-colors"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}