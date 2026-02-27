'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Before starting a course, write down 3 specific things you want to learn. This keeps you focused and motivated.',
    category: 'Productivity'
  },
  {
    emoji: '⏰',
    title: 'The 25-Minute Rule',
    tip: 'Study in 25-minute focused sessions (Pomodoro Technique). Take 5-minute breaks between sessions for better retention.',
    category: 'Time Management'
  },
  {
    emoji: '📝',
    title: 'Active Recall',
    tip: 'After each lesson, close your notes and write down everything you remember. This strengthens memory more than re-reading.',
    category: 'Learning Science'
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. This builds long-term memory.',
    category: 'Memory'
  },
  {
    emoji: '💻',
    title: 'Learn by Doing',
    tip: 'Code along with every tutorial. Typing the code yourself, even if copying, helps cement concepts better than just watching.',
    category: 'Practice'
  },
  {
    emoji: '🤔',
    title: 'Teach to Learn',
    tip: 'Explain concepts to someone else (or a rubber duck!). Teaching reveals gaps in your understanding.',
    category: 'Deep Learning'
  },
  {
    emoji: '😴',
    title: 'Sleep on It',
    tip: 'Your brain consolidates learning during sleep. Reviewing material before bed can improve retention by up to 20%.',
    category: 'Health'
  },
  {
    emoji: '🏃',
    title: 'Move Your Body',
    tip: 'A 20-minute walk can boost cognitive function for 2+ hours. Take movement breaks between study sessions.',
    category: 'Health'
  },
  {
    emoji: '🎮',
    title: 'Gamify Your Learning',
    tip: 'Set mini-challenges: "I\'ll complete 3 lessons before lunch." Small wins build momentum and dopamine.',
    category: 'Motivation'
  },
  {
    emoji: '📚',
    title: 'Connect the Dots',
    tip: 'Link new concepts to things you already know. Building mental connections makes information stick better.',
    category: 'Learning Science'
  },
  {
    emoji: '✍️',
    title: 'Handwritten Notes',
    tip: 'Writing notes by hand (even on a tablet) improves comprehension compared to typing.',
    category: 'Productivity'
  },
  {
    emoji: '🔍',
    title: 'Debug Mindset',
    tip: 'When stuck, break the problem into smaller pieces. Most bugs are simpler than they first appear.',
    category: 'Problem Solving'
  },
  {
    emoji: '🌟',
    title: 'Celebrate Small Wins',
    tip: 'Completed a lesson? Take a moment to acknowledge it. Positive reinforcement keeps you motivated.',
    category: 'Motivation'
  },
  {
    emoji: '🤝',
    title: 'Find a Study Buddy',
    tip: 'Learning with others increases accountability and makes difficult topics more approachable through discussion.',
    category: 'Social Learning'
  },
  {
    emoji: '📱',
    title: 'Reduce Distractions',
    tip: 'Put your phone in another room while learning. Even having it visible reduces cognitive capacity by 10%.',
    category: 'Focus'
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getTodaysTip = () => {
    // Use the day of year to get a consistent daily tip
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    return learningTips[dayOfYear % learningTips.length]
  }

  const getRandomTip = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * learningTips.length)
      setTip(learningTips[randomIndex])
      setIsRefreshing(false)
    }, 300)
  }

  useEffect(() => {
    setTip(getTodaysTip())
  }, [])

  if (!tip) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-800 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-navy-800 rounded"></div>
      </div>
    )
  }

  return (
    <div className={`card p-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{tip.emoji}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">Daily Learning Tip</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
              {tip.category}
            </span>
          </div>
        </div>
        <button
          onClick={getRandomTip}
          disabled={isRefreshing}
          className="p-2 rounded-lg hover:bg-navy-800 transition-colors text-navy-400 hover:text-white disabled:opacity-50"
          title="Get another tip"
        >
          <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <h4 className="text-white font-medium mb-2">{tip.title}</h4>
      <p className="text-navy-300 leading-relaxed">{tip.tip}</p>

      <div className="mt-4 pt-4 border-t border-navy-800">
        <p className="text-xs text-navy-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          New tip every day • Click refresh for more
        </p>
      </div>
    </div>
  )
}