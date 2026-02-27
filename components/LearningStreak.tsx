'use client'

import { useState, useEffect, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  velocity: { x: number; y: number }
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
]

const dailyChallenges = [
  "Complete one lesson today 📖",
  "Watch a course preview video 🎬",
  "Explore a new category 🔍",
  "Read course descriptions for 5 minutes 📚",
  "Take notes on something you learned ✏️",
  "Share your learning goal with a friend 🤝",
]

const confettiColors = ['#29ABE2', '#22d3ee', '#a855f7', '#ec4899', '#f59e0b', '#10b981']

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [challenge, setChallenge] = useState(dailyChallenges[0])
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    setMounted(true)
    
    // Load streak from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()
    
    if (savedStreak && lastVisit) {
      const parsedStreak = parseInt(savedStreak, 10)
      if (lastVisit === today) {
        setStreak(parsedStreak)
      } else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (lastVisit === yesterday.toDateString()) {
          // Continue streak
          const newStreak = parsedStreak + 1
          setStreak(newStreak)
          localStorage.setItem('learning-streak', newStreak.toString())
          localStorage.setItem('last-visit-date', today)
          // Trigger celebration for streak milestones
          if (newStreak % 7 === 0 || newStreak === 1) {
            setTimeout(() => triggerCelebration(), 500)
          }
        } else {
          // Streak broken, start fresh
          setStreak(1)
          localStorage.setItem('learning-streak', '1')
          localStorage.setItem('last-visit-date', today)
        }
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-visit-date', today)
      setTimeout(() => triggerCelebration(), 1000)
    }
    
    // Check if challenge was completed today
    const completedToday = localStorage.getItem('challenge-completed-date')
    if (completedToday === today) {
      setChallengeCompleted(true)
    }
    
    // Set random quote and challenge for today
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])
    setChallenge(dailyChallenges[dayOfYear % dailyChallenges.length])
  }, [])

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: 100 + Math.random() * 20,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: -(Math.random() * 15 + 10)
        }
      })
    }
    return newParticles
  }, [])

  const triggerCelebration = useCallback(() => {
    setShowConfetti(true)
    setParticles(createParticles())
    setIsAnimating(true)
    
    setTimeout(() => {
      setShowConfetti(false)
      setIsAnimating(false)
    }, 3000)
  }, [createParticles])

  const handleCompleteChallenge = () => {
    if (!challengeCompleted) {
      setChallengeCompleted(true)
      localStorage.setItem('challenge-completed-date', new Date().toDateString())
      triggerCelebration()
    }
  }

  // Animate particles
  useEffect(() => {
    if (!showConfetti || particles.length === 0) return
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.velocity.x * 0.5,
        y: p.y + p.velocity.y * 0.5,
        velocity: {
          x: p.velocity.x * 0.99,
          y: p.velocity.y + 0.3 // gravity
        }
      })).filter(p => p.y < 150))
    }, 30)
    
    return () => clearInterval(interval)
  }, [showConfetti, particles.length])

  if (!mounted) {
    return (
      <div className="card p-6 relative overflow-hidden animate-pulse">
        <div className="h-32 bg-navy-800 rounded" />
      </div>
    )
  }

  const streakEmoji = streak >= 30 ? '🔥🏆' : streak >= 14 ? '🔥⭐' : streak >= 7 ? '🔥' : '✨'
  const streakMessage = streak >= 30 
    ? "Legendary learner!" 
    : streak >= 14 
      ? "You're on fire!" 
      : streak >= 7 
        ? "One week strong!" 
        : streak > 1 
          ? "Keep it up!" 
          : "Welcome back!"

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                transform: 'translate(-50%, -50%)',
                transition: 'none'
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative z-10">
        {/* Streak Counter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`text-5xl ${isAnimating ? 'animate-bounce' : ''}`}>
              {streakEmoji}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{streak}</span>
                <span className="text-navy-400 text-sm">day{streak !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-primary-400 font-medium">{streakMessage}</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < Math.min(streak, 7)
                    ? 'bg-primary-500 scale-100'
                    : 'bg-navy-700 scale-75'
                }`}
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent mb-6" />

        {/* Daily Challenge */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-navy-300 uppercase tracking-wide">
              Today's Challenge
            </h4>
            {challengeCompleted && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete!
              </span>
            )}
          </div>
          <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
            challengeCompleted 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-navy-800/50 border border-navy-700 hover:border-primary-500/50'
          }`}>
            <span className={`text-lg ${challengeCompleted ? 'text-green-300 line-through' : 'text-white'}`}>
              {challenge}
            </span>
            {!challengeCompleted && (
              <button
                onClick={handleCompleteChallenge}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Done!
              </button>
            )}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="relative">
          <div className="absolute -left-2 top-0 text-4xl text-primary-500/20">"</div>
          <blockquote className="pl-6">
            <p className="text-navy-200 italic text-lg leading-relaxed mb-2">
              {quote.text}
            </p>
            <cite className="text-primary-400 text-sm not-italic">
              — {quote.author}
            </cite>
          </blockquote>
        </div>

        {/* Progress Ring Background Effect */}
        <div className="absolute -bottom-20 -right-20 w-48 h-48 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-navy-600"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-primary-500"
              strokeDasharray={`${Math.min(streak / 30, 1) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}