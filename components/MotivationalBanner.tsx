'use client'

import { useState, useEffect } from 'react'

const GREETINGS = {
  morning: ['Good morning', 'Rise and shine', 'Hello, early bird'],
  afternoon: ['Good afternoon', 'Hello there', 'Keep going'],
  evening: ['Good evening', 'Welcome back', 'Great to see you'],
}

const MOTIVATIONS = [
  "Every expert was once a beginner. Start your next lesson today!",
  "Small progress is still progress. Keep going! 💪",
  "The best time to learn was yesterday. The second best time is now.",
  "Your future self will thank you for learning today.",
  "Consistency beats intensity. Just 15 minutes can make a difference!",
  "You're one lesson closer to mastering something new.",
  "Learning is a superpower. Keep building yours! 🚀",
  "Great things never come from comfort zones.",
  "Today's learning is tomorrow's achievement.",
  "Stay curious, keep learning, never stop growing.",
]

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export default function MotivationalBanner() {
  const [greeting, setGreeting] = useState('')
  const [motivation, setMotivation] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timeOfDay = getTimeOfDay()
    const greetings = GREETINGS[timeOfDay]
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
    setMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!greeting) return null

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-transparent border border-primary-500/20 p-6 mb-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-primary-400/5 rounded-full translate-y-1/2" />
        
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="text-4xl">👋</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {greeting}!
              </h2>
              <p className="text-navy-300 text-lg">
                {motivation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}