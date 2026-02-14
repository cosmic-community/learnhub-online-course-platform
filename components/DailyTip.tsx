'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Consistency is Key',
    content: 'Learning just 30 minutes a day is more effective than cramming for hours once a week.',
    category: 'Learning'
  },
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    content: 'Before starting a course, write down what you want to achieve. It keeps you motivated!',
    category: 'Productivity'
  },
  {
    emoji: '🔄',
    title: 'Practice Active Recall',
    content: 'After watching a lesson, try to explain the concept without notes. It boosts retention by 50%!',
    category: 'Learning'
  },
  {
    emoji: '☕',
    title: 'Take Breaks',
    content: 'The Pomodoro Technique: 25 minutes of focus, then a 5-minute break. Your brain will thank you.',
    category: 'Wellness'
  },
  {
    emoji: '📝',
    title: 'Code Along',
    content: "Don't just watch - type the code yourself. Muscle memory is a powerful learning tool.",
    category: 'Coding'
  },
  {
    emoji: '🤝',
    title: 'Teach Others',
    content: 'The best way to solidify your knowledge is to explain it to someone else.',
    category: 'Learning'
  },
  {
    emoji: '🐛',
    title: 'Embrace Errors',
    content: 'Every bug you fix teaches you something. Errors are learning opportunities in disguise!',
    category: 'Coding'
  },
  {
    emoji: '📖',
    title: 'Read Documentation',
    content: 'Official docs are your best friend. They often contain gems that tutorials miss.',
    category: 'Coding'
  },
  {
    emoji: '🌟',
    title: 'Celebrate Progress',
    content: "Finished a lesson? That's worth celebrating! Small wins keep motivation high.",
    category: 'Motivation'
  },
  {
    emoji: '🔍',
    title: 'Debug Methodically',
    content: 'When stuck, break the problem into smaller parts. Console.log is your detective tool!',
    category: 'Coding'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get tip based on current day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex] ?? tips[0])
  }, [])

  const getNextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = tips.indexOf(currentTip)
      const nextIndex = (currentIndex + 1) % tips.length
      setCurrentTip(tips[nextIndex] ?? tips[0])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="card p-6 relative overflow-hidden group hover:border-primary-500/30 transition-all duration-300">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-navy-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce-slow">{currentTip.emoji}</span>
            <h3 className="text-lg font-semibold text-white">Daily Tip</h3>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
            {currentTip.category}
          </span>
        </div>
        
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          <h4 className="text-white font-medium mb-2">{currentTip.title}</h4>
          <p className="text-navy-300 text-sm leading-relaxed">{currentTip.content}</p>
        </div>
        
        <button 
          onClick={getNextTip}
          className="mt-4 text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
        >
          <span>Next tip</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}