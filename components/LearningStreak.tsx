'use client'

import { useState, useEffect } from 'react'

interface DayActivity {
  day: string
  active: boolean
  lessons: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [weekActivity, setWeekActivity] = useState<DayActivity[]>([])
  const [dailyGoal, setDailyGoal] = useState({ current: 0, target: 3 })

  useEffect(() => {
    // Simulate loading streak data (in a real app, this would come from user data)
    const savedStreak = localStorage.getItem('learning-streak')
    const savedLastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()

    if (savedLastVisit !== today) {
      // New day visit
      const newStreak = savedStreak ? parseInt(savedStreak) + 1 : 1
      setStreak(newStreak)
      localStorage.setItem('learning-streak', newStreak.toString())
      localStorage.setItem('last-visit-date', today)

      // Check for milestone
      if (newStreak % 7 === 0 || newStreak === 1) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    } else {
      setStreak(savedStreak ? parseInt(savedStreak) : 1)
    }

    // Generate week activity
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const currentDay = new Date().getDay()
    const activity = days.map((day, index) => ({
      day,
      active: index <= currentDay && Math.random() > 0.3,
      lessons: index <= currentDay ? Math.floor(Math.random() * 5) : 0
    }))
    setWeekActivity(activity)

    // Set daily goal progress
    setDailyGoal({ current: Math.floor(Math.random() * 3) + 1, target: 3 })

    // Trigger entrance animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  const progress = (dailyGoal.current / dailyGoal.target) * 100
  const circumference = 2 * Math.PI * 36

  return (
    <div className={`relative transition-all duration-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Your Learning Journey</h3>
            <p className="text-navy-400 text-sm">Keep the momentum going!</p>
          </div>
          
          {/* Streak Counter */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-full border border-orange-500/30">
            <span className="text-2xl animate-pulse-fire">🔥</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-orange-300">day streak</div>
            </div>
          </div>
        </div>

        {/* Week Activity */}
        <div className="mb-6">
          <div className="flex justify-between items-end gap-2">
            {weekActivity.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    day.active 
                      ? 'bg-gradient-to-t from-primary-600 to-primary-400' 
                      : 'bg-navy-800'
                  }`}
                  style={{ 
                    height: day.active ? `${Math.max(20, day.lessons * 12)}px` : '8px',
                    transitionDelay: `${index * 100}ms`
                  }}
                />
                <span className={`text-xs mt-2 ${
                  index === new Date().getDay() 
                    ? 'text-primary-400 font-semibold' 
                    : 'text-navy-500'
                }`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Goal Progress Ring */}
        <div className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-navy-700"
              />
              {/* Progress circle */}
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{dailyGoal.current}/{dailyGoal.target}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">Daily Goal</h4>
            <p className="text-navy-400 text-sm mb-2">
              {dailyGoal.current >= dailyGoal.target 
                ? '🎉 Goal achieved! Great job!' 
                : `Complete ${dailyGoal.target - dailyGoal.current} more lesson${dailyGoal.target - dailyGoal.current > 1 ? 's' : ''} today`}
            </p>
            <div className="flex gap-1">
              {[...Array(dailyGoal.target)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    i < dailyGoal.current 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                      : 'bg-navy-700'
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-4 text-center">
          <p className="text-navy-300 text-sm">
            {streak >= 7 
              ? "🌟 You're on fire! Keep this amazing streak going!"
              : streak >= 3
              ? "💪 Great progress! You're building a learning habit!"
              : "🚀 Every expert was once a beginner. Keep learning!"}
          </p>
        </div>
      </div>
    </div>
  )
}