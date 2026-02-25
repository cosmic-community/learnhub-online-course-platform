'use client'

import { useState, useEffect } from 'react'

export default function WelcomeGreeting() {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('👋')
  const [tip, setTip] = useState('')

  const tips = [
    "💡 Tip: Consistency beats intensity. Even 15 minutes daily makes a difference!",
    "🎯 Focus on one skill at a time for better retention.",
    "📝 Take notes while watching lessons to boost understanding.",
    "🔄 Review what you learned yesterday before starting something new.",
    "☕ The best time to learn is when you're most alert!",
    "🎮 Apply what you learn immediately with hands-on practice.",
    "🌟 Celebrate small wins - they add up to big achievements!",
  ]

  useEffect(() => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
      setEmoji('🌅')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon')
      setEmoji('☀️')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening')
      setEmoji('🌆')
    } else {
      setGreeting('Hello, night owl')
      setEmoji('🌙')
    }
    
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30 p-6 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl animate-wave">{emoji}</span>
            {greeting}!
          </h2>
          <p className="text-navy-300 mt-2">Ready to continue your learning journey?</p>
        </div>
      </div>
      <div className="mt-4 p-3 rounded-lg bg-navy-900/50 border border-navy-700">
        <p className="text-sm text-navy-300">{tip}</p>
      </div>
    </div>
  )
}