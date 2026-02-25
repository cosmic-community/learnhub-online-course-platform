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
    emoji: '🧠',
    title: 'Space Your Learning',
    content: 'Studies show that spacing out your study sessions leads to better long-term retention than cramming.',
    category: 'Study Technique'
  },
  {
    emoji: '💡',
    title: 'Teach What You Learn',
    content: 'Explaining concepts to others (even rubber ducks!) helps solidify your understanding.',
    category: 'Learning Hack'
  },
  {
    emoji: '⏰',
    title: 'Pomodoro Power',
    content: 'Try 25-minute focused sessions with 5-minute breaks. Your brain will thank you!',
    category: 'Productivity'
  },
  {
    emoji: '📝',
    title: 'Take Handwritten Notes',
    content: 'Writing by hand activates different parts of your brain and improves recall.',
    category: 'Study Technique'
  },
  {
    emoji: '🎯',
    title: 'Set Micro-Goals',
    content: 'Break big topics into tiny, achievable goals. Small wins build momentum!',
    category: 'Motivation'
  },
  {
    emoji: '😴',
    title: 'Sleep on It',
    content: 'Your brain consolidates learning during sleep. Never underestimate a good night\'s rest!',
    category: 'Wellness'
  },
  {
    emoji: '🔄',
    title: 'Active Recall',
    content: 'Test yourself frequently instead of re-reading. It\'s harder but way more effective!',
    category: 'Study Technique'
  },
  {
    emoji: '🎮',
    title: 'Gamify Your Learning',
    content: 'Create personal challenges and rewards. Learning should feel like an adventure!',
    category: 'Motivation'
  },
  {
    emoji: '🤔',
    title: 'Embrace Confusion',
    content: 'Feeling confused? That\'s actually your brain growing! Lean into the challenge.',
    category: 'Mindset'
  },
  {
    emoji: '☕',
    title: 'Environment Matters',
    content: 'Find your optimal learning spot. Some thrive in silence, others need background noise.',
    category: 'Productivity'
  },
  {
    emoji: '🏃',
    title: 'Move Your Body',
    content: 'A quick walk or stretch can boost focus and creativity. Don\'t sit too long!',
    category: 'Wellness'
  },
  {
    emoji: '🔗',
    title: 'Connect the Dots',
    content: 'Link new concepts to things you already know. Building mental bridges aids memory.',
    category: 'Learning Hack'
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // Get tip based on the day of the year for consistency
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = today.getTime() - start.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % DAILY_TIPS.length
    setTip(DAILY_TIPS[tipIndex])
    
    // Check if user already liked today's tip
    const likedTips = JSON.parse(localStorage.getItem('learnhub-liked-tips') || '[]')
    setIsLiked(likedTips.includes(dayOfYear))
  }, [])

  const handleLike = () => {
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = today.getTime() - start.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    const likedTips = JSON.parse(localStorage.getItem('learnhub-liked-tips') || '[]')
    
    if (isLiked) {
      const newLiked = likedTips.filter((d: number) => d !== dayOfYear)
      localStorage.setItem('learnhub-liked-tips', JSON.stringify(newLiked))
    } else {
      likedTips.push(dayOfYear)
      localStorage.setItem('learnhub-liked-tips', JSON.stringify(likedTips))
    }
    
    setIsLiked(!isLiked)
  }

  if (!tip) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-navy-700 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-navy-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className="card p-6 relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">💡</span> Daily Learning Tip
          </h3>
          <span className="badge bg-primary-500/20 text-primary-400 text-xs">
            {tip.category}
          </span>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
            {tip.emoji}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium mb-2">{tip.title}</h4>
            <p className="text-navy-300 text-sm leading-relaxed">{tip.content}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-navy-700 flex items-center justify-between">
          <span className="text-navy-500 text-xs">New tip every day!</span>
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-navy-700 text-navy-300 hover:bg-navy-600'
            }`}
          >
            <span className={isLiked ? 'animate-pulse' : ''}>{isLiked ? '❤️' : '🤍'}</span>
            {isLiked ? 'Loved!' : 'Helpful?'}
          </button>
        </div>
      </div>
    </div>
  )
}