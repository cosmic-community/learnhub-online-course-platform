'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    tip: "Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique).",
    icon: "⏱️",
    category: "Productivity"
  },
  {
    tip: "Teaching what you've learned to someone else is one of the best ways to reinforce knowledge.",
    icon: "👥",
    category: "Retention"
  },
  {
    tip: "Code along with tutorials instead of just watching - active learning beats passive consumption.",
    icon: "⌨️",
    category: "Practice"
  },
  {
    tip: "Take notes by hand - studies show it improves comprehension and memory retention.",
    icon: "📝",
    category: "Memory"
  },
  {
    tip: "Review what you learned yesterday before starting new material today.",
    icon: "🔄",
    category: "Spaced Repetition"
  },
  {
    tip: "Build small projects using new concepts - application beats memorization.",
    icon: "🛠️",
    category: "Application"
  },
  {
    tip: "Join a community of learners - accountability and collaboration accelerate growth.",
    icon: "🤝",
    category: "Community"
  },
  {
    tip: "Set specific, measurable goals for each learning session.",
    icon: "🎯",
    category: "Goal Setting"
  },
  {
    tip: "Sleep is crucial for memory consolidation - don't sacrifice rest for extra study time.",
    icon: "😴",
    category: "Health"
  },
  {
    tip: "Embrace confusion - it's a sign that your brain is working to understand something new.",
    icon: "🧠",
    category: "Mindset"
  },
  {
    tip: "Use multiple resources to learn the same concept from different perspectives.",
    icon: "📚",
    category: "Resources"
  },
  {
    tip: "Celebrate small wins - completing a lesson is an achievement worth acknowledging!",
    icon: "🎉",
    category: "Motivation"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`card p-5 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
            {tip.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              💡 Daily Learning Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-500">{tip.category}</span>
          </div>
          <p className="text-navy-200 leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}