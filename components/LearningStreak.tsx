'use client'

import { useState, useEffect } from 'react'

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

interface LearningStreakProps {
  coursesCount: number
  lessonsCount: number
}

export default function LearningStreak({ coursesCount, lessonsCount }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [todayQuote, setTodayQuote] = useState(motivationalQuotes[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Get or set streak from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const { lastVisit, currentStreak } = JSON.parse(storedData)
      const lastDate = new Date(lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastDate === today) {
        setStreak(currentStreak)
      } else if (lastDate === yesterday) {
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify({ lastVisit: today, currentStreak: newStreak }))
        if (newStreak % 5 === 0) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        setStreak(1)
        localStorage.setItem('learnhub-streak', JSON.stringify({ lastVisit: today, currentStreak: 1 }))
      }
    } else {
      setStreak(1)
      localStorage.setItem('learnhub-streak', JSON.stringify({ lastVisit: today, currentStreak: 1 }))
    }

    // Select quote based on day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTodayQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    // Trigger animation
    setIsAnimating(true)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#2dd4bf', '#fbbf24', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-navy-900/80 via-navy-900/60 to-navy-900/80 backdrop-blur-xl border border-navy-700/50 rounded-3xl p-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Streak Counter */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className={`relative ${isAnimating ? 'animate-bounce-slow' : ''}`}>
                <span className="text-5xl filter drop-shadow-lg">🔥</span>
                {streak >= 7 && (
                  <span className="absolute -top-1 -right-1 text-2xl animate-pulse">⭐</span>
                )}
              </div>
              <div>
                <div className="text-5xl font-bold text-white tabular-nums">
                  {streak}
                </div>
                <div className="text-sm text-navy-400 uppercase tracking-wider">
                  Day Streak
                </div>
              </div>
            </div>
            <p className="text-navy-300 text-sm mt-2">
              {streak === 1 && "Great start! Keep learning daily! 🌱"}
              {streak >= 2 && streak < 7 && "You're building momentum! 💪"}
              {streak >= 7 && streak < 30 && "Incredible dedication! 🚀"}
              {streak >= 30 && "You're a learning legend! 👑"}
            </p>
          </div>

          {/* Daily Quote */}
          <div className="text-center px-4 py-6 bg-navy-800/30 rounded-2xl border border-navy-700/30">
            <div className="text-3xl mb-3">💡</div>
            <blockquote className="text-navy-200 italic text-lg leading-relaxed mb-2">
              &ldquo;{todayQuote.quote}&rdquo;
            </blockquote>
            <cite className="text-primary-400 text-sm not-italic">
              — {todayQuote.author}
            </cite>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-navy-800/40 rounded-xl p-4 text-center border border-navy-700/30 hover:border-primary-500/30 transition-colors group">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">📚</div>
              <div className="text-2xl font-bold text-white">{coursesCount}</div>
              <div className="text-xs text-navy-400">Courses Available</div>
            </div>
            <div className="bg-navy-800/40 rounded-xl p-4 text-center border border-navy-700/30 hover:border-primary-500/30 transition-colors group">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🎯</div>
              <div className="text-2xl font-bold text-white">{lessonsCount}</div>
              <div className="text-xs text-navy-400">Total Lessons</div>
            </div>
            <div className="col-span-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl p-4 text-center border border-primary-500/30">
              <div className="flex items-center justify-center gap-2 text-primary-400">
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">You&apos;re doing great!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}