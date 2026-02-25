'use client'

import { useState, useEffect } from 'react'
import type { Instructor } from '@/types'

interface DailyTipProps {
  instructor: Instructor
}

const TIPS = [
  "Start each learning session with a clear goal. What do you want to accomplish today?",
  "Take breaks! The Pomodoro Technique suggests 25 minutes of focus, then a 5-minute break.",
  "Teaching others is the best way to solidify your knowledge. Try explaining what you learned!",
  "Build projects, not just tutorials. Real learning happens when you solve real problems.",
  "Don't be afraid to make mistakes. Every error is a learning opportunity in disguise.",
  "Consistency beats intensity. 30 minutes daily beats 4 hours once a week.",
  "Write code comments as if you're explaining to your future self. You'll thank yourself later!",
  "Version control is your friend. Commit often and write meaningful commit messages.",
  "Read documentation before Stack Overflow. The answers are often simpler than you think.",
  "Sleep on difficult problems. Your brain processes information while you rest.",
  "Celebrate small wins! Completed a lesson? That's progress worth acknowledging.",
  "Join communities. Learning together is more fun and effective than learning alone.",
  "Debug with console.log freely, but remember to clean up before committing!",
  "When stuck, explain your problem out loud. Rubber duck debugging really works!",
  "Set up your development environment properly. Good tools make learning smoother.",
]

export default function DailyTip({ instructor }: DailyTipProps) {
  const [tip, setTip] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get today's tip based on date (so it changes daily)
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % TIPS.length
    setTip(TIPS[tipIndex] ?? TIPS[0])
    
    // Check if dismissed today
    const dismissedDate = localStorage.getItem('learnhub-tip-dismissed')
    if (dismissedDate !== today.toDateString()) {
      // Animate in after a short delay
      setTimeout(() => setIsVisible(true), 500)
    } else {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub-tip-dismissed', new Date().toDateString())
    setTimeout(() => setIsDismissed(true), 300)
  }

  if (isDismissed || !tip) return null

  const instructorPhoto = instructor.metadata?.photo?.imgix_url
  const instructorName = instructor.metadata?.name || instructor.title

  return (
    <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 border border-primary-500/20">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent animate-shimmer" />
        
        <div className="relative p-6 flex items-start gap-4">
          {/* Light bulb icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl animate-pulse">💡</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Daily Learning Tip</span>
              <span className="text-navy-500">•</span>
              <span className="text-xs text-navy-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            
            <p className="text-white text-lg leading-relaxed mb-3">"{tip}"</p>
            
            <div className="flex items-center gap-3">
              {instructorPhoto && (
                <img 
                  src={`${instructorPhoto}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={instructorName}
                  className="w-8 h-8 rounded-full border-2 border-primary-500/30"
                />
              )}
              <div>
                <span className="text-sm text-navy-300">Shared by </span>
                <span className="text-sm text-primary-400 font-medium">{instructorName}</span>
              </div>
            </div>
          </div>
          
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-navy-500 hover:text-navy-300 hover:bg-navy-800 rounded-lg transition-colors"
            aria-label="Dismiss tip"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}