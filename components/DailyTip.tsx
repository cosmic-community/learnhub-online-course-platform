'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    title: "The Pomodoro Technique",
    tip: "Study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout.",
    icon: "🍅"
  },
  {
    title: "Active Recall",
    tip: "Instead of re-reading, try to recall information from memory. It strengthens neural pathways.",
    icon: "🧠"
  },
  {
    title: "Teach What You Learn",
    tip: "Explaining concepts to others helps solidify your understanding. Even explaining to a rubber duck works!",
    icon: "🦆"
  },
  {
    title: "Spaced Repetition",
    tip: "Review material at increasing intervals: 1 day, 3 days, 7 days, 14 days. This optimizes retention.",
    icon: "📅"
  },
  {
    title: "Code Along",
    tip: "Don't just watch tutorials - code along! Muscle memory and active practice accelerate learning.",
    icon: "⌨️"
  },
  {
    title: "Build Projects",
    tip: "Apply what you learn in real projects. Practical experience is worth more than passive watching.",
    icon: "🏗️"
  },
  {
    title: "Take Handwritten Notes",
    tip: "Writing by hand improves retention compared to typing. Keep a learning journal!",
    icon: "📝"
  },
  {
    title: "Sleep On It",
    tip: "Your brain consolidates memories during sleep. A good night's rest after learning is crucial.",
    icon: "😴"
  },
  {
    title: "Stay Curious",
    tip: "Ask 'why' and 'how' constantly. Curiosity-driven learning is more effective and enjoyable.",
    icon: "🔍"
  },
  {
    title: "Embrace Mistakes",
    tip: "Errors are learning opportunities. Debug fearlessly - every bug fixed is a lesson learned.",
    icon: "🐛"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    const timer = setTimeout(() => setIsVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`card p-6 relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0 p-3 bg-yellow-500/10 rounded-xl">
            {tip.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                💡 Daily Learning Tip
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
            <p className="text-navy-300 text-sm leading-relaxed">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}