'use client'

import { useState, useEffect } from 'react'

const motivationalQuotes = [
  { quote: "The only way to do great work is to love what you learn.", author: "Inspired by Steve Jobs" },
  { quote: "Every expert was once a beginner.", author: "Helen Hayes" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
]

const achievements = [
  { icon: '🌟', label: 'First Steps', desc: 'Start your learning journey' },
  { icon: '📚', label: 'Bookworm', desc: 'Complete 3 lessons' },
  { icon: '🎯', label: 'Focused', desc: 'Finish a course' },
  { icon: '🏆', label: 'Champion', desc: 'Master all beginner courses' },
]

export default function LearningMotivation() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check for learning streak in localStorage
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const storedStreak = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (lastVisit === today) {
      setStreak(parseInt(storedStreak || '1'))
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = parseInt(storedStreak || '0') + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
      } else {
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      }
      localStorage.setItem('learnhub-last-visit', today)
    }

    // Rotate quotes
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 8000)

    // Intersection observer for animation
    const timer = setTimeout(() => setIsVisible(true), 100)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  const getStreakMessage = () => {
    if (streak >= 7) return "🔥 You're on fire! 7+ day streak!"
    if (streak >= 3) return "💪 Great momentum! 3+ day streak!"
    if (streak >= 1) return "👋 Welcome back! Keep it going!"
    return "🌟 Start your learning streak today!"
  }

  const getStreakEmoji = () => {
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '💪'
    return '⭐'
  }

  return (
    <section className={`py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Streak Card */}
          <div className="card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Your Learning Streak</h3>
                <span className="text-3xl">{getStreakEmoji()}</span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-primary-400">{streak}</span>
                <span className="text-navy-400">{streak === 1 ? 'day' : 'days'}</span>
              </div>
              
              <p className="text-navy-300 mb-4">{getStreakMessage()}</p>
              
              {/* Mini calendar visualization */}
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                      i < streak 
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                        : 'bg-navy-800 text-navy-500 border border-navy-700'
                    }`}
                  >
                    {i < streak ? '✓' : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quote Card */}
          <div className="card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-semibold text-white">Daily Inspiration</h3>
              </div>
              
              <blockquote className="relative">
                <span className="absolute -top-2 -left-2 text-4xl text-primary-500/20">"</span>
                <p className="text-navy-200 text-lg italic pl-6 transition-opacity duration-500">
                  {motivationalQuotes[currentQuote].quote}
                </p>
                <footer className="mt-4 pl-6 text-navy-400">
                  — {motivationalQuotes[currentQuote].author}
                </footer>
              </blockquote>
            </div>
            
            {/* Quote dots */}
            <div className="flex gap-2 justify-center mt-6">
              {motivationalQuotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuote(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentQuote ? 'bg-primary-500 w-6' : 'bg-navy-600 hover:bg-navy-500'
                  }`}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Preview */}
        <div className="mt-8 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl">🏅</span>
              Achievements to Unlock
            </h3>
            <span className="text-sm text-navy-400">0/{achievements.length} unlocked</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700 opacity-60 hover:opacity-80 transition-opacity cursor-not-allowed"
              >
                <div className="text-3xl mb-2 grayscale">{achievement.icon}</div>
                <div className="font-medium text-navy-300 text-sm">{achievement.label}</div>
                <div className="text-xs text-navy-500 mt-1">{achievement.desc}</div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-navy-500 text-sm mt-6">
            Start taking courses to unlock achievements! 🎮
          </p>
        </div>
      </div>
    </section>
  )
}