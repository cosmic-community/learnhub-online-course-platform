'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

const motivationalMessages = [
  "🔥 You're on fire! Keep the momentum going!",
  "⭐ Consistency is key to mastery!",
  "🚀 Every day is a step closer to your goals!",
  "💪 Champions are made through daily practice!",
  "🎯 Focus + consistency = unstoppable you!",
  "🌟 Small steps lead to giant leaps!",
  "🏆 You're building something amazing!",
]

const learningTips = [
  { icon: "💡", tip: "Take short breaks every 25 minutes to boost retention.", category: "Focus" },
  { icon: "📝", tip: "Write notes by hand - it improves memory by 30%!", category: "Memory" },
  { icon: "🎯", tip: "Set specific goals for each learning session.", category: "Goals" },
  { icon: "🔄", tip: "Review yesterday's material before starting new content.", category: "Review" },
  { icon: "💬", tip: "Teach what you learn to solidify your understanding.", category: "Practice" },
  { icon: "😴", tip: "Sleep consolidates learning. Don't skip rest!", category: "Wellness" },
  { icon: "🎮", tip: "Practice coding challenges to reinforce concepts.", category: "Practice" },
  { icon: "📚", tip: "Mix different topics to improve problem-solving skills.", category: "Strategy" },
]

export default function LearningStreak({ totalCourses, totalLessons, totalHours }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [tip, setTip] = useState(learningTips[0])
  const [message, setMessage] = useState(motivationalMessages[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    // Simulate a streak based on localStorage (in real app, this would come from backend)
    const savedStreak = localStorage.getItem('learnhub-streak')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
        
        // Show fireworks for milestone streaks
        if (newStreak % 7 === 0) {
          setShowFireworks(true)
          setTimeout(() => setShowFireworks(false), 3000)
        }
      } else {
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      }
      localStorage.setItem('learnhub-last-visit', today)
    }

    // Random tip and message
    const randomTip = learningTips[Math.floor(Math.random() * learningTips.length)]
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    setTip(randomTip)
    setMessage(randomMessage)

    // Animate on mount
    setIsAnimating(true)
  }, [])

  const getStreakEmoji = () => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakLevel = () => {
    if (streak >= 30) return { level: 'Legend', color: 'from-yellow-500 to-amber-600' }
    if (streak >= 14) return { level: 'On Fire', color: 'from-orange-500 to-red-600' }
    if (streak >= 7) return { level: 'Dedicated', color: 'from-purple-500 to-pink-600' }
    if (streak >= 3) return { level: 'Getting Started', color: 'from-blue-500 to-cyan-600' }
    return { level: 'New Learner', color: 'from-green-500 to-emerald-600' }
  }

  const streakInfo = getStreakLevel()

  return (
    <div className="relative">
      {/* Fireworks effect for milestone streaks */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1s',
              }}
            >
              <span className="text-2xl">✨</span>
            </div>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Streak Card */}
        <div className="card p-6 relative overflow-hidden group">
          <div className={`absolute inset-0 bg-gradient-to-br ${streakInfo.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
              <span className="text-3xl animate-bounce">{getStreakEmoji()}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-5xl font-bold bg-gradient-to-r ${streakInfo.color} bg-clip-text text-transparent`}>
                {streak}
              </span>
              <span className="text-navy-400">days</span>
            </div>
            
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${streakInfo.color} text-white mb-3`}>
              {streakInfo.level}
            </div>
            
            <p className="text-sm text-navy-300">{message}</p>
            
            {/* Streak progress dots */}
            <div className="flex gap-1 mt-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < (streak % 7 || (streak >= 7 ? 7 : 0))
                      ? `bg-gradient-to-r ${streakInfo.color}`
                      : 'bg-navy-700'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-xs text-navy-500 mt-2">
              {7 - (streak % 7)} days until next milestone!
            </p>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="card p-6 group hover:border-primary-500/50 transition-colors">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Platform Stats
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-navy-400">Available Courses</span>
              <span className="text-2xl font-bold text-white">{totalCourses}</span>
            </div>
            <div className="h-px bg-navy-800" />
            <div className="flex items-center justify-between">
              <span className="text-navy-400">Total Lessons</span>
              <span className="text-2xl font-bold text-white">{totalLessons}</span>
            </div>
            <div className="h-px bg-navy-800" />
            <div className="flex items-center justify-between">
              <span className="text-navy-400">Hours of Content</span>
              <span className="text-2xl font-bold text-primary-400">{totalHours}+</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
            <p className="text-sm text-primary-300">
              🎓 That's enough to become proficient in multiple technologies!
            </p>
          </div>
        </div>

        {/* Tip of the Day Card */}
        <div className="card p-6 group hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Tip of the Day
            </h3>
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
              {tip.category}
            </span>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-4xl">{tip.icon}</span>
            <p className="text-navy-200 leading-relaxed">{tip.tip}</p>
          </div>
          
          <button
            onClick={() => {
              const newTip = learningTips[Math.floor(Math.random() * learningTips.length)]
              setTip(newTip)
            }}
            className="mt-4 w-full py-2 text-sm text-navy-400 hover:text-white border border-navy-700 hover:border-navy-600 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get Another Tip
          </button>
        </div>
      </div>
    </div>
  )
}