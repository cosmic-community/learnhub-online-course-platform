'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  category: string
  title: string
  content: string
  codeSnippet?: string
}

const LEARNING_TIPS: Tip[] = [
  {
    emoji: '💡',
    category: 'Pro Tip',
    title: 'Use console.table() for Better Debugging',
    content: 'Instead of console.log() for arrays and objects, try console.table() for a cleaner, more readable output in your browser devtools.',
    codeSnippet: 'console.table(users)'
  },
  {
    emoji: '🚀',
    category: 'Performance',
    title: 'Lazy Load Your Components',
    content: 'Use dynamic imports and React.lazy() to split your code and load components only when needed, improving initial page load time.',
    codeSnippet: "const Component = lazy(() => import('./Component'))"
  },
  {
    emoji: '🎯',
    category: 'Best Practice',
    title: 'Name Your Functions Descriptively',
    content: 'Good function names act as documentation. Instead of "handleClick", try "handleUserProfileUpdate" to make your code self-documenting.',
  },
  {
    emoji: '⚡',
    category: 'Quick Win',
    title: 'Master Keyboard Shortcuts',
    content: 'Press Cmd/Ctrl + K to quickly search and navigate. Learning IDE shortcuts can save you hours every week!',
  },
  {
    emoji: '🔧',
    category: 'Tool Tip',
    title: 'Use Git Stash for Quick Context Switching',
    content: 'Working on something when a bug comes in? Use "git stash" to save your changes temporarily and "git stash pop" to restore them.',
    codeSnippet: 'git stash && git checkout main'
  },
  {
    emoji: '📚',
    category: 'Learning',
    title: 'The Feynman Technique',
    content: 'To truly learn something, try explaining it to someone else (or rubber duck). If you can\'t explain it simply, you don\'t understand it well enough.',
  },
  {
    emoji: '🎨',
    category: 'CSS Magic',
    title: 'Aspect Ratio Made Easy',
    content: 'Use the aspect-ratio CSS property to maintain proportions without padding hacks. Perfect for responsive images and videos!',
    codeSnippet: '.video { aspect-ratio: 16/9; }'
  },
  {
    emoji: '🧠',
    category: 'Productivity',
    title: 'Take Strategic Breaks',
    content: 'The Pomodoro Technique (25 min work, 5 min break) helps maintain focus. Your brain often solves problems during rest!',
  },
  {
    emoji: '🔒',
    category: 'Security',
    title: 'Never Trust User Input',
    content: 'Always validate and sanitize user input on both client AND server side. This prevents XSS attacks and SQL injection.',
  },
  {
    emoji: '✨',
    category: 'Modern JS',
    title: 'Optional Chaining Saves Lines',
    content: 'Use ?. to safely access nested properties without multiple null checks. Clean code, fewer bugs!',
    codeSnippet: 'const city = user?.address?.city ?? "Unknown"'
  },
  {
    emoji: '🎭',
    category: 'TypeScript',
    title: 'Type Your API Responses',
    content: 'Create interfaces for API responses to catch errors at compile time and get better autocomplete support.',
  },
  {
    emoji: '📦',
    category: 'Architecture',
    title: 'Keep Components Small',
    content: 'If a component is over 200 lines, consider splitting it. Small, focused components are easier to test and reuse.',
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Get today's tip based on the day of the year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const initialIndex = dayOfYear % LEARNING_TIPS.length
    setTipIndex(initialIndex)
    setCurrentTip(LEARNING_TIPS[initialIndex])
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const newIndex = (tipIndex + 1) % LEARNING_TIPS.length
      setTipIndex(newIndex)
      setCurrentTip(LEARNING_TIPS[newIndex])
      setIsAnimating(false)
    }, 200)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const newIndex = tipIndex === 0 ? LEARNING_TIPS.length - 1 : tipIndex - 1
      setTipIndex(newIndex)
      setCurrentTip(LEARNING_TIPS[newIndex])
      setIsAnimating(false)
    }, 200)
  }

  if (!currentTip) return null

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h3 className="text-lg font-semibold text-white">Daily Learning Tip</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevTip}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
            aria-label="Previous tip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-navy-500 text-sm">
            {tipIndex + 1} / {LEARNING_TIPS.length}
          </span>
          <button
            onClick={nextTip}
            className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
            aria-label="Next tip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`card p-6 transition-all duration-200 ${
          isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{currentTip.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-primary-500/20 text-primary-400 text-xs">
                {currentTip.category}
              </span>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">{currentTip.title}</h4>
            <p className="text-navy-300 mb-3">{currentTip.content}</p>
            {currentTip.codeSnippet && (
              <div className="bg-navy-800 rounded-lg px-4 py-2 font-mono text-sm text-primary-300 overflow-x-auto">
                {currentTip.codeSnippet}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}