'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to achieve before starting each session.',
  },
  {
    emoji: '🧠',
    title: 'Active Recall',
    tip: 'Test yourself instead of just re-reading. It strengthens memory!',
  },
  {
    emoji: '⏰',
    title: 'Pomodoro Technique',
    tip: '25 minutes of focused work, then 5 minutes break. Repeat!',
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    tip: "Writing things down helps cement concepts in your mind.",
  },
  {
    emoji: '💻',
    title: 'Code Along',
    tip: "Don't just watch—type out the code yourself to learn faster.",
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals for better retention.',
  },
  {
    emoji: '🤝',
    title: 'Teach Others',
    tip: "Explaining concepts to others solidifies your understanding.",
  },
  {
    emoji: '😴',
    title: 'Rest Well',
    tip: 'Sleep consolidates learning. Your brain needs rest to retain!',
  },
  {
    emoji: '🎮',
    title: 'Build Projects',
    tip: 'Apply what you learn in real projects to make it stick.',
  },
  {
    emoji: '❓',
    title: 'Ask Questions',
    tip: "Curiosity drives learning. Don't be afraid to ask why!",
  },
]

export default function QuickTip() {
  const [tip, setTip] = useState(LEARNING_TIPS[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick a random tip based on the day
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    setTip(LEARNING_TIPS[dayOfYear % LEARNING_TIPS.length])
    
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  const getNewTip = () => {
    const currentIndex = LEARNING_TIPS.indexOf(tip)
    const nextIndex = (currentIndex + 1) % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[nextIndex])
  }

  if (!isVisible) return null

  return (
    <div className="card p-5 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/20">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{tip.emoji}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{tip.title}</h4>
          <p className="text-sm text-navy-300">{tip.tip}</p>
        </div>
        <button
          onClick={getNewTip}
          className="text-navy-500 hover:text-primary-400 transition-colors p-1"
          title="Next tip"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-navy-700/50">
        <p className="text-xs text-navy-500">💡 Daily Learning Tip</p>
      </div>
    </div>
  )
}