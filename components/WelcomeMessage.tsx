'use client'

import { useState, useEffect } from 'react'

export default function WelcomeMessage() {
  const [greeting, setGreeting] = useState('Hello')
  const [emoji, setEmoji] = useState('👋')

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
      setGreeting('Night owl mode')
      setEmoji('🦉')
    }
  }, [])

  return (
    <div className="flex items-center gap-2 text-navy-400 mb-4">
      <span className="text-2xl">{emoji}</span>
      <span className="text-lg">{greeting}, learner!</span>
    </div>
  )
}