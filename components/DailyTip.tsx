'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: '🧠',
    title: 'Active Recall',
    tip: 'Test yourself frequently instead of re-reading. It strengthens memory significantly!',
  },
  {
    icon: '⏰',
    title: 'Pomodoro Technique',
    tip: 'Study for 25 minutes, then take a 5-minute break. Your brain retains more this way.',
  },
  {
    icon: '📝',
    title: 'Teach What You Learn',
    tip: "Explaining concepts to others (or rubber ducks) helps solidify your understanding.",
  },
  {
    icon: '🎯',
    title: 'Set Micro-Goals',
    tip: 'Break big topics into tiny, achievable goals. Small wins build momentum!',
  },
  {
    icon: '💤',
    title: 'Sleep On It',
    tip: 'Your brain consolidates learning during sleep. A good night\'s rest is productive!',
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks...',
  },
  {
    icon: '🎨',
    title: 'Visualize Concepts',
    tip: 'Draw diagrams and mind maps. Visual learners retain 65% more information!',
  },
  {
    icon: '🏃',
    title: 'Move Your Body',
    tip: 'A short walk boosts creativity and helps process what you\'ve learned.',
  },
  {
    icon: '📱',
    title: 'Reduce Distractions',
    tip: 'Put your phone in another room. Deep focus beats multitasking every time.',
  },
  {
    icon: '🤝',
    title: 'Learn Together',
    tip: 'Join study groups or communities. Teaching and discussing accelerates learning.',
  },
  {
    icon: '✍️',
    title: 'Handwrite Notes',
    tip: 'Writing by hand engages your brain more than typing. Try it for key concepts!',
  },
  {
    icon: '🎮',
    title: 'Gamify Learning',
    tip: 'Set personal challenges and rewards. Make learning feel like a game!',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
  }, [])

  const getNewTip = () => {
    setIsRefreshing(true)
    const currentIndex = learningTips.indexOf(tip)
    const nextIndex = (currentIndex + 1) % learningTips.length
    setTimeout(() => {
      setTip(learningTips[nextIndex])
      setIsRefreshing(false)
    }, 300)
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-emerald-500/5" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">💡 Daily Learning Tip</h3>
          <button
            onClick={getNewTip}
            className="text-navy-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-1"
            aria-label="Get new tip"
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isRefreshing ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Tip
          </button>
        </div>
        
        <div className={`transition-all duration-300 ${isRefreshing ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">{tip.icon}</span>
            <div>
              <h4 className="text-white font-medium mb-1">{tip.title}</h4>
              <p className="text-navy-300 text-sm leading-relaxed">{tip.tip}</p>
            </div>
          </div>
        </div>
        
        {/* Tip counter */}
        <div className="mt-4 pt-4 border-t border-navy-800">
          <p className="text-navy-500 text-xs">
            Tip {learningTips.indexOf(tip) + 1} of {learningTips.length} • Come back tomorrow for a new tip!
          </p>
        </div>
      </div>
    </div>
  )
}