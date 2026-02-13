'use client'

import { useState, useEffect } from 'react'

export default function WelcomeMessage() {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')
  const [isVisible, setIsVisible] = useState(false)

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
      setEmoji('🌅')
    } else {
      setGreeting('Welcome, night owl')
      setEmoji('🌙')
    }

    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-full text-sm transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <span className="text-lg animate-pulse">{emoji}</span>
      <span className="text-navy-300">{greeting}, learner!</span>
      <span className="text-primary-400 font-medium">Ready to grow today?</span>
    </div>
  )
}