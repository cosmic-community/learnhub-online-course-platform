'use client'

import { useState, useEffect } from 'react'

interface PersonalizedGreetingProps {
  courseName?: string
}

export default function PersonalizedGreeting({ courseName }: PersonalizedGreetingProps) {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('')
  const [motivationalQuote, setMotivationalQuote] = useState('')

  const quotes = [
    "Every expert was once a beginner.",
    "The only way to do great work is to love what you do.",
    "Learning is a treasure that follows its owner everywhere.",
    "The beautiful thing about learning is nobody can take it away from you.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The capacity to learn is a gift; the ability to learn is a skill.",
    "Education is not the filling of a pail, but the lighting of a fire.",
    "The more that you read, the more things you will know.",
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

    // Random quote
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  return (
    <div className="bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 rounded-2xl p-6 mb-8 border border-primary-500/20">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-2xl font-bold text-white">
          {greeting}! {courseName ? `Ready to continue ${courseName}?` : 'Ready to learn something new?'}
        </h2>
      </div>
      <p className="text-navy-300 italic">"{motivationalQuote}"</p>
    </div>
  )
}