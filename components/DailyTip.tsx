'use client'

import { useState, useEffect } from 'react'

const TIPS = [
  {
    emoji: '💡',
    tip: 'Learning in 25-minute focused sessions with 5-minute breaks (Pomodoro Technique) can boost retention by up to 30%!',
  },
  {
    emoji: '📝',
    tip: 'Taking handwritten notes, even digitally, helps you remember concepts better than just reading.',
  },
  {
    emoji: '🔄',
    tip: 'Spaced repetition is key! Review what you learned yesterday, last week, and last month.',
  },
  {
    emoji: '🎯',
    tip: 'Set specific, achievable goals for each learning session. "Complete 2 lessons" beats "study more".',
  },
  {
    emoji: '🧠',
    tip: 'Teaching others what you\'ve learned is one of the most effective ways to solidify knowledge.',
  },
  {
    emoji: '😴',
    tip: 'Sleep is crucial for memory consolidation. Review key concepts before bed for better retention.',
  },
  {
    emoji: '💪',
    tip: 'Struggling with a concept? That\'s your brain growing! Embrace the challenge.',
  },
  {
    emoji: '🚀',
    tip: 'Build projects as you learn. Applying knowledge immediately makes it stick.',
  },
  {
    emoji: '☕',
    tip: 'Stay hydrated and take regular breaks. Your brain works better when you\'re refreshed!',
  },
  {
    emoji: '🎮',
    tip: 'Gamify your learning! Track streaks, earn badges, and celebrate small wins.',
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % TIPS.length
    setTip(TIPS[tipIndex])
    
    // Animate in after a short delay
    const timeout = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`bg-gradient-to-r from-primary-500/10 to-navy-800/50 border border-primary-500/20 rounded-2xl p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0 animate-pulse">{tip.emoji}</div>
        <div>
          <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2">
            💡 Tip of the Day
          </h3>
          <p className="text-navy-200 leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}