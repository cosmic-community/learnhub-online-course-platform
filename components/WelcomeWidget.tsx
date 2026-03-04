'use client'

import { useState, useEffect } from 'react'

interface WelcomeWidgetProps {
  courseCount: number
}

export default function WelcomeWidget({ courseCount }: WelcomeWidgetProps) {
  const [greeting, setGreeting] = useState('')
  const [motivationalTip, setMotivationalTip] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const tips = [
    "🎯 Tip: Start with just 15 minutes of learning today!",
    "💡 Fun fact: Consistent daily practice beats long cramming sessions.",
    "🚀 Pro tip: Take notes while watching lessons to boost retention by 40%.",
    "⭐ Remember: Every expert was once a beginner.",
    "🧠 Science says: Teaching others helps you learn faster!",
    "🎨 Try this: Apply what you learn in a small project today.",
    "⏰ Productivity hack: The best time to learn is when you feel most alert.",
    "🌟 You're doing great! Keep the momentum going.",
  ]

  useEffect(() => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening')
    } else {
      setGreeting('Hello, night owl')
    }

    // Random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setMotivationalTip(randomTip)

    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const getTimeBasedEmoji = (): string => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return '☀️'
    if (hour >= 12 && hour < 17) return '🌤️'
    if (hour >= 17 && hour < 21) return '🌅'
    return '🌙'
  }

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/30 border border-primary-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {getTimeBasedEmoji()} {greeting}!
            </h2>
            <p className="text-navy-300 mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-400">{courseCount}</div>
            <div className="text-xs text-navy-400">courses to explore</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-navy-700/50">
          <p className="text-sm text-navy-300 italic">{motivationalTip}</p>
        </div>
      </div>
    </div>
  )
}