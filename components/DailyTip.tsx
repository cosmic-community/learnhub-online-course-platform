'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { emoji: "🧠", tip: "Spaced repetition helps you remember 90% more. Review what you learned yesterday!" },
  { emoji: "⏰", tip: "The Pomodoro Technique: 25 min focus + 5 min break = maximum productivity" },
  { emoji: "📝", tip: "Teaching others is the best way to learn. Try explaining today's lesson to someone!" },
  { emoji: "🎯", tip: "Set micro-goals. Completing small tasks releases dopamine and keeps you motivated." },
  { emoji: "💤", tip: "Sleep consolidates memories. A good night's rest makes you learn 40% better." },
  { emoji: "🚀", tip: "Start with the hardest topic when your energy is highest. Tackle challenges first!" },
  { emoji: "🔄", tip: "Active recall beats passive reading. Close the book and try to remember." },
  { emoji: "🎮", tip: "Gamify your learning! Set streaks and celebrate small wins." },
  { emoji: "🤔", tip: "Confusion is part of learning. Embrace the struggle - it means you're growing!" },
  { emoji: "📱", tip: "Put your phone in another room. Single-tasking makes you 10x more effective." },
  { emoji: "✨", tip: "Consistency beats intensity. 30 minutes daily > 5 hours once a week." },
  { emoji: "🌟", tip: "Visualize yourself using this skill. Mental rehearsal boosts performance." },
  { emoji: "📖", tip: "Before each lesson, spend 2 minutes previewing. It primes your brain to absorb more." },
  { emoji: "💪", tip: "Your brain is a muscle. The more you challenge it, the stronger it gets!" },
  { emoji: "🎨", tip: "Connect new concepts to things you already know. Build mental bridges!" },
]

export default function DailyTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    const selectedTip = learningTips[tipIndex]
    if (selectedTip) {
      setTip(selectedTip)
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`
        bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent 
        border border-primary-500/20 rounded-2xl p-6
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }}>
          {tip.emoji}
        </div>
        <div>
          <h3 className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-1">
            💡 Daily Learning Tip
          </h3>
          <p className="text-navy-200 leading-relaxed">
            {tip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}