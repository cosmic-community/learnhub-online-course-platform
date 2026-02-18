'use client'

import { useState, useEffect } from 'react'

const greetings = [
  { emoji: '👋', message: 'Welcome back! Ready to learn something new?' },
  { emoji: '🌟', message: 'Great to see you! Your learning journey continues.' },
  { emoji: '🚀', message: 'Let\'s make today productive!' },
  { emoji: '📚', message: 'Knowledge awaits! Dive in.' },
  { emoji: '💪', message: 'You\'re building something amazing!' },
]

export default function WelcomeToast() {
  const [isVisible, setIsVisible] = useState(false)
  const [greeting, setGreeting] = useState(greetings[0])

  useEffect(() => {
    // Check if we've shown the toast today
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    
    if (lastVisit !== today) {
      // New day, show welcome toast
      localStorage.setItem('learnhub-last-visit', today)
      
      // Pick a random greeting
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
      setGreeting(randomGreeting)
      
      // Show toast after a short delay
      const showTimer = setTimeout(() => setIsVisible(true), 500)
      
      // Hide toast after 4 seconds
      const hideTimer = setTimeout(() => setIsVisible(false), 4500)
      
      return () => {
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-navy-800/90 backdrop-blur-lg border border-navy-700 rounded-xl px-6 py-4 shadow-2xl shadow-primary-500/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-wave">{greeting.emoji}</span>
          <p className="text-white font-medium">{greeting.message}</p>
        </div>
      </div>
    </div>
  )
}