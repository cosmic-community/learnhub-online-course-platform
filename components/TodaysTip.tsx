'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { emoji: "🧠", tip: "Take breaks every 25 minutes using the Pomodoro technique for better retention." },
  { emoji: "✍️", tip: "Writing notes by hand helps you remember 40% more than typing." },
  { emoji: "🎯", tip: "Set specific learning goals for each session to stay focused." },
  { emoji: "💤", tip: "Sleep consolidates memories - review before bed for better recall." },
  { emoji: "🔄", tip: "Spaced repetition helps move knowledge to long-term memory." },
  { emoji: "🗣️", tip: "Teaching others is one of the most effective ways to learn." },
  { emoji: "🎮", tip: "Gamify your learning - celebrate small wins along the way!" },
  { emoji: "📚", tip: "Mix up topics while studying to improve problem-solving skills." },
  { emoji: "🌟", tip: "Focus on understanding concepts, not just memorizing facts." },
  { emoji: "⏰", tip: "Morning hours are often best for learning complex topics." },
  { emoji: "🎵", tip: "Instrumental music can help maintain focus while studying." },
  { emoji: "💡", tip: "Connect new knowledge to things you already know." },
]

export default function TodaysTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick a tip based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % learningTips.length
    setTip(learningTips[tipIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div 
      className={`card p-5 bg-gradient-to-br from-primary-500/10 to-navy-900/50 border-primary-500/20 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0 animate-bounce-slow">
          {tip.emoji}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-1">
            💡 Today&apos;s Learning Tip
          </h3>
          <p className="text-navy-200 leading-relaxed">
            {tip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}