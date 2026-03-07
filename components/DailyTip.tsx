'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  title: string
  content: string
  category: string
}

const tips: Tip[] = [
  {
    emoji: '💡',
    title: 'Use console.table() for arrays',
    content: 'Instead of console.log(), use console.table() to display arrays and objects in a beautiful table format in your browser console.',
    category: 'JavaScript'
  },
  {
    emoji: '⚡',
    title: 'CSS Grid is your friend',
    content: 'For complex layouts, CSS Grid often requires less code than Flexbox. Use "display: grid" with "grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))" for responsive cards.',
    category: 'CSS'
  },
  {
    emoji: '🔥',
    title: 'The nullish coalescing operator',
    content: 'Use ?? instead of || when you want to provide defaults only for null/undefined, not for falsy values like 0 or empty strings.',
    category: 'JavaScript'
  },
  {
    emoji: '🎯',
    title: 'Semantic HTML matters',
    content: 'Use <article>, <section>, <nav>, and <aside> instead of generic <div>s. It improves accessibility and SEO significantly.',
    category: 'HTML'
  },
  {
    emoji: '🚀',
    title: 'React.memo for performance',
    content: 'Wrap functional components with React.memo() to prevent unnecessary re-renders when props haven\'t changed.',
    category: 'React'
  },
  {
    emoji: '🎨',
    title: 'CSS Custom Properties',
    content: 'Use CSS variables (--my-color: blue) for theming. They cascade like other properties and can be changed with JavaScript!',
    category: 'CSS'
  },
  {
    emoji: '📦',
    title: 'Destructuring saves time',
    content: 'Use destructuring to extract multiple properties at once: const { name, email, age } = user; Clean and readable!',
    category: 'JavaScript'
  },
  {
    emoji: '🔍',
    title: 'Optional chaining rocks',
    content: 'Use ?. to safely access nested properties: user?.profile?.avatar. No more "Cannot read property of undefined" errors!',
    category: 'JavaScript'
  },
  {
    emoji: '⌨️',
    title: 'Learn keyboard shortcuts',
    content: 'In VS Code, Ctrl+D selects the next occurrence of selected text. Ctrl+Shift+L selects ALL occurrences. Game changer!',
    category: 'Productivity'
  },
  {
    emoji: '🧪',
    title: 'Test your code early',
    content: 'Write tests as you code, not after. It helps you think through edge cases and makes refactoring much safer.',
    category: 'Best Practices'
  },
  {
    emoji: '📱',
    title: 'Mobile-first CSS',
    content: 'Start with mobile styles, then use min-width media queries for larger screens. It results in cleaner, more maintainable CSS.',
    category: 'CSS'
  },
  {
    emoji: '🔐',
    title: 'Never trust user input',
    content: 'Always validate and sanitize user input on the server side, even if you validate on the client. Security is non-negotiable!',
    category: 'Security'
  },
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])
  }, [])

  if (!currentTip || !isVisible) return null

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-2xl flex-shrink-0">{currentTip.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{currentTip.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
              {currentTip.category}
            </span>
          </div>
          <p className="text-sm text-navy-400 line-clamp-1 sm:line-clamp-none">
            {currentTip.content}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-navy-500 hover:text-navy-300 transition-colors flex-shrink-0"
        aria-label="Dismiss tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}