'use client'

import { useState, useEffect } from 'react'

const messages = [
  { text: "Every expert was once a beginner", emoji: "🌱" },
  { text: "The best time to start learning was yesterday. The second best time is now", emoji: "⏰" },
  { text: "Small progress is still progress", emoji: "📈" },
  { text: "Your future self will thank you for starting today", emoji: "🙏" },
  { text: "Consistency beats intensity. Show up every day", emoji: "💪" },
]

export default function MotivationalBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length)
        setIsVisible(true)
      }, 500)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden py-3 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 border-y border-primary-500/20">
      {/* Animated background shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine" />
      
      <div className={`flex items-center justify-center gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <span className="text-2xl">{messages[currentIndex].emoji}</span>
        <p className="text-primary-200 font-medium text-center">
          {messages[currentIndex].text}
        </p>
        <span className="text-2xl">{messages[currentIndex].emoji}</span>
      </div>
    </div>
  )
}