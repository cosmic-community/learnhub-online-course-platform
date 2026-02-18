'use client'

import { useState, useEffect } from 'react'

const skills = [
  'advance your career',
  'master web development',
  'build amazing apps',
  'become an expert',
  'unlock your potential'
]

export default function AnimatedHero() {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentSkillIndex((prev) => (prev + 1) % skills.length)
        setIsVisible(true)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
      Learn skills that
      <br />
      <span 
        className={`text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 inline-block transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {skills[currentSkillIndex]}
      </span>
    </h1>
  )
}