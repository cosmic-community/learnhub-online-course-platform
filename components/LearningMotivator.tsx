'use client'

import { useState, useEffect } from 'react'

interface MotivationalTip {
  emoji: string
  message: string
  author?: string
}

const motivationalTips: MotivationalTip[] = [
  { emoji: '🚀', message: "Every expert was once a beginner. Keep going!", author: "Helen Hayes" },
  { emoji: '💡', message: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { emoji: '🎯', message: "Small daily improvements lead to stunning results over time." },
  { emoji: '🧠', message: "Your brain creates new neural pathways every time you learn something new!" },
  { emoji: '⚡', message: "20 minutes of focused learning is better than 2 hours of distracted study." },
  { emoji: '🌟', message: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { emoji: '🔥', message: "You're not just learning code – you're building your future!" },
  { emoji: '💪', message: "Consistency beats intensity. Show up every day, even for just 15 minutes." },
  { emoji: '🎨', message: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { emoji: '🌈', message: "Every line of code you write makes you a better developer." },
  { emoji: '📚', message: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { emoji: '✨', message: "Your potential is endless. Go do what you were created to do." },
  { emoji: '🏆', message: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { emoji: '🌱', message: "Growth is never by mere chance; it is the result of forces working together.", author: "James Cash Penney" },
]

const greetings = [
  { time: 'morning', message: 'Good morning, learner! ☀️', subtext: 'Ready to conquer new skills today?' },
  { time: 'afternoon', message: 'Good afternoon! 🌤️', subtext: 'Perfect time for a learning session!' },
  { time: 'evening', message: 'Good evening! 🌙', subtext: 'Wind down with some learning!' },
  { time: 'night', message: 'Night owl mode! 🦉', subtext: 'Late night learning hits different!' },
]

export default function LearningMotivator() {
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [tip, setTip] = useState<MotivationalTip | null>(null)
  const [greeting, setGreeting] = useState<typeof greetings[0] | null>(null)
  const [visitCount, setVisitCount] = useState(0)

  useEffect(() => {
    // Get time-based greeting
    const hour = new Date().getHours()
    let timeOfDay = 'morning'
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening'
    else if (hour >= 21 || hour < 5) timeOfDay = 'night'
    
    const currentGreeting = greetings.find(g => g.time === timeOfDay) || greetings[0]
    setGreeting(currentGreeting)

    // Get daily tip based on date (changes once per day)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % motivationalTips.length
    setTip(motivationalTips[tipIndex])

    // Track visit count
    const storedCount = localStorage.getItem('learnhub-visit-count')
    const count = storedCount ? parseInt(storedCount, 10) + 1 : 1
    setVisitCount(count)
    localStorage.setItem('learnhub-visit-count', count.toString())

    // Show confetti for milestone visits
    if (count === 1 || count % 10 === 0) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!tip || !greeting) return null

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Motivator Banner */}
      <div 
        className={`bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-pink-600/20 border-b border-primary-500/20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Greeting */}
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-wave">{greeting.time === 'morning' ? '👋' : greeting.time === 'night' ? '🦉' : '✨'}</div>
              <div>
                <p className="text-white font-medium">{greeting.message}</p>
                <p className="text-navy-300 text-sm">{greeting.subtext}</p>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="flex items-center gap-3 text-center sm:text-right">
              <div className="hidden sm:block text-2xl animate-pulse-slow">{tip.emoji}</div>
              <div className="max-w-md">
                <p className="text-primary-300 text-sm font-medium">💡 Tip of the Day</p>
                <p className="text-navy-200 text-sm italic">&ldquo;{tip.message}&rdquo;</p>
                {tip.author && <p className="text-navy-400 text-xs mt-1">— {tip.author}</p>}
              </div>
            </div>
          </div>

          {/* Visit milestone */}
          {visitCount > 1 && (
            <div className="mt-3 pt-3 border-t border-primary-500/10 text-center">
              <p className="text-navy-400 text-xs">
                🎉 Welcome back! This is visit #{visitCount}. 
                {visitCount >= 10 && visitCount < 50 && " You're building great learning habits!"}
                {visitCount >= 50 && " You're a LearnHub champion! 🏆"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}