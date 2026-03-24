'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  className?: string
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function LearningStreak({ className = '' }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [todayQuote, setTodayQuote] = useState(motivationalQuotes[0])
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Get streak from localStorage
    const storedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-learning-visit')
    const today = new Date().toDateString()
    
    if (lastVisit === today) {
      // Already visited today, keep the streak
      setStreak(storedStreak ? parseInt(storedStreak, 10) : 1)
    } else if (lastVisit) {
      // Check if yesterday
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Continuing streak!
        const newStreak = (storedStreak ? parseInt(storedStreak, 10) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        localStorage.setItem('last-learning-visit', today)
        
        // Celebrate milestones
        if (newStreak % 7 === 0 || newStreak === 3 || newStreak === 30) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
        localStorage.setItem('last-learning-visit', today)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-learning-visit', today)
    }

    // Set quote of the day based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTodayQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    // Show widget after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return "Legendary learner!"
    if (streak >= 14) return "You're on fire!"
    if (streak >= 7) return "One week strong!"
    if (streak >= 3) return "Building momentum!"
    return "Great start!"
  }

  if (!isVisible) return null

  return (
    <>
      {/* Celebration confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div
        className={`fixed bottom-24 left-5 z-40 transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } ${className}`}
      >
        <div
          className={`bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-80' : 'w-auto'
          }`}
        >
          {/* Collapsed View - Just the streak button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 p-4 w-full hover:bg-navy-700/50 transition-colors"
          >
            <div className="relative">
              <span className="text-3xl animate-bounce-slow">{getStreakEmoji(streak)}</span>
              {streak >= 3 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </span>
              )}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-navy-400">day streak</div>
            </div>
            <svg
              className={`w-4 h-4 text-navy-400 ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded View */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4 animate-fadeIn">
              {/* Streak Progress */}
              <div className="bg-navy-800/50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-navy-300">{getStreakMessage(streak)}</span>
                  <span className="text-xs text-primary-400 font-medium">
                    {streak >= 7 ? `${Math.floor(streak / 7)} weeks` : `${7 - streak} days to 🔥`}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        i < (streak % 7 || (streak >= 7 ? 7 : 0))
                          ? 'bg-gradient-to-r from-primary-500 to-primary-400'
                          : 'bg-navy-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Daily Quote */}
              <div className="bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl p-3 border-l-2 border-primary-500">
                <p className="text-sm text-navy-200 italic mb-1">"{todayQuote.quote}"</p>
                <p className="text-xs text-navy-400">— {todayQuote.author}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-navy-800/30 rounded-lg">
                  <div className="text-lg font-bold text-green-400">🌱</div>
                  <div className="text-xs text-navy-400">Started</div>
                </div>
                <div className="text-center p-2 bg-navy-800/30 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">⚡</div>
                  <div className="text-xs text-navy-400">Active</div>
                </div>
                <div className="text-center p-2 bg-navy-800/30 rounded-lg">
                  <div className="text-lg font-bold text-primary-400">📚</div>
                  <div className="text-xs text-navy-400">Learning</div>
                </div>
              </div>

              {/* Milestone badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-navy-400">Milestones:</span>
                <span className={`text-lg ${streak >= 3 ? '' : 'grayscale opacity-50'}`} title="3-day streak">✨</span>
                <span className={`text-lg ${streak >= 7 ? '' : 'grayscale opacity-50'}`} title="7-day streak">🔥</span>
                <span className={`text-lg ${streak >= 14 ? '' : 'grayscale opacity-50'}`} title="14-day streak">⭐</span>
                <span className={`text-lg ${streak >= 30 ? '' : 'grayscale opacity-50'}`} title="30-day streak">🏆</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}