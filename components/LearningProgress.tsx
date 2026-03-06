'use client'

import { useState, useEffect, useRef } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
]

function AnimatedCounter({ target, duration = 2000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOut * target))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  return <span ref={ref}>{count}{suffix}</span>
}

function StreakFire({ streak }: { streak: number }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="absolute inset-0 animate-pulse">
        <svg className="w-16 h-16 text-orange-500 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/>
        </svg>
      </div>
      <div className="relative z-10 flex items-center gap-1">
        <svg className="w-8 h-8 text-orange-500 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/>
        </svg>
        <span className="text-2xl font-bold text-orange-400">{streak}</span>
      </div>
    </div>
  )
}

function FloatingParticle({ delay }: { delay: number }) {
  return (
    <div 
      className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-60 animate-float"
      style={{ 
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}
    />
  )
}

export default function LearningProgress({ totalCourses, totalLessons, totalInstructors }: LearningProgressProps) {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showAchievement, setShowAchievement] = useState(false)

  useEffect(() => {
    // Simulate getting streak from localStorage (in real app, this would be from user data)
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreak(parseInt(savedStreak || '1'))
    } else if (lastVisit) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (parseInt(savedStreak || '0')) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        // Show achievement for milestones
        if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
          setShowAchievement(true)
          setTimeout(() => setShowAchievement(false), 5000)
        }
      } else {
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      }
    } else {
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
    }
    localStorage.setItem('last-visit-date', today)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const quote = motivationalQuotes[currentQuote]

  return (
    <div className="relative">
      {/* Achievement Toast */}
      {showAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="text-3xl animate-bounce">🏆</div>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">{streak} Day Learning Streak!</div>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900/80 via-navy-800/50 to-navy-900/80 border border-navy-700/50 p-8 backdrop-blur-sm">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.5} />
          ))}
        </div>

        {/* Glowing orb effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          {/* Header with streak */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Your Learning Journey</h3>
              <p className="text-navy-400 text-sm">Keep the momentum going! 🚀</p>
            </div>
            <div className="flex flex-col items-center">
              <StreakFire streak={streak} />
              <span className="text-xs text-navy-400 mt-1">Day Streak</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-navy-800/50 rounded-xl border border-navy-700/50 hover:border-primary-500/50 transition-all hover:scale-105 group">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                <AnimatedCounter target={totalCourses} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm flex items-center justify-center gap-1">
                <span className="text-lg">📚</span> Courses
              </div>
            </div>
            <div className="text-center p-4 bg-navy-800/50 rounded-xl border border-navy-700/50 hover:border-primary-500/50 transition-all hover:scale-105 group">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                <AnimatedCounter target={totalLessons} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm flex items-center justify-center gap-1">
                <span className="text-lg">📖</span> Lessons
              </div>
            </div>
            <div className="text-center p-4 bg-navy-800/50 rounded-xl border border-navy-700/50 hover:border-primary-500/50 transition-all hover:scale-105 group">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                <AnimatedCounter target={totalInstructors} />
              </div>
              <div className="text-navy-400 text-sm flex items-center justify-center gap-1">
                <span className="text-lg">👨‍🏫</span> Experts
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="relative">
            <div className="absolute -left-2 top-0 text-4xl text-primary-500/30">"</div>
            <div className="pl-6 pr-4">
              <p className="text-navy-200 italic text-lg mb-2 transition-all duration-500">
                {quote.text}
              </p>
              <p className="text-primary-400 text-sm font-medium">— {quote.author}</p>
            </div>
            <div className="absolute -right-2 bottom-0 text-4xl text-primary-500/30 rotate-180">"</div>
          </div>

          {/* Progress indicator dots */}
          <div className="flex justify-center gap-2 mt-6">
            {motivationalQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote 
                    ? 'bg-primary-500 w-6' 
                    : 'bg-navy-600 hover:bg-navy-500'
                }`}
                aria-label={`Quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}