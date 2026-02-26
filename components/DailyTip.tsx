'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Consistency is Key',
    content: 'Just 30 minutes of daily learning is more effective than 4 hours once a week.',
    category: 'Learning'
  },
  {
    emoji: '🎯',
    title: 'Active Recall',
    content: 'Test yourself frequently. It strengthens memory far more than passive reading.',
    category: 'Study Tip'
  },
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    content: 'Review concepts at increasing intervals: 1 day, 3 days, 1 week, 2 weeks.',
    category: 'Memory'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    content: 'Writing notes by hand improves comprehension and retention.',
    category: 'Study Tip'
  },
  {
    emoji: '🔄',
    title: 'Teach to Learn',
    content: 'Explaining concepts to others is one of the best ways to solidify your understanding.',
    category: 'Learning'
  },
  {
    emoji: '😴',
    title: 'Rest Matters',
    content: 'Your brain consolidates learning during sleep. Aim for 7-8 hours.',
    category: 'Wellness'
  },
  {
    emoji: '🏃',
    title: 'Move Your Body',
    content: 'Short exercise breaks boost brain function and improve focus.',
    category: 'Wellness'
  },
  {
    emoji: '📱',
    title: 'Minimize Distractions',
    content: 'Put your phone in another room while studying to boost focus by 26%.',
    category: 'Productivity'
  },
  {
    emoji: '🎮',
    title: 'Gamify Learning',
    content: 'Set small goals and reward yourself. This triggers dopamine and motivation.',
    category: 'Motivation'
  },
  {
    emoji: '📚',
    title: 'Learn in Blocks',
    content: 'The Pomodoro Technique: 25 min focused work + 5 min break = optimal learning.',
    category: 'Productivity'
  }
]

const STORAGE_KEY = 'learnhub-tip-data'

interface TipData {
  lastShown: string
  dismissedToday: boolean
}

export default function DailyTip() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTip, setCurrentTip] = useState(tips[0])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(STORAGE_KEY)
    
    let tipData: TipData | null = null
    if (stored) {
      try {
        tipData = JSON.parse(stored)
      } catch {
        tipData = null
      }
    }

    // If dismissed today, don't show
    if (tipData?.dismissedToday && tipData.lastShown === today) {
      return
    }

    // Select a tip based on the day
    const dayIndex = new Date().getDate() % tips.length
    setCurrentTip(tips[dayIndex] ?? tips[0])

    // Show after delay
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    const today = new Date().toDateString()
    const data: TipData = {
      lastShown: today,
      dismissedToday: true
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 left-5 z-40 animate-fade-in-up max-w-sm">
      <div className="tip-card rounded-2xl p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{currentTip.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary-400 bg-primary-500/20 px-2 py-0.5 rounded-full">
                {currentTip.category}
              </span>
              <span className="text-xs text-navy-500">Daily Tip</span>
            </div>
            <h4 className="font-semibold text-white mb-1">{currentTip.title}</h4>
            <p className="text-sm text-navy-300">{currentTip.content}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-navy-500 hover:text-navy-300 transition-colors p-1"
            aria-label="Dismiss tip"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}