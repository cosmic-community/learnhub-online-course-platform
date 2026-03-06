'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalDays: number
  longestStreak: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
  { text: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein" },
]

function getRandomQuote(date: Date) {
  // Use date as seed for consistent daily quote
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return motivationalQuotes[dayOfYear % motivationalQuotes.length]
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function isConsecutiveDay(lastVisit: string, today: string): boolean {
  const last = new Date(lastVisit)
  const current = new Date(today)
  const diffTime = current.getTime() - last.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

function isSameDay(lastVisit: string, today: string): boolean {
  return lastVisit === today
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const today = getDateString(new Date())
    const todayQuote = getRandomQuote(new Date())
    setQuote(todayQuote)

    const stored = localStorage.getItem('learnhub-streak')
    let data: StreakData

    if (stored) {
      data = JSON.parse(stored)
      
      if (isSameDay(data.lastVisit, today)) {
        // Same day visit, no changes
        setStreakData(data)
      } else if (isConsecutiveDay(data.lastVisit, today)) {
        // Consecutive day - increase streak!
        data.currentStreak += 1
        data.lastVisit = today
        data.totalDays += 1
        data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
        setStreakData(data)
        setIsNewStreak(true)
        setShowConfetti(true)
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      } else {
        // Streak broken - reset to 1
        data.currentStreak = 1
        data.lastVisit = today
        data.totalDays += 1
        setStreakData(data)
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        totalDays: 1,
        longestStreak: 1
      }
      setStreakData(data)
      setIsNewStreak(true)
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    // Hide confetti after animation
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  if (!mounted || !streakData || !quote) return null

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Streak & Quote Section */}
      <section className="py-12 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Streak Counter */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-4 bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6">
                <div className="relative">
                  <div className="text-6xl animate-pulse-slow">🔥</div>
                  {isNewStreak && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
                    <span className="text-navy-400 text-lg">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-primary-400 font-medium">Learning Streak</p>
                  {isNewStreak && streakData.currentStreak > 1 && (
                    <p className="text-green-400 text-sm mt-1 animate-bounce-subtle">
                      🎉 You&apos;re on fire!
                    </p>
                  )}
                </div>
              </div>
              
              {/* Mini Stats */}
              <div className="flex gap-6 mt-4 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{streakData.totalDays}</div>
                  <div className="text-xs text-navy-400">Total Days</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
              </div>
            </div>

            {/* Quote of the Day */}
            <div className="bg-navy-900/30 backdrop-blur-sm border border-navy-800 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <span className="text-4xl">💡</span>
                <div>
                  <p className="text-lg text-navy-200 italic leading-relaxed">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="text-primary-400 font-medium mt-3">— {quote.author}</p>
                  <p className="text-navy-500 text-sm mt-2">Quote of the Day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}