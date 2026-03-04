'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  title: string
  content: string
  category: string
}

const TIPS: Tip[] = [
  {
    emoji: '💡',
    title: 'Console.log like a pro',
    content: 'Use console.table() to display arrays and objects in a nice table format in your browser console!',
    category: 'JavaScript'
  },
  {
    emoji: '🎨',
    title: 'CSS Grid shortcut',
    content: 'Use "place-items: center" to center items both horizontally and vertically in a grid container.',
    category: 'CSS'
  },
  {
    emoji: '⚡',
    title: 'Destructuring tip',
    content: 'You can rename variables while destructuring: const { name: userName } = user;',
    category: 'JavaScript'
  },
  {
    emoji: '🔥',
    title: 'Optional chaining',
    content: 'Use ?. to safely access nested properties: user?.address?.city avoids "cannot read property" errors.',
    category: 'JavaScript'
  },
  {
    emoji: '🚀',
    title: 'Array methods',
    content: 'Array.from() can create arrays from iterables AND transform them: Array.from({length: 5}, (_, i) => i*2)',
    category: 'JavaScript'
  },
  {
    emoji: '🎯',
    title: 'TypeScript tip',
    content: 'Use "as const" to infer literal types: const colors = ["red", "blue"] as const;',
    category: 'TypeScript'
  },
  {
    emoji: '🌈',
    title: 'CSS Variables',
    content: 'CSS variables cascade! Set --color: blue on a parent and override it with --color: red on children.',
    category: 'CSS'
  },
  {
    emoji: '⭐',
    title: 'Template literals',
    content: 'Tagged template literals can transform strings: html`<div>${content}</div>` for custom processing.',
    category: 'JavaScript'
  },
  {
    emoji: '🔧',
    title: 'Debug faster',
    content: 'Add "debugger;" in your code to automatically pause execution at that point when DevTools is open.',
    category: 'Debugging'
  },
  {
    emoji: '📦',
    title: 'Nullish coalescing',
    content: 'Use ?? instead of || when 0 or empty string are valid values: count ?? 10 (keeps 0, unlike ||)',
    category: 'JavaScript'
  },
  {
    emoji: '🎪',
    title: 'Flexbox trick',
    content: 'Use "gap" in flexbox! No more margin hacks: display: flex; gap: 1rem;',
    category: 'CSS'
  },
  {
    emoji: '🔮',
    title: 'Async/await tip',
    content: 'Use Promise.allSettled() when you want all promises to complete, even if some reject.',
    category: 'JavaScript'
  },
  {
    emoji: '🎭',
    title: 'React tip',
    content: 'Use React.lazy() with Suspense for code-splitting: const Component = React.lazy(() => import("./Component"))',
    category: 'React'
  },
  {
    emoji: '🌟',
    title: 'Object shorthand',
    content: 'When property name matches variable name, use shorthand: { name, age } instead of { name: name, age: age }',
    category: 'JavaScript'
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency across sessions
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % TIPS.length
    setTip(TIPS[tipIndex] ?? TIPS[0])
  }, [])

  if (!tip) return null

  return (
    <div 
      className="tip-card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl float-animation">{tip.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
              {tip.category}
            </span>
            <span className="text-xs text-navy-500">Tip of the Day</span>
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">{tip.title}</h3>
          <p className={`text-navy-300 text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
            {tip.content}
          </p>
        </div>
        <button 
          className="text-navy-500 hover:text-navy-300 transition-colors p-1"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}