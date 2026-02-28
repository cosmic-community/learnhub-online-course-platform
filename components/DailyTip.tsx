'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { emoji: '🎯', tip: "Set a specific learning goal for today - even 15 minutes counts!" },
  { emoji: '📝', tip: "Take notes while learning - it improves retention by 50%!" },
  { emoji: '💡', tip: "Try to explain what you learned to someone else - teaching reinforces learning!" },
  { emoji: '🔄', tip: "Review yesterday's material before starting something new!" },
  { emoji: '☕', tip: "Stay hydrated and take short breaks every 25 minutes!" },
  { emoji: '🌙', tip: "Sleep consolidates memory - get enough rest after learning sessions!" },
  { emoji: '🎮', tip: "Apply what you learn in a small project right away!" },
  { emoji: '🤔', tip: "Ask questions! Curiosity is the engine of learning!" },
  { emoji: '📚', tip: "Mix different topics to improve your brain's flexibility!" },
  { emoji: '🏃', tip: "A short walk before studying can boost focus and creativity!" },
  { emoji: '🎧', tip: "Try lo-fi music or nature sounds to maintain focus!" },
  { emoji: '✨', tip: "Celebrate small wins - each lesson completed is progress!" },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get consistent tip for the day based on date
    const today = new Date()
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % learningTips.length
    setTip(learningTips[dayIndex])
    
    setTimeout(() => setIsVisible(true), 800)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{tip.emoji}</span>
        <div>
          <h4 className="text-sm font-medium text-primary-400 mb-1">Daily Learning Tip</h4>
          <p className="text-sm text-navy-300">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}