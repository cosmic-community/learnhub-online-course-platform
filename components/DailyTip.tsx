'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Focus Mode',
    tip: 'Try the Pomodoro Technique: 25 minutes of focused learning, then a 5-minute break.',
    color: 'from-red-500/20 to-orange-500/20'
  },
  {
    emoji: '📝',
    title: 'Active Learning',
    tip: 'Take notes while watching lessons - it improves retention by up to 40%.',
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review what you learned yesterday before starting new content today.',
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    emoji: '💡',
    title: 'Practice Makes Perfect',
    tip: 'Code along with the examples - typing helps muscle memory.',
    color: 'from-yellow-500/20 to-amber-500/20'
  },
  {
    emoji: '🌙',
    title: 'Sleep on It',
    tip: 'Your brain consolidates learning during sleep. Get 7-8 hours for best retention.',
    color: 'from-indigo-500/20 to-blue-500/20'
  },
  {
    emoji: '🤝',
    title: 'Teach Others',
    tip: 'Explaining concepts to someone else is one of the best ways to learn.',
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    emoji: '🎮',
    title: 'Gamify It',
    tip: 'Set small challenges for yourself and reward your progress!',
    color: 'from-pink-500/20 to-rose-500/20'
  }
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % learningTips.length)
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (isDismissed) return null

  const currentTip = learningTips[tipIndex]
  if (!currentTip) return null

  return (
    <div 
      className={`fixed bottom-24 right-6 z-40 max-w-sm transform transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`bg-gradient-to-br ${currentTip.color} backdrop-blur-lg rounded-2xl border border-navy-700/50 shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="px-4 py-3 bg-navy-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentTip.emoji}</span>
            <span className="text-sm font-medium text-white">Daily Learning Tip</span>
          </div>
          <button 
            onClick={() => setIsDismissed(true)}
            className="text-navy-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss tip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h4 className="text-white font-semibold mb-2">{currentTip.title}</h4>
          <p className="text-navy-200 text-sm leading-relaxed">{currentTip.tip}</p>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-navy-900/30 flex items-center justify-between">
          <button 
            onClick={() => setTipIndex((prev) => (prev + 1) % learningTips.length)}
            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Another tip
          </button>
          <span className="text-navy-500 text-xs">Tip {tipIndex + 1} of {learningTips.length}</span>
        </div>
      </div>
    </div>
  )
}