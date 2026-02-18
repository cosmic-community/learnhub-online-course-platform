'use client'

import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
  emoji: string
}

const quotes: Quote[] = [
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King", emoji: "🎸" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X", emoji: "🎓" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss", emoji: "📚" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", emoji: "🌟" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert", emoji: "🎯" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", emoji: "💡" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford", emoji: "🚀" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes", emoji: "🌱" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci", emoji: "🎨" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers", emoji: "🔄" },
  { text: "In learning you will teach, and in teaching you will learn.", author: "Phil Collins", emoji: "🤝" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", emoji: "🔥" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", emoji: "💪" },
  { text: "Every master was once a disaster.", author: "T. Harv Eker", emoji: "🏆" },
]

export default function DailyMotivation() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const [timeOfDay, setTimeOfDay] = useState('')

  useEffect(() => {
    // Get today's quote based on date (consistent throughout the day)
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])

    // Determine time of day for greeting
    const hour = today.getHours()
    if (hour < 12) {
      setTimeOfDay('Good morning')
    } else if (hour < 17) {
      setTimeOfDay('Good afternoon')
    } else {
      setTimeOfDay('Good evening')
    }

    // Trigger animation
    setTimeout(() => setIsAnimating(false), 500)
  }, [])

  const getGreetingEmoji = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '🌅'
    if (hour < 17) return '☀️'
    return '🌙'
  }

  if (!quote) return null

  return (
    <div className={`card p-6 bg-gradient-to-br from-navy-900/80 to-navy-900/50 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      {/* Greeting */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{getGreetingEmoji()}</span>
        <span className="text-navy-300">{timeOfDay}, learner!</span>
      </div>

      {/* Quote */}
      <div className="relative">
        <div className="absolute -top-2 -left-2 text-4xl text-primary-500/20">"</div>
        <blockquote className="pl-6 pr-4 py-2">
          <p className="text-lg text-white leading-relaxed mb-3 italic">
            {quote.text}
          </p>
          <footer className="flex items-center gap-2 text-navy-400">
            <span className="text-xl">{quote.emoji}</span>
            <span>— {quote.author}</span>
          </footer>
        </blockquote>
        <div className="absolute -bottom-2 -right-2 text-4xl text-primary-500/20 rotate-180">"</div>
      </div>

      {/* Quick Action */}
      <div className="mt-6 pt-4 border-t border-navy-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-navy-400">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Daily inspiration refreshes at midnight</span>
          </div>
          <button
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: 'Daily Learning Quote',
                  text: `"${quote.text}" — ${quote.author}`,
                })
              } else {
                navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`)
                alert('Quote copied to clipboard!')
              }
            }}
            className="text-primary-400 hover:text-primary-300 transition-colors text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  )
}