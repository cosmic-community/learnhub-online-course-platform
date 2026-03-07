'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    tip: 'Set specific learning goals for each session. Focused learning leads to better retention!',
    author: 'Learning Science'
  },
  {
    emoji: '⏰',
    tip: 'The best time to learn is when you feel most alert. Find your peak hours!',
    author: 'Productivity Research'
  },
  {
    emoji: '📝',
    tip: 'Take notes by hand. Writing helps encode information deeper in your memory.',
    author: 'Cognitive Science'
  },
  {
    emoji: '🧠',
    tip: 'Use the Pomodoro technique: 25 minutes of focused learning, then a 5-minute break.',
    author: 'Time Management'
  },
  {
    emoji: '💡',
    tip: 'Teach what you learn to someone else. It\'s the best way to solidify knowledge!',
    author: 'Feynman Technique'
  },
  {
    emoji: '🏃',
    tip: 'A short walk before studying increases blood flow to the brain and boosts focus.',
    author: 'Health Science'
  },
  {
    emoji: '😴',
    tip: 'Sleep is crucial for memory consolidation. Don\'t skip rest while learning!',
    author: 'Neuroscience'
  },
  {
    emoji: '🔄',
    tip: 'Review material at spaced intervals. Spaced repetition beats cramming every time.',
    author: 'Memory Research'
  },
  {
    emoji: '🎮',
    tip: 'Gamify your learning! Small rewards for completing lessons boost motivation.',
    author: 'Behavioral Psychology'
  },
  {
    emoji: '🤔',
    tip: 'Ask "why" questions while learning. Deep processing creates stronger memories.',
    author: 'Educational Psychology'
  },
  {
    emoji: '✍️',
    tip: 'Practice immediately after learning a new concept. Application cements understanding.',
    author: 'Learning Science'
  },
  {
    emoji: '🎧',
    tip: 'Some people learn better with background music. Experiment to find what works for you!',
    author: 'Study Habits Research'
  },
  {
    emoji: '🌟',
    tip: 'Celebrate small wins! Each completed lesson is progress worth acknowledging.',
    author: 'Motivation Psychology'
  },
  {
    emoji: '📱',
    tip: 'Put your phone in another room while studying. Notifications are focus killers!',
    author: 'Attention Research'
  },
];

export default function DailyTip() {
  const [tip, setTip] = useState<typeof learningTips[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`flex items-center justify-center gap-4 py-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/10 text-xl">
          {tip.emoji}
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Daily Tip</span>
          <span className="hidden sm:inline text-navy-600">•</span>
          <p className="text-sm text-navy-300 max-w-xl">
            {tip.tip}
          </p>
        </div>
      </div>
      <div className="hidden lg:block text-xs text-navy-500 italic">
        — {tip.author}
      </div>
    </div>
  )
}