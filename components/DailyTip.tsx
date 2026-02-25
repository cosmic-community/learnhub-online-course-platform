'use client'

import { useState, useEffect } from 'react'

interface DailyTipProps {
  tips: string[]
}

export default function DailyTip({ tips }: DailyTipProps) {
  const [currentTip, setCurrentTip] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a tip based on the current day to keep it consistent for the day
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex] ?? tips[0])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [tips])

  if (!currentTip) return null

  return (
    <div
      className={`bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20 rounded-2xl p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wide">
              💡 Daily Learning Tip
            </h3>
            <span className="text-xs text-navy-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p className="text-navy-200 text-lg leading-relaxed">{currentTip}</p>
        </div>
      </div>
    </div>
  )
}