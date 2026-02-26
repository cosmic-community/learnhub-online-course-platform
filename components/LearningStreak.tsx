'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  totalCourses: number
  totalLessons: number
}

interface LearningProgress {
  viewedLessons: string[]
  lastVisitDate: string
  streakCount: number
  longestStreak: number
  totalTimeSpent: number // in minutes
}

const STORAGE_KEY = 'learnhub-progress'

function getDefaultProgress(): LearningProgress {
  return {
    viewedLessons: [],
    lastVisitDate: '',
    streakCount: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
  }
}

function isSameDay(date1: string, date2: string): boolean {
  return date1.split('T')[0] === date2.split('T')[0]
}

function isYesterday(lastDate: string, today: string): boolean {
  const last = new Date(lastDate)
  const current = new Date(today)
  const diffTime = current.getTime() - last.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

export default function LearningStreak({ totalCourses, totalLessons }: LearningStreakProps) {
  const [progress, setProgress] = useState<LearningProgress>(getDefaultProgress())
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMotivation, setShowMotivation] = useState(false)

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(STORAGE_KEY)
    const today = new Date().toISOString()
    
    if (saved) {
      try {
        const parsed: LearningProgress = JSON.parse(saved)
        
        // Check if we need to update the streak
        if (parsed.lastVisitDate) {
          if (isSameDay(parsed.lastVisitDate, today)) {
            // Same day, keep streak
            setProgress(parsed)
          } else if (isYesterday(parsed.lastVisitDate, today)) {
            // Yesterday, increment streak
            const newStreak = parsed.streakCount + 1
            const updated = {
              ...parsed,
              streakCount: newStreak,
              longestStreak: Math.max(newStreak, parsed.longestStreak),
              lastVisitDate: today,
            }
            setProgress(updated)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            setShowMotivation(true)
          } else {
            // More than a day, reset streak
            const updated = {
              ...parsed,
              streakCount: 1,
              lastVisitDate: today,
            }
            setProgress(updated)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          }
        } else {
          // First visit with saved data
          const updated = {
            ...parsed,
            streakCount: 1,
            lastVisitDate: today,
          }
          setProgress(updated)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
      } catch {
        // Invalid JSON, start fresh
        const newProgress = {
          ...getDefaultProgress(),
          streakCount: 1,
          lastVisitDate: today,
        }
        setProgress(newProgress)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
      }
    } else {
      // First visit ever
      const newProgress = {
        ...getDefaultProgress(),
        streakCount: 1,
        lastVisitDate: today,
      }
      setProgress(newProgress)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
    }
    
    setIsLoaded(true)
  }, [])

  // Auto-hide motivation message
  useEffect(() => {
    if (showMotivation) {
      const timer = setTimeout(() => setShowMotivation(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showMotivation])

  const progressPercent = totalLessons > 0 
    ? Math.round((progress.viewedLessons.length / totalLessons) * 100) 
    : 0

  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-navy-800/50 rounded-2xl"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Motivation Toast */}
      {showMotivation && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce z-10">
          <span className="flex items-center gap-2">
            🎉 Amazing! You're on a {progress.streakCount} day streak!
          </span>
        </div>
      )}

      <div className="card p-6 md:p-8 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-6xl animate-pulse">🔥</div>
              {progress.streakCount >= 7 && (
                <div className="absolute -top-1 -right-1 text-2xl animate-bounce">⭐</div>
              )}
            </div>
            <div>
              <div className="text-4xl font-bold text-white">
                {progress.streakCount}
                <span className="text-lg font-normal text-navy-400 ml-2">
                  day{progress.streakCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-navy-300 text-sm">
                {progress.streakCount >= 30 
                  ? "🏆 Learning Legend!" 
                  : progress.streakCount >= 14 
                    ? "🌟 On Fire!" 
                    : progress.streakCount >= 7 
                      ? "💪 Dedicated Learner!" 
                      : "Keep it going!"}
              </div>
              {progress.longestStreak > progress.streakCount && (
                <div className="text-navy-500 text-xs mt-1">
                  Best: {progress.longestStreak} days
                </div>
              )}
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Lessons Completed */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">📚</span>
                <span className="text-2xl font-bold text-white">
                  {progress.viewedLessons.length}
                  <span className="text-navy-400 text-sm font-normal">/{totalLessons}</span>
                </span>
              </div>
              <div className="text-navy-400 text-sm">Lessons Viewed</div>
            </div>

            {/* Progress Bar */}
            <div className="w-48">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-navy-400">Overall Progress</span>
                <span className="text-primary-400 font-semibold">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {progressPercent > 0 && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 border-2 border-primary-500/30 flex items-center justify-center mx-auto mb-2">
                <span className="text-3xl">
                  {progressPercent >= 100 ? '🎓' : 
                   progressPercent >= 75 ? '🌟' : 
                   progressPercent >= 50 ? '📖' : 
                   progressPercent >= 25 ? '🚀' : '🎯'}
                </span>
              </div>
              <div className="text-navy-400 text-xs">
                {progressPercent >= 100 ? 'Graduate!' : 
                 progressPercent >= 75 ? 'Almost There!' : 
                 progressPercent >= 50 ? 'Halfway!' : 
                 progressPercent >= 25 ? 'Great Start!' : 'Just Beginning'}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Streak Visualization */}
        <div className="mt-6 pt-6 border-t border-navy-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-400 text-sm">This Week&apos;s Learning</span>
            <span className="text-primary-400 text-sm font-medium">
              {Math.min(progress.streakCount, 7)}/7 days
            </span>
          </div>
          <div className="flex gap-2 justify-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const isActive = index < Math.min(progress.streakCount, 7)
              const isToday = index === new Date().getDay() - 1 || (new Date().getDay() === 0 && index === 6)
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                        : 'bg-navy-800 text-navy-600'
                    } ${isToday ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900' : ''}`}
                  >
                    {isActive ? '✓' : '○'}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-primary-400' : 'text-navy-600'}`}>
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Export helper function to track lesson views (used by lesson pages)
export function trackLessonView(lessonSlug: string): void {
  if (typeof window === 'undefined') return
  
  const saved = localStorage.getItem(STORAGE_KEY)
  const progress: LearningProgress = saved 
    ? JSON.parse(saved) 
    : getDefaultProgress()
  
  if (!progress.viewedLessons.includes(lessonSlug)) {
    progress.viewedLessons.push(lessonSlug)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    
    // Trigger confetti for milestone lessons
    if (progress.viewedLessons.length % 5 === 0) {
      triggerConfetti()
    }
  }
}

// Simple confetti effect
function triggerConfetti(): void {
  const colors = ['#29ABE2', '#FFFF00', '#FF6B6B', '#4ECDC4', '#A78BFA']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 4000)
  }
}