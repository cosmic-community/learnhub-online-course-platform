'use client'

import { useState, useEffect } from 'react'

interface UserProgress {
  lessonsCompleted: number
  currentStreak: number
  lastVisit: string
}

export default function WelcomeMessage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Load user progress
    const savedStats = localStorage.getItem('learnhub-progress')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setProgress({
        lessonsCompleted: stats.lessonsCompleted || 0,
        currentStreak: stats.currentStreak || 0,
        lastVisit: stats.lastVisit || '',
      })
    }

    // Set time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 17) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  const getEncouragement = () => {
    if (!progress) return "Ready to start your learning journey?"
    
    if (progress.lessonsCompleted === 0) {
      return "Ready to start your learning journey? Pick a course and dive in!"
    }
    
    if (progress.currentStreak >= 7) {
      return `Amazing ${progress.currentStreak}-day streak! You're unstoppable! 🔥`
    }
    
    if (progress.currentStreak >= 3) {
      return `${progress.currentStreak} days in a row! Keep the momentum going! ⚡`
    }
    
    if (progress.lessonsCompleted >= 10) {
      return `${progress.lessonsCompleted} lessons completed! You're making great progress! 📚`
    }
    
    if (progress.lessonsCompleted > 0) {
      return "Welcome back! Ready to learn something new today?"
    }
    
    return "Ready to start your learning journey?"
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-2">
        {greeting}, Learner! 👋
      </h2>
      <p className="text-navy-300">
        {getEncouragement()}
      </p>
    </div>
  )
}