'use client'

import { useState, useEffect } from 'react'

const STUDY_TIPS = [
  { emoji: '🧠', tip: "Take breaks every 25 minutes using the Pomodoro technique" },
  { emoji: '📝', tip: "Write notes by hand to improve retention by 30%" },
  { emoji: '🎯', tip: "Set specific, achievable learning goals for each session" },
  { emoji: '💡', tip: "Teach what you learn to someone else - it doubles retention!" },
  { emoji: '🌙', tip: "Review notes before sleep to boost memory consolidation" },
  { emoji: '🏃', tip: "A 20-minute walk can boost creativity and focus by 60%" },
  { emoji: '🎵', tip: "Lo-fi music can help maintain focus during study sessions" },
  { emoji: '📱', tip: "Put your phone in another room - it improves focus by 26%" },
  { emoji: '💧', tip: "Stay hydrated! Dehydration reduces cognitive performance" },
  { emoji: '🍎', tip: "Brain foods: blueberries, nuts, and dark chocolate boost focus" },
  { emoji: '⏰', tip: "Your brain is sharpest 2-4 hours after waking up" },
  { emoji: '🔄', tip: "Spaced repetition helps you remember 90% more long-term" },
]

export default function StudyTip() {
  const [tip, setTip] = useState<typeof STUDY_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick a random tip
    const randomTip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)]
    setTip(randomTip)
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-navy-800/50 border border-navy-700 backdrop-blur-sm">
        <span className="text-2xl animate-bounce">{tip.emoji}</span>
        <div className="text-left">
          <div className="text-xs text-primary-400 font-semibold uppercase tracking-wider mb-0.5">
            💡 Pro Tip
          </div>
          <div className="text-sm text-navy-200">
            {tip.tip}
          </div>
        </div>
      </div>
    </div>
  )
}