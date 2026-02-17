'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: "🎯",
    title: "Set Clear Goals",
    tip: "Define what you want to achieve before starting each course. Clear goals keep you motivated!"
  },
  {
    emoji: "⏰",
    title: "Consistency is Key",
    tip: "Just 30 minutes of daily learning is more effective than occasional marathon sessions."
  },
  {
    emoji: "✍️",
    title: "Take Notes",
    tip: "Writing things down helps with retention. Create your own cheat sheets as you learn."
  },
  {
    emoji: "🔄",
    title: "Practice Regularly",
    tip: "Apply what you learn immediately. Building projects reinforces concepts."
  },
  {
    emoji: "🤝",
    title: "Learn Together",
    tip: "Join study groups or discuss with peers. Teaching others solidifies your knowledge."
  },
  {
    emoji: "😴",
    title: "Rest Your Brain",
    tip: "Sleep helps consolidate learning. Don't skip rest while studying!"
  },
  {
    emoji: "🎮",
    title: "Gamify Learning",
    tip: "Set challenges and reward yourself for milestones reached."
  },
  {
    emoji: "📊",
    title: "Track Progress",
    tip: "Review what you've learned weekly. Progress tracking boosts motivation!"
  },
]

export default function LearningTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * learningTips.length)
    setTip(learningTips[randomIndex])
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 100)
  }, [])
  
  return (
    <div 
      className={`transform transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 to-navy-900/50 border border-primary-500/20 p-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full blur-xl" />
        
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
            {tip.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">
                💡 Learning Tip
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tip.title}</h3>
            <p className="text-navy-300 text-sm">{tip.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}