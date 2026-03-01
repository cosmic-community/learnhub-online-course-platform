'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { tip: "Break your learning into 25-minute focused sessions (Pomodoro Technique)", icon: "🍅" },
  { tip: "Teaching others what you learn helps reinforce your understanding", icon: "👥" },
  { tip: "Take handwritten notes - it improves memory retention by 30%", icon: "✍️" },
  { tip: "Get 7-8 hours of sleep to consolidate what you learned", icon: "😴" },
  { tip: "Review material within 24 hours to move it to long-term memory", icon: "🧠" },
  { tip: "Practice active recall instead of passive re-reading", icon: "🔄" },
  { tip: "Connect new knowledge to things you already know", icon: "🔗" },
  { tip: "Take breaks every 45-60 minutes to maintain focus", icon: "☕" },
  { tip: "Learn in the morning when your brain is freshest", icon: "🌅" },
  { tip: "Use spaced repetition to remember things longer", icon: "📊" },
  { tip: "Stay hydrated - your brain is 75% water!", icon: "💧" },
  { tip: "Exercise before studying to boost brain function", icon: "🏃" },
  { tip: "Set specific, achievable learning goals for each session", icon: "🎯" },
  { tip: "Embrace mistakes - they're essential for learning", icon: "💡" },
]

export default function DailyTip() {
  const [tip, setTip] = useState<{ tip: string; icon: string } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a tip based on the day of the year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`card p-5 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{tip.icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-primary-400 mb-1">💡 Daily Learning Tip</h3>
          <p className="text-navy-200 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}