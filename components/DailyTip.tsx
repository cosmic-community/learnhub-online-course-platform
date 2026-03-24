'use client'

import { useState, useEffect } from 'react'
import type { Instructor } from '@/types'

interface DailyTipProps {
  instructors: Instructor[]
}

// Curated learning tips that rotate daily
const learningTips = [
  {
    tip: "The best way to learn coding is by building real projects. Start small, then gradually increase complexity.",
    category: "Practice",
    emoji: "🛠️"
  },
  {
    tip: "Take breaks! The Pomodoro technique (25 min work, 5 min break) can dramatically improve focus and retention.",
    category: "Productivity",
    emoji: "⏰"
  },
  {
    tip: "Don't just watch tutorials—pause and code along. Active learning beats passive watching every time.",
    category: "Active Learning",
    emoji: "⌨️"
  },
  {
    tip: "When stuck on a bug, explain your problem out loud (rubber duck debugging). Often the solution becomes clear.",
    category: "Debugging",
    emoji: "🦆"
  },
  {
    tip: "Learn in public! Share your progress on social media. Teaching others reinforces your own understanding.",
    category: "Community",
    emoji: "🌐"
  },
  {
    tip: "Focus on understanding concepts deeply rather than memorizing syntax. The docs are always there for reference.",
    category: "Fundamentals",
    emoji: "🧠"
  },
  {
    tip: "Consistency beats intensity. 30 minutes of daily practice is better than 5 hours once a week.",
    category: "Habits",
    emoji: "📈"
  },
  {
    tip: "Read other people's code! GitHub is a treasure trove of learning opportunities. Study how experts structure their projects.",
    category: "Code Review",
    emoji: "👀"
  },
  {
    tip: "Don't fear errors—they're your best teachers. Each bug you fix makes you a stronger developer.",
    category: "Mindset",
    emoji: "💪"
  },
  {
    tip: "Build a portfolio as you learn. Future employers want to see what you can create, not just certificates.",
    category: "Career",
    emoji: "💼"
  }
]

export default function DailyTip({ instructors }: DailyTipProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBookmark, setShowBookmark] = useState(false)
  
  // Get today's tip based on day of year
  const getDayOfYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }

  const todaysTip = learningTips[getDayOfYear() % learningTips.length]
  
  // Get a featured instructor for the tip attribution
  const featuredInstructor = instructors.length > 0 
    ? instructors[getDayOfYear() % instructors.length]
    : null

  useEffect(() => {
    // Subtle entrance animation
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleBookmark = () => {
    setShowBookmark(true)
    // Save to localStorage
    const savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]')
    if (!savedTips.includes(todaysTip.tip)) {
      savedTips.push(todaysTip.tip)
      localStorage.setItem('savedTips', JSON.stringify(savedTips))
    }
    setTimeout(() => setShowBookmark(false), 2000)
  }

  return (
    <div 
      className={`card p-6 relative overflow-hidden transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{todaysTip.emoji}</span>
            <div>
              <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
                Daily Learning Tip
              </h3>
              <span className="text-xs text-navy-500">{todaysTip.category}</span>
            </div>
          </div>
          <button
            onClick={handleBookmark}
            className="p-2 rounded-lg hover:bg-navy-800 transition-colors group"
            title="Save tip"
          >
            {showBookmark ? (
              <span className="text-primary-400 text-sm">Saved! ✓</span>
            ) : (
              <svg 
                className="w-5 h-5 text-navy-400 group-hover:text-primary-400 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        </div>

        <blockquote className="text-white text-lg font-medium leading-relaxed mb-4">
          "{todaysTip.tip}"
        </blockquote>

        {featuredInstructor && (
          <div className="flex items-center gap-3 pt-4 border-t border-navy-800">
            {featuredInstructor.metadata?.photo?.imgix_url && (
              <img
                src={`${featuredInstructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                alt={featuredInstructor.metadata?.name || featuredInstructor.title}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <div className="text-sm text-navy-300">Inspired by</div>
              <div className="text-white font-medium">
                {featuredInstructor.metadata?.name || featuredInstructor.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}