'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  )
}

export default function LearningProgress({ totalCourses, totalLessons }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [lessonsViewed, setLessonsViewed] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [mounted, setMounted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const triggerCelebration = useCallback(() => {
    setShowConfetti(true)
    setShowCelebration(true)
    setTimeout(() => {
      setShowConfetti(false)
      setShowCelebration(false)
    }, 3000)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])
    
    // Check and update streak
    const lastVisit = localStorage.getItem('learnhub_last_visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub_streak') || '0')
    const viewedLessons = JSON.parse(localStorage.getItem('learnhub_viewed_lessons') || '[]')
    
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastVisit === today) {
      setStreak(currentStreak)
    } else if (lastVisit === yesterday) {
      const newStreak = currentStreak + 1
      setStreak(newStreak)
      localStorage.setItem('learnhub_streak', newStreak.toString())
      localStorage.setItem('learnhub_last_visit', today)
      
      // Celebrate milestone streaks
      if (newStreak === 7 || newStreak === 30 || newStreak % 100 === 0) {
        setTimeout(triggerCelebration, 500)
      }
    } else if (!lastVisit) {
      setStreak(1)
      localStorage.setItem('learnhub_streak', '1')
      localStorage.setItem('learnhub_last_visit', today)
    } else {
      // Streak broken, reset
      setStreak(1)
      localStorage.setItem('learnhub_streak', '1')
      localStorage.setItem('learnhub_last_visit', today)
    }
    
    setLessonsViewed(viewedLessons.length)
  }, [triggerCelebration])

  if (!mounted) return null

  const progressPercentage = totalLessons > 0 ? Math.round((lessonsViewed / totalLessons) * 100) : 0
  const circumference = 2 * Math.PI * 40

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900/80 via-navy-800/50 to-primary-900/30 border border-navy-700/50 p-6 backdrop-blur-sm">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Streak Counter */}
            <div className="flex items-center gap-4">
              <div className={`relative ${showCelebration ? 'animate-bounce' : ''}`}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <span className="text-3xl">🔥</span>
                </div>
                {streak >= 7 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-navy-900 shadow-lg">
                    ⭐
                  </div>
                )}
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{streak}</div>
                <div className="text-sm text-navy-300">Day Streak</div>
                {streak >= 7 && (
                  <div className="text-xs text-primary-400 mt-1">
                    🎉 Keep it up!
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-16 bg-navy-700" />

            {/* Progress Ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-navy-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (progressPercentage / 100) * circumference}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{progressPercentage}%</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {lessonsViewed} / {totalLessons}
                </div>
                <div className="text-sm text-navy-300">Lessons Explored</div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-16 bg-navy-700" />

            {/* Quote */}
            <div className="flex-1 text-center lg:text-left">
              <div className="text-navy-200 italic text-sm lg:text-base">
                &ldquo;{quote.text}&rdquo;
              </div>
              <div className="text-navy-400 text-xs mt-1">
                — {quote.author}
              </div>
            </div>
          </div>

          {/* Streak Milestones */}
          {streak > 0 && (
            <div className="mt-4 pt-4 border-t border-navy-700/50">
              <div className="flex items-center justify-center gap-2 text-xs text-navy-400">
                <span>Next milestone:</span>
                {streak < 7 && <span className="text-primary-400 font-medium">7 days (earn ⭐)</span>}
                {streak >= 7 && streak < 30 && <span className="text-primary-400 font-medium">30 days 🏆</span>}
                {streak >= 30 && streak < 100 && <span className="text-primary-400 font-medium">100 days 💎</span>}
                {streak >= 100 && <span className="text-primary-400 font-medium">You&apos;re a legend! 🚀</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}