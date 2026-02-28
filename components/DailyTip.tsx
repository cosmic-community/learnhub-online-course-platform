'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  title: string
  content: string
  category: string
}

const learningTips: Tip[] = [
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    content: 'Review what you learned yesterday before starting something new. Studies show this increases retention by up to 80%.',
    category: 'Learning Science'
  },
  {
    emoji: '⌨️',
    title: 'Code Every Day',
    content: 'Even 15 minutes of coding daily builds muscle memory and keeps concepts fresh. Consistency beats intensity.',
    category: 'Programming'
  },
  {
    emoji: '🎯',
    title: 'Set Micro Goals',
    content: 'Break large projects into tasks you can complete in under 25 minutes. Small wins fuel motivation.',
    category: 'Productivity'
  },
  {
    emoji: '📝',
    title: 'Teach to Learn',
    content: 'Explaining concepts to others (or rubber ducks) helps solidify your understanding and reveals gaps in knowledge.',
    category: 'Learning Science'
  },
  {
    emoji: '💤',
    title: 'Sleep on It',
    content: 'Your brain consolidates learning during sleep. Study before bed and review in the morning for better retention.',
    category: 'Wellness'
  },
  {
    emoji: '🔄',
    title: 'Embrace Errors',
    content: 'Error messages are learning opportunities, not failures. Each bug you fix makes you a better developer.',
    category: 'Programming'
  },
  {
    emoji: '📖',
    title: 'Read Code Daily',
    content: 'Spend 10 minutes reading well-written open source code. You\'ll discover patterns and techniques used by experts.',
    category: 'Programming'
  },
  {
    emoji: '🏃',
    title: 'Take Movement Breaks',
    content: 'A 5-minute walk every hour increases creativity by 60% and helps solve complex problems.',
    category: 'Wellness'
  },
  {
    emoji: '🎨',
    title: 'Build Something Fun',
    content: 'Side projects that excite you teach more than tutorials. Make a game, automate something, or scratch your own itch.',
    category: 'Motivation'
  },
  {
    emoji: '🤝',
    title: 'Find Your Community',
    content: 'Join Discord servers, attend meetups, or find a coding buddy. Learning with others keeps you accountable and inspired.',
    category: 'Community'
  },
  {
    emoji: '📊',
    title: 'Track Your Progress',
    content: 'Keep a learning journal. Seeing how far you\'ve come is the best motivation when things get tough.',
    category: 'Productivity'
  },
  {
    emoji: '🎧',
    title: 'Active Listening',
    content: 'When watching tutorials, pause and predict what comes next. This turns passive watching into active learning.',
    category: 'Learning Science'
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getNewTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * learningTips.length)
      setTip(learningTips[randomIndex])
      setIsVisible(true)
    }, 300)
  }

  if (!tip) return null

  return (
    <div 
      className={`flex items-center gap-4 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-2xl border border-primary-500/20">
        {tip.emoji}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">💡 Daily Tip</span>
          <span className="text-navy-600">•</span>
          <span className="text-xs text-navy-500">{tip.category}</span>
        </div>
        <p className="text-navy-200 text-sm">
          <span className="font-semibold text-white">{tip.title}:</span> {tip.content}
        </p>
      </div>
      
      <button
        onClick={getNewTip}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-navy-800 transition-colors text-navy-400 hover:text-white"
        title="Get another tip"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}