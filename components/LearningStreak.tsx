'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  className?: string
}

const learningTips = [
  "🧠 Consistency beats intensity. 15 minutes daily outperforms 3 hours weekly.",
  "📝 Teaching others is the fastest way to learn. Try explaining what you learned today!",
  "🎯 Focus on understanding concepts, not just syntax. The 'why' matters more than the 'how'.",
  "☕ Take breaks! Your brain consolidates learning during rest periods.",
  "🔄 Spaced repetition works. Review yesterday's material before starting new content.",
  "💪 Struggling is part of learning. If it feels hard, you're growing!",
  "🎨 Build projects, not tutorials. Real learning happens when you create.",
  "🤝 Join a community. Learning together accelerates progress.",
  "📚 Read documentation. It's often better than any tutorial.",
  "🌟 Celebrate small wins. You completed another day of learning!",
  "🔍 Debug systematically. Console.log is your friend, not your enemy.",
  "⏰ Set specific learning goals. 'Learn JavaScript' is vague. 'Build a todo app' is actionable.",
  "🎮 Make it fun! Gamify your learning with challenges and rewards.",
  "📱 Code every day, even if just for 10 minutes. Momentum matters.",
  "🌱 Growth mindset: 'I can't do this YET' is more powerful than 'I can't do this'."
]

const milestones = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak({ className = '' }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [dailyTip, setDailyTip] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [justHitMilestone, setJustHitMilestone] = useState(false)

  useEffect(() => {
    // Get or initialize streak data from localStorage
    const today = new Date().toDateString()
    const storedData = localStorage.getItem('learnhub-streak')
    
    if (storedData) {
      const data = JSON.parse(storedData)
      const lastVisit = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreak(data.streak)
      } else if (lastVisit === yesterday) {
        // Continuing streak
        const newStreak = data.streak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify({
          streak: newStreak,
          lastVisit: today
        }))
        
        // Check for milestone
        if (milestones.includes(newStreak)) {
          setShowConfetti(true)
          setJustHitMilestone(true)
          setTimeout(() => {
            setShowConfetti(false)
            setJustHitMilestone(false)
          }, 4000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learnhub-streak', JSON.stringify({
          streak: 1,
          lastVisit: today
        }))
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub-streak', JSON.stringify({
        streak: 1,
        lastVisit: today
      }))
    }
    
    // Set daily tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(learningTips[dayOfYear % learningTips.length])
    
    setIsLoaded(true)
  }, [])

  const getNextMilestone = () => {
    return milestones.find(m => m > streak) || streak + 1
  }

  const getStreakEmoji = () => {
    if (streak >= 365) return '🏆'
    if (streak >= 100) return '💎'
    if (streak >= 50) return '🌟'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '✨'
    if (streak >= 3) return '🌱'
    return '🎯'
  }

  const getMilestoneMessage = () => {
    if (streak >= 365) return "Legendary learner! One full year!"
    if (streak >= 100) return "Triple digits! Incredible dedication!"
    if (streak >= 50) return "Halfway to 100! You're unstoppable!"
    if (streak >= 30) return "A full month! You've built a habit!"
    if (streak >= 14) return "Two weeks strong! Keep it up!"
    if (streak >= 7) return "One week streak! You're on fire!"
    if (streak >= 3) return "3 days in a row! Great start!"
    return "Welcome! Start your streak today!"
  }

  if (!isLoaded) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="card p-6 h-40 bg-navy-800/50"></div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                fontSize: `${12 + Math.random() * 16}px`,
              }}
            >
              {['🎉', '⭐', '🔥', '✨', '🎊', '💫'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}
      
      <div className={`card p-6 transition-all duration-500 ${justHitMilestone ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-950' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl animate-pulse">{getStreakEmoji()}</span>
              Learning Streak
            </h3>
            <p className="text-sm text-navy-400 mt-1">{getMilestoneMessage()}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-yellow-400">
              {streak}
            </div>
            <div className="text-xs text-navy-400">
              {streak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {/* Progress to next milestone */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Progress to {getNextMilestone()} days</span>
            <span>{Math.round((streak / getNextMilestone()) * 100)}%</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-yellow-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((streak / getNextMilestone()) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Daily Tip */}
        <div className="bg-navy-800/50 rounded-lg p-4 border border-navy-700">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="text-sm font-medium text-primary-400 mb-1">Today's Learning Tip</h4>
              <p className="text-sm text-navy-300 leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}