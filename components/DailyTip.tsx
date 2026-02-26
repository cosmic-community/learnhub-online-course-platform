'use client'

import { useState, useEffect } from 'react'

interface LearningTip {
  category: string
  categoryEmoji: string
  tip: string
  source?: string
}

const dailyTips: LearningTip[] = [
  {
    category: 'JavaScript',
    categoryEmoji: '💛',
    tip: 'Use optional chaining (?.) to safely access nested properties without worrying about undefined errors.',
    source: 'ES2020',
  },
  {
    category: 'React',
    categoryEmoji: '⚛️',
    tip: 'Always use keys when rendering lists - they help React identify which items have changed, been added, or removed.',
  },
  {
    category: 'CSS',
    categoryEmoji: '🎨',
    tip: 'The clamp() function lets you set a responsive value with min and max bounds: clamp(1rem, 5vw, 3rem)',
  },
  {
    category: 'TypeScript',
    categoryEmoji: '📘',
    tip: 'Use "unknown" instead of "any" when you need a type-safe alternative - it forces you to check the type before using it.',
  },
  {
    category: 'Git',
    categoryEmoji: '🌿',
    tip: 'Use "git stash" to save your work-in-progress changes and switch branches without committing.',
  },
  {
    category: 'Performance',
    categoryEmoji: '⚡',
    tip: 'Lazy load images and components that are below the fold to improve initial page load time.',
  },
  {
    category: 'Accessibility',
    categoryEmoji: '♿',
    tip: 'Always provide alt text for images. Screen readers depend on it to describe visual content.',
  },
  {
    category: 'Node.js',
    categoryEmoji: '💚',
    tip: 'Use async/await with try-catch for cleaner error handling instead of nested .then().catch() chains.',
  },
  {
    category: 'Database',
    categoryEmoji: '🗃️',
    tip: 'Index your frequently queried columns - it can improve query performance by orders of magnitude.',
  },
  {
    category: 'Security',
    categoryEmoji: '🔒',
    tip: 'Never store sensitive data in localStorage - it\'s accessible to any script on your page.',
  },
  {
    category: 'API Design',
    categoryEmoji: '🔌',
    tip: 'Use proper HTTP status codes: 200 for success, 201 for created, 400 for bad request, 404 for not found.',
  },
  {
    category: 'Testing',
    categoryEmoji: '🧪',
    tip: 'Write tests for the behavior, not the implementation. Your tests should survive refactoring.',
  },
  {
    category: 'Career',
    categoryEmoji: '📈',
    tip: 'Build projects that solve real problems. They make better portfolio pieces than tutorial clones.',
  },
  {
    category: 'Productivity',
    categoryEmoji: '🎯',
    tip: 'Use the Pomodoro technique: 25 minutes of focused work, 5 minutes break. It boosts productivity!',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<LearningTip | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Get tip based on the day of year for consistency
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % dailyTips.length
    
    setTip(dailyTips[tipIndex] ?? dailyTips[0])
  }, [])

  if (!tip) return null

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`
            relative overflow-hidden rounded-xl 
            bg-gradient-to-r from-navy-800/80 to-navy-900/80 
            border border-navy-700/50
            transition-all duration-300
            ${isExpanded ? 'p-6' : 'p-4'}
          `}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 text-8xl opacity-5 -translate-y-1/4 translate-x-1/4">
            💡
          </div>
          
          <div className="relative flex items-start gap-4">
            {/* Light bulb icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-2xl animate-pulse-slow">💡</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                    Daily Learning Tip
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-700/50 text-xs text-navy-300">
                    {tip.categoryEmoji} {tip.category}
                  </span>
                </div>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-navy-400 hover:text-navy-200 transition-colors p-1"
                  aria-label={isExpanded ? 'Collapse tip' : 'Expand tip'}
                >
                  <svg 
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {isExpanded && (
                <div className="animate-fadeIn">
                  <p className="text-white text-lg leading-relaxed">
                    {tip.tip}
                  </p>
                  {tip.source && (
                    <span className="inline-block mt-2 text-xs text-navy-400">
                      Source: {tip.source}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}