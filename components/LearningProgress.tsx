'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalMinutes: number
}

export default function LearningProgress({ totalCourses, totalMinutes }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load progress from localStorage
    const savedStreak = localStorage.getItem('learnhub-streak')
    const savedLessons = localStorage.getItem('learnhub-completed-lessons')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    
    const today = new Date().toDateString()
    
    if (savedStreak) {
      const streakCount = parseInt(savedStreak, 10)
      
      // Check if user visited yesterday to maintain streak
      if (lastVisit) {
        const lastDate = new Date(lastVisit)
        const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
          // Same day, keep streak
          setStreak(streakCount)
        } else if (diffDays === 1) {
          // Consecutive day, increment streak
          const newStreak = streakCount + 1
          setStreak(newStreak)
          localStorage.setItem('learnhub-streak', newStreak.toString())
          
          // Show celebration for milestone streaks
          if (newStreak % 7 === 0) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }
        } else {
          // Streak broken, reset to 1
          setStreak(1)
          localStorage.setItem('learnhub-streak', '1')
        }
      } else {
        setStreak(streakCount)
      }
    } else {
      // First visit, start streak at 1
      setStreak(1)
      localStorage.setItem('learnhub-streak', '1')
    }
    
    localStorage.setItem('learnhub-last-visit', today)
    
    if (savedLessons) {
      setCompletedLessons(parseInt(savedLessons, 10))
    }
    
    // Trigger animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  const progressPercentage = Math.min((completedLessons / (totalCourses * 3)) * 100, 100)
  const hours = Math.floor(totalMinutes / 60)
  
  // Calculate ring animation values
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <div className="card p-8 relative overflow-hidden">
      {/* Confetti effect for milestones */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#29ABE2', '#4CAF50', '#FF6B6B', '#FFD93D', '#6BCB77'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-8">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={isAnimating ? strokeDashoffset : circumference}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#29ABE2" />
                <stop offset="100%" stopColor="#4CAF50" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{Math.round(progressPercentage)}%</span>
            <span className="text-xs text-navy-400">Complete</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Your Progress</h3>
          
          {/* Streak Counter */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
            <div className="text-3xl animate-pulse-slow">🔥</div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{streak} Day Streak!</div>
              <div className="text-xs text-navy-400">Keep learning every day</div>
            </div>
          </div>
          
          {/* Mini Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-navy-800/50 rounded-lg">
              <div className="text-lg font-bold text-primary-400">{completedLessons}</div>
              <div className="text-xs text-navy-400">Lessons Done</div>
            </div>
            <div className="p-3 bg-navy-800/50 rounded-lg">
              <div className="text-lg font-bold text-green-400">{hours}h+</div>
              <div className="text-xs text-navy-400">Content Available</div>
            </div>
          </div>
          
          {/* Quick Action */}
          <button
            onClick={() => {
              const newCount = completedLessons + 1
              setCompletedLessons(newCount)
              localStorage.setItem('learnhub-completed-lessons', newCount.toString())
              
              // Celebration for every 5 lessons
              if (newCount % 5 === 0) {
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 2000)
              }
            }}
            className="w-full py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-sm font-medium transition-all duration-200 border border-primary-500/30 hover:border-primary-500/50"
          >
            ✨ Mark a Lesson Complete
          </button>
        </div>
      </div>
    </div>
  )
}