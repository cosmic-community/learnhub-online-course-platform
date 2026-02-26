'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  { emoji: '🧠', tip: "Take breaks every 25 minutes using the Pomodoro Technique for better retention." },
  { emoji: '✍️', tip: "Write code along with the lessons - active learning beats passive watching." },
  { emoji: '🔄', tip: "Review what you learned yesterday before starting today's lesson." },
  { emoji: '🎯', tip: "Set specific learning goals for each session to stay focused." },
  { emoji: '💬', tip: "Explain concepts out loud as if teaching someone else." },
  { emoji: '📝', tip: "Take handwritten notes - it improves memory and understanding." },
  { emoji: '🌙', tip: "Get enough sleep - your brain consolidates learning while you rest." },
  { emoji: '🏃', tip: "A short walk can boost creativity and problem-solving abilities." },
  { emoji: '🎮', tip: "Build a small project after each course to solidify your skills." },
  { emoji: '👥', tip: "Join a community - learning with others keeps you motivated." },
  { emoji: '❓', tip: "Don't be afraid to ask questions - curiosity accelerates learning." },
  { emoji: '🔁', tip: "Spaced repetition: review material at increasing intervals for long-term memory." },
]

export default function QuickTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if tip was dismissed today
    const lastDismissed = localStorage.getItem('learnhub-tip-dismissed')
    const today = new Date().toDateString()
    
    if (lastDismissed === today) {
      return
    }

    // Pick a random tip
    const randomTip = LEARNING_TIPS[Math.floor(Math.random() * LEARNING_TIPS.length)]
    setTip(randomTip)
    
    // Show with delay
    const timer = setTimeout(() => setIsVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
  }

  if (!tip || isDismissed || !isVisible) return null

  return (
    <div 
      className={`fixed bottom-24 left-5 z-40 max-w-xs transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl p-4 shadow-xl">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-navy-700 hover:bg-navy-600 text-navy-300 rounded-full flex items-center justify-center text-sm transition-colors"
          aria-label="Dismiss tip"
        >
          ×
        </button>
        
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
          <div>
            <div className="text-xs text-primary-400 font-medium mb-1">💡 Learning Tip</div>
            <p className="text-sm text-navy-200 leading-relaxed">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}