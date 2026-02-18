'use client'

import { useState, useEffect } from 'react'

export default function WelcomeMessage() {
  const [greeting, setGreeting] = useState('')
  const [emoji, setEmoji] = useState('👋')
  const [tip, setTip] = useState('')

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
      setGreeting('Hello, night owl')
      setEmoji('🦉')
    }

    // Random learning tips
    const tips = [
      '💡 Tip: Consistency beats intensity. Just 15 minutes daily can lead to mastery!',
      '🎯 Fun fact: Active recall is 50% more effective than passive reading.',
      '🧠 Did you know? Taking breaks every 25 minutes improves retention by 30%.',
      '🚀 Pro tip: Teaching what you learn helps you understand it 2x better.',
      '⚡ Quick win: Start with the hardest topic when your energy is highest.',
      '🎪 Learning hack: Connect new concepts to things you already know.',
    ]
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  return (
    <div className="card p-6 bg-gradient-to-r from-primary-500/10 to-navy-900/50 border-primary-500/20">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {greeting}, learner! <span className="animate-wave">{emoji}</span>
          </h2>
          <p className="text-navy-300 mt-1">Ready to level up your skills today?</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-navy-800/50 rounded-lg border border-navy-700/50">
        <p className="text-sm text-navy-300">{tip}</p>
      </div>
    </div>
  )
}