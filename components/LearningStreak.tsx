'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
}

const MOTIVATIONAL_QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "🔥 3-day streak! You're building momentum!",
  7: "🌟 One week strong! Amazing dedication!",
  14: "🚀 Two weeks! You're unstoppable!",
  30: "👑 30-day legend! True commitment!",
  50: "💎 50 days! You're an inspiration!",
  100: "🏆 100 days! Absolute champion!",
}

function createConfetti() {
  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      opacity: ${Math.random() * 0.7 + 0.3};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      transform: rotate(${Math.random() * 360}deg);
      z-index: 10000;
      pointer-events: none;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMilestone, setShowMilestone] = useState<string | null>(null)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const checkAndUpdateStreak = useCallback(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: '',
      totalVisits: 0,
    }

    if (data.lastVisitDate === today) {
      setStreakData(data)
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()

    let newStreak = data.currentStreak
    let milestoneHit: string | null = null

    if (data.lastVisitDate === yesterdayString) {
      newStreak = data.currentStreak + 1
    } else if (data.lastVisitDate !== today) {
      newStreak = 1
    }

    // Check for milestones
    const milestones = Object.keys(MILESTONE_MESSAGES).map(Number).sort((a, b) => b - a)
    for (const milestone of milestones) {
      if (newStreak === milestone && data.currentStreak < milestone) {
        milestoneHit = MILESTONE_MESSAGES[milestone] ?? null
        break
      }
    }

    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, data.longestStreak),
      lastVisitDate: today,
      totalVisits: data.totalVisits + 1,
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    setStreakData(newData)

    if (milestoneHit) {
      setShowMilestone(milestoneHit)
      createConfetti()
      setTimeout(() => setShowMilestone(null), 5000)
    }
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!streakData || !isVisible) return null

  const quote = MOTIVATIONAL_QUOTES[currentQuote]

  return (
    <>
      {/* Confetti keyframes */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes streak-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes quote-fade {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Milestone Celebration Banner */}
      {showMilestone && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-bounce">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-primary-500/50 text-lg font-bold">
            {showMilestone}
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <div 
          className={`bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${
            isExpanded ? 'w-80' : 'w-auto'
          }`}
        >
          {/* Collapsed View - Just the streak button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 p-4 w-full text-left hover:bg-navy-800/50 transition-colors"
            style={{ animation: streakData.currentStreak >= 3 ? 'streak-pulse 2s ease-in-out infinite' : 'none' }}
          >
            <div className="relative">
              <span className="text-3xl">🔥</span>
              {streakData.currentStreak >= 7 && (
                <span className="absolute -top-1 -right-1 text-xs">✨</span>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-xs text-navy-400">day streak</div>
            </div>
            <svg 
              className={`w-5 h-5 text-navy-400 ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded View */}
          {isExpanded && (
            <div className="px-4 pb-4 border-t border-navy-700/50">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-primary-400">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-primary-400">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Progress to next milestone */}
              {(() => {
                const nextMilestone = [3, 7, 14, 30, 50, 100].find(m => m > streakData.currentStreak) || 100
                const prevMilestone = [0, 3, 7, 14, 30, 50].reverse().find(m => m < nextMilestone) || 0
                const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
                
                return (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-navy-400 mb-1">
                      <span>Progress to {nextMilestone}-day</span>
                      <span>{nextMilestone - streakData.currentStreak} days to go</span>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })()}

              {/* Motivational Quote */}
              {quote && (
                <div 
                  className="mt-4 p-3 bg-navy-800/30 rounded-xl border border-navy-700/50"
                  key={currentQuote}
                  style={{ animation: 'quote-fade 10s ease-in-out' }}
                >
                  <p className="text-sm text-navy-300 italic">&ldquo;{quote.text}&rdquo;</p>
                  <p className="text-xs text-navy-500 mt-1">— {quote.author}</p>
                </div>
              )}

              {/* Close/Hide button */}
              <button
                onClick={() => setIsVisible(false)}
                className="mt-3 w-full text-xs text-navy-500 hover:text-navy-400 transition-colors"
              >
                Hide for this session
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}