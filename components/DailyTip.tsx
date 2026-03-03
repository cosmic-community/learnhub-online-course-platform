'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    content: 'Break your learning into small, achievable milestones. Completing small goals builds momentum!',
  },
  {
    emoji: '⏰',
    title: 'Consistency is Key',
    content: 'Even 20 minutes of daily practice is more effective than occasional long study sessions.',
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    content: 'Writing helps retain information. Try summarizing lessons in your own words.',
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    content: 'Review what you learned yesterday before starting something new. It dramatically improves retention!',
  },
  {
    emoji: '💡',
    title: 'Learn by Doing',
    content: 'Apply concepts immediately through projects. Hands-on practice is the fastest path to mastery.',
  },
  {
    emoji: '🤝',
    title: 'Teach Others',
    content: 'Explaining concepts to others solidifies your understanding. Join our community discussions!',
  },
  {
    emoji: '😴',
    title: 'Rest is Productive',
    content: 'Your brain consolidates learning during sleep. Don\'t skip rest – it\'s part of the process!',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setTip(tips[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <section className={`py-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 p-6 sm:p-8">
          <div className="absolute top-0 right-0 text-8xl opacity-10 -translate-y-4 translate-x-4">
            {tip.emoji}
          </div>
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
              {tip.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">Daily Learning Tip</span>
                <span className="w-1 h-1 rounded-full bg-primary-500" />
                <span className="text-xs text-navy-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{tip.title}</h3>
              <p className="text-navy-300">{tip.content}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}