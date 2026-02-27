'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    icon: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to achieve before starting each lesson. Clear goals improve retention by 40%!'
  },
  {
    icon: '📝',
    title: 'Take Active Notes',
    tip: 'Writing notes by hand helps cement concepts in your memory. Try summarizing each section in your own words.'
  },
  {
    icon: '⏰',
    title: 'Pomodoro Technique',
    tip: 'Study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout.'
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition',
    tip: 'Review material at increasing intervals. Come back to lessons after 1 day, 3 days, then 1 week.'
  },
  {
    icon: '💡',
    title: 'Teach What You Learn',
    tip: 'Explaining concepts to others (or even to yourself) deepens your understanding dramatically.'
  },
  {
    icon: '🏃',
    title: 'Practice Immediately',
    tip: 'Apply what you learn right away. Build a small project after each course section.'
  },
  {
    icon: '😴',
    title: 'Sleep on It',
    tip: 'Your brain consolidates learning during sleep. Review key concepts before bed for better retention.'
  },
  {
    icon: '🎵',
    title: 'Find Your Flow',
    tip: 'Some learn better with background music, others need silence. Experiment to find your ideal environment.'
  },
  {
    icon: '🤔',
    title: 'Embrace Confusion',
    tip: 'Feeling confused means you\'re learning. Push through the discomfort – clarity will follow.'
  },
  {
    icon: '🎮',
    title: 'Gamify Your Learning',
    tip: 'Set challenges for yourself and reward progress. Small wins keep motivation high!'
  }
]

export default function TodaysTip() {
  const [tip, setTip] = useState(learningTips[0])
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTip(learningTips[dayOfYear % learningTips.length])
  }, [])
  
  const getNewTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = learningTips.findIndex(t => t.title === tip.title)
      const nextIndex = (currentIndex + 1) % learningTips.length
      setTip(learningTips[nextIndex])
      setIsAnimating(false)
    }, 200)
  }
  
  return (
    <div className="card p-6 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity">
        {tip.icon}
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tip.icon}</span>
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">
              Today's Learning Tip
            </span>
          </div>
          
          <button
            onClick={getNewTip}
            className="p-2 hover:bg-navy-800 rounded-lg transition-colors text-navy-400 hover:text-white"
            aria-label="Get another tip"
          >
            <svg className={`w-4 h-4 transition-transform ${isAnimating ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className={`transition-all duration-200 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
          <h3 className="text-white font-semibold mb-2">{tip.title}</h3>
          <p className="text-navy-400 text-sm leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}