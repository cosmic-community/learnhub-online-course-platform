'use client'

import { useState, useEffect } from 'react'

export default function WelcomeGreeting() {
  const [greeting, setGreeting] = useState('')
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
    <span className="inline-flex items-center gap-2">
      <span className="animate-bounce inline-block">{emoji}</span>
      <span>{greeting}, learner!</span>
    </span>
  )
}