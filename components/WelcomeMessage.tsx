'use client'

import { useState, useEffect } from 'react'

export default function WelcomeMessage() {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')
  const [tip, setTip] = useState('')

  const tips = [
    "💡 Tip: Consistent daily practice beats occasional marathon sessions!",
    "💡 Tip: Try explaining what you learn to solidify your understanding.",
    "💡 Tip: Take breaks every 25 minutes using the Pomodoro technique.",
    "💡 Tip: Apply what you learn in small personal projects.",
    "💡 Tip: Don't be afraid to revisit lessons - repetition is key!",
    "💡 Tip: Join discussions and connect with fellow learners.",
    "💡 Tip: Set specific goals for each learning session.",
    "💡 Tip: Code along with the examples, don't just watch!",
  ]

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
      setGreeting('Burning the midnight oil')
      setEmoji('🌙')
    }

    // Random tip
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-2xl font-bold text-white">
          {greeting}, learner!
        </h2>
      </div>
      <p className="text-navy-400 text-sm pl-12">{tip}</p>
    </div>
  )
}