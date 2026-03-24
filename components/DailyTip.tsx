'use client'

import { useState, useEffect } from 'react'

interface LearningTip {
  emoji: string
  title: string
  tip: string
  category: string
}

const LEARNING_TIPS: LearningTip[] = [
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    tip: 'Review what you learned yesterday before starting new material. Your brain retains information better with spaced reviews.',
    category: 'Memory',
  },
  {
    emoji: '✍️',
    title: 'Active Recall',
    tip: 'After watching a lesson, close it and try to write down everything you remember. This strengthens neural pathways.',
    category: 'Study Technique',
  },
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to accomplish today. "Complete 2 lessons" is better than "study some JavaScript".',
    category: 'Productivity',
  },
  {
    emoji: '⏰',
    title: 'Pomodoro Technique',
    tip: 'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.',
    category: 'Time Management',
  },
  {
    emoji: '💻',
    title: 'Code Along',
    tip: "Don't just watch tutorials - type the code yourself. Muscle memory and active engagement boost learning.",
    category: 'Practice',
  },
  {
    emoji: '🔄',
    title: 'Teach Others',
    tip: 'Explaining a concept to someone else (or rubber duck debugging) helps solidify your understanding.',
    category: 'Deep Learning',
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    tip: 'Writing notes by hand activates different brain regions than typing. Keep a learning journal!',
    category: 'Study Technique',
  },
  {
    emoji: '🌙',
    title: 'Sleep On It',
    tip: 'Your brain consolidates memories during sleep. A good night rest after learning is crucial.',
    category: 'Memory',
  },
  {
    emoji: '🏃',
    title: 'Exercise & Learn',
    tip: 'Light exercise before studying increases blood flow to the brain and improves focus.',
    category: 'Wellness',
  },
  {
    emoji: '🎮',
    title: 'Gamify Your Learning',
    tip: "Challenge yourself with mini-goals and rewards. Make learning feel like leveling up in a game!",
    category: 'Motivation',
  },
  {
    emoji: '🤔',
    title: 'Ask Why',
    tip: "Don't just memorize - understand the reasoning behind concepts. Ask 'why' for deeper comprehension.",
    category: 'Deep Learning',
  },
  {
    emoji: '🔗',
    title: 'Connect Concepts',
    tip: 'Link new information to what you already know. Building mental connections aids retention.',
    category: 'Memory',
  },
  {
    emoji: '📱',
    title: 'Minimize Distractions',
    tip: 'Put your phone in another room while studying. Even having it visible reduces cognitive capacity.',
    category: 'Focus',
  },
  {
    emoji: '🎧',
    title: 'Background Music',
    tip: 'Instrumental music or lo-fi beats can help some people focus. Experiment to find what works for you.',
    category: 'Focus',
  },
  {
    emoji: '🌅',
    title: 'Morning Learning',
    tip: 'Your brain is often sharpest in the morning. Try tackling difficult concepts early in the day.',
    category: 'Productivity',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<LearningTip | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get consistent tip for the day based on date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])

    // Check if user dismissed the tip today
    const dismissedDate = localStorage.getItem('daily-tip-dismissed')
    if (dismissedDate === today.toDateString()) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('daily-tip-dismissed', new Date().toDateString())
  }

  if (!tip || !isVisible) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 text-4xl animate-float">
          {tip.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">
              💡 Daily Learning Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-500">{tip.category}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{tip.title}</h3>
          <p className="text-navy-300 text-sm leading-relaxed">{tip.tip}</p>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-navy-500 hover:text-navy-300 transition-colors p-1"
          aria-label="Dismiss tip"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}