'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  title: string
  content: string
  category: string
}

const tips: Tip[] = [
  {
    emoji: '🧠',
    title: 'Active Recall',
    content: 'Test yourself instead of just re-reading. Your brain learns better when retrieving information actively.',
    category: 'Learning Science'
  },
  {
    emoji: '⏰',
    title: 'Pomodoro Technique',
    content: '25 minutes of focused learning followed by a 5-minute break increases retention and prevents burnout.',
    category: 'Productivity'
  },
  {
    emoji: '✍️',
    title: 'Teach to Learn',
    content: 'Explaining concepts to others (or even to yourself) deepens your understanding dramatically.',
    category: 'Learning Science'
  },
  {
    emoji: '🔗',
    title: 'Connect the Dots',
    content: 'Link new concepts to what you already know. Building mental connections improves recall.',
    category: 'Memory'
  },
  {
    emoji: '😴',
    title: 'Sleep on It',
    content: 'Your brain consolidates learning during sleep. A good night\'s rest after studying is essential.',
    category: 'Wellness'
  },
  {
    emoji: '🎯',
    title: 'Specific Goals',
    content: 'Instead of "learn JavaScript", try "complete 3 lessons on arrays today". Specificity drives action.',
    category: 'Goal Setting'
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    content: 'Review material at increasing intervals. Day 1, Day 3, Day 7, Day 14 - it sticks better!',
    category: 'Memory'
  },
  {
    emoji: '💻',
    title: 'Code Along',
    content: 'Don\'t just watch - type the code yourself. Muscle memory and active engagement boost learning.',
    category: 'Practice'
  },
  {
    emoji: '🐛',
    title: 'Embrace Errors',
    content: 'Bugs and mistakes are learning opportunities. Every error fixed is a concept mastered.',
    category: 'Mindset'
  },
  {
    emoji: '📚',
    title: 'Interleaving',
    content: 'Mix up different topics in one session. It feels harder but leads to better long-term retention.',
    category: 'Learning Science'
  },
  {
    emoji: '🎨',
    title: 'Visual Learning',
    content: 'Draw diagrams and flowcharts. Visual representations help cement abstract concepts.',
    category: 'Technique'
  },
  {
    emoji: '🚀',
    title: 'Build Projects',
    content: 'Apply what you learn in real projects. Theory becomes permanent when put into practice.',
    category: 'Practice'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<Tip>(tips[0])
  const [isFlipping, setIsFlipping] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency, but allow manual changes
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
  }, [])

  const getNextTip = () => {
    setIsFlipping(true)
    setTimeout(() => {
      const currentIndex = tips.findIndex(t => t.title === currentTip.title)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex])
      setIsFlipping(false)
    }, 300)
  }

  return (
    <div 
      className={`card p-6 cursor-pointer transition-all duration-300 ${isFlipping ? 'scale-95 opacity-50' : ''}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentTip.emoji}</span>
          <div>
            <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
              Daily Tip
            </span>
            <h3 className="text-lg font-bold text-white">{currentTip.title}</h3>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            getNextTip()
          }}
          className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
          aria-label="Next tip"
        >
          <svg className="w-5 h-5 text-navy-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <p className="text-navy-300 leading-relaxed">
        {currentTip.content}
      </p>

      {/* Expandable details */}
      <div className={`overflow-hidden transition-all duration-300 ${showDetails ? 'max-h-40 mt-4' : 'max-h-0'}`}>
        <div className="pt-4 border-t border-navy-800">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">
            {currentTip.category}
          </span>
          <p className="text-navy-400 text-sm mt-3">
            💡 Tap for more tips or click the refresh button
          </p>
        </div>
      </div>

      {/* Tip indicator dots */}
      <div className="flex justify-center gap-1 mt-4">
        {tips.slice(0, 5).map((tip, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              tip.title === currentTip.title ? 'bg-primary-400' : 'bg-navy-700'
            }`}
          />
        ))}
        <span className="text-navy-600 text-xs ml-1">...</span>
      </div>
    </div>
  )
}