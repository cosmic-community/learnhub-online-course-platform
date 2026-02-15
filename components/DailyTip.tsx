'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    icon: '💡',
    title: 'Tip of the Day',
    content: 'Break complex problems into smaller, manageable pieces. It\'s the key to solving any coding challenge!',
    category: 'Problem Solving'
  },
  {
    icon: '⌨️',
    title: 'Keyboard Shortcut',
    content: 'Use Ctrl+Shift+K (Cmd+Shift+K on Mac) to delete an entire line in most code editors.',
    category: 'Productivity'
  },
  {
    icon: '🎯',
    title: 'Best Practice',
    content: 'Write code for humans first, computers second. Clear, readable code saves hours of debugging.',
    category: 'Clean Code'
  },
  {
    icon: '🔥',
    title: 'Performance Tip',
    content: 'Always lazy load images and components that are below the fold to improve initial page load.',
    category: 'Performance'
  },
  {
    icon: '🛡️',
    title: 'Security Tip',
    content: 'Never trust user input. Always validate and sanitize data on both client and server side.',
    category: 'Security'
  },
  {
    icon: '🧪',
    title: 'Testing Wisdom',
    content: 'Write tests for the behavior you want, not the implementation you have.',
    category: 'Testing'
  },
  {
    icon: '🎨',
    title: 'CSS Trick',
    content: 'Use CSS custom properties (variables) for consistent theming and easier maintenance.',
    category: 'CSS'
  },
  {
    icon: '⚡',
    title: 'Quick Win',
    content: 'Add loading states to all async operations. Your users will thank you!',
    category: 'UX'
  },
  {
    icon: '📚',
    title: 'Learning Tip',
    content: 'Teach what you learn to someone else. It\'s the fastest way to solidify your knowledge.',
    category: 'Learning'
  },
  {
    icon: '🔄',
    title: 'Git Tip',
    content: 'Commit early, commit often. Small, focused commits make code review and debugging easier.',
    category: 'Version Control'
  },
  {
    icon: '🌐',
    title: 'Web Accessibility',
    content: 'Always add alt text to images and use semantic HTML elements for better accessibility.',
    category: 'Accessibility'
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    content: 'Design mobile-first, then enhance for larger screens. It\'s easier than the other way around.',
    category: 'Responsive'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const index = dayOfYear % tips.length
    setTipIndex(index)
    setCurrentTip(tips[index])
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const newIndex = (tipIndex + 1) % tips.length
      setTipIndex(newIndex)
      setCurrentTip(tips[newIndex])
      setIsAnimating(false)
    }, 200)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const newIndex = (tipIndex - 1 + tips.length) % tips.length
      setTipIndex(newIndex)
      setCurrentTip(tips[newIndex])
      setIsAnimating(false)
    }, 200)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={prevTip}
        className="p-2 text-navy-400 hover:text-primary-400 transition-colors flex-shrink-0"
        aria-label="Previous tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className={`flex-1 flex items-center gap-4 transition-all duration-200 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <span className="text-3xl flex-shrink-0">{currentTip.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{currentTip.title}</span>
            <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full">
              {currentTip.category}
            </span>
          </div>
          <p className="text-navy-300 text-sm line-clamp-2">{currentTip.content}</p>
        </div>
      </div>
      
      <button
        onClick={nextTip}
        className="p-2 text-navy-400 hover:text-primary-400 transition-colors flex-shrink-0"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}