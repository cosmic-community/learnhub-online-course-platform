'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Focus Tip',
    content: 'Try the Pomodoro technique: 25 minutes of focused learning, then a 5-minute break.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30'
  },
  {
    emoji: '🧠',
    title: 'Memory Boost',
    content: 'Teaching others what you learn improves retention by up to 90%.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30'
  },
  {
    emoji: '⚡',
    title: 'Quick Win',
    content: 'Start with a small, achievable goal today. Progress compounds!',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30'
  },
  {
    emoji: '🌟',
    title: 'Stay Motivated',
    content: 'Every expert was once a beginner. Your journey starts with one lesson.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30'
  },
  {
    emoji: '🔥',
    title: 'Build Momentum',
    content: 'Consistency beats intensity. Even 15 minutes daily adds up to 91 hours yearly!',
    gradient: 'from-red-500/20 to-rose-500/20',
    border: 'border-red-500/30'
  },
  {
    emoji: '💡',
    title: 'Learn Smarter',
    content: 'Active recall trumps passive reading. Quiz yourself after each lesson.',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30'
  },
  {
    emoji: '🎨',
    title: 'Be Creative',
    content: 'Apply what you learn to a personal project. Real-world practice cements knowledge.',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    border: 'border-indigo-500/30'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const tipIndex = dayOfYear % learningTips.length
    
    setCurrentTip(learningTips[tipIndex] ?? learningTips[0])
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => setIsDismissed(true), 300)
  }

  const handleNewTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * learningTips.length)
      setCurrentTip(learningTips[randomIndex] ?? learningTips[0])
      setIsVisible(true)
    }, 300)
  }

  if (isDismissed) return null

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentTip.gradient} border ${currentTip.border} p-6 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl animate-bounce-slow">
          {currentTip.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Daily Tip</span>
            <span className="text-white/40">•</span>
            <span className="text-xs font-semibold text-white/80">{currentTip.title}</span>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">
            {currentTip.content}
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={handleNewTip}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
            title="Get new tip"
          >
            <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
            title="Dismiss"
          >
            <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}