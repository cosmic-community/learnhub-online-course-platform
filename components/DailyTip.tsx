'use client'

import { useState, useEffect } from 'react'

const DAILY_TIPS = [
  { tip: "Break your learning into 25-minute focused sessions for better retention.", icon: "⏱️" },
  { tip: "Teaching someone else what you learned helps reinforce your knowledge.", icon: "🎓" },
  { tip: "Take handwritten notes - it improves memory more than typing.", icon: "📝" },
  { tip: "Review what you learned yesterday before starting new material.", icon: "🔄" },
  { tip: "Get enough sleep - your brain consolidates learning while you rest.", icon: "😴" },
  { tip: "Practice active recall instead of passive re-reading.", icon: "🧠" },
  { tip: "Connect new concepts to things you already know.", icon: "🔗" },
  { tip: "Take breaks! Your brain needs time to process information.", icon: "☕" },
  { tip: "Set specific goals for each learning session.", icon: "🎯" },
  { tip: "Celebrate small wins to stay motivated!", icon: "🎉" },
  { tip: "Consistency beats intensity - learn a little every day.", icon: "📈" },
  { tip: "Ask questions - curiosity accelerates learning.", icon: "❓" },
  { tip: "Apply what you learn to real projects as soon as possible.", icon: "🛠️" },
  { tip: "Learn in different environments to improve recall.", icon: "🌍" },
  { tip: "Stay hydrated - your brain works better when well-hydrated.", icon: "💧" },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof DAILY_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub_daily_tip')
    
    if (stored) {
      const data = JSON.parse(stored)
      if (data.date === today && data.dismissed) {
        setIsDismissed(true)
        return
      }
    }

    // Get tip based on day of year for consistency
    const start = new Date(new Date().getFullYear(), 0, 0)
    const diff = Number(new Date()) - Number(start)
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % DAILY_TIPS.length
    
    setTip(DAILY_TIPS[tipIndex])
    
    // Show tip after a short delay
    setTimeout(() => setIsVisible(true), 1500)
  }, [])

  const dismissTip = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub_daily_tip', JSON.stringify({
      date: new Date().toDateString(),
      dismissed: true
    }))
    setTimeout(() => setIsDismissed(true), 300)
  }

  if (isDismissed || !tip) return null

  return (
    <div className={`
      fixed bottom-24 right-4 z-40 max-w-sm
      transition-all duration-500 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
    `}>
      <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl shadow-xl p-4 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-xl flex-shrink-0">
              {tip.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary-400 font-medium mb-1">💡 Daily Learning Tip</p>
              <p className="text-sm text-navy-200 leading-relaxed">{tip.tip}</p>
            </div>
            <button
              onClick={dismissTip}
              className="text-navy-500 hover:text-navy-300 transition-colors p-1 -m-1"
              aria-label="Dismiss tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}