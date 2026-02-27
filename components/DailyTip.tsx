'use client'

import { useState, useEffect } from 'react'

const TIPS = [
  {
    icon: '💡',
    title: 'Start Small',
    content: 'Learning 15 minutes daily is more effective than cramming once a week.',
  },
  {
    icon: '🎯',
    title: 'Set Goals',
    content: 'Define clear, achievable goals for each learning session.',
  },
  {
    icon: '✍️',
    title: 'Practice Active Learning',
    content: 'Code along with tutorials instead of just watching them.',
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    content: 'Review concepts at increasing intervals to strengthen memory.',
  },
  {
    icon: '🤝',
    title: 'Teach Others',
    content: 'Explaining concepts to others is the best way to solidify your understanding.',
  },
  {
    icon: '😴',
    title: 'Rest is Learning',
    content: 'Your brain consolidates learning during sleep. Get enough rest!',
  },
  {
    icon: '🚀',
    title: 'Build Projects',
    content: 'Apply what you learn by building real projects, even simple ones.',
  },
  {
    icon: '❌',
    title: 'Embrace Errors',
    content: 'Debugging is a skill. Each error is a learning opportunity.',
  },
  {
    icon: '📖',
    title: 'Read Documentation',
    content: 'Official docs are your best friend. Learn to navigate them effectively.',
  },
  {
    icon: '🧩',
    title: 'Break It Down',
    content: 'Complex problems are just collections of simpler ones.',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(TIPS[0])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % TIPS.length
    setTip(TIPS[tipIndex])
  }, [])

  if (!isClient) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-navy-800/50 rounded-xl"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
        <span className="text-2xl">{tip.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">Daily Tip</span>
          <span className="text-navy-600">•</span>
          <h4 className="text-sm font-semibold text-white">{tip.title}</h4>
        </div>
        <p className="text-navy-300 text-sm truncate sm:whitespace-normal">{tip.content}</p>
      </div>
      <button 
        onClick={() => {
          const randomIndex = Math.floor(Math.random() * TIPS.length)
          setTip(TIPS[randomIndex])
        }}
        className="flex-shrink-0 text-navy-400 hover:text-primary-400 transition-colors p-2"
        title="Get another tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}