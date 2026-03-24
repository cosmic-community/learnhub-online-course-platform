'use client'

import { useState, useEffect } from 'react'

const LEARNING_TIPS = [
  {
    emoji: "🧠",
    title: "Active Recall",
    tip: "Test yourself frequently! Active recall strengthens memory better than passive re-reading.",
    category: "Memory"
  },
  {
    emoji: "⏰",
    title: "Pomodoro Technique",
    tip: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.",
    category: "Productivity"
  },
  {
    emoji: "✍️",
    title: "Teach What You Learn",
    tip: "Explaining concepts to others (or even rubber ducks!) reinforces your understanding.",
    category: "Comprehension"
  },
  {
    emoji: "🎯",
    title: "Set Specific Goals",
    tip: "Instead of 'learn JavaScript', try 'complete 2 lessons on arrays today'.",
    category: "Planning"
  },
  {
    emoji: "💤",
    title: "Sleep on It",
    tip: "Your brain consolidates learning during sleep. Review before bed for better retention.",
    category: "Memory"
  },
  {
    emoji: "🔄",
    title: "Spaced Repetition",
    tip: "Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month.",
    category: "Memory"
  },
  {
    emoji: "🎮",
    title: "Gamify Your Learning",
    tip: "Set challenges, reward yourself for milestones, and make it fun!",
    category: "Motivation"
  },
  {
    emoji: "📝",
    title: "Write It Down",
    tip: "Writing notes by hand improves retention compared to typing.",
    category: "Comprehension"
  },
  {
    emoji: "🏃",
    title: "Exercise Boosts Learning",
    tip: "A short walk or exercise session before studying can improve focus and memory.",
    category: "Wellness"
  },
  {
    emoji: "🎵",
    title: "The Right Ambiance",
    tip: "Lo-fi music or ambient sounds can help maintain focus while coding.",
    category: "Focus"
  },
  {
    emoji: "🔗",
    title: "Connect the Dots",
    tip: "Link new concepts to things you already know. Associations strengthen memory.",
    category: "Comprehension"
  },
  {
    emoji: "❓",
    title: "Embrace Confusion",
    tip: "Feeling confused means you're at the edge of learning something new. Keep pushing!",
    category: "Mindset"
  },
  {
    emoji: "📊",
    title: "Track Your Progress",
    tip: "Seeing how far you've come is incredibly motivating. Celebrate small wins!",
    category: "Motivation"
  },
  {
    emoji: "🤝",
    title: "Learn Together",
    tip: "Join communities or find a study buddy. Discussion deepens understanding.",
    category: "Social"
  }
]

export default function DailyTip() {
  const [tip, setTip] = useState<typeof LEARNING_TIPS[0] | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
  }, [])

  const getNewTip = () => {
    setIsFlipping(true)
    setTimeout(() => {
      const currentIndex = tip ? LEARNING_TIPS.indexOf(tip) : 0
      const nextIndex = (currentIndex + 1) % LEARNING_TIPS.length
      setTip(LEARNING_TIPS[nextIndex])
      setIsFlipping(false)
    }, 300)
  }

  if (!mounted || !tip) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-navy-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-navy-900/50 to-primary-900/20 border-primary-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Daily Learning Tip
        </h3>
        <button 
          onClick={getNewTip}
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
        >
          <span>Next tip</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className={`transition-all duration-300 ${isFlipping ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-float">{tip.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-white text-lg">{tip.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                {tip.category}
              </span>
            </div>
            <p className="text-navy-300 leading-relaxed">{tip.tip}</p>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary-500/10 to-transparent rounded-tl-full pointer-events-none" />
    </div>
  )
}