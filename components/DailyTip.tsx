'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Tip of the Day',
    content: 'Break your learning into 25-minute focused sessions with 5-minute breaks. This Pomodoro technique boosts retention!',
    color: 'primary',
  },
  {
    emoji: '🎯',
    title: 'Goal Setting',
    content: 'Set a specific learning goal for today. Even 15 minutes of focused practice makes a difference!',
    color: 'green',
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    content: 'Writing notes by hand improves memory retention by 34%. Try summarizing each lesson in your own words.',
    color: 'yellow',
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    content: 'Review what you learned yesterday before starting new material. This strengthens neural pathways!',
    color: 'purple',
  },
  {
    emoji: '🏆',
    title: 'Celebrate Progress',
    content: 'Every small win counts! Completed a lesson? Take a moment to acknowledge your achievement.',
    color: 'orange',
  },
  {
    emoji: '🧠',
    title: 'Active Recall',
    content: 'Test yourself instead of re-reading. Try to recall key concepts before checking your notes.',
    color: 'blue',
  },
  {
    emoji: '☕',
    title: 'Stay Hydrated',
    content: 'Drinking water improves focus and cognitive performance. Keep a glass nearby while learning!',
    color: 'cyan',
  },
]

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  primary: {
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/30',
    text: 'text-primary-400',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
  },
}

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a deterministic tip based on the day
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    setCurrentTip(dayOfYear % tips.length)
  }, [])

  const handleNextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
      setIsAnimating(false)
    }, 200)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  const tip = tips[currentTip]
  if (!tip) return null
  
  const colors = colorClasses[tip.color] || colorClasses.primary

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`${colors.bg} ${colors.border} border rounded-xl p-4 md:p-6 relative overflow-hidden transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">{tip.emoji}</div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold ${colors.text} mb-1`}>{tip.title}</h3>
              <p className="text-navy-300 text-sm md:text-base">{tip.content}</p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleNextTip}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Next tip"
              >
                <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Tip indicator dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {tips.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentTip(index)
                    setIsAnimating(false)
                  }, 200)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTip ? `${colors.text.replace('text-', 'bg-')} scale-125` : 'bg-navy-600 hover:bg-navy-500'
                }`}
                aria-label={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}