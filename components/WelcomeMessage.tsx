'use client'

import { useState, useEffect } from 'react'

export default function WelcomeMessage() {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
      setGreeting('Good night')
      setEmoji('🌙')
    }
  }, [])

  if (!mounted) {
    return <span>Welcome</span>
  }

  return (
    <span className="inline-flex items-center gap-2">
      {greeting} <span className="animate-wave inline-block">{emoji}</span>
    </span>
  )
}