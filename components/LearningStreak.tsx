'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearning: number
  level: string
  xp: number
}

const MOTIVATIONAL_QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
]

const LEVELS = [
  { name: 'Curious Learner', minXp: 0, emoji: '🌱' },
  { name: 'Knowledge Seeker', minXp: 100, emoji: '📖' },
  { name: 'Dedicated Scholar', minXp: 300, emoji: '🎓' },
  { name: 'Wisdom Hunter', minXp: 600, emoji: '🦉' },
  { name: 'Master Mind', minXp: 1000, emoji: '🧠' },
  { name: 'Learning Legend', minXp: 2000, emoji: '⭐' },
]

function getLevel(xp: number): { name: string; emoji: string; progress: number; nextLevel: string | null } {
  let currentLevel = LEVELS[0]
  let nextLevel = LEVELS[1]
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i]
      nextLevel = LEVELS[i + 1] || null
      break
    }
  }
  
  const progress = nextLevel 
    ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
    : 100
    
  return {
    name: currentLevel.name,
    emoji: currentLevel.emoji,
    progress: Math.min(progress, 100),
    nextLevel: nextLevel?.name || null
  }
}

function createConfetti() {
  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
  const confettiCount = 150
  const confetti: HTMLDivElement[] = []
  
  for (let i = 0; i < confettiCount; i++) {
    const element = document.createElement('div')
    element.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(element)
    confetti.push(element)
  }
  
  // Add keyframe animation if not exists
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style')
    style.id = 'confetti-style'
    style.textContent = `
      @keyframes confettiFall {
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
  }
  
  // Clean up after animation
  setTimeout(() => {
    confetti.forEach(el => el.remove())
  }, 5000)
}

export default function LearningStreak() {
  const [isOpen, setIsOpen] = useState(false)
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0])
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get random quote for the day (consistent per day)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length])
    
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const data: StreakData = JSON.parse(savedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Same day visit
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Consecutive day - increase streak!
        const newStreak = data.currentStreak + 1
        const newXp = data.xp + 25 // Bonus XP for maintaining streak
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisit: today,
          totalDaysLearning: data.totalDaysLearning + 1,
          xp: newXp
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Celebrate milestones
        if (newStreak === 3) {
          setTimeout(() => triggerCelebration('🎉 3-Day Streak! You\'re building momentum!'), 1000)
        } else if (newStreak === 7) {
          setTimeout(() => triggerCelebration('🔥 1 Week Streak! You\'re on fire!'), 1000)
        } else if (newStreak === 30) {
          setTimeout(() => triggerCelebration('🏆 30-Day Streak! Legendary dedication!'), 1000)
        } else if (newStreak % 10 === 0) {
          setTimeout(() => triggerCelebration(`⭐ ${newStreak}-Day Streak! Amazing!`), 1000)
        }
      } else {
        // Streak broken - start fresh but keep history
        const newData: StreakData = {
          ...data,
          currentStreak: 1,
          lastVisit: today,
          totalDaysLearning: data.totalDaysLearning + 1,
          xp: data.xp + 10
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever - welcome new learner!
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDaysLearning: 1,
        level: 'Curious Learner',
        xp: 10
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      
      // Welcome celebration
      setTimeout(() => triggerCelebration('🌟 Welcome to LearnHub! Your journey begins!'), 2000)
    }
  }, [])

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message)
    setShowCelebration(true)
    createConfetti()
    
    setTimeout(() => {
      setShowCelebration(false)
    }, 4000)
  }

  if (!mounted || !streakData) return null

  const levelInfo = getLevel(streakData.xp)

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-navy-900/95 backdrop-blur-xl px-8 py-6 rounded-2xl border border-primary-500/50 shadow-2xl shadow-primary-500/20 animate-bounce-in">
            <p className="text-2xl font-bold text-white text-center">{celebrationMessage}</p>
          </div>
        </div>
      )}

      {/* Floating Streak Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 group"
        aria-label="View learning streak"
      >
        <div className="relative">
          {/* Pulse animation for active streak */}
          {streakData.currentStreak >= 3 && (
            <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-25" />
          )}
          
          <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-110">
            <span className="text-2xl">{levelInfo.emoji}</span>
            
            {/* Streak count badge */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {streakData.currentStreak}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Streak Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-80 bg-navy-900/95 backdrop-blur-xl rounded-2xl border border-navy-700 shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">Your Level</p>
                  <p className="text-white font-bold text-lg flex items-center gap-2">
                    <span>{levelInfo.emoji}</span>
                    {levelInfo.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* XP Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-primary-100 mb-1">
                  <span>{streakData.xp} XP</span>
                  {levelInfo.nextLevel && <span>Next: {levelInfo.nextLevel}</span>}
                </div>
                <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 space-y-4">
              {/* Current Streak */}
              <div className="flex items-center justify-between p-4 bg-navy-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-navy-400 text-sm">Current Streak</p>
                    <p className="text-white font-bold text-xl">{streakData.currentStreak} days</p>
                  </div>
                </div>
              </div>

              {/* Other Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-navy-800/50 rounded-xl text-center">
                  <p className="text-2xl mb-1">🏆</p>
                  <p className="text-white font-semibold">{streakData.longestStreak}</p>
                  <p className="text-navy-400 text-xs">Best Streak</p>
                </div>
                <div className="p-3 bg-navy-800/50 rounded-xl text-center">
                  <p className="text-2xl mb-1">📅</p>
                  <p className="text-white font-semibold">{streakData.totalDaysLearning}</p>
                  <p className="text-navy-400 text-xs">Total Days</p>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="p-4 bg-gradient-to-br from-primary-500/10 to-primary-600/5 rounded-xl border border-primary-500/20">
                <p className="text-navy-200 text-sm italic mb-2">"{quote.quote}"</p>
                <p className="text-primary-400 text-xs">— {quote.author}</p>
              </div>

              {/* Encourage action */}
              <p className="text-center text-navy-400 text-sm">
                Keep learning to grow your streak! 🚀
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}