'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: '🎯',
    title: 'Set Clear Goals',
    tip: 'Before starting a course, write down what you want to achieve. Clear goals help you stay focused and motivated.',
  },
  {
    icon: '🧠',
    title: 'Active Recall',
    tip: 'After each lesson, close it and try to recall the key points. This strengthens your memory significantly.',
  },
  {
    icon: '⏰',
    title: 'Pomodoro Technique',
    tip: 'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.',
  },
  {
    icon: '✍️',
    title: 'Take Notes by Hand',
    tip: 'Writing notes by hand improves retention more than typing. Keep a dedicated notebook for your learning.',
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. This optimizes long-term memory.',
  },
  {
    icon: '💻',
    title: 'Practice Immediately',
    tip: 'Apply what you learn right away. Create a small project or solve exercises immediately after each lesson.',
  },
  {
    icon: '🎓',
    title: 'Teach Others',
    tip: 'The best way to solidify knowledge is to explain it to someone else. Start a study group or write a blog post.',
  },
  {
    icon: '😴',
    title: 'Sleep on It',
    tip: 'Your brain consolidates learning during sleep. Get a good night\'s rest after intense study sessions.',
  },
  {
    icon: '🏃',
    title: 'Exercise Boost',
    tip: 'Light exercise before studying increases blood flow to the brain and improves focus and retention.',
  },
  {
    icon: '📱',
    title: 'Eliminate Distractions',
    tip: 'Put your phone in another room or use website blockers. Even having your phone visible reduces cognitive capacity.',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`card p-6 border-l-4 border-primary-500 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{tip.icon}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-primary-400 font-medium uppercase tracking-wide">Daily Learning Tip</span>
            <span className="w-1 h-1 bg-primary-400 rounded-full" />
            <span className="text-xs text-navy-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h4 className="text-white font-semibold mb-1">{tip.title}</h4>
          <p className="text-navy-300 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}