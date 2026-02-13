'use client'

import { useState, useEffect } from 'react'

const TIPS = [
  { tip: "The best time to plant a tree was 20 years ago. The second best time is now.", icon: "🌳", category: "Motivation" },
  { tip: "Consistency beats intensity. 15 minutes daily is better than 3 hours once a week.", icon: "📅", category: "Learning" },
  { tip: "Teaching others is the best way to truly understand a concept.", icon: "👨‍🏫", category: "Learning" },
  { tip: "Take breaks! The Pomodoro technique: 25 min work, 5 min rest.", icon: "🍅", category: "Productivity" },
  { tip: "Code is read more often than it's written. Write for your future self.", icon: "💻", category: "Coding" },
  { tip: "Debugging is twice as hard as writing code. So write simple code!", icon: "🐛", category: "Coding" },
  { tip: "The only way to learn programming is by programming.", icon: "⌨️", category: "Coding" },
  { tip: "Don't compare your Day 1 to someone else's Year 10.", icon: "📈", category: "Motivation" },
  { tip: "Every expert was once a beginner. Keep going!", icon: "🌟", category: "Motivation" },
  { tip: "Sleep is crucial for memory consolidation. Don't skip it!", icon: "😴", category: "Health" },
  { tip: "Build projects. Real-world practice beats theory every time.", icon: "🔨", category: "Learning" },
  { tip: "Read error messages carefully. They're trying to help you!", icon: "⚠️", category: "Coding" },
  { tip: "Version control your code. Future you will thank present you.", icon: "📦", category: "Coding" },
  { tip: "Celebrate small wins. Progress compounds over time.", icon: "🎉", category: "Motivation" },
  { tip: "Ask questions. The only dumb question is the one not asked.", icon: "❓", category: "Learning" },
  { tip: "Review yesterday's code with fresh eyes. You'll spot improvements!", icon: "👀", category: "Coding" },
  { tip: "Your environment shapes your habits. Create a distraction-free space.", icon: "🏠", category: "Productivity" },
  { tip: "Document as you go. Your future self will appreciate it.", icon: "📝", category: "Coding" },
  { tip: "Learn the fundamentals deeply. Frameworks change, concepts don't.", icon: "🎯", category: "Learning" },
  { tip: "Embrace failure as feedback. Every bug is a learning opportunity.", icon: "🦋", category: "Motivation" },
]

const CATEGORY_COLORS: Record<string, string> = {
  Motivation: 'from-purple-500 to-pink-500',
  Learning: 'from-blue-500 to-cyan-500',
  Coding: 'from-green-500 to-emerald-500',
  Productivity: 'from-orange-500 to-yellow-500',
  Health: 'from-red-500 to-rose-500',
}

export default function DailyTip() {
  const [tip, setTip] = useState<typeof TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get tip based on the day of the year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % TIPS.length
    
    setTip(TIPS[tipIndex])

    // Check if user dismissed today's tip
    const dismissedDate = localStorage.getItem('tip_dismissed_date')
    if (dismissedDate === now.toDateString()) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('tip_dismissed_date', new Date().toDateString())
  }

  if (!tip || !isVisible) return null

  const gradientClass = CATEGORY_COLORS[tip.category] || 'from-primary-500 to-primary-600'

  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 animate-fade-in">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-10`} />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full animate-float" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full animate-float-delayed" />
      </div>

      <div className="relative p-6 flex items-center gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}>
          <span className="text-3xl">{tip.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
              💡 Daily Learning Tip
            </span>
            <span className="text-xs text-navy-500">• {tip.category}</span>
          </div>
          <p className="text-white font-medium">{tip.tip}</p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-2 text-navy-400 hover:text-white transition-colors rounded-lg hover:bg-navy-800"
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