'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  coursesCount: number
}

interface ProgressData {
  streak: number
  lastVisit: string
  totalVisits: number
  lessonsViewed: number
  minutesLearned: number
}

const STORAGE_KEY = 'learnhub_progress'

function getProgressData(): ProgressData {
  if (typeof window === 'undefined') {
    return { streak: 0, lastVisit: '', totalVisits: 0, lessonsViewed: 0, minutesLearned: 0 }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { streak: 0, lastVisit: '', totalVisits: 0, lessonsViewed: 0, minutesLearned: 0 }
  }
  
  try {
    return JSON.parse(stored) as ProgressData
  } catch {
    return { streak: 0, lastVisit: '', totalVisits: 0, lessonsViewed: 0, minutesLearned: 0 }
  }
}

function updateStreak(data: ProgressData): ProgressData {
  const today = new Date().toDateString()
  const lastVisit = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
  
  if (lastVisit === today) {
    // Already visited today, no streak change
    return data
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newStreak = data.streak
  if (lastVisit === yesterdayStr) {
    // Visited yesterday, increment streak
    newStreak = data.streak + 1
  } else if (lastVisit !== today) {
    // Missed a day, reset streak to 1
    newStreak = 1
  }
  
  return {
    ...data,
    streak: newStreak,
    lastVisit: new Date().toISOString(),
    totalVisits: data.totalVisits + 1,
  }
}

export default function LearningProgress({ coursesCount }: LearningProgressProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [streakAnimation, setStreakAnimation] = useState(false)

  useEffect(() => {
    const data = getProgressData()
    const updated = updateStreak(data)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setProgress(updated)
    
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100)
    
    // Trigger streak fire animation if streak > 1
    if (updated.streak > 1) {
      setTimeout(() => setStreakAnimation(true), 500)
    }
  }, [])

  if (!progress) {
    return (
      <div className="animate-pulse flex items-center justify-center gap-8 py-4">
        <div className="h-20 w-32 bg-navy-800 rounded-xl" />
        <div className="h-20 w-32 bg-navy-800 rounded-xl" />
        <div className="h-20 w-32 bg-navy-800 rounded-xl" />
      </div>
    )
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return "You're on fire!"
    if (streak >= 7) return 'Amazing dedication!'
    if (streak >= 3) return 'Building momentum!'
    if (streak === 1) return 'Welcome back!'
    return 'Start your streak!'
  }

  const getProgressPercentage = (): number => {
    // Simulate progress based on visits (max 100%)
    return Math.min((progress.totalVisits / 50) * 100, 100)
  }

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Streak Card */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl px-6 py-4 min-w-[200px]">
          <div className={`text-4xl transition-transform duration-300 ${streakAnimation ? 'animate-bounce' : ''}`}>
            {getStreakEmoji(progress.streak)}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{progress.streak}</span>
              <span className="text-orange-400 text-sm font-medium">day streak</span>
            </div>
            <div className="text-sm text-navy-400">{getStreakMessage(progress.streak)}</div>
          </div>
          {progress.streak >= 3 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
          )}
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-navy-800"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${getProgressPercentage() * 2.83} 283`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{Math.round(getProgressPercentage())}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-navy-300">Learning Journey</div>
            <div className="text-xs text-navy-500">{progress.totalVisits} total visits</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{coursesCount}</div>
            <div className="text-xs text-navy-400">Available Courses</div>
          </div>
          <div className="w-px h-10 bg-navy-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{progress.totalVisits}</div>
            <div className="text-xs text-navy-400">Your Visits</div>
          </div>
        </div>

        {/* Encourage action */}
        <div className="hidden lg:block">
          <a 
            href="/courses" 
            className="inline-flex items-center gap-2 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl px-4 py-3 transition-colors group"
          >
            <span className="text-primary-400 font-medium">Continue Learning</span>
            <svg className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}