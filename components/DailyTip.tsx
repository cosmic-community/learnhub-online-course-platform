'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    title: 'Code Tip of the Day',
    tip: 'Use const for variables that won\'t be reassigned, and let for those that will. Avoid var in modern JavaScript.',
    category: 'JavaScript'
  },
  {
    emoji: '🎨',
    title: 'CSS Tip of the Day',
    tip: 'Use CSS Grid for 2D layouts and Flexbox for 1D layouts. They work great together!',
    category: 'CSS'
  },
  {
    emoji: '⚡',
    title: 'Performance Tip',
    tip: 'Lazy load images that are below the fold to improve initial page load time significantly.',
    category: 'Performance'
  },
  {
    emoji: '🔒',
    title: 'Security Tip',
    tip: 'Always sanitize user input and use parameterized queries to prevent SQL injection attacks.',
    category: 'Security'
  },
  {
    emoji: '🧪',
    title: 'Testing Tip',
    tip: 'Write tests for edge cases first - they often reveal the most bugs!',
    category: 'Testing'
  },
  {
    emoji: '📱',
    title: 'Responsive Design Tip',
    tip: 'Design mobile-first, then progressively enhance for larger screens.',
    category: 'Design'
  },
  {
    emoji: '🚀',
    title: 'Productivity Tip',
    tip: 'Learn keyboard shortcuts for your IDE - they can save hours over time!',
    category: 'Productivity'
  },
  {
    emoji: '🔄',
    title: 'Git Tip',
    tip: 'Make small, frequent commits with clear messages. Your future self will thank you!',
    category: 'Git'
  },
  {
    emoji: '🎯',
    title: 'TypeScript Tip',
    tip: 'Use strict mode in TypeScript to catch more potential errors at compile time.',
    category: 'TypeScript'
  },
  {
    emoji: '🌐',
    title: 'API Tip',
    tip: 'Use appropriate HTTP status codes - 200 for success, 201 for created, 400 for bad request, 404 for not found.',
    category: 'API'
  }
]

export default function DailyTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Get a consistent daily tip based on the date
  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % tips.length)
  }, [])

  const currentTip = tips[tipIndex]

  const handleNextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
      setIsAnimating(false)
    }, 150)
  }

  const handlePrevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
      setIsAnimating(false)
    }, 150)
  }

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <button
        onClick={handlePrevTip}
        className="p-2 rounded-lg text-navy-400 hover:text-white hover:bg-navy-800 transition-colors flex-shrink-0"
        aria-label="Previous tip"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className={`flex-1 flex items-center gap-4 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-2xl">
          {currentTip?.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-white">{currentTip?.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-navy-400">
              {currentTip?.category}
            </span>
          </div>
          <p className="text-sm text-navy-300 truncate sm:whitespace-normal">
            {currentTip?.tip}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleNextTip}
        className="p-2 rounded-lg text-navy-400 hover:text-white hover:bg-navy-800 transition-colors flex-shrink-0"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}