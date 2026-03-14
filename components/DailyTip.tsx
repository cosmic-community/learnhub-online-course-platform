'use client'

import { useState, useEffect } from 'react'

interface LearningTip {
  tip: string
  category: string
  icon: string
}

const learningTips: LearningTip[] = [
  { tip: "Take breaks every 25 minutes using the Pomodoro Technique for better retention.", category: "Study Hack", icon: "⏰" },
  { tip: "Teaching others what you learn helps solidify your understanding.", category: "Memory", icon: "🧠" },
  { tip: "Practice coding daily, even if it's just for 15 minutes.", category: "Development", icon: "💻" },
  { tip: "Write down key concepts by hand - it improves memory encoding.", category: "Study Hack", icon: "✍️" },
  { tip: "Build real projects to apply what you learn.", category: "Development", icon: "🚀" },
  { tip: "Join coding communities to learn from others.", category: "Growth", icon: "👥" },
  { tip: "Review your code from 6 months ago to see your progress!", category: "Motivation", icon: "📈" },
  { tip: "Sleep is crucial for memory consolidation - don't skip it!", category: "Health", icon: "😴" },
  { tip: "Break complex problems into smaller, manageable pieces.", category: "Problem Solving", icon: "🧩" },
  { tip: "Read documentation before Stack Overflow - it's often clearer!", category: "Development", icon: "📚" },
]

export default function DailyTip() {
  const [tip, setTip] = useState<LearningTip | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get today's tip based on the day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const todaysTip = learningTips[dayOfYear % learningTips.length]
    setTip(todaysTip)
    
    // Check if dismissed today
    const dismissedDate = localStorage.getItem('learnhub-tip-dismissed')
    const today = new Date().toDateString()
    
    if (dismissedDate !== today) {
      setTimeout(() => setIsVisible(true), 3000)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!tip || !isVisible) return null

  return (
    <div 
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-40 max-w-md w-full mx-4 transition-all duration-500 ${
        isDismissed ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 border border-navy-700 rounded-2xl shadow-xl shadow-primary-500/10 p-4 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
        
        <div className="relative flex items-start gap-3">
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            {tip.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-primary-400 text-xs font-medium uppercase tracking-wide">
                💡 Daily Tip • {tip.category}
              </span>
              <button
                onClick={handleDismiss}
                className="text-navy-500 hover:text-navy-300 transition-colors"
                aria-label="Dismiss tip"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-white text-sm leading-relaxed">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}