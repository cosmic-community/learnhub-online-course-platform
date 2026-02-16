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
    title: 'Consistency beats intensity',
    content: 'Learning 30 minutes daily is more effective than 4 hours once a week. Small, regular efforts compound over time.',
    category: 'Learning Strategy'
  },
  {
    emoji: '🧠',
    title: 'Teach to learn',
    content: 'The best way to solidify knowledge is to explain it to someone else. Try writing a blog post or mentoring!',
    category: 'Deep Learning'
  },
  {
    emoji: '⌨️',
    title: 'Type it, don\'t copy it',
    content: 'When following code tutorials, type every line manually. The muscle memory helps you remember syntax better.',
    category: 'Coding Practice'
  },
  {
    emoji: '🎯',
    title: 'Build real projects',
    content: 'The gap between tutorials and real-world coding closes fastest when you build something you actually want to use.',
    category: 'Project-Based Learning'
  },
  {
    emoji: '🔍',
    title: 'Read error messages',
    content: 'Error messages are your friends! They usually tell you exactly what\'s wrong and where. Take time to read them carefully.',
    category: 'Debugging'
  },
  {
    emoji: '📝',
    title: 'Take handwritten notes',
    content: 'Writing by hand improves retention. Keep a physical notebook for key concepts and "aha!" moments.',
    category: 'Note-Taking'
  },
  {
    emoji: '🔄',
    title: 'Embrace the struggle',
    content: 'Feeling confused means you\'re learning. Push through the discomfort—that\'s where growth happens.',
    category: 'Mindset'
  },
  {
    emoji: '☕',
    title: 'Take breaks',
    content: 'Your brain consolidates learning during rest. Use the Pomodoro technique: 25 min work, 5 min break.',
    category: 'Productivity'
  },
  {
    emoji: '🤝',
    title: 'Join a community',
    content: 'Learning alongside others accelerates progress. Find a Discord, subreddit, or local meetup for your tech stack.',
    category: 'Community'
  },
  {
    emoji: '📚',
    title: 'Read source code',
    content: 'Great developers read code as much as they write it. Explore open source projects to see how pros do it.',
    category: 'Advanced Learning'
  },
  {
    emoji: '🎮',
    title: 'Make it fun',
    content: 'Gamify your learning! Set challenges, track progress, and reward yourself for completing milestones.',
    category: 'Motivation'
  },
  {
    emoji: '🌙',
    title: 'Sleep on it',
    content: 'Struggling with a problem? Sleep actually helps! Your brain processes and organizes information overnight.',
    category: 'Brain Science'
  },
  {
    emoji: '🦆',
    title: 'Rubber duck debugging',
    content: 'Explain your code to a rubber duck (or any object). Articulating the problem often reveals the solution.',
    category: 'Problem Solving'
  },
  {
    emoji: '📱',
    title: 'Learn mobile-first',
    content: 'Most users browse on mobile. Always test your projects on small screens—it\'s a crucial skill.',
    category: 'Web Development'
  },
  {
    emoji: '🔐',
    title: 'Security first',
    content: 'Never commit secrets to Git, always validate user input, and treat security as a first-class concern.',
    category: 'Best Practices'
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    
    const tipIndex = dayOfYear % tips.length
    setTip(tips[tipIndex])
  }, [])

  if (!tip || !isVisible) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/80 border border-primary-500/20 p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-xl" />
      
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 p-1 text-navy-500 hover:text-navy-300 transition-colors"
        aria-label="Dismiss tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/20 text-2xl">
            {tip.emoji}
          </div>
          <div>
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              💡 Daily Learning Tip
            </span>
            <span className="mx-2 text-navy-600">•</span>
            <span className="text-xs text-navy-500">{tip.category}</span>
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2">
          {tip.title}
        </h3>
        <p className="text-navy-300 text-sm leading-relaxed">
          {tip.content}
        </p>
        
        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-navy-500">
            New tip every day ✨
          </span>
          <button
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * tips.length)
              setTip(tips[randomIndex])
            }}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Shuffle
          </button>
        </div>
      </div>
    </div>
  )
}