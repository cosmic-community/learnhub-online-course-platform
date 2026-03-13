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
    emoji: '💡',
    title: 'Use Keyboard Shortcuts',
    content: 'Press Cmd/Ctrl + K anywhere to quickly search courses. Speed up your learning workflow!',
    category: 'Productivity'
  },
  {
    emoji: '🎯',
    title: 'Set Learning Goals',
    content: 'Studies show that setting specific learning goals increases completion rates by 42%.',
    category: 'Learning'
  },
  {
    emoji: '⏰',
    title: 'The 25-Minute Rule',
    content: 'Try the Pomodoro technique: 25 minutes of focused learning, then a 5-minute break.',
    category: 'Focus'
  },
  {
    emoji: '📝',
    title: 'Take Active Notes',
    content: 'Writing notes by hand improves retention by 30% compared to typing.',
    category: 'Retention'
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    content: 'Review what you learned after 1 day, 3 days, and 7 days for maximum retention.',
    category: 'Memory'
  },
  {
    emoji: '👥',
    title: 'Teach to Learn',
    content: 'Explaining concepts to others solidifies your own understanding. Find a study buddy!',
    category: 'Learning'
  },
  {
    emoji: '🧘',
    title: 'Mind-Body Connection',
    content: 'Regular exercise improves cognitive function. Take short walks between study sessions.',
    category: 'Wellness'
  },
  {
    emoji: '🌙',
    title: 'Sleep on It',
    content: 'Your brain consolidates learning during sleep. Aim for 7-9 hours for optimal retention.',
    category: 'Health'
  },
  {
    emoji: '🎮',
    title: 'Gamify Your Learning',
    content: 'Set mini-challenges for yourself. Small wins release dopamine and boost motivation!',
    category: 'Motivation'
  },
  {
    emoji: '📚',
    title: 'Read Documentation',
    content: 'Official docs are often the best resource. Bookmark them for quick reference.',
    category: 'Development'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getNextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const currentIndex = currentTip ? tips.indexOf(currentTip) : 0
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex])
      setIsVisible(true)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <div 
      className={`flex items-center justify-between gap-4 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-2xl">
          {currentTip.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              💡 Daily Tip • {currentTip.category}
            </span>
          </div>
          <p className="text-sm text-navy-200">
            <span className="font-semibold text-white">{currentTip.title}:</span>{' '}
            {currentTip.content}
          </p>
        </div>
      </div>
      
      <button
        onClick={getNextTip}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-navy-800 transition-colors text-navy-400 hover:text-white"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}