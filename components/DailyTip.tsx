'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Use const by default',
    content: 'In JavaScript/TypeScript, prefer const over let. Only use let when you need to reassign the variable.',
    category: 'JavaScript'
  },
  {
    emoji: '🎯',
    title: 'Learn in public',
    content: 'Share what you learn! Teaching others reinforces your own understanding and builds your network.',
    category: 'Career'
  },
  {
    emoji: '⚡',
    title: 'Keyboard shortcuts',
    content: 'Learn your IDE\'s keyboard shortcuts. Cmd/Ctrl+P opens quick file search in VS Code!',
    category: 'Productivity'
  },
  {
    emoji: '🔍',
    title: 'Read error messages',
    content: 'Error messages often contain the solution. Read them carefully before searching online.',
    category: 'Debugging'
  },
  {
    emoji: '📝',
    title: 'Write comments wisely',
    content: 'Comment WHY, not WHAT. Code should be self-explanatory for what it does.',
    category: 'Best Practices'
  },
  {
    emoji: '🚀',
    title: 'Start small',
    content: 'Break large tasks into smaller ones. Completing small wins builds momentum.',
    category: 'Productivity'
  },
  {
    emoji: '🧪',
    title: 'Test your code',
    content: 'Write tests for critical paths. Even simple tests catch bugs before users do.',
    category: 'Testing'
  },
  {
    emoji: '📚',
    title: 'Read documentation',
    content: 'Official docs are often better than Stack Overflow. Start there first!',
    category: 'Learning'
  },
  {
    emoji: '🎨',
    title: 'Consistent naming',
    content: 'Use clear, consistent naming conventions. Your future self will thank you.',
    category: 'Best Practices'
  },
  {
    emoji: '💪',
    title: 'Practice daily',
    content: '30 minutes of coding every day beats 5 hours once a week. Consistency wins.',
    category: 'Learning'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Get a "daily" tip based on the day of year (changes daily)
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTip(dayOfYear % tips.length)
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
      setIsAnimating(false)
    }, 150)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
      setIsAnimating(false)
    }, 150)
  }

  const tip = tips[currentTip]

  return (
    <section className="py-8 border-y border-navy-800 bg-gradient-to-r from-primary-500/5 via-navy-900/50 to-primary-500/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={prevTip}
            className="p-2 text-navy-400 hover:text-white transition-colors hidden sm:block"
            aria-label="Previous tip"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className={`flex-1 flex items-center gap-4 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{tip?.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">💡 Daily Tip</span>
                <span className="text-xs text-navy-500">•</span>
                <span className="text-xs text-navy-500">{tip?.category}</span>
              </div>
              <h3 className="text-white font-semibold truncate">{tip?.title}</h3>
              <p className="text-navy-400 text-sm line-clamp-1">{tip?.content}</p>
            </div>
          </div>

          <button
            onClick={nextTip}
            className="p-2 text-navy-400 hover:text-white transition-colors"
            aria-label="Next tip"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => {
                  setCurrentTip(index)
                  setIsAnimating(false)
                }, 150)
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentTip
                  ? 'bg-primary-400 w-4'
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}