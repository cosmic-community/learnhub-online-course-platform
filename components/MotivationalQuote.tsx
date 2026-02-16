'use client'

import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
  emoji: string
}

const quotes: Quote[] = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes", emoji: "🌱" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams", emoji: "📚" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King", emoji: "💎" },
  { text: "Education is the passport to the future.", author: "Malcolm X", emoji: "🎓" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss", emoji: "📖" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", emoji: "✨" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", emoji: "💰" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", emoji: "🎯" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert", emoji: "🎁" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci", emoji: "🧠" },
  { text: "Anyone who stops learning is old. Anyone who keeps learning stays young.", author: "Henry Ford", emoji: "🌟" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers", emoji: "🦋" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo", emoji: "🌳" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", emoji: "⚡" }
]

function getDailyQuote(): Quote {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const index = dayOfYear % quotes.length
  return quotes[index] ?? quotes[0]
}

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setQuote(getDailyQuote())
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-navy-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNGI4YTYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="relative p-8 text-center">
        <span className="text-4xl mb-4 block">{quote.emoji}</span>
        <blockquote className="text-xl md:text-2xl text-white font-light leading-relaxed mb-4 italic">
          "{quote.text}"
        </blockquote>
        <cite className="text-navy-400 not-italic flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-navy-600" />
          {quote.author}
          <span className="w-8 h-px bg-navy-600" />
        </cite>
        <p className="text-xs text-navy-500 mt-4">Daily motivation • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  )
}