'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalLessonsCompleted: number
  lastVisitDate: string
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

function getRandomQuote(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return motivationalQuotes[dayOfYear % motivationalQuotes.length]
}

function createConfetti() {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899']
  const confettiCount = 50
  const confettiElements: HTMLDivElement[] = []

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    confettiElements.push(confetti)
  }

  // Add confetti animation styles
  const style = document.createElement('style')
  style.textContent = `
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
  `
  document.head.appendChild(style)

  // Cleanup after animation
  setTimeout(() => {
    confettiElements.forEach(el => el.remove())
    style.remove()
  }, 5000)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dailyQuote] = useState(() => getRandomQuote(new Date()))

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      if (stored) {
        const data: StreakData = JSON.parse(stored)
        const lastVisit = new Date(data.lastVisitDate).toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastVisit === today) {
          // Already visited today
          setStreakData(data)
        } else if (lastVisit === yesterday.toDateString()) {
          // Visited yesterday, increment streak
          const newData = {
            ...data,
            currentStreak: data.currentStreak + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
            lastVisitDate: today,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
          
          // Celebrate milestones
          if (newData.currentStreak % 7 === 0 || [3, 10, 30, 50, 100].includes(newData.currentStreak)) {
            setShowCelebration(true)
            createConfetti()
          }
        } else {
          // Streak broken, reset to 1
          const newData = {
            ...data,
            currentStreak: 1,
            lastVisitDate: today,
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
        }
      } else {
        // First visit
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          totalLessonsCompleted: 0,
          lastVisitDate: today,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        setShowCelebration(true)
        createConfetti()
      }
    }

    loadStreakData()
    setIsAnimating(true)
  }, [])

  if (!streakData) {
    return null
  }

  const streakEmoji = streakData.currentStreak >= 30 ? '🏆' :
                      streakData.currentStreak >= 14 ? '🔥' :
                      streakData.currentStreak >= 7 ? '⚡' :
                      streakData.currentStreak >= 3 ? '✨' : '🌟'

  return (
    <div className={`relative overflow-hidden transition-all duration-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md mx-4 text-center transform animate-bounce-in">
            <div className="text-6xl mb-4">{streakEmoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {streakData.currentStreak === 1 ? 'Welcome to LearnHub!' : `${streakData.currentStreak} Day Streak!`}
            </h3>
            <p className="text-navy-300 mb-6">
              {streakData.currentStreak === 1 
                ? "Your learning journey begins today!" 
                : `You're on fire! Keep up the amazing work!`}
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-primary"
            >
              Let&apos;s Learn!
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="bg-gradient-to-br from-navy-900/80 to-navy-800/50 border border-navy-700 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl animate-pulse">{streakEmoji}</span>
              <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
              <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-primary-400 font-medium">Learning Streak</p>
          </div>
          <div className="text-right">
            <div className="text-navy-400 text-sm">Best Streak</div>
            <div className="text-white font-semibold">{streakData.longestStreak} days</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Progress to next milestone</span>
            <span>{streakData.currentStreak % 7}/7 days</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(streakData.currentStreak % 7) / 7 * 100}%` }}
            />
          </div>
        </div>

        {/* Daily Quote */}
        <div className="pt-4 border-t border-navy-700">
          <p className="text-navy-200 text-sm italic mb-1">&ldquo;{dailyQuote.quote}&rdquo;</p>
          <p className="text-navy-500 text-xs">— {dailyQuote.author}</p>
        </div>

        {/* Achievement Badges */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {streakData.currentStreak >= 3 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
              ✨ Getting Started
            </span>
          )}
          {streakData.currentStreak >= 7 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              ⚡ Week Warrior
            </span>
          )}
          {streakData.currentStreak >= 14 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
              🔥 Dedicated Learner
            </span>
          )}
          {streakData.currentStreak >= 30 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
              🏆 Learning Legend
            </span>
          )}
        </div>
      </div>
    </div>
  )
}