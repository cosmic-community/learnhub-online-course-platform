'use client'

import { useState, useEffect } from 'react'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Happy late-night coding'
}

function getEmoji(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '☀️'
  if (hour >= 12 && hour < 17) return '🌤️'
  if (hour >= 17 && hour < 21) return '🌅'
  return '🌙'
}

export default function WelcomeBanner() {
  const [greeting, setGreeting] = useState('Hello')
  const [emoji, setEmoji] = useState('👋')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setGreeting(getGreeting())
    setEmoji(getEmoji())
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="text-center mb-2">
      <span className="text-4xl animate-wave inline-block">{emoji}</span>
      <h2 className="text-xl text-navy-300 mt-2">
        {greeting}, learner!
      </h2>
    </div>
  )
}