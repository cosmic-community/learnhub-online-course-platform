'use client'

import { useState, useEffect } from 'react'

const TIPS = [
  {
    emoji: '💡',
    title: 'Active Recall',
    tip: 'After watching a lesson, close your eyes and try to recall the main concepts. This strengthens memory retention by 50%!'
  },
  {
    emoji: '🎯',
    title: 'Pomodoro Technique',
    tip: 'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.'
  },
  {
    emoji: '✍️',
    title: 'Code Along',
    tip: "Don't just watch—type out every code example yourself. Muscle memory is a powerful learning tool!"
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review what you learned yesterday before starting new material. This prevents the forgetting curve!'
  },
  {
    emoji: '🎨',
    title: 'Teach to Learn',
    tip: 'Explain concepts to yourself or others as if teaching. If you can teach it, you truly understand it.'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    tip: 'Writing notes by hand activates different parts of your brain than typing, improving comprehension.'
  },
  {
    emoji: '🌙',
    title: 'Sleep on It',
    tip: 'Your brain consolidates learning during sleep. Review material before bed for better retention!'
  },
  {
    emoji: '🏃',
    title: 'Move Your Body',
    tip: 'A 10-minute walk after studying can boost memory consolidation by up to 20%.'
  },
  {
    emoji: '🎵',
    title: 'Focus Music',
    tip: 'Try lo-fi beats or classical music while coding. Consistent ambient sound can improve focus.'
  },
  {
    emoji: '🔗',
    title: 'Connect Concepts',
    tip: 'Link new concepts to things you already know. Building mental connections makes recall easier.'
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(TIPS[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % TIPS.length
    setTip(TIPS[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div 
      className={`bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl flex-shrink-0">
          {tip.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
              Daily Learning Tip
            </span>
            <span className="text-navy-500">•</span>
            <span className="text-xs text-navy-500">{tip.title}</span>
          </div>
          <p className="text-navy-200">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}