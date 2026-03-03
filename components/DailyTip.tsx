'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  title: string
  content: string
  category: string
}

const DAILY_TIPS: Tip[] = [
  {
    emoji: '💡',
    title: 'Use console.table() for arrays',
    content: 'When debugging arrays of objects, console.table() displays data in a beautiful table format!',
    category: 'JavaScript'
  },
  {
    emoji: '🎨',
    title: 'CSS Grid is your friend',
    content: 'Use "display: grid; place-items: center;" to perfectly center anything in one line!',
    category: 'CSS'
  },
  {
    emoji: '⚡',
    title: 'Lazy load images',
    content: 'Add loading="lazy" to img tags to defer offscreen images and improve page speed.',
    category: 'Performance'
  },
  {
    emoji: '🔐',
    title: 'Never trust user input',
    content: 'Always validate and sanitize user input on the server side, even if validated on the client.',
    category: 'Security'
  },
  {
    emoji: '📦',
    title: 'Keep dependencies updated',
    content: 'Run npm audit regularly to check for security vulnerabilities in your dependencies.',
    category: 'DevOps'
  },
  {
    emoji: '🧪',
    title: 'Test edge cases',
    content: 'Empty arrays, null values, and extreme numbers often reveal hidden bugs. Test them!',
    category: 'Testing'
  },
  {
    emoji: '📝',
    title: 'Write self-documenting code',
    content: 'Good variable names often eliminate the need for comments. Name things by what they do!',
    category: 'Best Practices'
  },
  {
    emoji: '🚀',
    title: 'Learn keyboard shortcuts',
    content: 'Mastering your IDE shortcuts can save hours per week. Start with 3 new ones today!',
    category: 'Productivity'
  },
  {
    emoji: '🔄',
    title: 'Git commit often',
    content: 'Small, frequent commits with clear messages make debugging and reverting much easier.',
    category: 'Git'
  },
  {
    emoji: '🎯',
    title: 'Focus on fundamentals',
    content: 'Frameworks change, but understanding core concepts (algorithms, data structures) lasts forever.',
    category: 'Career'
  },
  {
    emoji: '🌐',
    title: 'Learn the network tab',
    content: 'Browser DevTools Network tab is invaluable for debugging API calls and performance issues.',
    category: 'Debugging'
  },
  {
    emoji: '♻️',
    title: 'DRY but not too dry',
    content: "Don't Repeat Yourself is good, but some duplication is better than the wrong abstraction.",
    category: 'Architecture'
  },
  {
    emoji: '🎭',
    title: 'Use TypeScript interfaces',
    content: 'Defining interfaces for your data shapes catches bugs at compile time, not runtime.',
    category: 'TypeScript'
  },
  {
    emoji: '📱',
    title: 'Mobile-first design',
    content: 'Start with mobile styles and add complexity for larger screens. It leads to cleaner CSS.',
    category: 'Responsive Design'
  },
  {
    emoji: '🧹',
    title: 'Clean up useEffects',
    content: 'Always return a cleanup function from useEffect when setting up subscriptions or timers.',
    category: 'React'
  },
  {
    emoji: '🔍',
    title: 'Use semantic HTML',
    content: 'nav, main, article, section - semantic tags improve accessibility and SEO automatically.',
    category: 'HTML'
  },
  {
    emoji: '⏰',
    title: 'Take breaks',
    content: 'The Pomodoro technique (25 min work, 5 min break) can significantly boost your focus.',
    category: 'Wellness'
  },
  {
    emoji: '🤝',
    title: 'Code reviews matter',
    content: "Review others' code as carefully as you'd want yours reviewed. Everyone learns!",
    category: 'Collaboration'
  },
  {
    emoji: '📊',
    title: 'Measure before optimizing',
    content: "Profile your code before optimizing. You might be surprised where the real bottlenecks are.",
    category: 'Performance'
  },
  {
    emoji: '🎓',
    title: 'Teach what you learn',
    content: 'Explaining concepts to others is the best way to solidify your own understanding.',
    category: 'Learning'
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a tip based on the day of year (so it changes daily but is consistent throughout the day)
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const tipIndex = dayOfYear % DAILY_TIPS.length
    
    setTip(DAILY_TIPS[tipIndex] ?? DAILY_TIPS[0] ?? null)
  }, [])

  if (!tip || !isVisible) return null

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              Daily Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-400">{tip.category}</span>
          </div>
          <p className="text-sm text-navy-200">
            <span className="font-semibold text-white">{tip.title}:</span>{' '}
            {tip.content}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-navy-400 hover:text-white transition-colors p-1 flex-shrink-0"
        aria-label="Dismiss tip"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}