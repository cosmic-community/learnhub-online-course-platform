'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { emoji: '💡', tip: "Consistency beats intensity! Even 15 minutes daily creates lasting habits." },
  { emoji: '🧠', tip: "Take breaks every 25 minutes to boost retention by up to 40%." },
  { emoji: '📝', tip: "Teaching others what you learn helps you remember 90% more." },
  { emoji: '🎯', tip: "Focus on one concept at a time - multitasking reduces learning by 40%." },
  { emoji: '🔄', tip: "Review material after 24 hours to move it to long-term memory." },
  { emoji: '☕', tip: "Morning learners retain 30% more than night owls. Find your peak time!" },
  { emoji: '🏆', tip: "Celebrate small wins - dopamine helps reinforce new neural pathways." },
  { emoji: '🎧', tip: "Background music without lyrics can improve focus by 15%." },
]

export default function LearningTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Check if user has seen tips before
    const seenTips = localStorage.getItem('learnhub-tips-seen')
    if (seenTips) {
      setHasInteracted(true)
    }
    
    // Rotate tips every 8 seconds
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % learningTips.length)
        setIsVisible(true)
      }, 300)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub-tips-seen', 'true')
    setHasInteracted(true)
  }

  const handleNextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
      setIsVisible(true)
    }, 200)
  }

  if (hasInteracted && !isVisible) return null

  const tip = learningTips[currentTip]

  return (
    <div 
      className={`mb-8 transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
      }`}
    >
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-sm">
        <span className="text-lg animate-bounce-subtle">{tip?.emoji}</span>
        <span className="text-primary-300">{tip?.tip}</span>
        <button 
          onClick={handleNextTip}
          className="ml-2 text-primary-400 hover:text-primary-300 transition-colors"
          aria-label="Next tip"
        >
          ↻
        </button>
        <button 
          onClick={handleDismiss}
          className="ml-1 text-navy-500 hover:text-navy-400 transition-colors"
          aria-label="Dismiss tips"
        >
          ×
        </button>
      </div>
    </div>
  )
}