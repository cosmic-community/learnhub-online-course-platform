'use client'

import { useState, useEffect } from 'react'

const tips = [
  { emoji: '💡', text: 'Tip: Consistent 30-minute study sessions beat marathon cramming!' },
  { emoji: '🎯', text: 'Pro tip: Take notes while watching lessons to boost retention by 40%' },
  { emoji: '⚡', text: 'Did you know? Active coding practice helps you learn 3x faster' },
  { emoji: '🧠', text: 'Learning hack: Teach what you learn to solidify your knowledge' },
  { emoji: '🔥', text: 'Motivation: Every expert was once a beginner. Start today!' },
  { emoji: '📚', text: 'Study tip: Review yesterday's lesson before starting a new one' },
  { emoji: '🚀', text: 'Career boost: Completing 1 course/month can transform your skills' },
  { emoji: '✨', text: 'Fun fact: Developers who learn continuously earn 20% more' },
  { emoji: '🎓', text: 'Success tip: Set specific learning goals for each session' },
  { emoji: '💪', text: 'You've got this! Small steps lead to big achievements' },
]

export default function DailyTip() {
  const [tip, setTip] = useState(tips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a "daily" tip based on the day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    const selectedTip = tips[tipIndex]
    if (selectedTip) {
      setTip(selectedTip)
    }
    
    // Animate in
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 backdrop-blur-sm border border-navy-700/50 text-sm mb-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <span className="animate-bounce-slow">{tip.emoji}</span>
      <span className="text-navy-300">{tip.text}</span>
    </div>
  )
}