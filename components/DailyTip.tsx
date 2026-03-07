'use client'

import { useEffect, useState } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to achieve before starting each course. Clear goals boost completion rates by 40%!',
  },
  {
    emoji: '⏰',
    title: 'Consistent Schedule',
    tip: 'Learning for 30 minutes daily is more effective than cramming 4 hours once a week.',
  },
  {
    emoji: '✍️',
    title: 'Take Notes',
    tip: 'Writing notes by hand improves retention by 50% compared to just watching videos.',
  },
  {
    emoji: '🔄',
    title: 'Practice Regularly',
    tip: "Apply what you learn immediately. The 'use it or lose it' principle applies to coding skills!",
  },
  {
    emoji: '🤝',
    title: 'Join a Community',
    tip: 'Learning with others increases motivation and provides different perspectives.',
  },
  {
    emoji: '😴',
    title: 'Rest & Review',
    tip: 'Your brain consolidates learning during sleep. Review before bed for better retention.',
  },
  {
    emoji: '🏆',
    title: 'Celebrate Progress',
    tip: 'Acknowledge small wins! Completing even one lesson is a step toward mastery.',
  },
  {
    emoji: '❓',
    title: 'Embrace Confusion',
    tip: "Feeling confused? That's your brain growing! Struggle is part of effective learning.",
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a consistent tip for today based on the date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const tipIndex = dayOfYear % learningTips.length
    setCurrentTip(learningTips[tipIndex] ?? learningTips[0])
    
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleNextTip = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsVisible(false)
    
    setTimeout(() => {
      const currentIndex = learningTips.findIndex(t => t.title === currentTip.title)
      const nextIndex = (currentIndex + 1) % learningTips.length
      setCurrentTip(learningTips[nextIndex] ?? learningTips[0])
      setIsVisible(true)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div
      className={`relative overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 border border-primary-500/20 rounded-2xl p-6 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
        
        <div className="relative flex items-start gap-4">
          <div className="text-4xl flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }}>
            {currentTip.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
                💡 Daily Learning Tip
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {currentTip.title}
            </h3>
            <p className="text-navy-300 text-sm leading-relaxed">
              {currentTip.tip}
            </p>
          </div>
          <button
            onClick={handleNextTip}
            disabled={isAnimating}
            className="flex-shrink-0 p-2 text-navy-400 hover:text-white hover:bg-navy-700/50 rounded-lg transition-all duration-200 disabled:opacity-50"
            aria-label="Next tip"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}