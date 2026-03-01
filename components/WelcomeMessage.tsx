'use client'

import { useState, useEffect } from 'react'

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

const greetings = {
  morning: { emoji: '☀️', text: 'Good morning', message: 'Ready to learn something new today?' },
  afternoon: { emoji: '🌤️', text: 'Good afternoon', message: 'Perfect time for a quick lesson!' },
  evening: { emoji: '🌅', text: 'Good evening', message: 'Wind down with some learning?' },
  night: { emoji: '🌙', text: 'Hello night owl', message: 'Learning never sleeps!' },
}

export default function WelcomeMessage() {
  const [mounted, setMounted] = useState(false)
  const [greeting, setGreeting] = useState(greetings.morning)
  
  useEffect(() => {
    setMounted(true)
    setGreeting(greetings[getTimeOfDay()])
  }, [])
  
  if (!mounted) {
    return null
  }
  
  return (
    <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20">
      <span className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>{greeting.emoji}</span>
      <div>
        <h2 className="text-xl font-semibold text-white">{greeting.text}!</h2>
        <p className="text-navy-300">{greeting.message}</p>
      </div>
    </div>
  )
}