'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    icon: '⏰',
    title: 'Time Block Your Learning',
    content: 'Set aside dedicated 25-minute blocks for focused learning. Short, consistent sessions beat long sporadic ones.'
  },
  {
    icon: '✍️',
    title: 'Code Along, Don\'t Just Watch',
    content: 'Type out the code yourself as you learn. Muscle memory and active practice boost retention significantly.'
  },
  {
    icon: '🔄',
    title: 'Teach What You Learn',
    content: 'Explain concepts to a rubber duck or write a blog post. Teaching reinforces your understanding.'
  },
  {
    icon: '🎯',
    title: 'Build Projects Immediately',
    content: 'Apply new concepts in small projects right away. Real-world practice cements theoretical knowledge.'
  },
  {
    icon: '💡',
    title: 'Embrace the Struggle',
    content: 'Getting stuck is part of learning. Spend 15-20 minutes wrestling with a problem before seeking help.'
  },
  {
    icon: '📝',
    title: 'Take Smart Notes',
    content: 'Write notes in your own words. Summarize key concepts and create your own code snippets.'
  }
]

export default function LearningTip() {
  const [currentTip, setCurrentTip] = useState(tips[0])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length)
    setCurrentTip(tips[randomIndex])
  }, [])

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 p-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentTip.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">Pro Tip</span>
              <svg 
                className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <h4 className="text-white font-medium">{currentTip.title}</h4>
          </div>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
        <p className="text-navy-300 text-sm pl-11">
          {currentTip.content}
        </p>
      </div>
    </div>
  )
}