'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { emoji: '🎯', tip: 'Set specific learning goals for each study session to stay focused and motivated.' },
  { emoji: '⏰', tip: 'The best time to learn is when you\'re well-rested. Morning learners retain 20% more!' },
  { emoji: '📝', tip: 'Taking notes by hand improves comprehension by 40% compared to typing.' },
  { emoji: '🔄', tip: 'Spaced repetition: Review material after 1 day, 3 days, and 7 days for optimal retention.' },
  { emoji: '💡', tip: 'Teaching others what you\'ve learned is the fastest way to master any concept.' },
  { emoji: '🧠', tip: 'Take a 5-minute break every 25 minutes. Your brain consolidates learning during rest.' },
  { emoji: '🎮', tip: 'Gamify your learning! Set rewards for completing lessons to boost dopamine.' },
  { emoji: '🌙', tip: 'Sleep is crucial for memory. 7-8 hours helps transfer skills to long-term memory.' },
  { emoji: '🏃', tip: 'A 20-minute walk before learning increases brain plasticity and focus.' },
  { emoji: '🎵', tip: 'Lo-fi beats or classical music at 60 BPM can improve concentration while studying.' },
  { emoji: '📱', tip: 'Put your phone in another room. Even a visible phone reduces cognitive capacity by 10%.' },
  { emoji: '🍎', tip: 'Blueberries and walnuts are brain superfoods! Snack smart while you learn.' },
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    const selectedTip = learningTips[tipIndex]
    if (selectedTip) {
      setTip(selectedTip)
    }
  }, [])

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40' : 'max-h-14'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 animate-gradient-x" />
      <div className="relative flex items-center gap-3 px-4 py-3 border border-yellow-500/20 rounded-xl bg-navy-900/50 backdrop-blur-sm cursor-pointer">
        <span className="text-2xl flex-shrink-0">{tip?.emoji}</span>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-yellow-400 uppercase tracking-wide font-semibold">Daily Learning Tip</span>
          <p className={`text-sm text-navy-200 ${isExpanded ? '' : 'truncate'}`}>
            {tip?.tip}
          </p>
        </div>
        <span className={`text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
    </div>
  )
}