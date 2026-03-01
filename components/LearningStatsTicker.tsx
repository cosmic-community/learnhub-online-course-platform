'use client'

import { useState, useEffect } from 'react'

interface LearningStatsTickerProps {
  coursesCount: number
  lessonsCount: number
  instructorsCount: number
}

interface Activity {
  id: number
  emoji: string
  text: string
  time: string
}

export default function LearningStatsTicker({ 
  coursesCount, 
  lessonsCount, 
  instructorsCount 
}: LearningStatsTickerProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Generate realistic-looking activities
  const generateActivities = (): Activity[] => {
    const names = [
      'Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery',
      'Quinn', 'Skyler', 'Jamie', 'Drew', 'Cameron', 'Blake', 'Reese', 'Parker'
    ]
    
    const actions = [
      { emoji: '🎓', text: (name: string) => `${name} just completed a lesson` },
      { emoji: '🚀', text: (name: string) => `${name} started a new course` },
      { emoji: '⭐', text: (name: string) => `${name} earned a certificate` },
      { emoji: '📝', text: (name: string) => `${name} finished a coding challenge` },
      { emoji: '🎯', text: (name: string) => `${name} reached a learning milestone` },
      { emoji: '💡', text: (name: string) => `${name} completed their daily goal` },
    ]

    const times = ['just now', '1 min ago', '2 mins ago', '3 mins ago', '5 mins ago']

    return Array.from({ length: 10 }, (_, i) => {
      const name = names[Math.floor(Math.random() * names.length)]
      const action = actions[Math.floor(Math.random() * actions.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      
      return {
        id: i,
        emoji: action.emoji,
        text: action.text(name),
        time
      }
    })
  }

  useEffect(() => {
    setActivities(generateActivities())
    
    // Rotate activities every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 10)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentActivity = activities[currentIndex]

  return (
    <div className="bg-navy-900 border-y border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 overflow-hidden">
          {/* Left: Live activity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-xs font-medium uppercase tracking-wider hidden sm:inline">
                Live
              </span>
            </div>
            
            {currentActivity && (
              <div className="flex items-center gap-2 animate-fade-in text-sm text-navy-300 truncate">
                <span>{currentActivity.emoji}</span>
                <span className="truncate">{currentActivity.text}</span>
                <span className="text-navy-500 flex-shrink-0">• {currentActivity.time}</span>
              </div>
            )}
          </div>

          {/* Right: Quick stats */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary-400">📚</span>
              <span className="text-navy-400">{coursesCount} courses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-400">📖</span>
              <span className="text-navy-400">{lessonsCount} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-400">👨‍🏫</span>
              <span className="text-navy-400">{instructorsCount} instructors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}