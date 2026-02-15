'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: "💡",
    title: "Practice Daily",
    tip: "Even 15 minutes of focused learning each day builds lasting knowledge. Consistency beats intensity!",
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30"
  },
  {
    icon: "🎯",
    title: "Set Clear Goals",
    tip: "Before starting a lesson, decide what you want to achieve. Focused learning is effective learning.",
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30"
  },
  {
    icon: "✍️",
    title: "Take Notes",
    tip: "Writing things down helps cement concepts in memory. Try explaining what you learned in your own words.",
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30"
  },
  {
    icon: "🔄",
    title: "Review Often",
    tip: "Spaced repetition is key! Review yesterday's lesson before starting today's for better retention.",
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30"
  },
  {
    icon: "🤝",
    title: "Teach Others",
    tip: "The best way to solidify your knowledge is to explain it to someone else. Share what you learn!",
    color: "from-rose-500/20 to-red-500/20",
    borderColor: "border-rose-500/30"
  },
  {
    icon: "🧪",
    title: "Build Projects",
    tip: "Apply what you learn by building real projects. Theory + practice = mastery.",
    color: "from-indigo-500/20 to-violet-500/20",
    borderColor: "border-indigo-500/30"
  },
  {
    icon: "😴",
    title: "Rest is Important",
    tip: "Your brain consolidates learning during sleep. Get enough rest to maximize retention!",
    color: "from-slate-500/20 to-gray-500/20",
    borderColor: "border-slate-500/30"
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Set initial tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setCurrentTip(dayOfYear % learningTips.length)
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
      setIsAnimating(false)
    }, 150)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + learningTips.length) % learningTips.length)
      setIsAnimating(false)
    }, 150)
  }

  const tip = learningTips[currentTip]
  
  if (!tip) {
    return null
  }

  return (
    <div className={`relative bg-gradient-to-r ${tip.color} border ${tip.borderColor} rounded-2xl p-6 overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{tip.icon}</span>
            <div>
              <div className="text-xs text-navy-400 uppercase tracking-wider">Daily Learning Tip</div>
              <div className="text-lg font-semibold text-white">{tip.title}</div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevTip}
              className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-300 hover:text-white transition-colors"
              aria-label="Previous tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTip}
              className="p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-300 hover:text-white transition-colors"
              aria-label="Next tip"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <p className={`text-navy-200 leading-relaxed transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {tip.tip}
        </p>
        
        {/* Tip indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {learningTips.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => {
                  setCurrentTip(index)
                  setIsAnimating(false)
                }, 150)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentTip
                  ? 'bg-white w-4'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}