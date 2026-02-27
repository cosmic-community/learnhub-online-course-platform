'use client'

import { useState, useEffect } from 'react'
import type { Instructor } from '@/types'

interface DailyTipProps {
  instructor: Instructor | null
}

const learningTips = [
  {
    tip: "Break your learning into 25-minute focused sessions. Your brain absorbs more when you give it regular breaks!",
    category: "productivity"
  },
  {
    tip: "Don't just watch tutorials — code along! Muscle memory is real, and your fingers need practice too.",
    category: "practice"
  },
  {
    tip: "Stuck on a problem? Try explaining it to a rubber duck. Seriously, it works! It's called rubber duck debugging.",
    category: "debugging"
  },
  {
    tip: "Learn one thing deeply before moving to the next. Shallow knowledge of many things is less valuable than deep understanding of a few.",
    category: "focus"
  },
  {
    tip: "Teaching others is the best way to learn. Write a blog post, make a video, or explain concepts to a friend.",
    category: "teaching"
  },
  {
    tip: "Your first version doesn't have to be perfect. Ship it, get feedback, iterate. That's how real software is built.",
    category: "mindset"
  },
  {
    tip: "Read code written by others. Open source projects are goldmines of learning. Study how experienced developers solve problems.",
    category: "reading"
  },
  {
    tip: "Build projects you actually care about. Passion projects keep you motivated when tutorials get boring.",
    category: "projects"
  },
  {
    tip: "Sleep is part of the learning process. Your brain consolidates knowledge while you rest. Don't skip it!",
    category: "wellness"
  },
  {
    tip: "Celebrate small wins! Finished a chapter? Got code to work? Do a little victory dance. It builds positive associations with learning.",
    category: "motivation"
  }
]

const categoryEmojis: Record<string, string> = {
  productivity: '⏰',
  practice: '💻',
  debugging: '🔍',
  focus: '🎯',
  teaching: '📚',
  mindset: '🧠',
  reading: '📖',
  projects: '🚀',
  wellness: '😴',
  motivation: '🎉'
}

export default function DailyTip({ instructor }: DailyTipProps) {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get a consistent tip for the day based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    const todaysTip = learningTips[tipIndex]
    if (todaysTip) {
      setCurrentTip(todaysTip)
    }
    
    setTimeout(() => setIsAnimating(true), 200)
  }, [])

  const refreshTip = () => {
    setIsAnimating(false)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * learningTips.length)
      const randomTip = learningTips[randomIndex]
      if (randomTip) {
        setCurrentTip(randomTip)
      }
      setIsAnimating(true)
    }, 300)
  }

  if (!mounted) {
    return (
      <div className="card p-6 bg-gradient-to-br from-navy-800/80 to-navy-900/80">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-32 mb-4"></div>
          <div className="h-20 bg-navy-700 rounded mb-4"></div>
          <div className="h-10 bg-navy-700 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-yellow-500/5 via-navy-800/80 to-navy-900/80 border-yellow-500/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-4xl opacity-20">💡</div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Daily Learning Tip
          </h3>
          <button 
            onClick={refreshTip}
            className="text-xs text-navy-400 hover:text-primary-400 bg-navy-800/50 hover:bg-navy-700/50 px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New tip
          </button>
        </div>
        
        {/* Tip category badge */}
        <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 mb-3 transition-all duration-300 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <span>{categoryEmojis[currentTip?.category ?? 'motivation'] ?? '💡'}</span>
          <span className="capitalize">{currentTip?.category ?? 'tip'}</span>
        </div>
        
        {/* The tip itself */}
        <blockquote className={`text-navy-200 text-base leading-relaxed mb-4 transition-all duration-500 ${isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          "{currentTip?.tip ?? 'Learning is a lifelong journey!'}"
        </blockquote>
        
        {/* Instructor attribution */}
        {instructor && (
          <div className={`flex items-center gap-3 pt-4 border-t border-navy-700/50 transition-all duration-500 delay-200 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {instructor.metadata?.photo ? (
              <img 
                src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                alt={instructor.metadata?.name || instructor.title}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-600/30 flex items-center justify-center text-lg">
                👨‍🏫
              </div>
            )}
            <div>
              <p className="text-sm text-white font-medium">
                {instructor.metadata?.name || instructor.title}
              </p>
              <p className="text-xs text-navy-400">
                {instructor.metadata?.credentials?.split(',')[0] || 'Expert Instructor'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}