'use client'

import { useState, useEffect } from 'react'

interface LearningTip {
  id: number
  tip: string
  category: string
  icon: string
}

const learningTips: LearningTip[] = [
  {
    id: 1,
    tip: "Break your learning into 25-minute focused sessions (Pomodoro Technique) for better retention.",
    category: "Productivity",
    icon: "⏰"
  },
  {
    id: 2,
    tip: "Teaching what you learn to others is one of the most effective ways to solidify your knowledge.",
    category: "Learning Strategy",
    icon: "🎓"
  },
  {
    id: 3,
    tip: "Code every day, even if it's just for 15 minutes. Consistency beats intensity.",
    category: "Practice",
    icon: "💻"
  },
  {
    id: 4,
    tip: "Don't just copy code - type it out manually. Muscle memory helps reinforce learning.",
    category: "Coding Tips",
    icon: "⌨️"
  },
  {
    id: 5,
    tip: "Build projects that solve your own problems - you'll be more motivated to complete them.",
    category: "Projects",
    icon: "🚀"
  },
  {
    id: 6,
    tip: "Read error messages carefully - they often tell you exactly what's wrong and how to fix it.",
    category: "Debugging",
    icon: "🔍"
  },
  {
    id: 7,
    tip: "Join a community of learners. Collaboration accelerates learning and keeps you motivated.",
    category: "Community",
    icon: "👥"
  },
  {
    id: 8,
    tip: "Take breaks! Your brain consolidates information during rest periods.",
    category: "Wellness",
    icon: "🧘"
  },
  {
    id: 9,
    tip: "Version control your learning notes using Git - treat them like code.",
    category: "Organization",
    icon: "📝"
  },
  {
    id: 10,
    tip: "Embrace the struggle - if it feels hard, that's when real learning is happening.",
    category: "Mindset",
    icon: "💪"
  }
]

export default function DailyLearningTip() {
  const [currentTip, setCurrentTip] = useState<LearningTip | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get today's tip based on the day of year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const tipIndex = dayOfYear % learningTips.length
    
    setCurrentTip(learningTips[tipIndex])
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!currentTip) return null

  return (
    <section className={`py-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-600/10 to-primary-500/10 border border-primary-500/20 p-6 md:p-8">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 animate-gradient-x" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center text-3xl animate-bounce-slow">
                {currentTip.icon}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300">
                  💡 Daily Learning Tip
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-700 text-navy-300">
                  {currentTip.category}
                </span>
              </div>
              <p className="text-white text-lg md:text-xl font-medium leading-relaxed">
                "{currentTip.tip}"
              </p>
            </div>
            
            {/* Decorative sparkles */}
            <div className="hidden lg:block absolute top-2 right-2 text-2xl animate-pulse">✨</div>
            <div className="hidden lg:block absolute bottom-2 right-12 text-xl animate-pulse animation-delay-1000">⭐</div>
          </div>
        </div>
      </div>
    </section>
  )
}