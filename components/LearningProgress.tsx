'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

const getTimeBasedGreeting = (): { greeting: string; emoji: string; suggestion: string } => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good morning",
      emoji: "🌅",
      suggestion: "Start your day with a fresh lesson!"
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good afternoon", 
      emoji: "☀️",
      suggestion: "Perfect time for a quick learning session!"
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good evening",
      emoji: "🌆",
      suggestion: "Wind down with some new knowledge!"
    }
  } else {
    return {
      greeting: "Hello night owl",
      emoji: "🌙",
      suggestion: "Late night learning? We admire your dedication!"
    }
  }
}

export default function LearningProgress({ totalCourses, totalLessons, totalInstructors }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [timeGreeting, setTimeGreeting] = useState(getTimeBasedGreeting())
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate getting streak from localStorage (in real app, this would come from user data)
    const savedStreak = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisit')
    const today = new Date().toDateString()
    
    if (lastVisit === today) {
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learningStreak', newStreak.toString())
      } else {
        setStreak(1)
        localStorage.setItem('learningStreak', '1')
      }
      localStorage.setItem('lastVisit', today)
    }

    // Random quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)

    // Update time greeting
    setTimeGreeting(getTimeBasedGreeting())

    // Trigger animations
    setIsVisible(true)
  }, [])

  // Animate numbers
  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedCourses(Math.round(totalCourses * easeOut))
      setAnimatedLessons(Math.round(totalLessons * easeOut))
      setAnimatedInstructors(Math.round(totalInstructors * easeOut))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible, totalCourses, totalLessons, totalInstructors])

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Greeting & Streak Section */}
      <div className="card p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{timeGreeting.emoji}</span>
              <h3 className="text-xl font-semibold text-white">{timeGreeting.greeting}, Learner!</h3>
            </div>
            <p className="text-navy-400">{timeGreeting.suggestion}</p>
          </div>
          
          {/* Streak Counter */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-3 rounded-xl border border-orange-500/30">
            <div className="relative">
              <span className="text-3xl animate-pulse">🔥</span>
              {streak > 3 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-orange-300">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center group hover:border-primary-500/50 transition-colors">
          <div className="text-3xl font-bold text-primary-400 mb-1 tabular-nums">
            {animatedCourses}+
          </div>
          <div className="text-sm text-navy-400 group-hover:text-navy-300 transition-colors">Courses</div>
        </div>
        <div className="card p-4 text-center group hover:border-primary-500/50 transition-colors">
          <div className="text-3xl font-bold text-primary-400 mb-1 tabular-nums">
            {animatedLessons}+
          </div>
          <div className="text-sm text-navy-400 group-hover:text-navy-300 transition-colors">Lessons</div>
        </div>
        <div className="card p-4 text-center group hover:border-primary-500/50 transition-colors">
          <div className="text-3xl font-bold text-primary-400 mb-1 tabular-nums">
            {animatedInstructors}+
          </div>
          <div className="text-sm text-navy-400 group-hover:text-navy-300 transition-colors">Instructors</div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        <div className="flex gap-4">
          <span className="text-4xl text-primary-500/50">"</span>
          <div>
            <p className="text-white italic text-lg mb-2">{quote.text}</p>
            <p className="text-navy-400 text-sm">— {quote.author}</p>
          </div>
        </div>
      </div>
    </div>
  )
}