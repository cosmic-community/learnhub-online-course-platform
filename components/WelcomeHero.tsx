'use client'

import { useState, useEffect } from 'react'

interface WelcomeHeroProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
}

export default function WelcomeHero({ totalCourses, totalInstructors, totalCategories }: WelcomeHeroProps) {
  const [greeting, setGreeting] = useState('Hello')
  const [timeEmoji, setTimeEmoji] = useState('👋')
  const [typedText, setTypedText] = useState('')
  const fullText = "Ready to learn something new?"
  
  useEffect(() => {
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
      setGreeting('Night owl mode')
      setTimeEmoji('🦉')
    }
  }, [])

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Animated Greeting */}
      <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-full border border-navy-700">
        <span className="text-2xl animate-wave">{timeEmoji}</span>
        <span className="text-navy-300">{greeting}, learner!</span>
      </div>
      
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        Learn skills that
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient"> advance your career</span>
      </h1>
      
      <p className="text-xl text-navy-300 mb-2 h-8">
        {typedText}
        <span className="animate-blink">|</span>
      </p>
      
      <p className="text-lg text-navy-400 mb-8">
        Master web development, design, and more with expert-led courses.
      </p>

      {/* Animated Stats Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <div className="group px-4 py-2 bg-navy-800/50 rounded-full border border-navy-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105">
          <span className="text-primary-400 font-bold">{totalCourses}+</span>
          <span className="text-navy-400 ml-1">Courses</span>
        </div>
        <div className="group px-4 py-2 bg-navy-800/50 rounded-full border border-navy-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105">
          <span className="text-primary-400 font-bold">{totalInstructors}+</span>
          <span className="text-navy-400 ml-1">Expert Instructors</span>
        </div>
        <div className="group px-4 py-2 bg-navy-800/50 rounded-full border border-navy-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105">
          <span className="text-primary-400 font-bold">{totalCategories}</span>
          <span className="text-navy-400 ml-1">Categories</span>
        </div>
      </div>
    </div>
  )
}