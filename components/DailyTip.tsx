'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    title: "Consistency is Key",
    content: "Learning a little every day is more effective than cramming. Aim for 20-30 minutes daily!",
    icon: "🎯"
  },
  {
    title: "Take Notes",
    content: "Writing things down by hand helps with retention. Try summarizing each lesson in your own words.",
    icon: "📝"
  },
  {
    title: "Practice Makes Perfect",
    content: "Don't just watch the videos - code along! Active learning beats passive consumption.",
    icon: "💻"
  },
  {
    title: "Ask Questions",
    content: "If something doesn't make sense, pause and research. Curiosity is your best teacher.",
    icon: "❓"
  },
  {
    title: "Build Projects",
    content: "Apply what you learn by building real projects. It's the fastest way to solidify knowledge.",
    icon: "🚀"
  },
  {
    title: "Review Regularly",
    content: "Spaced repetition helps long-term memory. Review yesterday's lesson before starting today's.",
    icon: "🔄"
  },
  {
    title: "Stay Curious",
    content: "The best developers never stop learning. Every expert was once a beginner!",
    icon: "✨"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent tip for today based on the date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const tipIndex = dayOfYear % tips.length
    setTip(tips[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div 
      className={`card p-6 border-l-4 border-primary-500 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{tip.icon}</div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-free">Daily Tip</span>
            <h3 className="font-semibold text-white">{tip.title}</h3>
          </div>
          <p className="text-navy-300 text-sm leading-relaxed">{tip.content}</p>
        </div>
      </div>
    </div>
  )
}