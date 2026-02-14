'use client'

import { useEffect, useState } from 'react'

interface MotivationItem {
  quote: string
  author: string
  emoji: string
}

const motivations: MotivationItem[] = [
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    emoji: "🎸"
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    emoji: "🌍"
  },
  {
    quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    emoji: "📚"
  },
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    emoji: "🌟"
  },
  {
    quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
    emoji: "🎯"
  },
  {
    quote: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford",
    emoji: "🚀"
  },
  {
    quote: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    emoji: "🎨"
  },
]

export default function DailyMotivation() {
  const [motivation, setMotivation] = useState<MotivationItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent quote for the day based on date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
      (1000 * 60 * 60 * 24)
    )
    const quoteIndex = dayOfYear % motivations.length
    setMotivation(motivations[quoteIndex] ?? motivations[0] ?? null)
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!motivation) return null

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-navy-800/50 via-navy-900/30 to-navy-800/50" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">{motivation.emoji}</span>
          <span className="text-xs uppercase tracking-wider text-primary-400 font-semibold">
            Daily Inspiration
          </span>
          <span className="text-2xl">{motivation.emoji}</span>
        </div>
        
        <blockquote className="text-xl sm:text-2xl text-white font-medium italic mb-3 leading-relaxed">
          &ldquo;{motivation.quote}&rdquo;
        </blockquote>
        
        <cite className="text-navy-400 not-italic">
          — {motivation.author}
        </cite>
      </div>
    </div>
  )
}