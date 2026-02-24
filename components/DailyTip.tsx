'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: "🎯",
    title: "Set Clear Goals",
    tip: "Break down your learning into small, achievable milestones. This keeps you motivated and tracks progress!",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30"
  },
  {
    emoji: "🧠",
    title: "Practice Active Recall",
    tip: "Don't just re-read—test yourself! Try to explain concepts without looking at your notes.",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30"
  },
  {
    emoji: "⏰",
    title: "Pomodoro Technique",
    tip: "Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer break!",
    color: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30"
  },
  {
    emoji: "💻",
    title: "Code Along",
    tip: "Don't just watch—type the code yourself! Muscle memory is crucial for programming skills.",
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30"
  },
  {
    emoji: "📝",
    title: "Take Notes",
    tip: "Writing helps retention. Summarize key concepts in your own words after each lesson.",
    color: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/30"
  },
  {
    emoji: "🤝",
    title: "Teach Others",
    tip: "The best way to solidify knowledge is to explain it to someone else. Start a study group!",
    color: "from-teal-500/20 to-cyan-500/20",
    borderColor: "border-teal-500/30"
  },
  {
    emoji: "🌙",
    title: "Sleep On It",
    tip: "Your brain consolidates memories during sleep. Review before bed for better retention!",
    color: "from-indigo-500/20 to-violet-500/20",
    borderColor: "border-indigo-500/30"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    const selectedTip = learningTips[tipIndex]
    if (selectedTip) {
      setTip(selectedTip)
    }

    // Check if user dismissed today's tip
    const dismissedDate = localStorage.getItem('tip-dismissed-date')
    const today = new Date().toDateString()
    
    if (dismissedDate !== today) {
      setTimeout(() => setIsVisible(true), 500)
    } else {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('tip-dismissed-date', new Date().toDateString())
  }

  if (isDismissed) return null

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${tip.color} border ${tip.borderColor} p-6`}>
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-navy-400 hover:text-white transition-colors"
              aria-label="Dismiss tip"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-start gap-4">
              <div className="text-4xl animate-bounce-slow">{tip.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">💡 Daily Learning Tip</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{tip.title}</h3>
                <p className="text-navy-200">{tip.tip}</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </section>
    </div>
  )
}