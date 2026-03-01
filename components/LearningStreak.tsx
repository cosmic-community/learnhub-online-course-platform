'use client'

import { useState, useEffect } from 'react'

const motivationalQuotes = [
  { quote: "The only way to do great work is to love what you learn.", author: "Inspired by Steve Jobs" },
  { quote: "Every expert was once a beginner.", author: "Helen Hayes" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isNewDay, setIsNewDay] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Get stored streak data
    const storedData = localStorage.getItem('learning-streak-data')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data = JSON.parse(storedData)
      const lastVisit = data.lastVisit
      const currentStreak = data.streak || 0
      
      if (lastVisit === today) {
        // Same day visit
        setStreak(currentStreak)
      } else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastVisit === yesterday.toDateString()) {
          // Consecutive day - increment streak!
          const newStreak = currentStreak + 1
          setStreak(newStreak)
          setIsNewDay(true)
          localStorage.setItem('learning-streak-data', JSON.stringify({
            lastVisit: today,
            streak: newStreak
          }))
          
          // Trigger confetti for streak milestones
          if (newStreak > 0) {
            setShowConfetti(true)
            generateConfetti()
            setTimeout(() => setShowConfetti(false), 3000)
          }
        } else {
          // Streak broken, start fresh
          setStreak(1)
          setIsNewDay(true)
          localStorage.setItem('learning-streak-data', JSON.stringify({
            lastVisit: today,
            streak: 1
          }))
        }
      }
    } else {
      // First visit
      setStreak(1)
      setIsNewDay(true)
      localStorage.setItem('learning-streak-data', JSON.stringify({
        lastVisit: today,
        streak: 1
      }))
      setShowConfetti(true)
      generateConfetti()
      setTimeout(() => setShowConfetti(false), 3000)
    }

    // Set daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])
  }, [])

  const generateConfetti = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
    const pieces: ConfettiPiece[] = []
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2
      })
    }
    
    setConfettiPieces(pieces)
  }

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '⭐'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = () => {
    if (streak >= 30) return "You're a learning champion!"
    if (streak >= 14) return "Two weeks strong! Amazing!"
    if (streak >= 7) return "One week streak! Keep it up!"
    if (streak >= 3) return "You're building momentum!"
    return "Great start! Come back tomorrow!"
  }

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm animate-confetti"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Card */}
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-bounce-gentle">{getStreakEmoji()}</div>
            <div>
              <div className="text-sm text-navy-400 uppercase tracking-wider">Learning Streak</div>
              <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                {streak}
                <span className="text-lg text-navy-400">
                  {streak === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
          
          {isNewDay && (
            <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full animate-pulse">
              +1 Today!
            </div>
          )}
        </div>
        
        <p className="text-navy-300 text-sm mb-4">{getStreakMessage()}</p>
        
        {/* Progress Bar to next milestone */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Progress to next milestone</span>
            <span>{getNextMilestone(streak)}</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${getMilestoneProgress(streak)}%` }}
            />
          </div>
        </div>

        {/* Daily Quote */}
        <div className="pt-4 border-t border-navy-700/50">
          <div className="flex gap-2">
            <span className="text-2xl opacity-50">"</span>
            <div>
              <p className="text-navy-200 italic text-sm leading-relaxed">{quote.quote}</p>
              <p className="text-navy-400 text-xs mt-2">— {quote.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getNextMilestone(streak: number): string {
  if (streak < 3) return '3 days 🌟'
  if (streak < 7) return '7 days 🔥'
  if (streak < 14) return '14 days ⭐'
  if (streak < 30) return '30 days 🏆'
  return 'Legend status! 👑'
}

function getMilestoneProgress(streak: number): number {
  if (streak < 3) return (streak / 3) * 100
  if (streak < 7) return ((streak - 3) / 4) * 100
  if (streak < 14) return ((streak - 7) / 7) * 100
  if (streak < 30) return ((streak - 14) / 16) * 100
  return 100
}