'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Consistent Practice',
    content: 'Code for at least 30 minutes every day. Consistency beats intensity for long-term learning.',
    category: 'Learning'
  },
  {
    emoji: '🎯',
    title: 'Build Projects',
    content: 'The best way to learn is by building. Start with small projects and gradually increase complexity.',
    category: 'Practice'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    content: 'Writing notes by hand helps reinforce concepts. Try explaining what you learned in your own words.',
    category: 'Study Tips'
  },
  {
    emoji: '🔍',
    title: 'Read Error Messages',
    content: 'Error messages are your friends! They often tell you exactly what went wrong and where.',
    category: 'Debugging'
  },
  {
    emoji: '🤝',
    title: 'Join Communities',
    content: 'Connect with other learners on Discord, Twitter, or local meetups. Learning together is powerful.',
    category: 'Community'
  },
  {
    emoji: '⚡',
    title: 'Learn Shortcuts',
    content: 'Master keyboard shortcuts in your code editor. It saves hours over time and makes coding more enjoyable.',
    category: 'Productivity'
  },
  {
    emoji: '🧠',
    title: 'Teach Others',
    content: 'Explaining concepts to others is the best way to solidify your understanding.',
    category: 'Learning'
  },
  {
    emoji: '🔄',
    title: 'Embrace Iteration',
    content: 'Your first solution won\'t be perfect. Focus on making it work first, then refine it.',
    category: 'Mindset'
  },
  {
    emoji: '📚',
    title: 'Read Documentation',
    content: 'Official documentation is often the best resource. Make it a habit to check docs first.',
    category: 'Resources'
  },
  {
    emoji: '🎮',
    title: 'Make it Fun',
    content: 'Gamify your learning! Set challenges, earn achievements, and celebrate your progress.',
    category: 'Motivation'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTip(tips[dayOfYear % tips.length] ?? tips[0])
  }, [])

  const getNextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = tips.findIndex(t => t.title === currentTip.title)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex] ?? tips[0])
      setIsAnimating(false)
    }, 200)
  }

  return (
    <section className="py-8 border-y border-navy-800 bg-gradient-to-r from-navy-900/50 via-primary-900/10 to-navy-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center gap-6 transition-all duration-200 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-3xl flex-shrink-0">
            {currentTip.emoji}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="sm:hidden text-xl">{currentTip.emoji}</span>
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
                Daily Tip • {currentTip.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {currentTip.title}
            </h3>
            <p className="text-navy-300 text-sm">
              {currentTip.content}
            </p>
          </div>
          
          <button
            onClick={getNextTip}
            className="flex-shrink-0 p-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-all duration-200 group"
            aria-label="Next tip"
          >
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}