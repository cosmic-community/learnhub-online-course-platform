'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    icon: '💡',
    title: 'Focus on Fundamentals',
    content: 'Master the basics before diving into advanced topics. Strong foundations make complex concepts easier to grasp.'
  },
  {
    icon: '🎯',
    title: 'Practice Daily',
    content: 'Consistency beats intensity. Even 30 minutes of daily practice compounds into significant progress over time.'
  },
  {
    icon: '🔄',
    title: 'Teach What You Learn',
    content: 'Explaining concepts to others is one of the best ways to solidify your understanding and identify gaps.'
  },
  {
    icon: '📝',
    title: 'Take Notes Actively',
    content: 'Write notes in your own words. Active note-taking helps with retention and creates valuable reference material.'
  },
  {
    icon: '🚀',
    title: 'Build Real Projects',
    content: 'Apply what you learn by building projects. Hands-on experience is irreplaceable for developing real skills.'
  },
  {
    icon: '🤝',
    title: 'Join a Community',
    content: 'Learning with others accelerates growth. Share knowledge, ask questions, and collaborate on challenges.'
  },
  {
    icon: '⏰',
    title: 'Use Spaced Repetition',
    content: 'Review material at increasing intervals. This technique dramatically improves long-term retention.'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Set initial tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTip(dayOfYear % tips.length)
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
      setIsAnimating(false)
    }, 200)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
      setIsAnimating(false)
    }, 200)
  }

  const tip = tips[currentTip]

  return (
    <div className="relative bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">Daily Learning Tip</span>
            <span className="px-2 py-0.5 bg-primary-500/20 rounded-full text-xs text-primary-300">
              {currentTip + 1}/{tips.length}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={prevTip}
              className="p-1.5 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-400 hover:text-white transition-colors"
              aria-label="Previous tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTip}
              className="p-1.5 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-400 hover:text-white transition-colors"
              aria-label="Next tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{tip?.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{tip?.title}</h3>
              <p className="text-navy-300 text-sm leading-relaxed">{tip?.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}