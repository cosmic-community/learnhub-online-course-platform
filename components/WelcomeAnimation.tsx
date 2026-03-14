'use client'

import { useState, useEffect } from 'react'

const welcomeMessages = [
  "Ready to learn something amazing? 🚀",
  "Every expert was once a beginner 🌱",
  "Your coding journey continues! 💻",
  "Time to level up your skills! ⬆️",
  "Knowledge is power 💪",
]

export default function WelcomeAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Only show once per session
    const hasShown = sessionStorage.getItem('learnhub-welcome-shown')
    
    if (!hasShown) {
      setMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)])
      setIsVisible(true)
      sessionStorage.setItem('learnhub-welcome-shown', 'true')
      
      // Auto-hide after 3 seconds
      setTimeout(() => setIsVisible(false), 3000)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div className="bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-3xl px-12 py-8 shadow-2xl animate-welcomePulse">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">👋</div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to LearnHub!</h2>
          <p className="text-primary-400">{message}</p>
        </div>
      </div>
    </div>
  )
}