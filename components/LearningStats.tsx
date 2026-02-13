'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalCategories: number
}

const motivationalQuotes = [
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
]

const funFacts = [
  "🧠 Learning a new skill can increase gray matter in your brain!",
  "🚀 Developers who learn continuously earn 25% more on average.",
  "⚡ The best time to learn something new is right now!",
  "🎯 Consistent 30-minute learning sessions are more effective than cramming.",
  "💡 Teaching others what you learn helps retain 90% of the knowledge.",
  "🌟 Every expert was once a beginner - keep going!",
]

function AnimatedCounter({ target, duration = 2000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * target))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])
  
  return <span>{count}{suffix}</span>
}

export default function LearningStats({ totalCourses, totalLessons, totalInstructors, totalCategories }: LearningStatsProps) {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentFact, setCurrentFact] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
    
    // Rotate quotes every 8 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 8000)
    
    // Rotate fun facts every 6 seconds
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length)
    }, 6000)
    
    // Show confetti animation briefly on load
    setShowConfetti(true)
    const confettiTimeout = setTimeout(() => setShowConfetti(false), 3000)
    
    return () => {
      clearInterval(quoteInterval)
      clearInterval(factInterval)
      clearTimeout(confettiTimeout)
    }
  }, [])
  
  const stats = [
    { label: 'Courses', value: totalCourses, icon: '📚', color: 'from-primary-400 to-teal-500' },
    { label: 'Lessons', value: totalLessons, icon: '📖', color: 'from-purple-400 to-pink-500' },
    { label: 'Instructors', value: totalInstructors, icon: '👨‍🏫', color: 'from-orange-400 to-red-500' },
    { label: 'Categories', value: totalCategories, icon: '🏷️', color: 'from-blue-400 to-indigo-500' },
  ]
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating particles */}
        {showConfetti && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#14b8a6', '#8b5cf6', '#f97316', '#3b82f6'][i % 4],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Learning Journey Starts Here ✨
          </h2>
          
          {/* Animated Quote */}
          <div className="max-w-2xl mx-auto h-20 flex items-center justify-center">
            <blockquote 
              key={currentQuote}
              className="text-navy-300 italic animate-fadeIn"
            >
              &ldquo;{motivationalQuotes[currentQuote].quote}&rdquo;
              <footer className="text-primary-400 text-sm mt-2">
                — {motivationalQuotes[currentQuote].author}
              </footer>
            </blockquote>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`card p-6 text-center group hover:scale-105 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="text-4xl mb-3 group-hover:animate-bounce">
                {stat.icon}
              </div>
              <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                <AnimatedCounter target={stat.value} suffix="+" />
              </div>
              <div className="text-navy-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Fun Fact Ticker */}
        <div className={`card p-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl animate-pulse">💡</span>
            <p 
              key={currentFact}
              className="text-navy-200 text-lg animate-fadeIn"
            >
              {funFacts[currentFact]}
            </p>
          </div>
        </div>
        
        {/* Learning Streak Encouragement */}
        <div className={`mt-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-full border border-primary-500/30">
            <span className="text-2xl">🔥</span>
            <span className="text-white font-medium">Start your learning streak today!</span>
            <span className="text-2xl">🔥</span>
          </div>
        </div>
      </div>
    </section>
  )
}