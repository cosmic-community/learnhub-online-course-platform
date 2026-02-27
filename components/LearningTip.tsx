'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🧠',
    tip: 'Space your learning over time rather than cramming - it helps retention!',
    category: 'Memory'
  },
  {
    emoji: '✍️',
    tip: 'Taking handwritten notes helps you understand and remember better.',
    category: 'Note-taking'
  },
  {
    emoji: '🎯',
    tip: 'Set specific, achievable goals for each study session.',
    category: 'Planning'
  },
  {
    emoji: '🔄',
    tip: 'Review what you learned yesterday before starting something new.',
    category: 'Review'
  },
  {
    emoji: '💡',
    tip: 'Try to explain concepts in your own words - it deepens understanding.',
    category: 'Understanding'
  },
  {
    emoji: '⏰',
    tip: 'Use the Pomodoro technique: 25 min focus, 5 min break.',
    category: 'Productivity'
  },
  {
    emoji: '🏃',
    tip: 'A short walk or exercise before studying improves focus.',
    category: 'Health'
  },
  {
    emoji: '😴',
    tip: 'Sleep is crucial for memory consolidation. Don\'t skip it!',
    category: 'Health'
  },
  {
    emoji: '🤔',
    tip: 'Ask "why" and "how" questions to deepen your learning.',
    category: 'Critical Thinking'
  },
  {
    emoji: '👥',
    tip: 'Teaching others is one of the best ways to learn.',
    category: 'Social Learning'
  }
]

export default function LearningTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(true)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Set initial random tip based on current time
    const initialIndex = Math.floor(Date.now() / 1000) % learningTips.length
    setTipIndex(initialIndex)
    setCurrentTip(learningTips[initialIndex])
  }, [])

  const nextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const newIndex = (tipIndex + 1) % learningTips.length
      setTipIndex(newIndex)
      setCurrentTip(learningTips[newIndex])
      setIsVisible(true)
    }, 200)
  }

  return (
    <div className="card p-5 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-navy-300 uppercase tracking-wide flex items-center gap-2">
            <span>💡</span>
            Learning Tip
          </h4>
          <span className="text-xs px-2 py-1 bg-navy-800 rounded-full text-navy-400">
            {currentTip.category}
          </span>
        </div>
        
        <div 
          className={`transition-all duration-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl flex-shrink-0">{currentTip.emoji}</span>
            <p className="text-navy-200 text-sm leading-relaxed">
              {currentTip.tip}
            </p>
          </div>
        </div>
        
        <button
          onClick={nextTip}
          className="mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 group/btn"
        >
          <span>Another tip</span>
          <svg 
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}