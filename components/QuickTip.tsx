'use client'

import { useState, useEffect } from 'react'

const tips = [
  { icon: '💡', text: 'Break learning into 25-minute sessions for better retention.' },
  { icon: '🎯', text: 'Set specific goals: "Complete 2 lessons today" beats "study more".' },
  { icon: '✍️', text: 'Take notes while watching—you\'ll remember 50% more!' },
  { icon: '🔄', text: 'Review yesterday\'s lesson before starting a new one.' },
  { icon: '🏃', text: 'Take a 5-minute break between lessons to let info sink in.' },
  { icon: '📱', text: 'Put your phone in another room to boost focus by 26%.' },
  { icon: '🌙', text: 'Your brain consolidates learning during sleep. Get 7-8 hours!' },
  { icon: '🎵', text: 'Instrumental music can help concentration while coding.' },
  { icon: '🤝', text: 'Teaching others is the fastest way to master a concept.' },
  { icon: '📊', text: 'Track your progress—visible progress boosts motivation!' },
  { icon: '🧠', text: 'Spaced repetition: Review new concepts after 1, 3, and 7 days.' },
  { icon: '☕', text: 'Best learning times: 10am-12pm and 4pm-6pm for most people.' },
]

export default function QuickTip() {
  const [tip, setTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed today
    const dismissedDate = localStorage.getItem('tip-dismissed-date')
    const today = new Date().toDateString()
    
    if (dismissedDate === today) {
      setIsDismissed(true)
      return
    }

    // Select random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setTip(randomTip)

    // Show after a delay
    const showTimer = setTimeout(() => setIsVisible(true), 3000)
    
    // Auto-hide after 15 seconds
    const hideTimer = setTimeout(() => setIsVisible(false), 18000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('tip-dismissed-date', new Date().toDateString())
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed top-24 right-5 z-50 max-w-sm animate-slideInRight">
      <div className="bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">{tip.icon}</span>
          <div className="flex-1">
            <div className="text-xs text-primary-400 font-semibold uppercase tracking-wider mb-1">
              Learning Tip
            </div>
            <p className="text-navy-200 text-sm leading-relaxed">
              {tip.text}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-navy-500 hover:text-navy-300 transition-colors text-lg leading-none"
            aria-label="Dismiss tip"
          >
            ×
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}