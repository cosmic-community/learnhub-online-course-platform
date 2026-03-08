'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface ViewedCourse {
  slug: string
  title: string
  thumbnail?: string
  viewedAt: number
}

interface ProgressData {
  coursesViewed: string[]
  lastVisit: string
  streak: number
  totalVisits: number
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#38bdf8', '#818cf8', '#f472b6', '#fbbf24', '#34d399']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LearningProgressTracker({ totalCourses }: { totalCourses: number }) {
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [recentCourses, setRecentCourses] = useState<ViewedCourse[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [streakMessage, setStreakMessage] = useState('')

  const checkStreak = useCallback((lastVisit: string, currentStreak: number): number => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastVisit === today) {
      return currentStreak
    } else if (lastVisit === yesterday) {
      return currentStreak + 1
    } else {
      return 1
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Load progress data
    const storedProgress = localStorage.getItem('learnhub-progress')
    const storedCourses = localStorage.getItem('learnhub-recent-courses')
    
    const today = new Date().toDateString()
    
    if (storedProgress) {
      const parsed: ProgressData = JSON.parse(storedProgress)
      const newStreak = checkStreak(parsed.lastVisit, parsed.streak)
      
      const updatedProgress: ProgressData = {
        ...parsed,
        lastVisit: today,
        streak: newStreak,
        totalVisits: parsed.lastVisit === today ? parsed.totalVisits : parsed.totalVisits + 1
      }
      
      // Check for milestone celebrations
      if (newStreak > parsed.streak && newStreak % 7 === 0) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      
      localStorage.setItem('learnhub-progress', JSON.stringify(updatedProgress))
      setProgressData(updatedProgress)
      
      // Set streak message
      if (newStreak >= 30) {
        setStreakMessage("🏆 Learning Legend!")
      } else if (newStreak >= 14) {
        setStreakMessage("🔥 On Fire!")
      } else if (newStreak >= 7) {
        setStreakMessage("⭐ Consistent!")
      } else if (newStreak >= 3) {
        setStreakMessage("📈 Building momentum!")
      }
    } else {
      const newProgress: ProgressData = {
        coursesViewed: [],
        lastVisit: today,
        streak: 1,
        totalVisits: 1
      }
      localStorage.setItem('learnhub-progress', JSON.stringify(newProgress))
      setProgressData(newProgress)
    }
    
    if (storedCourses) {
      const courses: ViewedCourse[] = JSON.parse(storedCourses)
      setRecentCourses(courses.slice(0, 3))
    }
  }, [checkStreak])

  if (!mounted || !progressData) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-navy-800 rounded w-2/3"></div>
      </div>
    )
  }

  const viewedCount = progressData.coursesViewed.length
  const progressPercentage = totalCourses > 0 ? Math.min((viewedCount / totalCourses) * 100, 100) : 0

  return (
    <div className="card p-6 relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Your Learning Journey
        </h3>
        {progressData.streak > 1 && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 px-3 py-1 rounded-full">
            <span className="text-xl animate-bounce">🔥</span>
            <span className="text-sm font-medium text-orange-400">{progressData.streak} day streak!</span>
          </div>
        )}
      </div>

      {/* Streak Message */}
      {streakMessage && (
        <div className="mb-4 text-center py-2 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-lg">
          <p className="text-primary-400 font-medium">{streakMessage}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-navy-400">Courses explored</span>
          <span className="text-white font-medium">{viewedCount} / {totalCourses}</span>
        </div>
        <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-navy-800/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{progressData.streak}</div>
          <div className="text-xs text-navy-400">Day Streak</div>
        </div>
        <div className="text-center p-3 bg-navy-800/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{progressData.totalVisits}</div>
          <div className="text-xs text-navy-400">Total Visits</div>
        </div>
        <div className="text-center p-3 bg-navy-800/50 rounded-lg">
          <div className="text-2xl font-bold text-white">{viewedCount}</div>
          <div className="text-xs text-navy-400">Courses Seen</div>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentCourses.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-navy-400 mb-3">Continue Learning</h4>
          <div className="space-y-2">
            {recentCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg bg-navy-800/30 hover:bg-navy-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center text-lg overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={`${course.thumbnail}?w=80&h=80&fit=crop&auto=format,compress`} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '📚'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </p>
                  <p className="text-xs text-navy-500">
                    {new Date(course.viewedAt).toLocaleDateString()}
                  </p>
                </div>
                <svg className="w-4 h-4 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement for new users */}
      {viewedCount === 0 && (
        <div className="text-center py-4">
          <p className="text-navy-400 text-sm mb-3">Start exploring courses to track your progress!</p>
          <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm font-medium inline-flex items-center gap-1">
            Browse Courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}

      {/* Achievement Badge */}
      {progressPercentage >= 100 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg text-center border border-yellow-500/30">
          <span className="text-3xl">🎉</span>
          <p className="text-yellow-400 font-semibold mt-1">Course Explorer Achievement!</p>
          <p className="text-sm text-yellow-400/70">You've explored all available courses</p>
        </div>
      )}
    </div>
  )
}