'use client'

import { useState, useEffect } from 'react'

interface WelcomeBackProps {
  coursesCount: number
  categoriesCount: number
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Happy late-night learning'
}

function getTimeEmoji(): string {
  const hour = new Date().getHours()
  if (hour < 6) return '🌙'
  if (hour < 12) return '☀️'
  if (hour < 17) return '🌤️'
  if (hour < 21) return '🌅'
  return '🌙'
}

export default function WelcomeBack({ coursesCount, categoriesCount }: WelcomeBackProps) {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setGreeting(getGreeting())
    setEmoji(getTimeEmoji())
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!greeting) return null

  return (
    <div 
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="flex items-center gap-2 text-navy-400 mb-2">
        <span className="text-2xl">{emoji}</span>
        <span className="text-sm font-medium">{greeting}, learner!</span>
      </div>
      <p className="text-sm text-navy-500">
        Ready to explore {coursesCount} courses across {categoriesCount} categories?
      </p>
    </div>
  )
}