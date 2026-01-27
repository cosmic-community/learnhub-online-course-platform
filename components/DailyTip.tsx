'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Practice Every Day',
    content: 'Consistency beats intensity. Even 30 minutes of daily practice is better than 5 hours once a week.',
    category: 'Productivity'
  },
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    content: 'Define what you want to achieve before starting a course. It helps you stay focused and motivated.',
    category: 'Learning'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    content: 'Writing things down improves retention by 40%. Use a notebook or a note-taking app while learning.',
    category: 'Study Tips'
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    content: 'Review what you learned after 1 day, 3 days, and 1 week. This technique dramatically improves long-term memory.',
    category: 'Memory'
  },
  {
    emoji: '🤝',
    title: 'Teach Others',
    content: 'The best way to solidify your knowledge is to explain it to someone else. Start a blog or help a friend learn.',
    category: 'Growth'
  },
  {
    emoji: '🛠️',
    title: 'Build Projects',
    content: 'Apply what you learn by building real projects. Theory is important, but practice makes perfect.',
    category: 'Practice'
  },
  {
    emoji: '☕',
    title: 'Take Breaks',
    content: 'The Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. Your brain needs rest to process information.',
    category: 'Wellness'
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a consistent daily tip based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTip(dayOfYear % tips.length)
  }, [])

  const tip = tips[currentTip]

  if (!isVisible || !tip) return null

  return (
    <section className="py-6 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 border-y border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center text-2xl">
              {tip.emoji}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
                  Daily Tip • {tip.category}
                </span>
              </div>
              <p className="text-white font-medium truncate sm:whitespace-normal">
                <span className="text-primary-400">{tip.title}:</span>{' '}
                <span className="text-navy-200">{tip.content}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-2 text-navy-400 hover:text-white transition-colors"
            aria-label="Dismiss tip"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}