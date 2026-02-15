'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    content: 'Review concepts at increasing intervals to boost long-term retention by up to 200%.',
  },
  {
    emoji: '✍️',
    title: 'Active Recall',
    content: 'Test yourself instead of re-reading. It strengthens memory pathways dramatically.',
  },
  {
    emoji: '🍅',
    title: 'Pomodoro Technique',
    content: 'Study for 25 minutes, then take a 5-minute break. Your brain consolidates learning during rest.',
  },
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    content: 'Define what you want to achieve before each session. Focused learning is effective learning.',
  },
  {
    emoji: '🔗',
    title: 'Connect Concepts',
    content: 'Link new knowledge to things you already know. Creating mental hooks aids memory.',
  },
  {
    emoji: '💤',
    title: 'Sleep on It',
    content: 'Your brain processes and organizes information during sleep. Don't skip rest!',
  },
  {
    emoji: '🗣️',
    title: 'Teach Others',
    content: 'Explaining concepts to others reveals gaps in your understanding and reinforces learning.',
  },
  {
    emoji: '📝',
    title: 'Take Notes by Hand',
    content: 'Handwriting activates more brain regions than typing, improving comprehension.',
  },
]

const TIP_KEY = 'learnhub_last_tip_index'
const TIP_DATE_KEY = 'learnhub_tip_date'

export default function LearningTip() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const today = new Date().toDateString()
    const lastTipDate = localStorage.getItem(TIP_DATE_KEY)
    const lastIndex = parseInt(localStorage.getItem(TIP_KEY) || '0', 10)
    
    if (lastTipDate !== today) {
      // New day, show new tip
      const newIndex = (lastIndex + 1) % tips.length
      setTipIndex(newIndex)
      localStorage.setItem(TIP_KEY, newIndex.toString())
      localStorage.setItem(TIP_DATE_KEY, today)
    } else {
      setTipIndex(lastIndex)
    }

    // Show tip after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted || !isVisible) return null

  const currentTip = tips[tipIndex]

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-primary-500 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-xl hover:scale-110 transition-transform animate-bounce-slow"
        title="Show learning tip"
      >
        💡
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm animate-slide-in-right">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500/20 to-transparent border-b border-navy-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <span className="text-sm font-semibold text-white">Learning Tip of the Day</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-navy-400 hover:text-white transition-colors"
              title="Minimize"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-navy-400 hover:text-white transition-colors"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{currentTip.emoji}</span>
            <div>
              <h4 className="text-white font-semibold mb-1">{currentTip.title}</h4>
              <p className="text-navy-300 text-sm leading-relaxed">{currentTip.content}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-navy-800/50 border-t border-navy-700/50 flex items-center justify-between">
          <span className="text-xs text-navy-500">New tip every day</span>
          <div className="flex gap-1">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === tipIndex ? 'bg-primary-500' : 'bg-navy-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}