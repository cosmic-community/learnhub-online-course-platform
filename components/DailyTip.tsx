'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'

interface DailyTipProps {
  categories: Category[]
}

const learningTips = [
  { icon: '💡', tip: "Consistency beats intensity. Just 30 minutes daily leads to mastery!" },
  { icon: '🎯', tip: "Set micro-goals. Complete one lesson today, build momentum tomorrow." },
  { icon: '🧠', tip: "Teaching others is the best way to learn. Share what you discover!" },
  { icon: '⏰', tip: "Your brain learns best with breaks. Try the Pomodoro technique!" },
  { icon: '📝', tip: "Take notes by hand—it improves retention by 30%." },
  { icon: '🔄', tip: "Review yesterday's lesson before starting today's. It cements knowledge!" },
  { icon: '🌟', tip: "Don't just watch—code along! Active learning is 10x more effective." },
  { icon: '🚀', tip: "Build projects! Portfolio pieces matter more than certificates." },
  { icon: '🤝', tip: "Join a community. Learning with others accelerates growth." },
  { icon: '💪', tip: "Struggle is learning. If it feels hard, you're growing!" },
]

const categoryTips: Record<string, string[]> = {
  'web-development': [
    "Master the fundamentals: HTML, CSS, and JavaScript are your foundation.",
    "Learn Git early—version control is essential for every developer.",
    "Build responsive designs from the start. Mobile-first is the way!",
  ],
  'cloud-computing': [
    "Start with one cloud provider and master it before branching out.",
    "Security first! Always encrypt data and use IAM roles properly.",
    "Automate everything you do twice. Infrastructure as Code saves time!",
  ],
  'mobile-development': [
    "Learn one platform deeply before going cross-platform.",
    "Focus on UX—users abandon apps with poor interfaces in seconds.",
    "Always test on real devices, not just emulators!",
  ],
  'data-science': [
    "Clean data is more valuable than complex algorithms.",
    "Start with visualization—seeing patterns is half the battle!",
    "Document your analysis. Future-you will thank present-you.",
  ],
}

export default function DailyTip({ categories }: DailyTipProps) {
  const [currentTip, setCurrentTip] = useState({ icon: '💡', tip: '' })
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Get the day of year to select a consistent daily tip
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    
    // Mix in category-specific tips
    let allTips = [...learningTips]
    categories.forEach(category => {
      const slug = category.slug
      if (categoryTips[slug]) {
        categoryTips[slug].forEach(tip => {
          allTips.push({ 
            icon: category.metadata?.icon || '📚', 
            tip 
          })
        })
      }
    })
    
    const tipIndex = dayOfYear % allTips.length
    setCurrentTip(allTips[tipIndex])
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [categories])
  
  if (!currentTip.tip) return null
  
  return (
    <div 
      className={`mb-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 border border-navy-700 text-sm">
        <span className="text-lg">{currentTip.icon}</span>
        <span className="text-navy-300">
          <strong className="text-primary-400">Daily Tip:</strong> {currentTip.tip}
        </span>
      </div>
    </div>
  )
}