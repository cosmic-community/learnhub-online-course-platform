'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    emoji: '💡',
    category: 'Pro Tip',
    tip: "Consistency beats intensity. Code for 30 minutes daily rather than 5 hours once a week.",
    author: 'Learning Science'
  },
  {
    emoji: '🎯',
    category: 'Focus',
    tip: "Use the Pomodoro Technique: 25 minutes of focused coding, then a 5-minute break.",
    author: 'Productivity Hack'
  },
  {
    emoji: '🐛',
    category: 'Debugging',
    tip: "When stuck on a bug, explain the problem out loud. It's called rubber duck debugging!",
    author: 'Developer Wisdom'
  },
  {
    emoji: '📚',
    category: 'Learning',
    tip: "Learn by doing. Build projects, break things, fix them, and repeat.",
    author: 'Hands-On Learning'
  },
  {
    emoji: '🤝',
    category: 'Community',
    tip: "Join developer communities. Teaching others solidifies your own understanding.",
    author: 'Growth Mindset'
  },
  {
    emoji: '⚡',
    category: 'Speed',
    tip: "Master your keyboard shortcuts. They compound into hours saved over time.",
    author: 'Efficiency Expert'
  },
  {
    emoji: '🧠',
    category: 'Memory',
    tip: "Space out your learning. Review concepts after 1 day, 3 days, then 7 days.",
    author: 'Spaced Repetition'
  },
  {
    emoji: '🎨',
    category: 'Design',
    tip: "Good code is like good writing: clear, concise, and easy to understand.",
    author: 'Clean Code'
  },
  {
    emoji: '🔄',
    category: 'Progress',
    tip: "Compare yourself only to who you were yesterday, not to others.",
    author: 'Personal Growth'
  },
  {
    emoji: '☕',
    category: 'Balance',
    tip: "Take breaks! Your brain processes and solidifies learning during rest.",
    author: 'Work-Life Balance'
  },
  {
    emoji: '🚀',
    category: 'Ship It',
    tip: "Done is better than perfect. Ship early, get feedback, iterate.",
    author: 'Startup Wisdom'
  },
  {
    emoji: '📖',
    category: 'Docs',
    tip: "Read the documentation first. It's often faster than searching Stack Overflow.",
    author: 'Best Practice'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Get today's date to seed the random tip (same tip all day)
    const today = new Date().toDateString()
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const tipIndex = seed % tips.length
    setCurrentTip(tips[tipIndex])
    
    // Fade in after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getNewTip = () => {
    setIsChanging(true)
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * tips.length)
      setCurrentTip(tips[newIndex])
      setIsChanging(false)
    }, 200)
  }

  return (
    <div 
      className={`card p-6 relative overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-start gap-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-2xl transition-transform duration-300 ${isChanging ? 'scale-75 opacity-50' : 'scale-100 opacity-100'}`}>
          {currentTip.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium">
              {currentTip.category}
            </span>
            <span className="text-navy-500 text-xs">Daily Tip</span>
          </div>
          
          <p className={`text-white font-medium mb-2 transition-all duration-200 ${isChanging ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}`}>
            "{currentTip.tip}"
          </p>
          
          <p className={`text-navy-400 text-sm transition-all duration-200 delay-75 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
            — {currentTip.author}
          </p>
        </div>
        
        <button
          onClick={getNewTip}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-navy-800 transition-colors group"
          title="Get another tip"
        >
          <svg 
            className="w-5 h-5 text-navy-400 group-hover:text-primary-400 transition-colors group-hover:rotate-180 duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}