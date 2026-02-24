'use client'

import { useState, useEffect } from 'react'

const tips = [
  { icon: '💡', tip: "Take notes while watching lessons to boost retention by 40%!" },
  { icon: '🎯', tip: "Focus on one course at a time for better learning outcomes." },
  { icon: '⏰', tip: "The best time to learn is when you're most alert - find your peak hours!" },
  { icon: '🔄', tip: "Review what you learned yesterday before starting new content." },
  { icon: '💪', tip: "Practice makes perfect - try coding along with the instructor!" },
  { icon: '☕', tip: "Take a 5-minute break every 25 minutes to stay sharp." },
  { icon: '🤝', tip: "Teaching others is the best way to solidify your knowledge." },
  { icon: '📝', tip: "Create a mini-project after each module to apply what you've learned." },
  { icon: '🌙', tip: "Sleep well! Your brain processes new information while you rest." },
  { icon: '🎮', tip: "Make learning fun by challenging yourself with coding exercises!" },
  { icon: '📚', tip: "Read documentation alongside video content for deeper understanding." },
  { icon: '🧠', tip: "Spaced repetition: review topics at increasing intervals for better memory." },
]

export default function QuickTip() {
  const [currentTip, setCurrentTip] = useState<typeof tips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show tip after a short delay
    const showTimer = setTimeout(() => {
      const lastShown = localStorage.getItem('last-tip-shown')
      const today = new Date().toDateString()
      
      // Only show one tip per day
      if (lastShown !== today) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)]
        setCurrentTip(randomTip)
        setIsVisible(true)
        localStorage.setItem('last-tip-shown', today)
      }
    }, 3000)

    return () => clearTimeout(showTimer)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible || !currentTip) return null

  return (
    <div 
      className={`fixed top-24 right-5 z-40 max-w-sm transition-all duration-300 ${
        isDismissed ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-primary-500/30 rounded-2xl p-4 shadow-xl shadow-primary-500/10">
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">{currentTip.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">
                Learning Tip
              </span>
              <button
                onClick={handleDismiss}
                className="text-navy-500 hover:text-white transition-colors"
                aria-label="Dismiss tip"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-navy-200">{currentTip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}