'use client'

import { useState, useEffect } from 'react'

interface DailyTipProps {
  tips: string[]
}

export default function DailyTip({ tips }: DailyTipProps) {
  const [currentTip, setCurrentTip] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const index = dayOfYear % tips.length
    setTipIndex(index)
    setCurrentTip(tips[index] || tips[0])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [tips])

  const nextTip = () => {
    setIsVisible(false)
    setTimeout(() => {
      const newIndex = (tipIndex + 1) % tips.length
      setTipIndex(newIndex)
      setCurrentTip(tips[newIndex] || tips[0])
      setIsVisible(true)
    }, 300)
  }

  if (!currentTip) return null

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-primary-600/5 border border-primary-500/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
          <span className="text-2xl">💡</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary-400 font-semibold text-sm">Daily Learning Tip</span>
          <span className="text-navy-600 text-xs">#{tipIndex + 1}</span>
        </div>
        <p className="text-navy-200 text-sm leading-relaxed">{currentTip}</p>
      </div>
      
      <button
        onClick={nextTip}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-navy-800/50 text-navy-400 hover:text-primary-400 transition-colors"
        aria-label="Next tip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}