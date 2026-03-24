'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    icon: '💡',
    category: 'Productivity',
    tip: 'Break your learning into 25-minute focused sessions with 5-minute breaks. This Pomodoro technique can boost retention by up to 40%!',
    color: 'from-amber-500/20 to-orange-500/20'
  },
  {
    icon: '🎯',
    category: 'Goal Setting',
    tip: 'Set a specific learning goal for today. "Complete 2 lessons" is better than "study more". Clear goals lead to clear progress.',
    color: 'from-primary-500/20 to-indigo-500/20'
  },
  {
    icon: '🧠',
    category: 'Memory',
    tip: 'Teaching what you learn to someone else is the best way to truly understand it. Try explaining today\'s lesson in your own words.',
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: '⚡',
    category: 'Momentum',
    tip: 'Consistency beats intensity. 30 minutes daily is more effective than 3 hours once a week. Build your learning habit!',
    color: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    icon: '🔄',
    category: 'Practice',
    tip: 'Code along with the lessons instead of just watching. Active learning leads to 75% retention vs 5% from passive watching.',
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: '🌟',
    category: 'Mindset',
    tip: 'Struggling with a concept? That\'s not failure - it\'s your brain forming new neural connections. Embrace the challenge!',
    color: 'from-rose-500/20 to-red-500/20'
  },
  {
    icon: '📝',
    category: 'Notes',
    tip: 'Write notes by hand if possible. Studies show handwritten notes improve conceptual understanding compared to typing.',
    color: 'from-teal-500/20 to-cyan-500/20'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Select tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-navy-800 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTip.color}`} />
      
      {/* Content */}
      <div className="relative p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-4xl">
            {currentTip.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                Daily Learning Tip
              </span>
              <span className="text-navy-500">•</span>
              <span className="text-xs text-navy-400">{currentTip.category}</span>
            </div>
            <p className="text-navy-200 leading-relaxed">
              {currentTip.tip}
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-6xl opacity-10 pointer-events-none">
          {currentTip.icon}
        </div>
      </div>
    </div>
  )
}