'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  { tip: "Take a 5-minute break every 25 minutes using the Pomodoro technique.", icon: "🍅" },
  { tip: "Teaching what you learn to others reinforces your understanding.", icon: "👥" },
  { tip: "Code along with tutorials rather than just watching them.", icon: "⌨️" },
  { tip: "Review your notes within 24 hours to boost retention by 60%.", icon: "📝" },
  { tip: "Build projects to apply what you learn - it's the best way to master skills.", icon: "🏗️" },
  { tip: "Join a community of learners to stay motivated and get help.", icon: "🤝" },
  { tip: "Consistency beats intensity. 30 minutes daily is better than 5 hours once a week.", icon: "📈" },
  { tip: "Don't be afraid to make mistakes - debugging is where real learning happens.", icon: "🐛" },
  { tip: "Explain concepts in your own words to test your understanding.", icon: "💭" },
  { tip: "Sleep is crucial for memory consolidation. Don't skip it!", icon: "😴" },
  { tip: "Break complex problems into smaller, manageable pieces.", icon: "🧩" },
  { tip: "Read documentation - it's often better than tutorials.", icon: "📚" },
  { tip: "Practice active recall by testing yourself without looking at notes.", icon: "🧠" },
  { tip: "Set specific, measurable learning goals for each session.", icon: "🎯" },
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
  }, [])

  const getNewTip = () => {
    setIsFlipped(true)
    setTimeout(() => {
      const currentIndex = tip ? LEARNING_TIPS.indexOf(tip) : 0
      const newIndex = (currentIndex + 1) % LEARNING_TIPS.length
      setTip(LEARNING_TIPS[newIndex])
      setIsFlipped(false)
    }, 300)
  }

  if (!tip) return null

  return (
    <div 
      className="card p-6 cursor-pointer group"
      onClick={getNewTip}
      style={{
        transform: isFlipped ? 'rotateY(90deg)' : 'rotateY(0)',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl group-hover:scale-110 transition-transform">
          {tip.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
              💡 Daily Learning Tip
            </span>
          </div>
          <p className="text-navy-200 leading-relaxed">
            {tip.tip}
          </p>
          <p className="text-navy-500 text-xs mt-3 group-hover:text-navy-400 transition-colors">
            Click for another tip →
          </p>
        </div>
      </div>
    </div>
  )
}