'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalDaysLearning: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The only way to do great work is to love what you learn.", author: "Adapted from Steve Jobs" },
  { quote: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
]

const milestones = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(true)

  const createConfetti = useCallback(() => {
    const confettiContainer = document.getElementById('confetti-container')
    if (!confettiContainer) return

    const colors = ['#7C3AED', '#22D3EE', '#F59E0B', '#10B981', '#EC4899', '#3B82F6']
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${Math.random() * 2 + 2}s ease-out forwards;
        animation-delay: ${Math.random() * 0.5}s;
        transform: rotate(${Math.random() * 360}deg);
      `
      confettiContainer.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 4000)
    }
  }, [])

  useEffect(() => {
    // Get a consistent quote for the day
    const today = new Date().toDateString()
    const dayIndex = new Date().getDate() % motivationalQuotes.length
    setQuote(motivationalQuotes[dayIndex])

    // Load and update streak data
    const storedData = localStorage.getItem('learnhub-streak')
    const now = new Date()
    const todayStr = now.toDateString()

    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit)
      const lastVisitStr = lastVisitDate.toDateString()
      
      // Check if this is a new day
      if (todayStr !== lastVisitStr) {
        const daysDiff = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
        
        let newStreak: number
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          newStreak = data.currentStreak + 1
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = 1
        } else {
          newStreak = data.currentStreak
        }

        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: todayStr,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalDaysLearning: data.totalDaysLearning + 1,
        }

        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)

        // Check for milestone
        if (milestones.includes(newStreak) && newStreak > data.currentStreak) {
          setMilestone(newStreak)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 4000)
        }
      } else {
        setStreakData(data)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: todayStr,
        longestStreak: 1,
        totalDaysLearning: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [])

  useEffect(() => {
    if (showConfetti) {
      createConfetti()
    }
  }, [showConfetti, createConfetti])

  if (!streakData || !isVisible) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 365) return '👑'
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '⭐'
    if (streak >= 30) return '💎'
    if (streak >= 14) return '🚀'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getNextMilestone = (streak: number) => {
    return milestones.find(m => m > streak) || null
  }

  const nextMilestone = getNextMilestone(streakData.currentStreak)
  const progress = nextMilestone 
    ? ((streakData.currentStreak / nextMilestone) * 100)
    : 100

  return (
    <>
      {/* Confetti Container */}
      <div 
        id="confetti-container" 
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        aria-hidden="true"
      />

      {/* Milestone Celebration Modal */}
      {milestone && showConfetti && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-primary-500/50 rounded-2xl p-8 text-center max-w-md mx-4 animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {milestone} Day Streak!
            </h3>
            <p className="text-navy-300 mb-4">
              You're on fire! Keep up the amazing learning journey!
            </p>
            <button
              onClick={() => {
                setShowConfetti(false)
                setMilestone(null)
              }}
              className="btn-primary"
            >
              Keep Learning!
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="bg-gradient-to-r from-navy-900/90 via-navy-800/90 to-navy-900/90 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 mb-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Streak Counter */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl shadow-lg shadow-primary-500/30">
                  {getStreakEmoji(streakData.currentStreak)}
                </div>
                {streakData.currentStreak >= 7 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs animate-pulse">
                    🔥
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    {streakData.currentStreak}
                  </span>
                  <span className="text-navy-400 text-sm">
                    day{streakData.currentStreak !== 1 ? 's' : ''} streak
                  </span>
                </div>
                <p className="text-navy-400 text-sm">
                  Personal best: {streakData.longestStreak} days 🏆
                </p>
              </div>
            </div>

            {/* Progress to Next Milestone */}
            {nextMilestone && (
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-navy-400">Next milestone</span>
                  <span className="text-primary-400 font-medium">{nextMilestone} days</span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-navy-500 mt-1">
                  {nextMilestone - streakData.currentStreak} day{nextMilestone - streakData.currentStreak !== 1 ? 's' : ''} to go!
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{streakData.totalDaysLearning}</div>
                <div className="text-xs text-navy-400">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="mt-6 pt-4 border-t border-navy-700/50">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-navy-200 italic">"{quote.quote}"</p>
                <p className="text-navy-500 text-sm mt-1">— {quote.author}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-navy-500 hover:text-navy-300 transition-colors"
          aria-label="Hide streak widget"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CSS for confetti animation */}
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
        
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  )
}