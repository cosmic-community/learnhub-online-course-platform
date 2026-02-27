'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '💡',
    title: 'Pro Tip',
    tip: 'Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).'
  },
  {
    emoji: '🧠',
    title: 'Memory Hack',
    tip: 'Review what you learned yesterday before starting new content - it helps with retention!'
  },
  {
    emoji: '✍️',
    title: 'Practice Makes Perfect',
    tip: 'Code along with tutorials instead of just watching - active learning is 3x more effective.'
  },
  {
    emoji: '🎯',
    title: 'Stay Focused',
    tip: 'Set specific goals for each learning session, like "complete 2 lessons" or "build one feature".'
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review concepts at increasing intervals: 1 day, 3 days, 1 week, 2 weeks for long-term memory.'
  },
  {
    emoji: '🤝',
    title: 'Learn by Teaching',
    tip: 'Explain concepts to others or write about them - teaching is the best way to solidify knowledge.'
  },
  {
    emoji: '🚀',
    title: 'Build Projects',
    tip: 'Apply what you learn immediately in personal projects - practical experience beats theory.'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    tip: 'Write notes in your own words, not verbatim. This forces you to understand the material.'
  },
  {
    emoji: '😴',
    title: 'Rest Well',
    tip: 'Your brain consolidates learning during sleep. Aim for 7-8 hours for optimal retention.'
  },
  {
    emoji: '🎮',
    title: 'Gamify Learning',
    tip: 'Set up rewards for milestones - completing a course, maintaining streaks, or finishing projects.'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    const tip = learningTips[tipIndex]
    if (tip) {
      setCurrentTip(tip)
    }
    
    // Check if dismissed today
    const dismissedDate = localStorage.getItem('learnhub-tip-dismissed')
    const today = new Date().toDateString()
    if (dismissedDate === today) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-y border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-2xl shrink-0 animate-bounce-slow">{currentTip.emoji}</span>
            <div className="min-w-0">
              <span className="text-primary-400 font-semibold text-sm">{currentTip.title}:</span>
              <span className="text-navy-200 ml-2 text-sm">{currentTip.tip}</span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 text-navy-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss tip"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}