'use client'

import { useState, useEffect } from 'react'

const codingTips = [
  {
    tip: "Use console.table() instead of console.log() for arrays and objects - it displays data in a neat table format!",
    category: "JavaScript",
    icon: "💡"
  },
  {
    tip: "The CSS :has() selector lets you style parent elements based on their children. It's the 'parent selector' we've always wanted!",
    category: "CSS",
    icon: "🎨"
  },
  {
    tip: "In TypeScript, use 'satisfies' to validate types while preserving the narrowest type inference.",
    category: "TypeScript",
    icon: "📘"
  },
  {
    tip: "React's useId() hook generates unique IDs that are stable across server and client - perfect for accessibility!",
    category: "React",
    icon: "⚛️"
  },
  {
    tip: "Use git stash -p to interactively choose which changes to stash - great for messy work in progress!",
    category: "Git",
    icon: "📦"
  },
  {
    tip: "The Nullish Coalescing operator (??) only returns the right side if the left is null or undefined, not just falsy.",
    category: "JavaScript",
    icon: "💡"
  },
  {
    tip: "Use CSS scroll-snap for smooth, native carousel-like scrolling without any JavaScript!",
    category: "CSS",
    icon: "🎨"
  },
  {
    tip: "In Node.js, use process.hrtime.bigint() for high-precision timing in nanoseconds.",
    category: "Node.js",
    icon: "🟢"
  },
  {
    tip: "Destructure with default values: const { name = 'Anonymous' } = user; - cleaner than || operators!",
    category: "JavaScript",
    icon: "💡"
  },
  {
    tip: "Use CSS container queries (@container) to make truly responsive components that adapt to their container, not just the viewport!",
    category: "CSS",
    icon: "🎨"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(codingTips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a tip based on the day of the year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % codingTips.length
    setTip(codingTips[tipIndex] ?? codingTips[0])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
            {tip.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                💡 Daily Coding Tip
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-navy-300">
                {tip.category}
              </span>
            </div>
            <p className="text-navy-200 leading-relaxed">
              {tip.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}