'use client'

import { useState } from 'react'

const learningTips = [
  { emoji: '🧠', tip: 'Take breaks every 25-30 minutes to help retain information better!' },
  { emoji: '📝', tip: 'Writing notes by hand improves memory retention by 40%.' },
  { emoji: '🎯', tip: 'Set specific learning goals before each study session.' },
  { emoji: '💤', tip: 'Sleep consolidates learning. Review before bed for better recall!' },
  { emoji: '🗣️', tip: 'Teach what you learn to someone else - it reinforces your knowledge.' },
  { emoji: '🔄', tip: 'Spaced repetition: Review material at increasing intervals.' },
  { emoji: '🏃', tip: 'A short walk before studying boosts brain function!' },
  { emoji: '🎵', tip: 'Instrumental music can help maintain focus while learning.' },
]

export default function LearningTip() {
  const [currentTipIndex, setCurrentTipIndex] = useState(() => 
    Math.floor(Math.random() * learningTips.length)
  )
  const [isFlipping, setIsFlipping] = useState(false)

  const currentTip = learningTips[currentTipIndex] ?? learningTips[0]

  const nextTip = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % learningTips.length)
      setIsFlipping(false)
    }, 200)
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-navy-700/50 to-transparent rounded-tr-full" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-sm font-semibold text-navy-300 uppercase tracking-wider">Learning Tip</h3>
          </div>
          <button
            onClick={nextTip}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
          >
            Next tip →
          </button>
        </div>
        
        <div 
          className={`flex items-start gap-3 transition-all duration-200 ${
            isFlipping ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
          }`}
        >
          <span className="text-3xl flex-shrink-0">{currentTip.emoji}</span>
          <p className="text-navy-200 leading-relaxed">{currentTip.tip}</p>
        </div>
      </div>
    </div>
  )
}