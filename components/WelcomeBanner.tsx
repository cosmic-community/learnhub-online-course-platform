'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function WelcomeBanner() {
  const [greeting, setGreeting] = useState('Hello')
  const [timeEmoji, setTimeEmoji] = useState('👋')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
      setTimeEmoji('🌅')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon')
      setTimeEmoji('☀️')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening')
      setTimeEmoji('🌆')
    } else {
      setGreeting('Good night')
      setTimeEmoji('🌙')
    }
  }, [])

  const motivationalQuotes = [
    "Every expert was once a beginner.",
    "The only way to learn is to start.",
    "Small steps lead to big achievements.",
    "Knowledge is power, keep learning!",
    "Today is a perfect day to learn something new."
  ]

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500 p-8 transition-all duration-700 ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-3xl">{timeEmoji}</span>
            {greeting}, Learner!
          </h2>
          <p className="text-white/80 text-lg italic">"{randomQuote}"</p>
        </div>
        
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Continue Learning
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}