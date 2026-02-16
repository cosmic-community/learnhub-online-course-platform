'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to achieve before starting each lesson. Clear goals boost focus and retention.',
  },
  {
    emoji: '⏰',
    title: 'Learn in Chunks',
    tip: 'Study for 25-30 minutes, then take a 5-minute break. This Pomodoro technique improves focus.',
  },
  {
    emoji: '✍️',
    title: 'Practice Actively',
    tip: 'Don\'t just watch - code along! Active practice reinforces learning 10x better than passive watching.',
  },
  {
    emoji: '🔄',
    title: 'Review Regularly',
    tip: 'Spaced repetition helps you remember. Review yesterday\'s lesson before starting today\'s.',
  },
  {
    emoji: '🤝',
    title: 'Teach Others',
    tip: 'Explaining concepts to others is the best way to solidify your understanding.',
  },
  {
    emoji: '😴',
    title: 'Sleep Well',
    tip: 'Your brain consolidates learning during sleep. Get 7-8 hours for optimal retention.',
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    tip: 'Write down key concepts in your own words. Handwritten notes can boost memory by 34%.',
  },
  {
    emoji: '🏃',
    title: 'Stay Consistent',
    tip: '15 minutes daily beats 2 hours weekly. Consistency builds lasting habits.',
  },
  {
    emoji: '❓',
    title: 'Ask Questions',
    tip: 'If something\'s unclear, pause and research. Understanding beats completion.',
  },
  {
    emoji: '🎮',
    title: 'Build Projects',
    tip: 'Apply what you learn immediately. Real projects make knowledge stick.',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get today's tip based on the date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
  }, [])

  const getNewTip = () => {
    setIsAnimating(true)
    const currentIndex = learningTips.findIndex(t => t.title === tip.title)
    const nextIndex = (currentIndex + 1) % learningTips.length
    
    setTimeout(() => {
      setTip(learningTips[nextIndex])
      setIsAnimating(false)
    }, 200)
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <h3 className="text-lg font-semibold text-white">Daily Learning Tip</h3>
        </div>
        <button
          onClick={getNewTip}
          className="text-navy-400 hover:text-white transition-colors p-1 rounded hover:bg-navy-800"
          title="Get another tip"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className={`transition-all duration-200 ${isAnimating ? 'opacity-0 transform -translate-x-2' : 'opacity-100 transform translate-x-0'}`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{tip.emoji}</span>
          <div>
            <h4 className="font-medium text-yellow-300 mb-1">{tip.title}</h4>
            <p className="text-navy-300 text-sm leading-relaxed">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}