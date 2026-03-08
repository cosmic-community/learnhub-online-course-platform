'use client'

import { useState, useEffect } from 'react'

interface VisitorData {
  name: string | null
  lastCourse: string | null
  visitCount: number
}

export default function WelcomeBack() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')

    const stored = localStorage.getItem('learnhub-visitor')
    if (stored) {
      const data = JSON.parse(stored) as VisitorData
      setVisitorData(data)
      
      // Update visit count
      data.visitCount += 1
      localStorage.setItem('learnhub-visitor', JSON.stringify(data))
    } else {
      const newData: VisitorData = { name: null, lastCourse: null, visitCount: 1 }
      localStorage.setItem('learnhub-visitor', JSON.stringify(newData))
      setVisitorData(newData)
    }

    setTimeout(() => setIsVisible(true), 300)
  }, [])

  const getGreeting = () => {
    const greetings = {
      morning: ['Good morning', 'Rise and shine', 'Hello, early learner'],
      afternoon: ['Good afternoon', 'Hello there', 'Welcome back'],
      evening: ['Good evening', 'Hello, night owl', 'Welcome back']
    }
    const options = greetings[timeOfDay as keyof typeof greetings] || greetings.afternoon
    return options[Math.floor(Math.random() * options.length)]
  }

  const getEmoji = () => {
    const emojis = {
      morning: '☀️',
      afternoon: '👋',
      evening: '🌙'
    }
    return emojis[timeOfDay as keyof typeof emojis] || '👋'
  }

  if (!visitorData) return null

  return (
    <div 
      className="transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)'
      }}
    >
      <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
        <span>{getEmoji()}</span>
        <span>{getGreeting()}!</span>
        {visitorData.visitCount > 1 && (
          <span className="text-primary-300">Visit #{visitorData.visitCount}</span>
        )}
      </span>
    </div>
  )
}