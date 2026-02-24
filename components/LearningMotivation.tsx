'use client'

import { useState, useEffect } from 'react'

interface MotivationalQuote {
  text: string
  author: string
}

const quotes: MotivationalQuote[] = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
]

const greetings = [
  "Welcome back, learner! 🎓",
  "Ready to grow today? 🌱",
  "Let's learn something new! ✨",
  "Knowledge awaits! 📚",
  "Time to level up! 🚀",
]

const achievements = [
  { days: 1, emoji: "🌟", title: "First Step" },
  { days: 3, emoji: "🔥", title: "Getting Warmed Up" },
  { days: 7, emoji: "⚡", title: "Week Warrior" },
  { days: 14, emoji: "💎", title: "Dedicated Learner" },
  { days: 30, emoji: "🏆", title: "Monthly Master" },
]

export default function LearningMotivation() {
  const [streak, setStreak] = useState(0)
  const [quote, setQuote] = useState<MotivationalQuote | null>(null)
  const [greeting, setGreeting] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<typeof achievements[0] | null>(null)

  useEffect(() => {
    // Get or set the learning streak
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub-streak') || '0')
    
    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      let newStreak = 1
      if (lastVisit === yesterday.toDateString()) {
        // Continuing streak
        newStreak = currentStreak + 1
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
      
      localStorage.setItem('learnhub-last-visit', today)
      localStorage.setItem('learnhub-streak', newStreak.toString())
      setStreak(newStreak)
    } else {
      setStreak(currentStreak || 1)
    }

    // Select quote based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(quotes[dayOfYear % quotes.length])
    
    // Random greeting
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  useEffect(() => {
    // Find current achievement level
    const achieved = [...achievements]
      .reverse()
      .find(a => streak >= a.days)
    setCurrentAchievement(achieved || null)
  }, [streak])

  if (!quote) return null

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['✨', '🎉', '⭐', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 via-navy-900/60 to-primary-900/20 border-primary-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Greeting & Streak */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl shadow-lg shadow-primary-500/30 animate-pulse-slow">
                {currentAchievement?.emoji || '📖'}
              </div>
              {streak > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-navy-800 border-2 border-primary-500 rounded-full px-2 py-0.5 text-xs font-bold text-primary-400">
                  {streak}🔥
                </div>
              )}
            </div>
            <div>
              <p className="text-primary-400 font-medium text-sm">{greeting}</p>
              <p className="text-white font-semibold">
                {streak === 1 ? 'Start your streak!' : `${streak} day streak!`}
              </p>
              {currentAchievement && (
                <p className="text-navy-400 text-xs mt-0.5">
                  {currentAchievement.emoji} {currentAchievement.title}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-16 bg-navy-700" />

          {/* Quote */}
          <div className="flex-1">
            <blockquote className="relative">
              <svg 
                className="absolute -top-2 -left-2 w-6 h-6 text-primary-500/30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-navy-200 italic pl-6">
                &ldquo;{quote.text}&rdquo;
              </p>
              <footer className="text-navy-400 text-sm mt-1 pl-6">
                — {quote.author}
              </footer>
            </blockquote>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-1 lg:flex-col">
            {achievements.slice(0, 4).map((achievement, i) => (
              <div
                key={achievement.days}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  streak >= achievement.days 
                    ? 'bg-primary-500 scale-110' 
                    : 'bg-navy-700'
                }`}
                title={`${achievement.title} - ${achievement.days} days`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}