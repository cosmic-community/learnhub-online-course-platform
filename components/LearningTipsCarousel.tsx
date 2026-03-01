'use client'

import { useState, useEffect } from 'react'

interface LearningTip {
  emoji: string
  title: string
  tip: string
  category: string
}

const learningTips: LearningTip[] = [
  {
    emoji: '💡',
    title: 'Code Every Day',
    tip: 'Even 15 minutes of daily practice builds muscle memory and keeps concepts fresh.',
    category: 'Productivity'
  },
  {
    emoji: '🧠',
    title: 'Teach What You Learn',
    tip: 'Explaining concepts to others is the best way to solidify your understanding.',
    category: 'Learning'
  },
  {
    emoji: '🔧',
    title: 'Build Real Projects',
    tip: 'Theory is important, but nothing beats hands-on experience with real-world projects.',
    category: 'Practice'
  },
  {
    emoji: '📚',
    title: 'Read Documentation',
    tip: 'Official docs are often the best resource. Make it a habit to read them first.',
    category: 'Resources'
  },
  {
    emoji: '🤝',
    title: 'Join Communities',
    tip: 'Connect with other learners. Collaboration accelerates growth exponentially.',
    category: 'Networking'
  },
  {
    emoji: '🎯',
    title: 'Set Small Goals',
    tip: 'Break down big learning objectives into achievable daily or weekly milestones.',
    category: 'Productivity'
  },
  {
    emoji: '🔄',
    title: 'Embrace Debugging',
    tip: 'Errors are learning opportunities. Every bug you fix makes you a better developer.',
    category: 'Mindset'
  },
  {
    emoji: '⏰',
    title: 'Take Breaks',
    tip: 'The Pomodoro technique works! Your brain needs rest to consolidate knowledge.',
    category: 'Wellness'
  }
]

export default function LearningTipsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % learningTips.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const goToTip = (index: number) => {
    if (index === currentIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsAnimating(false)
    }, 300)
  }

  const currentTip = learningTips[currentIndex]

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between gap-8">
        {/* Label */}
        <div className="hidden sm:flex items-center gap-2 text-navy-400 text-sm whitespace-nowrap">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Learning Tip of the Moment</span>
        </div>

        {/* Tip Content */}
        <div 
          className={`flex-1 flex items-center gap-4 transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <span className="text-3xl">{currentTip.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white">{currentTip.title}</span>
              <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full">
                {currentTip.category}
              </span>
            </div>
            <p className="text-navy-300 text-sm truncate sm:text-clip sm:whitespace-normal">
              {currentTip.tip}
            </p>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="hidden md:flex items-center gap-1.5">
          {learningTips.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTip(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-500 w-6' 
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToTip((currentIndex - 1 + learningTips.length) % learningTips.length)}
            className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            aria-label="Previous tip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToTip((currentIndex + 1) % learningTips.length)}
            className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            aria-label="Next tip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}