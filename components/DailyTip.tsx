'use client'

import { useState, useEffect } from 'react'

interface Tip {
  id: number
  emoji: string
  title: string
  content: string
  category: string
}

const tips: Tip[] = [
  {
    id: 1,
    emoji: '💡',
    title: 'Consistency is Key',
    content: 'Learning for 30 minutes every day is more effective than 3 hours once a week. Build the habit!',
    category: 'Learning'
  },
  {
    id: 2,
    emoji: '🎯',
    title: 'Active Recall',
    content: 'After watching a lesson, close your eyes and try to explain what you learned. This strengthens memory.',
    category: 'Study Tip'
  },
  {
    id: 3,
    emoji: '💻',
    title: 'Code Along',
    content: "Don't just watch - type out every code example yourself. Muscle memory is a real thing in programming!",
    category: 'Coding'
  },
  {
    id: 4,
    emoji: '🔄',
    title: 'Spaced Repetition',
    content: 'Review concepts after 1 day, 3 days, 1 week, and 2 weeks. This moves knowledge to long-term memory.',
    category: 'Learning'
  },
  {
    id: 5,
    emoji: '🐛',
    title: 'Embrace Errors',
    content: 'Error messages are your friends! Read them carefully - they often tell you exactly what went wrong.',
    category: 'Debugging'
  },
  {
    id: 6,
    emoji: '📝',
    title: 'Teach Others',
    content: "The best way to learn is to teach. Try explaining a concept to a rubber duck or write a blog post!",
    category: 'Learning'
  },
  {
    id: 7,
    emoji: '⏰',
    title: 'Pomodoro Technique',
    content: 'Work for 25 minutes, then take a 5-minute break. After 4 rounds, take a longer 15-30 minute break.',
    category: 'Productivity'
  },
  {
    id: 8,
    emoji: '🏗️',
    title: 'Build Projects',
    content: 'Theory is important, but building real projects is where the magic happens. Start small and iterate!',
    category: 'Practice'
  },
  {
    id: 9,
    emoji: '🔍',
    title: 'Read Documentation',
    content: 'Official docs are often the best resource. They might seem dry, but they contain the most accurate info.',
    category: 'Research'
  },
  {
    id: 10,
    emoji: '🤝',
    title: 'Join Communities',
    content: 'Connect with other learners on Discord, Twitter, or Reddit. Shared learning is more effective and fun!',
    category: 'Community'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
  }, [])

  const getNextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = tips.findIndex(t => t.id === currentTip?.id)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex])
      setIsAnimating(false)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10" />
      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary-400 text-sm font-medium">💡 Daily Learning Tip</span>
            <span className="text-navy-500 text-xs">• {currentTip.category}</span>
          </div>
          <button
            onClick={getNextTip}
            className="text-navy-400 hover:text-primary-400 text-sm flex items-center gap-1 transition-colors"
          >
            Next tip
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{currentTip.emoji}</span>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{currentTip.title}</h3>
              <p className="text-navy-300 leading-relaxed">{currentTip.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}