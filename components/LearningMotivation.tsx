'use client'

import { useState, useEffect, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

const learningTips = [
  { emoji: '🧠', tip: "Studies show that learning in 25-minute focused sessions boosts retention by 40%." },
  { emoji: '📚', tip: "Teaching what you learn to others helps you retain 90% of the information." },
  { emoji: '💡', tip: "Taking notes by hand activates more areas of your brain than typing." },
  { emoji: '🎯', tip: "Setting specific learning goals increases completion rates by 76%." },
  { emoji: '☕', tip: "A 10-minute break every hour improves focus and prevents burnout." },
  { emoji: '🌟', tip: "Consistency beats intensity. 30 minutes daily outperforms 4-hour weekend sessions." },
  { emoji: '🔄', tip: "Spaced repetition: Review material at increasing intervals for long-term memory." },
  { emoji: '✨', tip: "Celebrate small wins! Each completed lesson is a step toward mastery." },
]

export default function LearningMotivation() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [streakCount, setStreakCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Rotate tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % learningTips.length)
        setIsAnimating(false)
      }, 300)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Initialize streak from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('learnhub-streak')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreakCount(Number(savedStreak) || 1)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const currentDate = new Date()
      const diffTime = currentDate.getTime() - lastDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        const newStreak = (Number(savedStreak) || 0) + 1
        setStreakCount(newStreak)
        localStorage.setItem('learnhub-streak', String(newStreak))
        // Celebrate streak milestones
        if (newStreak % 7 === 0) {
          triggerConfetti()
        }
      } else if (diffDays > 1) {
        setStreakCount(1)
        localStorage.setItem('learnhub-streak', '1')
      }
    } else {
      setStreakCount(1)
      localStorage.setItem('learnhub-streak', '1')
    }

    localStorage.setItem('learnhub-last-visit', today)
  }, [])

  const createParticle = useCallback((x: number, y: number): Particle => {
    const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#818cf8', '#34d399']
    return {
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    }
  }, [])

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push(createParticle(window.innerWidth / 2, 200))
    }
    setParticles(newParticles)

    setTimeout(() => {
      setShowConfetti(false)
      setParticles([])
    }, 3000)
  }, [createParticle])

  const handleMotivateClick = () => {
    triggerConfetti()
  }

  const currentTip = learningTips[currentTipIndex]

  return (
    <>
      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute animate-confetti"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                width: '10px',
                height: '10px',
                transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Main Widget */}
      <div className="card p-6 relative overflow-hidden group">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-400/10 rounded-full blur-2xl animate-pulse-slow delay-1000" />

        <div className="relative">
          {/* Header with Streak */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-3xl animate-bounce-slow">🔥</span>
                {streakCount >= 7 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs animate-ping-slow">
                    ⭐
                  </span>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{streakCount}</div>
                <div className="text-xs text-navy-400">Day Streak</div>
              </div>
            </div>
            
            <button
              onClick={handleMotivateClick}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium text-sm hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 active:scale-95"
            >
              ✨ Celebrate!
            </button>
          </div>

          {/* Learning Tip Section */}
          <div className="bg-navy-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary-400 text-sm font-medium">💡 Daily Learning Tip</span>
              <div className="flex-1 h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
            </div>
            
            <div 
              className={`transition-all duration-300 ${
                isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{currentTip?.emoji}</span>
                <p className="text-navy-300 text-sm leading-relaxed">{currentTip?.tip}</p>
              </div>
            </div>

            {/* Tip Progress Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {learningTips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAnimating(true)
                    setTimeout(() => {
                      setCurrentTipIndex(index)
                      setIsAnimating(false)
                    }, 300)
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentTipIndex 
                      ? 'bg-primary-400 w-4' 
                      : 'bg-navy-600 hover:bg-navy-500'
                  }`}
                  aria-label={`Go to tip ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-navy-800/30 rounded-lg group/stat hover:bg-navy-800/50 transition-colors cursor-pointer">
              <div className="text-xl mb-1 group-hover/stat:animate-bounce-once">📖</div>
              <div className="text-xs text-navy-400">Start a lesson</div>
            </div>
            <div className="text-center p-3 bg-navy-800/30 rounded-lg group/stat hover:bg-navy-800/50 transition-colors cursor-pointer">
              <div className="text-xl mb-1 group-hover/stat:animate-bounce-once">🎯</div>
              <div className="text-xs text-navy-400">Set a goal</div>
            </div>
            <div className="text-center p-3 bg-navy-800/30 rounded-lg group/stat hover:bg-navy-800/50 transition-colors cursor-pointer">
              <div className="text-xl mb-1 group-hover/stat:animate-bounce-once">🏆</div>
              <div className="text-xs text-navy-400">View progress</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}