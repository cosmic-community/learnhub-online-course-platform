'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DailyMotivationProps {
  totalCourses: number
  totalLessons: number
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The only way to do great work is to love what you learn.", author: "Steve Jobs" },
  { quote: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
]

const learningTips = [
  "💡 Try the Pomodoro technique: 25 minutes of focused learning, then a 5-minute break!",
  "💡 Teaching others what you learn helps reinforce your own understanding.",
  "💡 Take handwritten notes - it improves memory retention by 29%!",
  "💡 Review material before bed - your brain processes information during sleep.",
  "💡 Practice makes progress, not perfect. Keep going!",
  "💡 Break complex topics into smaller, manageable chunks.",
  "💡 Connect new knowledge to things you already know.",
  "💡 Stay hydrated! Your brain is 75% water.",
]

export default function DailyMotivation({ totalCourses, totalLessons }: DailyMotivationProps) {
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [tip, setTip] = useState(learningTips[0])
  const [dailyGoal, setDailyGoal] = useState(0)
  const [goalProgress, setGoalProgress] = useState(0)
  const [showGoalAchieved, setShowGoalAchieved] = useState(false)

  useEffect(() => {
    // Get random quote and tip based on day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length] ?? motivationalQuotes[0])
    setTip(learningTips[dayOfYear % learningTips.length] ?? learningTips[0])

    // Load daily goal progress
    const savedGoal = localStorage.getItem('daily-learning-goal')
    const savedProgress = localStorage.getItem('daily-learning-progress')
    const goalDate = localStorage.getItem('daily-goal-date')
    const todayStr = today.toDateString()

    if (goalDate !== todayStr) {
      // New day - reset progress
      localStorage.setItem('daily-goal-date', todayStr)
      localStorage.setItem('daily-learning-progress', '0')
      setGoalProgress(0)
    } else if (savedProgress) {
      setGoalProgress(parseInt(savedProgress, 10))
    }

    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal, 10))
    } else {
      setDailyGoal(30) // Default 30 minutes
      localStorage.setItem('daily-learning-goal', '30')
    }
  }, [])

  const addLearningTime = (minutes: number) => {
    const newProgress = Math.min(goalProgress + minutes, dailyGoal)
    setGoalProgress(newProgress)
    localStorage.setItem('daily-learning-progress', newProgress.toString())
    
    if (newProgress >= dailyGoal && goalProgress < dailyGoal) {
      setShowGoalAchieved(true)
      setTimeout(() => setShowGoalAchieved(false), 3000)
    }
  }

  const progressPercentage = dailyGoal > 0 ? Math.min((goalProgress / dailyGoal) * 100, 100) : 0

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Goal Achieved Animation */}
      {showGoalAchieved && (
        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center z-10 animate-pulse">
          <div className="text-center">
            <div className="text-6xl mb-2 animate-bounce">🎉</div>
            <div className="text-xl font-bold text-white">Daily Goal Achieved!</div>
          </div>
        </div>
      )}

      {/* Daily Quote */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">💬</span>
          <div>
            <p className="text-white italic text-lg leading-relaxed">&ldquo;{quote?.quote}&rdquo;</p>
            <p className="text-primary-400 text-sm mt-2">— {quote?.author}</p>
          </div>
        </div>
      </div>

      {/* Daily Learning Goal */}
      <div className="bg-navy-800/50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium flex items-center gap-2">
            <span>🎯</span> Daily Learning Goal
          </h4>
          <span className="text-primary-400 font-bold">
            {goalProgress}/{dailyGoal} min
          </span>
        </div>
        
        {/* Progress Ring */}
        <div className="relative h-3 bg-navy-700 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage >= 100 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => addLearningTime(5)}
            className="flex-1 py-2 px-3 bg-navy-700 hover:bg-navy-600 text-white text-sm rounded-lg transition-colors"
          >
            +5 min
          </button>
          <button 
            onClick={() => addLearningTime(15)}
            className="flex-1 py-2 px-3 bg-navy-700 hover:bg-navy-600 text-white text-sm rounded-lg transition-colors"
          >
            +15 min
          </button>
          <button 
            onClick={() => addLearningTime(30)}
            className="flex-1 py-2 px-3 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-lg transition-colors"
          >
            +30 min
          </button>
        </div>
      </div>

      {/* Learning Tip */}
      <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl p-4 border border-primary-500/20">
        <p className="text-navy-200 text-sm">{tip}</p>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-navy-800 flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalCourses}</div>
          <div className="text-xs text-navy-400">courses to explore</div>
        </div>
        <div className="h-8 w-px bg-navy-700" />
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{totalLessons}</div>
          <div className="text-xs text-navy-400">lessons available</div>
        </div>
        <div className="h-8 w-px bg-navy-700" />
        <Link href="/courses" className="btn-primary text-sm py-2 px-4">
          Start Learning →
        </Link>
      </div>
    </div>
  )
}