'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    emoji: '🧠',
    title: 'Active Recall',
    tip: 'Test yourself without looking at notes. This strengthens memory pathways more than passive review.'
  },
  {
    emoji: '⏰',
    title: 'Pomodoro Technique',
    tip: 'Study for 25 minutes, then take a 5-minute break. Your brain consolidates learning during rest.'
  },
  {
    emoji: '✍️',
    title: 'Teach Others',
    tip: 'Explaining concepts to someone else reveals gaps in your understanding and deepens knowledge.'
  },
  {
    emoji: '🎯',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals. This fights the forgetting curve effectively.'
  },
  {
    emoji: '💡',
    title: 'Connect Ideas',
    tip: 'Link new concepts to things you already know. Building mental connections aids retention.'
  },
  {
    emoji: '🏃',
    title: 'Exercise & Learn',
    tip: 'Physical activity before learning increases BDNF, which helps form new neural connections.'
  },
  {
    emoji: '😴',
    title: 'Sleep On It',
    tip: 'Your brain processes and consolidates learning during sleep. Prioritize rest!'
  },
  {
    emoji: '📝',
    title: 'Handwritten Notes',
    tip: 'Writing by hand engages more brain areas than typing and improves comprehension.'
  },
  {
    emoji: '🎵',
    title: 'Background Music',
    tip: 'Instrumental music at 60-70 BPM can enhance focus and information retention.'
  },
  {
    emoji: '🥤',
    title: 'Stay Hydrated',
    tip: 'Even mild dehydration impairs cognitive function. Keep water nearby while studying.'
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState(LEARNING_TIPS[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a tip based on the day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
    
    // Show after a brief delay for animation
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  return (
    <div 
      className={`
        relative overflow-hidden bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 
        border border-primary-500/20 rounded-2xl p-6 
        transition-all duration-700 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full blur-xl" />
      
      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-2xl">
          {tip.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider">
              💡 Daily Learning Tip
            </span>
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">{tip.title}</h3>
          <p className="text-navy-300 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}