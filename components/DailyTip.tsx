'use client'

import { useState, useEffect } from 'react'

interface LearningTip {
  emoji: string
  title: string
  tip: string
  actionText: string
}

const LEARNING_TIPS: LearningTip[] = [
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    tip: 'Review what you learned yesterday before starting something new. This strengthens neural pathways and improves retention by up to 200%!',
    actionText: 'Review a past lesson'
  },
  {
    emoji: '✍️',
    title: 'Active Learning',
    tip: "Don't just watch - code along! Typing the code yourself, even when copying, creates muscle memory and deeper understanding.",
    actionText: 'Open your code editor'
  },
  {
    emoji: '🎯',
    title: 'Focused Sessions',
    tip: 'The Pomodoro Technique: 25 minutes of focused learning, then a 5-minute break. Your brain consolidates information during rest.',
    actionText: 'Set a 25-min timer'
  },
  {
    emoji: '🗣️',
    title: 'Teach to Learn',
    tip: "Explaining a concept to someone else (or even a rubber duck!) reveals gaps in your understanding and solidifies knowledge.",
    actionText: 'Explain your last topic'
  },
  {
    emoji: '🔄',
    title: 'Embrace Mistakes',
    tip: 'Errors are learning opportunities! When code breaks, debug systematically. The struggle of fixing bugs builds problem-solving skills.',
    actionText: 'Tackle that tricky bug'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    tip: 'Write notes in your own words, not copy-paste. Summarizing forces comprehension and creates a personal reference guide.',
    actionText: 'Start a learning journal'
  },
  {
    emoji: '🌙',
    title: 'Sleep on It',
    tip: 'Your brain processes and consolidates learning during sleep. Reviewing material before bed can improve recall by 20-40%!',
    actionText: 'Plan tomorrow\'s topics'
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState<LearningTip | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    // Get tip based on day of week (0-6)
    const dayIndex = new Date().getDay()
    setTip(LEARNING_TIPS[dayIndex])
    
    // Trigger fade-in animation
    setTimeout(() => setFadeIn(true), 100)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`
        card overflow-hidden
        bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-purple-500/10
        border-primary-500/20
        transition-all duration-700 ease-out
        ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tip.emoji}</span>
            <div>
              <div className="text-xs text-primary-400 uppercase tracking-wide font-medium mb-0.5">
                💡 Daily Learning Tip
              </div>
              <h3 className="text-lg font-semibold text-white">
                {tip.title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-navy-400 hover:text-white transition-colors p-1"
            aria-label={isExpanded ? 'Collapse tip' : 'Expand tip'}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Expandable content */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isExpanded ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
        `}>
          <p className="text-navy-300 leading-relaxed mb-4">
            {tip.tip}
          </p>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-navy-500">Today's action:</span>
            <span className="text-primary-400 font-medium">{tip.actionText}</span>
          </div>
        </div>

        {/* Preview text when collapsed */}
        {!isExpanded && (
          <p className="text-navy-400 text-sm mt-3 line-clamp-1">
            {tip.tip}
          </p>
        )}
      </div>

      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500" />
    </div>
  )
}