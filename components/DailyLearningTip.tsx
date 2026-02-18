'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🧠',
    tip: "Space your learning sessions! The 'spacing effect' shows you retain more when learning is distributed over time.",
    source: 'Cognitive Science'
  },
  {
    emoji: '✍️',
    tip: 'Take notes by hand. Studies show handwriting improves memory retention compared to typing.',
    source: 'Educational Psychology'
  },
  {
    emoji: '🎯',
    tip: 'Set specific learning goals. "Complete 1 lesson today" beats "learn some code" for motivation.',
    source: 'Goal-Setting Theory'
  },
  {
    emoji: '💤',
    tip: 'Sleep consolidates memory. Review material before bed for better retention!',
    source: 'Neuroscience'
  },
  {
    emoji: '🗣️',
    tip: 'Teach what you learn! Explaining concepts to others is one of the most effective study techniques.',
    source: 'Feynman Technique'
  },
  {
    emoji: '🏃',
    tip: 'Take breaks every 25-30 minutes. Your brain processes information during rest periods.',
    source: 'Pomodoro Technique'
  },
  {
    emoji: '🔄',
    tip: 'Practice retrieval, not just re-reading. Testing yourself strengthens neural pathways.',
    source: 'Learning Science'
  },
  {
    emoji: '🎵',
    tip: 'Instrumental music can help focus. Try lo-fi beats or classical while coding!',
    source: 'Focus Research'
  },
  {
    emoji: '💡',
    tip: 'Connect new concepts to what you already know. Building mental bridges aids understanding.',
    source: 'Schema Theory'
  },
  {
    emoji: '🌟',
    tip: 'Celebrate small wins! Dopamine released from achievements boosts learning motivation.',
    source: 'Behavioral Psychology'
  }
]

export default function DailyLearningTip() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % learningTips.length)
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const nextTip = () => {
    setIsChanging(true)
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % learningTips.length)
      setIsChanging(false)
    }, 300)
  }

  const currentTip = learningTips[tipIndex]
  if (!currentTip) return null

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl animate-bounce">
            {currentTip.emoji}
          </div>
          
          <div className={`flex-1 transition-all duration-300 ${isChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                💡 Daily Learning Tip
              </span>
              <span className="text-xs text-navy-500">
                • {currentTip.source}
              </span>
            </div>
            <p className="text-navy-200 leading-relaxed">
              {currentTip.tip}
            </p>
          </div>
          
          <button
            onClick={nextTip}
            className="flex-shrink-0 p-2 rounded-lg bg-navy-800/50 hover:bg-navy-700/50 text-navy-400 hover:text-primary-400 transition-all duration-200 group"
            aria-label="Next tip"
          >
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}