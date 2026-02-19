'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '🎯',
    title: 'Set Daily Goals',
    content: 'Start each day with a clear learning goal. Even 15 minutes of focused study can make a difference!'
  },
  {
    emoji: '📝',
    title: 'Take Notes',
    content: 'Writing things down helps cement concepts in memory. Try summarizing each lesson in your own words.'
  },
  {
    emoji: '🔄',
    title: 'Practice Regularly',
    content: 'Consistency beats intensity. Regular practice is more effective than occasional marathon sessions.'
  },
  {
    emoji: '💡',
    title: 'Teach Others',
    content: 'The best way to learn is to teach. Try explaining concepts to a friend or rubber duck!'
  },
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    content: 'Review material at increasing intervals. This technique dramatically improves long-term retention.'
  },
  {
    emoji: '🛠️',
    title: 'Build Projects',
    content: 'Apply what you learn by building real projects. Practical experience accelerates understanding.'
  },
  {
    emoji: '🤔',
    title: 'Ask Questions',
    content: "There's no such thing as a stupid question. Curiosity is the engine of learning!"
  },
  {
    emoji: '⏰',
    title: 'Time Blocking',
    content: 'Schedule dedicated learning time. Treat it like an important meeting with yourself.'
  },
  {
    emoji: '🎮',
    title: 'Gamify Learning',
    content: 'Challenge yourself with mini-goals and celebrate small wins to stay motivated.'
  },
  {
    emoji: '😴',
    title: 'Rest Well',
    content: 'Sleep is crucial for memory consolidation. Your brain processes and stores information during rest.'
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(tips[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get tip based on current day (changes daily)
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setTip(tips[tipIndex])
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-navy-900/50 to-primary-900/20 border-primary-800/30">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl flex-shrink-0">
          {tip.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-primary-400 uppercase tracking-wider font-medium">Daily Tip</span>
            <span className="w-1 h-1 rounded-full bg-primary-500" />
            <span className="text-xs text-navy-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </div>
          <h4 className="text-white font-semibold mb-1">{tip.title}</h4>
          <p className="text-sm text-navy-300">{tip.content}</p>
        </div>
      </div>
    </div>
  )
}