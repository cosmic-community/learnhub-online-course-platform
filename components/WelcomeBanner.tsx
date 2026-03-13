'use client'

import { useState, useEffect } from 'react'

export default function WelcomeBanner() {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning')
      setEmoji('🌅')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon')
      setEmoji('☀️')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening')
      setEmoji('🌆')
    } else {
      setGreeting('Good Night')
      setEmoji('🌙')
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-full border border-navy-700 mb-6">
      <span className="text-xl">{emoji}</span>
      <span className="text-navy-300 text-sm font-medium">{greeting}, Learner!</span>
      <span className="text-primary-400 text-sm">Ready to level up today?</span>
    </div>
  )
}