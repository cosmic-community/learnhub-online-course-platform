'use client'

import { useState, useEffect } from 'react'

const motivationalMessages = [
  "You're on fire! 🔥",
  "Keep the momentum going! 💪",
  "Learning champion! 🏆",
  "Unstoppable learner! 🚀",
  "Knowledge seeker! 📚",
]

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Get streak from localStorage
    const stored = localStorage.getItem('learningStreak')
    const lastVisit = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()

    if (stored && lastVisit) {
      const storedStreak = parseInt(stored, 10)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastVisit === today) {
        // Already visited today
        setStreak(storedStreak)
      } else if (lastVisit === yesterday.toDateString()) {
        // Continuing streak
        const newStreak = storedStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learningStreak', newStreak.toString())
        localStorage.setItem('lastVisitDate', today)
        
        // Show celebration for milestones
        if (newStreak % 5 === 0) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learningStreak', '1')
        localStorage.setItem('lastVisitDate', today)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learningStreak', '1')
      localStorage.setItem('lastVisitDate', today)
    }

    // Set random motivational message
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
  }, [])

  if (streak === 0) return null

  return (
    <div className="relative mb-8">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-full border border-primary-500/30 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce-slow">🔥</span>
          <div className="text-left">
            <div className="text-sm text-primary-300 font-medium">Learning Streak</div>
            <div className="text-2xl font-bold text-white">{streak} {streak === 1 ? 'day' : 'days'}</div>
          </div>
        </div>
        {streak >= 3 && (
          <div className="hidden sm:block pl-3 border-l border-primary-500/30">
            <span className="text-sm text-navy-300">{message}</span>
          </div>
        )}
      </div>
    </div>
  )
}