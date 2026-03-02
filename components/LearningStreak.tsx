'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
}

const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
]

function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '🔥'
  if (streak >= 7) return '⭐'
  if (streak >= 3) return '✨'
  return '🌱'
}

function getStreakMessage(streak: number): string {
  if (streak >= 30) return 'Legendary learner!'
  if (streak >= 14) return "You're on fire!"
  if (streak >= 7) return 'Amazing consistency!'
  if (streak >= 3) return 'Building momentum!'
  if (streak >= 1) return 'Great start!'
  return 'Start your streak today!'
}

function getDailyQuote(): { quote: string; author: string } {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isConsecutiveDay(lastVisit: Date, today: Date): boolean {
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(lastVisit, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const dailyQuote = getDailyQuote()

  useEffect(() => {
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date()
    
    if (storedData) {
      const parsed: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(parsed.lastVisit)
      
      if (isSameDay(lastVisitDate, today)) {
        // Same day, no update needed
        setStreakData(parsed)
      } else if (isConsecutiveDay(lastVisitDate, today)) {
        // Consecutive day - increment streak!
        const newStreak = parsed.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, parsed.longestStreak),
          lastVisit: today.toISOString(),
          totalDays: parsed.totalDays + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Show confetti for milestones
        if (newStreak === 7 || newStreak === 14 || newStreak === 30 || newStreak === 100) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken - reset to 1
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: parsed.longestStreak,
          lastVisit: today.toISOString(),
          totalDays: parsed.totalDays + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today.toISOString(),
        totalDays: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [])

  if (!streakData) return null

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}
      >
        <div 
          className="bg-gradient-to-br from-navy-900 to-navy-800 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Collapsed View */}
          {!isExpanded && (
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
              <div>
                <div className="text-white font-bold">{streakData.currentStreak} day streak</div>
                <div className="text-xs text-navy-400">{getStreakMessage(streakData.currentStreak)}</div>
              </div>
            </div>
          )}

          {/* Expanded View */}
          {isExpanded && (
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
                  Learning Streak
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(false)
                  }}
                  className="text-navy-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                  <div className="text-xs text-navy-400">Current</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Longest</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{streakData.totalDays}</div>
                  <div className="text-xs text-navy-400">Total Days</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-navy-400 mb-1">
                  <span>Progress to next milestone</span>
                  <span>{getNextMilestone(streakData.currentStreak)} days</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${getMilestoneProgress(streakData.currentStreak)}%` }}
                  />
                </div>
              </div>

              {/* Quote of the Day */}
              <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20 rounded-xl p-4">
                <div className="text-xs text-primary-400 font-medium mb-2 flex items-center gap-1">
                  <span>💡</span> Quote of the Day
                </div>
                <p className="text-sm text-navy-200 italic mb-2">"{dailyQuote.quote}"</p>
                <p className="text-xs text-navy-400">— {dailyQuote.author}</p>
              </div>

              {/* Encouragement */}
              <div className="mt-4 text-center">
                <p className="text-sm text-navy-300">
                  {getStreakMessage(streakData.currentStreak)} 
                  {streakData.currentStreak >= 7 && ' Keep it up! 🎉'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 60, 100, 365]
  for (const m of milestones) {
    if (current < m) return m
  }
  return current + 30
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 3, 7, 14, 30, 60, 100, 365]
  for (let i = 1; i < milestones.length; i++) {
    if (current < milestones[i]) {
      const prev = milestones[i - 1]
      const next = milestones[i]
      return ((current - prev) / (next - prev)) * 100
    }
  }
  return 100
}