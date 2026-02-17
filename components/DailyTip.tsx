'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    tip: "Break down complex topics into smaller chunks. Your brain retains information better in bite-sized pieces! 🧠",
    category: "Memory"
  },
  {
    tip: "Practice active recall instead of re-reading. Test yourself to strengthen neural pathways! 📝",
    category: "Retention"
  },
  {
    tip: "Take a 5-minute break every 25 minutes. The Pomodoro technique boosts focus and prevents burnout! ⏱️",
    category: "Focus"
  },
  {
    tip: "Teach what you learn to someone else. If you can explain it simply, you truly understand it! 🎓",
    category: "Understanding"
  },
  {
    tip: "Code along with tutorials instead of just watching. Hands-on practice is 10x more effective! 💻",
    category: "Practice"
  },
  {
    tip: "Review yesterday's material before starting new content. Spaced repetition locks in knowledge! 🔄",
    category: "Review"
  },
  {
    tip: "Set specific learning goals for each session. 'Learn React hooks' beats 'study React'! 🎯",
    category: "Goals"
  },
  {
    tip: "Join a community of learners. Discussing concepts with others accelerates understanding! 👥",
    category: "Community"
  },
  {
    tip: "Sleep is crucial for learning. Your brain consolidates memories while you rest! 😴",
    category: "Health"
  },
  {
    tip: "Build projects as you learn. Real-world application makes concepts stick forever! 🛠️",
    category: "Projects"
  },
  {
    tip: "Don't aim for perfection. 'Good enough' progress beats paralysis by analysis! 🚀",
    category: "Mindset"
  },
  {
    tip: "Use multiple resources for tough topics. Different explanations click for different people! 📚",
    category: "Resources"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get tip based on day of year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    
    setTip(LEARNING_TIPS[tipIndex])
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`card p-6 border-l-4 border-l-primary-500 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
          <span className="text-xl">💡</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">
              Daily Learning Tip
            </span>
            <span className="text-xs text-navy-500">•</span>
            <span className="text-xs text-navy-500">{tip.category}</span>
          </div>
          <p className="text-navy-200 leading-relaxed">{tip.tip}</p>
        </div>
      </div>
    </div>
  )
}