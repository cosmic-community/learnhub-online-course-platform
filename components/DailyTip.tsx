'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Small Goals',
    content: 'Break your learning into 25-minute focused sessions. The Pomodoro Technique helps maintain concentration and prevents burnout.',
  },
  {
    emoji: '✍️',
    title: 'Practice Active Recall',
    content: 'After each lesson, close your notes and try to recall the main concepts. This strengthens memory retention significantly.',
  },
  {
    emoji: '🔄',
    title: 'Spaced Repetition',
    content: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. This optimizes long-term memory.',
  },
  {
    emoji: '💻',
    title: 'Code Along, Then Solo',
    content: "First, follow along with tutorials. Then close them and try to recreate what you learned from memory.",
  },
  {
    emoji: '🤝',
    title: 'Teach What You Learn',
    content: 'Explaining concepts to others (or even rubber ducks!) reveals gaps in your understanding and reinforces knowledge.',
  },
  {
    emoji: '🌙',
    title: 'Sleep on It',
    content: 'Your brain consolidates learning during sleep. Reviewing material before bed can enhance retention.',
  },
  {
    emoji: '📝',
    title: 'Take Handwritten Notes',
    content: 'Writing by hand engages different brain processes than typing, leading to better comprehension and recall.',
  },
  {
    emoji: '🎮',
    title: 'Build Projects',
    content: "The best way to learn is by doing. Start with small projects that excite you, even if they're imperfect.",
  },
  {
    emoji: '🔍',
    title: 'Debug Actively',
    content: "When stuck, read error messages carefully. They're clues! Understanding errors is a crucial skill.",
  },
  {
    emoji: '☕',
    title: 'Take Breaks',
    content: "Your brain needs rest to process information. A 10-minute break every hour boosts productivity.",
  },
  {
    emoji: '📚',
    title: 'Learn Fundamentals First',
    content: "Master the basics before diving into frameworks. Strong foundations make learning new tools much easier.",
  },
  {
    emoji: '🎧',
    title: 'Optimize Your Environment',
    content: "Find what works for you: some thrive with music, others need silence. Experiment to discover your ideal setup.",
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const getNewTip = () => {
    setIsRefreshing(true)
    setIsVisible(false)
    
    setTimeout(() => {
      const currentIndex = learningTips.indexOf(tip)
      const nextIndex = (currentIndex + 1) % learningTips.length
      setTip(learningTips[nextIndex])
      setIsVisible(true)
      setIsRefreshing(false)
    }, 300)
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl animate-pulse" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h3 className="text-lg font-semibold text-white">Tip of the Day</h3>
          </div>
          <button
            onClick={getNewTip}
            disabled={isRefreshing}
            className="text-navy-400 hover:text-primary-400 transition-colors disabled:opacity-50"
            title="Get another tip"
          >
            <svg 
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center text-2xl">
              {tip.emoji}
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">{tip.title}</h4>
              <p className="text-navy-300 text-sm leading-relaxed">{tip.content}</p>
            </div>
          </div>
        </div>

        {/* Progress dots showing there are more tips */}
        <div className="flex justify-center gap-1 mt-6 pt-4 border-t border-navy-700/50">
          {learningTips.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                learningTips.indexOf(tip) % 5 === index
                  ? 'bg-primary-400'
                  : 'bg-navy-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}