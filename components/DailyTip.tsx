'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    emoji: '⏰',
    title: 'Consistency Over Intensity',
    tip: '15 minutes daily beats 2 hours once a week. Small, consistent efforts lead to lasting knowledge.',
  },
  {
    emoji: '📝',
    title: 'Take Notes By Hand',
    tip: 'Writing notes by hand improves retention by 30% compared to typing. Try sketching concepts!',
  },
  {
    emoji: '🧠',
    title: 'Teach What You Learn',
    tip: "The Feynman Technique: If you can't explain it simply, you don't understand it well enough.",
  },
  {
    emoji: '😴',
    title: 'Sleep On It',
    tip: 'Your brain consolidates memories during sleep. Review challenging material before bed.',
  },
  {
    emoji: '🎯',
    title: 'Active Recall',
    tip: 'Test yourself instead of re-reading. Active recall strengthens memory pathways.',
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month.',
  },
  {
    emoji: '💪',
    title: 'Embrace the Struggle',
    tip: "Difficulty is good! When learning feels hard, that's when real neural connections form.",
  },
  {
    emoji: '🎨',
    title: 'Make It Visual',
    tip: 'Create mind maps, diagrams, or doodles. Visual learning activates different brain areas.',
  },
  {
    emoji: '🚶',
    title: 'Move Your Body',
    tip: 'Light exercise improves cognitive function. Take a walk when stuck on a problem.',
  },
  {
    emoji: '🤝',
    title: 'Learn Together',
    tip: 'Study groups increase accountability and expose you to different perspectives.',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get a consistent tip for today based on date
    const today = new Date().toDateString()
    const dayIndex = new Date().getDate() % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[dayIndex])

    // Check if already dismissed today
    const dismissed = localStorage.getItem('learnhub-tip-dismissed')
    if (dismissed === today) {
      setIsDismissed(true)
    }

    setTimeout(() => setIsVisible(true), 900)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
  }

  if (!tip || isDismissed) return null

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative card p-6 bg-gradient-to-br from-purple-500/10 to-navy-900/50 border-purple-500/20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
        
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-navy-700 transition-colors text-navy-400 hover:text-white"
          aria-label="Dismiss tip"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{tip.emoji}</span>
            <div>
              <span className="text-xs text-purple-400 font-medium uppercase tracking-wide">Daily Learning Tip</span>
              <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
            </div>
          </div>
          <p className="text-navy-300 leading-relaxed pl-11">
            {tip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}