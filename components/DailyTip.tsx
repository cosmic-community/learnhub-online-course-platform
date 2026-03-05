'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to achieve before starting a course. Having clear objectives helps you stay focused and motivated.',
  },
  {
    emoji: '⏰',
    title: 'Learn in Chunks',
    tip: 'Studies show that 25-minute focused sessions with 5-minute breaks (Pomodoro Technique) improve retention by up to 40%.',
  },
  {
    emoji: '✍️',
    title: 'Take Active Notes',
    tip: 'Writing notes in your own words helps you process and remember information better than passive reading.',
  },
  {
    emoji: '🔄',
    title: 'Practice Spaced Repetition',
    tip: 'Review material at increasing intervals - this technique can boost long-term retention by up to 200%.',
  },
  {
    emoji: '💡',
    title: 'Teach What You Learn',
    tip: 'Explaining concepts to others (or even rubber ducks!) is one of the most effective ways to solidify your understanding.',
  },
  {
    emoji: '🛠️',
    title: 'Build Projects',
    tip: 'Apply what you learn by building real projects. Practical application cements knowledge better than theory alone.',
  },
  {
    emoji: '😴',
    title: 'Sleep on It',
    tip: 'Your brain consolidates learning during sleep. A good night\'s rest after studying can improve recall by up to 40%.',
  },
  {
    emoji: '🤝',
    title: 'Join a Community',
    tip: 'Learning with others provides motivation, different perspectives, and opportunities to discuss challenging concepts.',
  },
  {
    emoji: '📱',
    title: 'Minimize Distractions',
    tip: 'Turn off notifications while learning. It takes an average of 23 minutes to regain focus after an interruption.',
  },
  {
    emoji: '🎮',
    title: 'Make It Fun',
    tip: 'Gamify your learning with challenges and rewards. Engagement and enjoyment significantly boost information retention.',
  },
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    setTipIndex(dayOfYear % learningTips.length)
  }, [])

  const currentTip = learningTips[tipIndex]

  if (!currentTip || !isVisible) return null

  return (
    <section className="py-6 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-y border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-2xl">
              {currentTip.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary-400 text-xs font-semibold uppercase tracking-wide">Daily Learning Tip</span>
                <span className="text-navy-600">•</span>
                <span className="text-navy-500 text-xs">{currentTip.title}</span>
              </div>
              <p className="text-navy-200 text-sm line-clamp-2">{currentTip.tip}</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-2 text-navy-500 hover:text-white transition-colors"
            aria-label="Dismiss tip"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}