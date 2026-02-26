'use client'

import { useState, useEffect } from 'react'

const TIPS = [
  { emoji: '💡', text: 'Consistency beats intensity. Small daily progress leads to big results!' },
  { emoji: '🎯', text: 'Set specific learning goals. "Learn React hooks" beats "Learn React".' },
  { emoji: '🧠', text: 'Teaching others is the best way to solidify your understanding.' },
  { emoji: '☕', text: 'Take breaks! Your brain processes information during rest.' },
  { emoji: '📝', text: 'Take notes while watching videos - it improves retention by 30%.' },
  { emoji: '🚀', text: 'Build projects as you learn. Theory + practice = mastery.' },
  { emoji: '🔄', text: 'Revisit concepts after a few days. Spaced repetition works!' },
  { emoji: '👥', text: 'Join a community. Learning together accelerates growth.' },
  { emoji: '🎮', text: 'Make it fun! Gamify your learning with personal challenges.' },
  { emoji: '⏰', text: 'Best time to learn? When you have energy and focus!' },
  { emoji: '📱', text: 'Code on paper sometimes. It forces you to think deeply.' },
  { emoji: '🌟', text: 'Celebrate small wins. Every concept mastered is progress!' },
]

export default function MotivationalTip() {
  const [tip, setTip] = useState<typeof TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick a random tip
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)]
    setTip(randomTip)
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`mt-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-xl max-w-xl">
        <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
        <p className="text-navy-300 text-sm italic">&ldquo;{tip.text}&rdquo;</p>
      </div>
    </div>
  )
}