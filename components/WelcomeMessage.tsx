'use client'

import { useState, useEffect } from 'react'

export default function WelcomeMessage() {
  const [greeting, setGreeting] = useState('')
  const [motivation, setMotivation] = useState('')
  const [emoji, setEmoji] = useState('👋')

  const motivationalMessages = [
    "Every expert was once a beginner. Keep going!",
    "The best time to learn is now. You've got this!",
    "Small daily improvements lead to stunning results.",
    "Your future self will thank you for learning today.",
    "Progress, not perfection. Let's learn something new!",
    "The more you learn, the more you earn—in skills and confidence!",
    "Consistency beats intensity. Welcome back!",
    "Great things never come from comfort zones. Time to grow!",
  ]

  useEffect(() => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
      setEmoji('☀️')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon')
      setEmoji('🌤️')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening')
      setEmoji('🌆')
    } else {
      setGreeting('Late night learning')
      setEmoji('🌙')
    }

    // Random motivation
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
    setMotivation(motivationalMessages[randomIndex])
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-blue-500/10 border border-primary-500/20 rounded-2xl p-6 mb-8">
      {/* Animated background shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl animate-wave">{emoji}</span>
          <h2 className="text-2xl font-bold text-white">{greeting}!</h2>
        </div>
        <p className="text-navy-300 text-lg max-w-2xl">
          {motivation}
        </p>
        
        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <span>📖</span> Continue Learning
          </button>
          <button className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-navy-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <span>🎯</span> Set a Goal
          </button>
        </div>
      </div>
    </div>
  )
}