'use client'

import { useEffect, useState } from 'react'

const TIPS = [
  { emoji: '🎯', tip: "Set specific learning goals for each session to stay focused and motivated." },
  { emoji: '⏰', tip: "The Pomodoro Technique: Study for 25 minutes, then take a 5-minute break." },
  { emoji: '📝', tip: "Taking notes by hand helps you retain information better than typing." },
  { emoji: '🔄', tip: "Review what you learned yesterday before starting something new." },
  { emoji: '💡', tip: "Teaching concepts to others is one of the best ways to truly understand them." },
  { emoji: '🌙', tip: "Getting enough sleep helps consolidate memories and improve learning." },
  { emoji: '🏃', tip: "A short walk or exercise session can boost your focus and creativity." },
  { emoji: '🎵', tip: "Lo-fi music or ambient sounds can help you concentrate while studying." },
  { emoji: '🍎', tip: "Stay hydrated and eat brain-boosting foods like nuts, berries, and dark chocolate." },
  { emoji: '🧘', tip: "Take a few deep breaths before starting to learn. A calm mind absorbs better." },
  { emoji: '📱', tip: "Put your phone in another room to avoid distractions while learning." },
  { emoji: '✍️', tip: "Write a summary of what you learned in your own words after each lesson." },
  { emoji: '🎮', tip: "Gamify your learning! Set small rewards for completing milestones." },
  { emoji: '👥', tip: "Join a study group or community to stay accountable and motivated." },
  { emoji: '🌅', tip: "Morning learners often retain more. Try studying in the early hours!" },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get consistent tip for the day based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % TIPS.length
    setTip(TIPS[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`bg-gradient-to-r from-primary-500/10 to-navy-800/50 border border-primary-500/20 rounded-xl p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }}>
          {tip.emoji}
        </div>
        <div>
          <h4 className="text-primary-400 font-semibold mb-1 flex items-center gap-2">
            <span>💡</span> Daily Learning Tip
          </h4>
          <p className="text-navy-200">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}