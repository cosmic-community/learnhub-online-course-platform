'use client'

import { useState, useEffect } from 'react'

const tips = [
  { emoji: '💡', title: 'Set a Schedule', tip: 'Learning at the same time each day builds strong habits.' },
  { emoji: '🎯', title: 'Focus on One Topic', tip: 'Master one skill before moving to the next for better retention.' },
  { emoji: '✍️', title: 'Take Notes', tip: 'Writing helps you remember 50% more than just reading.' },
  { emoji: '🔄', title: 'Practice Daily', tip: 'Consistent practice beats long cramming sessions.' },
  { emoji: '🧠', title: 'Teach Others', tip: 'Explaining concepts solidifies your understanding.' },
  { emoji: '☕', title: 'Take Breaks', tip: 'Short breaks every 25-30 minutes improve focus.' },
  { emoji: '🎮', title: 'Build Projects', tip: 'Apply what you learn in real projects for deeper learning.' },
  { emoji: '📚', title: 'Read Documentation', tip: 'Official docs are often the best learning resource.' },
  { emoji: '🤝', title: 'Join Communities', tip: 'Learning with others accelerates your progress.' },
  { emoji: '🏃', title: 'Start Small', tip: 'Beginning with simple tasks builds confidence and momentum.' }
]

export default function DailyTip() {
  const [tip, setTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setTip(tips[tipIndex])
    
    setTimeout(() => setIsVisible(true), 300)
  }, [])
  
  return (
    <div className={`card p-6 relative overflow-hidden transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
            <span className="text-3xl">{tip.emoji}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">Daily Tip</span>
              <span className="text-xs text-navy-500">•</span>
              <span className="text-xs text-navy-500">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">{tip.title}</h4>
            <p className="text-navy-300 text-sm">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}