'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    icon: '💡',
    title: 'Pro Tip',
    content: 'Start with fundamentals before jumping to advanced topics. A strong foundation leads to faster progress!',
  },
  {
    icon: '🎯',
    title: 'Focus Mode',
    content: 'Set a 25-minute timer and focus on one lesson at a time. The Pomodoro technique works wonders!',
  },
  {
    icon: '📝',
    title: 'Take Notes',
    content: 'Writing notes by hand improves retention by 40%. Try summarizing key concepts after each lesson.',
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    content: 'Review what you learned after 1 day, 3 days, and 1 week. This locks knowledge into long-term memory.',
  },
  {
    icon: '🤝',
    title: 'Teach Others',
    content: 'The best way to learn is to teach. Try explaining concepts to a friend or even a rubber duck!',
  },
  {
    icon: '🌙',
    title: 'Rest Well',
    content: 'Sleep is when your brain consolidates learning. Don\'t sacrifice sleep for more study time.',
  },
]

export default function QuickTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
      setIsAnimating(false)
    }, 300)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
      setIsAnimating(false)
    }, 300)
  }

  // Auto-advance tips
  useEffect(() => {
    const timer = setInterval(() => {
      nextTip()
    }, 8000)

    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  const tip = tips[currentTip]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-purple-500/10 border border-navy-800">
      <div className="absolute top-0 left-0 w-full h-1 bg-navy-800">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-300"
          style={{ width: `${((currentTip + 1) / tips.length) * 100}%` }}
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex-1 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{tip.icon}</span>
              <span className="text-sm font-medium text-primary-400">{tip.title}</span>
            </div>
            <p className="text-navy-200">{tip.content}</p>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-navy-500 hover:text-navy-300 transition-colors"
            aria-label="Dismiss tip"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-800">
          <div className="flex gap-1">
            {tips.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentTip(index)
                    setIsAnimating(false)
                  }, 300)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTip 
                    ? 'bg-primary-500 w-4' 
                    : 'bg-navy-700 hover:bg-navy-600'
                }`}
                aria-label={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={prevTip}
              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
              aria-label="Previous tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTip}
              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
              aria-label="Next tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}