'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  totalLessons: number
  completedLessons?: number
}

export default function LearningStreak({ totalLessons, completedLessons = 0 }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [progress, setProgress] = useState(0)
  const [lastLesson, setLastLesson] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Load streak from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-learning-visit')
    const savedProgress = localStorage.getItem('learning-progress')
    const savedLastLesson = localStorage.getItem('last-lesson-slug')
    
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastVisit === today) {
      // Already visited today, keep streak
      setStreak(parseInt(savedStreak || '1'))
    } else if (lastVisit === yesterday) {
      // Visited yesterday, increment streak
      const newStreak = parseInt(savedStreak || '0') + 1
      setStreak(newStreak)
      localStorage.setItem('learning-streak', newStreak.toString())
      localStorage.setItem('last-learning-visit', today)
      
      // Show celebration for streak milestones
      if (newStreak % 7 === 0 || newStreak === 3) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    } else {
      // Streak broken, start over
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-learning-visit', today)
    }
    
    // Load progress
    if (savedProgress) {
      setProgress(parseInt(savedProgress))
    }
    
    if (savedLastLesson) {
      setLastLesson(savedLastLesson)
    }
  }, [])

  // Calculate progress percentage
  const progressPercentage = totalLessons > 0 ? Math.round((progress / totalLessons) * 100) : 0
  const circumference = 2 * Math.PI * 40 // radius = 40
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  if (!isClient) {
    return null
  }

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#29ABE2', '#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6'][Math.floor(Math.random() * 5)],
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Learning Streak Card */}
      <div className="card p-6">
        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-navy-800"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#29ABE2" />
                  <stop offset="100%" stopColor="#4ECDC4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{progressPercentage}%</span>
              <span className="text-xs text-navy-400">Complete</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🔥</span>
              <div>
                <div className="text-2xl font-bold text-white">{streak} Day Streak!</div>
                <p className="text-navy-400 text-sm">Keep learning to maintain your streak</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-primary-400">{progress}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-semibold text-primary-400">{totalLessons - progress}</div>
                <div className="text-xs text-navy-400">Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Resume Button */}
        {lastLesson && (
          <a
            href={`/courses`}
            className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Continue Learning
          </a>
        )}

        {/* Motivational Message */}
        <div className="mt-4 pt-4 border-t border-navy-800">
          <p className="text-sm text-navy-300 text-center italic">
            {streak >= 7 
              ? "🏆 Amazing! You're on a roll! Keep up the incredible momentum!" 
              : streak >= 3 
                ? "⭐ Great work! You're building a solid learning habit!"
                : "💪 Every journey begins with a single step. Let's learn today!"}
          </p>
        </div>
      </div>
    </>
  )
}