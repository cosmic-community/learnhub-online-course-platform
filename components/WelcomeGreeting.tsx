'use client'

import { useState, useEffect } from 'react'

export default function WelcomeGreeting() {
  const [greeting, setGreeting] = useState('Welcome')
  const [emoji, setEmoji] = useState('👋')

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
      setGreeting('Night owl mode')
      setEmoji('🦉')
    }
  }, [])

  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl animate-bounce">{emoji}</span>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {greeting}, Learner!
        </h2>
        <p className="text-navy-400">Ready to learn something amazing today?</p>
      </div>
    </div>
  )
}