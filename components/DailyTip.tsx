'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    tip: 'Focus on one concept at a time. Mastery comes from depth, not breadth.',
    category: 'Focus'
  },
  {
    emoji: '🧠',
    tip: 'Take breaks every 25 minutes. Your brain consolidates learning during rest.',
    category: 'Productivity'
  },
  {
    emoji: '✍️',
    tip: 'Write code by hand sometimes. It strengthens memory and understanding.',
    category: 'Practice'
  },
  {
    emoji: '🔄',
    tip: 'Review yesterday\'s lesson before starting today\'s. Spaced repetition works!',
    category: 'Memory'
  },
  {
    emoji: '🤝',
    tip: 'Teach what you learn to others. Teaching is the best way to solidify knowledge.',
    category: 'Growth'
  },
  {
    emoji: '🛠️',
    tip: 'Build projects as you learn. Real-world application beats passive consumption.',
    category: 'Practice'
  },
  {
    emoji: '📝',
    tip: 'Keep a learning journal. Document your "aha!" moments and struggles.',
    category: 'Reflection'
  },
  {
    emoji: '💪',
    tip: 'Embrace the struggle. Confusion is a sign that real learning is happening.',
    category: 'Mindset'
  },
  {
    emoji: '🌟',
    tip: 'Celebrate small wins. Completed a lesson? That\'s progress worth acknowledging!',
    category: 'Motivation'
  },
  {
    emoji: '🔍',
    tip: 'Read error messages carefully. They\'re trying to help you, not frustrate you.',
    category: 'Debugging'
  },
  {
    emoji: '⏰',
    tip: 'Consistency beats intensity. 30 minutes daily outperforms weekend marathons.',
    category: 'Habits'
  },
  {
    emoji: '🎨',
    tip: 'Experiment freely. Some of the best discoveries come from "what if" moments.',
    category: 'Creativity'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setCurrentTip(learningTips[tipIndex] ?? learningTips[0])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-xl" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
          {currentTip.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              Daily Learning Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-400">{currentTip.category}</span>
          </div>
          <p className="text-white font-medium leading-relaxed">
            {currentTip.tip}
          </p>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}