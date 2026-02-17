'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Break your learning into small, achievable milestones. Completing them releases dopamine and keeps you motivated!',
    color: 'from-blue-500/20 to-purple-500/20'
  },
  {
    emoji: '🧠',
    title: 'Space Your Learning',
    tip: 'Instead of cramming, spread your study sessions over time. Spaced repetition helps move knowledge to long-term memory.',
    color: 'from-green-500/20 to-teal-500/20'
  },
  {
    emoji: '✍️',
    title: 'Practice Active Recall',
    tip: 'After watching a lesson, close your notes and try to recall what you learned. This strengthens neural pathways!',
    color: 'from-orange-500/20 to-red-500/20'
  },
  {
    emoji: '🤝',
    title: 'Teach What You Learn',
    tip: 'Explaining concepts to others (or even to yourself) is one of the most effective ways to solidify understanding.',
    color: 'from-pink-500/20 to-rose-500/20'
  },
  {
    emoji: '💪',
    title: 'Embrace the Struggle',
    tip: "If something feels hard, that's when the most learning happens! Difficulty is a sign that your brain is growing.",
    color: 'from-yellow-500/20 to-amber-500/20'
  },
  {
    emoji: '🎵',
    title: 'Create Your Environment',
    tip: 'A consistent study environment signals to your brain that it\'s time to focus. Try lo-fi music or white noise!',
    color: 'from-indigo-500/20 to-blue-500/20'
  },
  {
    emoji: '😴',
    title: 'Sleep on It',
    tip: 'Your brain consolidates memories during sleep. Review important concepts before bed for better retention!',
    color: 'from-violet-500/20 to-purple-500/20'
  },
  {
    emoji: '📝',
    title: 'Code Along, Don\'t Copy',
    tip: 'When following tutorials, type the code yourself instead of copy-pasting. Muscle memory is real for coding!',
    color: 'from-cyan-500/20 to-sky-500/20'
  },
  {
    emoji: '🔄',
    title: 'Build Something New',
    tip: 'Apply what you learn to a personal project. Real-world application cements knowledge like nothing else.',
    color: 'from-emerald-500/20 to-green-500/20'
  },
  {
    emoji: '⏰',
    title: 'Use the Pomodoro Technique',
    tip: '25 minutes of focused study followed by a 5-minute break keeps your mind fresh and prevents burnout.',
    color: 'from-red-500/20 to-orange-500/20'
  }
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setTipIndex(dayOfYear % learningTips.length)
    
    // Check if user dismissed today's tip
    const dismissedDate = localStorage.getItem('tipDismissedDate')
    const todayStr = today.toDateString()
    if (dismissedDate !== todayStr) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('tipDismissedDate', new Date().toDateString())
  }

  const handleShowTip = () => {
    setIsVisible(true)
    setIsDismissed(false)
  }

  const tip = learningTips[tipIndex]

  if (!tip) return null

  return (
    <div className="relative">
      {/* Collapsed state - show button */}
      {isDismissed && !isVisible && (
        <div className="fixed bottom-24 right-6 z-40">
          <button
            onClick={handleShowTip}
            className="group flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 rounded-full border border-navy-700 text-navy-300 hover:text-white transition-all shadow-lg"
          >
            <span className="text-xl">💡</span>
            <span className="text-sm font-medium">Daily Tip</span>
          </button>
        </div>
      )}

      {/* Expanded tip */}
      {isVisible && (
        <section className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${tip.color} border border-navy-700/50 p-6 md:p-8 animate-fade-in`}>
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 text-navy-400 hover:text-white transition-colors"
                aria-label="Dismiss tip"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-navy-800/50 flex items-center justify-center text-4xl animate-bounce-slow">
                  {tip.emoji}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                      💡 Daily Learning Tip
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-navy-200">
                    {tip.tip}
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}