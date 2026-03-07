'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    emoji: '🧠',
    title: 'Active Recall',
    tip: 'Test yourself frequently. Trying to recall information strengthens memory more than re-reading.',
  },
  {
    emoji: '⏰',
    title: 'Pomodoro Technique',
    tip: 'Work in 25-minute focused sessions with 5-minute breaks. Your brain needs rest to consolidate learning.',
  },
  {
    emoji: '📝',
    title: 'Take Notes by Hand',
    tip: 'Writing notes by hand improves retention compared to typing. It forces you to process information.',
  },
  {
    emoji: '💤',
    title: 'Sleep on It',
    tip: 'Sleep helps consolidate memories. Review what you learned before bed for better retention.',
  },
  {
    emoji: '🗣️',
    title: 'Teach Others',
    tip: 'Explaining concepts to others is one of the best ways to solidify your understanding.',
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month.',
  },
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define specific, measurable goals for each study session to stay focused and motivated.',
  },
  {
    emoji: '🏃',
    title: 'Exercise Helps',
    tip: 'Physical exercise increases blood flow to the brain and improves cognitive function.',
  },
  {
    emoji: '🧩',
    title: 'Chunk Information',
    tip: 'Break complex topics into smaller, manageable pieces. Learn one chunk before moving to the next.',
  },
  {
    emoji: '🎵',
    title: 'Try Different Environments',
    tip: 'Studying in different locations can help you recall information in various contexts.',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(LEARNING_TIPS[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get today's tip based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
    
    // Check if already dismissed today
    const dismissed = localStorage.getItem('learnhub-tip-dismissed')
    if (dismissed === today.toDateString()) {
      setIsDismissed(true)
    }
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
  }

  if (isDismissed) return null

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="relative card p-5 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-primary-500/20">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-navy-500 hover:text-white transition-colors"
          aria-label="Dismiss tip"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{tip.emoji}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-primary-400 font-semibold">
                💡 Daily Learning Tip
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tip.title}</h3>
            <p className="text-navy-300 text-sm">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}