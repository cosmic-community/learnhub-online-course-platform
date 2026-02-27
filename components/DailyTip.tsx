'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: "💡",
    title: "Master the Fundamentals",
    content: "Before diving into frameworks, ensure you have a solid understanding of HTML, CSS, and JavaScript basics.",
    category: "Learning"
  },
  {
    emoji: "🚀",
    title: "Practice Daily",
    content: "Consistent daily practice, even for just 30 minutes, is more effective than occasional long sessions.",
    category: "Productivity"
  },
  {
    emoji: "🔧",
    title: "Build Real Projects",
    content: "The best way to learn is by building. Start with small projects and gradually increase complexity.",
    category: "Development"
  },
  {
    emoji: "📚",
    title: "Read Documentation",
    content: "Official documentation is often the best resource. Make it a habit to read docs before searching elsewhere.",
    category: "Learning"
  },
  {
    emoji: "🤝",
    title: "Join Communities",
    content: "Connect with other developers. Communities like Discord, Reddit, and Twitter are great for learning and networking.",
    category: "Career"
  },
  {
    emoji: "🎯",
    title: "Set Clear Goals",
    content: "Define what you want to achieve with each learning session. Specific goals lead to better outcomes.",
    category: "Productivity"
  },
  {
    emoji: "🔄",
    title: "Embrace Iteration",
    content: "Your first solution doesn't have to be perfect. Write working code first, then refactor and improve.",
    category: "Development"
  },
  {
    emoji: "🧪",
    title: "Test Your Code",
    content: "Writing tests helps you catch bugs early and gives you confidence when making changes.",
    category: "Development"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % tips.length
    const selectedTip = tips[tipIndex]
    if (selectedTip) {
      setTip(selectedTip)
    }
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        <div className="flex items-start gap-4">
          {/* Emoji Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
            {tip?.emoji}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
                💡 Tip of the Day
              </span>
              <span className="text-xs text-navy-500">•</span>
              <span className="text-xs text-navy-500">{tip?.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {tip?.title}
            </h3>
            <p className="text-navy-300 text-sm leading-relaxed">
              {tip?.content}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full blur-xl" />
      </div>
    </div>
  )
}