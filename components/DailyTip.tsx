'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    tip: "Break your learning into 25-minute focused sessions (Pomodoro Technique) for better retention.",
    icon: "⏱️",
    category: "Productivity"
  },
  {
    tip: "Teaching others what you've learned is one of the most effective ways to solidify your knowledge.",
    icon: "🎓",
    category: "Retention"
  },
  {
    tip: "Take handwritten notes - it engages your brain more actively than typing.",
    icon: "✍️",
    category: "Note-taking"
  },
  {
    tip: "Review what you learned yesterday for just 5 minutes to strengthen memory pathways.",
    icon: "🧠",
    category: "Memory"
  },
  {
    tip: "Practice coding daily, even if just for 15 minutes. Consistency beats intensity.",
    icon: "💻",
    category: "Practice"
  },
  {
    tip: "Build projects as you learn. Applied knowledge sticks better than theoretical knowledge.",
    icon: "🛠️",
    category: "Projects"
  },
  {
    tip: "Join a learning community. Discussing concepts with others deepens understanding.",
    icon: "👥",
    category: "Community"
  },
  {
    tip: "Get enough sleep! Your brain consolidates learning during rest.",
    icon: "😴",
    category: "Health"
  },
  {
    tip: "Don't just watch tutorials - pause and try things yourself before seeing the solution.",
    icon: "🎯",
    category: "Active Learning"
  },
  {
    tip: "When stuck, explain the problem out loud (rubber duck debugging). It often reveals the solution.",
    icon: "🦆",
    category: "Debugging"
  },
  {
    tip: "Set specific learning goals. 'Learn React hooks by Friday' beats 'Learn React'.",
    icon: "🎯",
    category: "Goals"
  },
  {
    tip: "Take breaks when frustrated. Your subconscious continues working on problems.",
    icon: "☕",
    category: "Rest"
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date().toISOString().split('T')[0]
    const daysSinceEpoch = Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24))
    const tipIndex = daysSinceEpoch % LEARNING_TIPS.length
    
    setTip(LEARNING_TIPS[tipIndex] ?? LEARNING_TIPS[0])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  if (!tip) return null

  return (
    <div 
      className={`bg-gradient-to-r from-primary-500/10 via-blue-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl p-5 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-navy-800 rounded-xl text-2xl">
          {tip.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              💡 Daily Learning Tip
            </span>
            <span className="px-2 py-0.5 text-xs bg-navy-800 text-navy-300 rounded-full">
              {tip.category}
            </span>
          </div>
          <p className="text-navy-200 text-sm leading-relaxed">
            {tip.tip}
          </p>
        </div>
      </div>
    </div>
  )
}