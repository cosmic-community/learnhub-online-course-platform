'use client'

import { useState, useEffect } from 'react'

const GREETINGS = [
  { time: 'morning', emoji: '☀️', greeting: 'Good morning' },
  { time: 'afternoon', emoji: '🌤️', greeting: 'Good afternoon' },
  { time: 'evening', emoji: '🌙', greeting: 'Good evening' },
]

const MOTIVATIONAL_MESSAGES = [
  "Ready to learn something amazing today?",
  "Every expert was once a beginner!",
  "Your future self will thank you!",
  "Small steps lead to big achievements!",
  "Consistency beats intensity!",
  "You're investing in yourself!",
  "Knowledge is power!",
  "Let's make today count!",
]

export default function WelcomeBack() {
  const [greeting, setGreeting] = useState<typeof GREETINGS[0] | null>(null)
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    let timeOfDay: 'morning' | 'afternoon' | 'evening'
    
    if (hour < 12) timeOfDay = 'morning'
    else if (hour < 18) timeOfDay = 'afternoon'
    else timeOfDay = 'evening'
    
    const currentGreeting = GREETINGS.find(g => g.time === timeOfDay) || GREETINGS[0]
    setGreeting(currentGreeting)
    
    // Check if this is a new visitor
    const hasVisited = localStorage.getItem('learnhub-streak')
    setIsNew(!hasVisited)
    
    // Pick random motivational message
    setMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!greeting) return null

  return (
    <div 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{greeting.emoji}</span>
        <h2 className="text-2xl font-bold text-white">
          {greeting.greeting}{isNew ? ', learner!' : '!'}
        </h2>
      </div>
      <p className="text-navy-300 flex items-center gap-2">
        <span className="text-primary-400">✨</span>
        {message}
      </p>
    </div>
  )
}