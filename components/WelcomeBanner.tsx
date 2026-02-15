'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WelcomeBannerProps {
  courseCount: number
}

const learningTips = [
  "💡 Tip: Start with beginner courses to build a strong foundation!",
  "🎯 Focus on one course at a time for better retention.",
  "⏰ Just 30 minutes of daily learning can transform your skills!",
  "🧠 Take breaks every 25 minutes to maximize focus.",
  "📝 Take notes while watching lessons - it doubles retention!",
  "🔄 Review yesterday's lesson before starting a new one.",
  "🤝 Join discussions to deepen your understanding.",
  "🏆 Set small daily goals and celebrate your wins!"
]

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" }
]

function getTimeBasedContent() {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good morning, learner!",
      emoji: "🌅",
      message: "Start your day with something new!",
      gradient: "from-orange-500/20 via-yellow-500/10"
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good afternoon!",
      emoji: "☀️",
      message: "Perfect time for a learning break!",
      gradient: "from-blue-500/20 via-cyan-500/10"
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good evening!",
      emoji: "🌆",
      message: "Wind down with some productive learning!",
      gradient: "from-purple-500/20 via-pink-500/10"
    }
  } else {
    return {
      greeting: "Night owl mode!",
      emoji: "🦉",
      message: "Burning the midnight oil? We admire your dedication!",
      gradient: "from-indigo-500/20 via-purple-500/10"
    }
  }
}

export default function WelcomeBanner({ courseCount }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentTip, setCurrentTip] = useState('')
  const [currentQuote, setCurrentQuote] = useState<typeof motivationalQuotes[0] | null>(null)
  const [timeContent, setTimeContent] = useState(getTimeBasedContent())

  useEffect(() => {
    // Check if banner was dismissed today
    const dismissedDate = localStorage.getItem('learnhub_banner_dismissed')
    const today = new Date().toDateString()
    
    if (dismissedDate === today) {
      setIsVisible(false)
    }

    // Set random tip and quote
    setCurrentTip(learningTips[Math.floor(Math.random() * learningTips.length)])
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
    setTimeContent(getTimeBasedContent())
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub_banner_dismissed', new Date().toDateString())
  }

  if (!isVisible) return null

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${timeContent.gradient} to-transparent border-b border-navy-800`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{timeContent.emoji}</span>
              <h2 className="text-lg font-semibold text-white">{timeContent.greeting}</h2>
            </div>
            
            <p className="text-navy-300 text-sm mb-2">{timeContent.message}</p>
            
            {currentQuote && (
              <div className="bg-navy-900/30 rounded-lg p-3 mb-2">
                <p className="text-primary-300 text-sm italic">"{currentQuote.quote}"</p>
                <p className="text-navy-500 text-xs mt-1">— {currentQuote.author}</p>
              </div>
            )}
            
            <p className="text-navy-400 text-xs">{currentTip}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center bg-navy-900/50 rounded-lg px-4 py-2 hidden sm:block">
              <div className="text-2xl font-bold text-primary-400">{courseCount}</div>
              <div className="text-xs text-navy-400">Courses Available</div>
            </div>
            
            <Link
              href="/courses"
              className="btn-primary text-sm whitespace-nowrap"
            >
              Start Learning →
            </Link>
            
            <button
              onClick={handleDismiss}
              className="p-2 text-navy-500 hover:text-navy-300 transition-colors"
              aria-label="Dismiss banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}