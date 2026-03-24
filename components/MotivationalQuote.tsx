'use client'

import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
  emoji: string
}

const QUOTES: Quote[] = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes", emoji: "🌱" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams", emoji: "🔥" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King", emoji: "💎" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", emoji: "🌟" },
  { text: "The more I learn, the more I realize how much I don't know.", author: "Albert Einstein", emoji: "🧠" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey", emoji: "🎯" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", emoji: "💡" },
  { text: "The only person who is educated is the one who has learned how to learn.", author: "Carl Rogers", emoji: "📚" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci", emoji: "✨" },
  { text: "Anyone who stops learning is old. Anyone who keeps learning stays young.", author: "Henry Ford", emoji: "🚀" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert", emoji: "🎁" },
  { text: "In learning you will teach, and in teaching you will learn.", author: "Phil Collins", emoji: "🔄" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo", emoji: "🌳" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", emoji: "🔥" },
]

function getDailyQuote(): Quote {
  // Use day of year as seed for consistent daily quote
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / 86400000)
  const index = dayOfYear % QUOTES.length
  return QUOTES[index] ?? QUOTES[0]
}

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setQuote(getDailyQuote())
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10" />
      <div className="relative bg-navy-900/30 backdrop-blur-sm border border-navy-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl flex-shrink-0">{quote.emoji}</span>
          <div>
            <p className="text-lg text-navy-200 italic mb-2 leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-sm text-primary-400 font-medium">
              — {quote.author}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      </div>
    </div>
  )
}