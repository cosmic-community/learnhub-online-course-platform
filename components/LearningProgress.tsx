'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LearningStats {
  coursesViewed: string[]
  lessonsCompleted: number
  lastVisit: string
  streak: number
  totalMinutes: number
}

const motivationalMessages = [
  "🚀 You're making great progress!",
  "💪 Keep up the momentum!",
  "🌟 You're a learning superstar!",
  "🎯 Stay focused, you've got this!",
  "🔥 Your dedication is inspiring!",
  "📚 Knowledge is power!",
  "✨ Every lesson counts!",
  "🏆 Champions never stop learning!",
]

const achievementMilestones = [
  { lessons: 1, emoji: '🌱', title: 'First Steps', description: 'Started your learning journey' },
  { lessons: 5, emoji: '📖', title: 'Bookworm', description: 'Completed 5 lessons' },
  { lessons: 10, emoji: '🎓', title: 'Scholar', description: 'Completed 10 lessons' },
  { lessons: 25, emoji: '🏅', title: 'Dedicated Learner', description: 'Completed 25 lessons' },
  { lessons: 50, emoji: '🏆', title: 'Knowledge Champion', description: 'Completed 50 lessons' },
]

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learning-stats')
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      
      // Check if streak should continue
      const lastVisit = new Date(parsed.lastVisit)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Continued streak!
        parsed.streak += 1
        setShowConfetti(parsed.streak % 5 === 0) // Confetti every 5 day streak
      } else if (diffDays > 1) {
        // Streak broken
        parsed.streak = 1
      }
      
      parsed.lastVisit = today.toISOString()
      localStorage.setItem('learning-stats', JSON.stringify(parsed))
      setStats(parsed)
    } else {
      // Initialize new stats
      const newStats: LearningStats = {
        coursesViewed: [],
        lessonsCompleted: 0,
        lastVisit: new Date().toISOString(),
        streak: 1,
        totalMinutes: 0,
      }
      localStorage.setItem('learning-stats', JSON.stringify(newStats))
      setStats(newStats)
    }

    // Set random motivational message
    setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  if (!stats) return null

  const progressPercent = Math.min((stats.lessonsCompleted / 10) * 100, 100)
  const currentAchievement = achievementMilestones
    .filter(m => stats.lessonsCompleted >= m.lessons)
    .pop()
  const nextAchievement = achievementMilestones.find(m => stats.lessonsCompleted < m.lessons)

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '✨', '🌟', '🎊', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Floating Progress Widget */}
      <div
        className={`fixed bottom-24 right-5 z-40 transition-all duration-500 ${
          isExpanded ? 'w-80' : 'w-16'
        }`}
      >
        {/* Collapsed View - Progress Ring */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${
            isExpanded ? 'hidden' : 'flex'
          } items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110 group`}
          aria-label="View learning progress"
        >
          {/* SVG Progress Ring */}
          <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeDasharray={`${progressPercent}, 100`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute text-white font-bold text-sm">
            {stats.streak}🔥
          </span>
        </button>

        {/* Expanded View */}
        <div
          className={`${
            isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          } card p-5 transition-all duration-300 origin-bottom-right`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              📊 Your Progress
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-navy-400 hover:text-white transition-colors"
              aria-label="Close progress panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-primary-500/20 to-transparent rounded-lg p-3 mb-4">
            <p className="text-primary-300 text-sm font-medium">{message}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.streak}</div>
              <div className="text-xs text-navy-400">Day Streak 🔥</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.lessonsCompleted}</div>
              <div className="text-xs text-navy-400">Lessons</div>
            </div>
            <div className="text-center p-3 bg-navy-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.coursesViewed.length}</div>
              <div className="text-xs text-navy-400">Courses</div>
            </div>
          </div>

          {/* Current Achievement */}
          {currentAchievement && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg mb-3">
              <span className="text-3xl">{currentAchievement.emoji}</span>
              <div>
                <div className="text-white font-semibold text-sm">{currentAchievement.title}</div>
                <div className="text-navy-400 text-xs">{currentAchievement.description}</div>
              </div>
            </div>
          )}

          {/* Next Achievement Progress */}
          {nextAchievement && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
                <span>Next: {nextAchievement.title} {nextAchievement.emoji}</span>
                <span>{stats.lessonsCompleted}/{nextAchievement.lessons}</span>
              </div>
              <div className="w-full bg-navy-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.lessonsCompleted / nextAchievement.lessons) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Link
            href="/courses"
            className="btn-primary w-full text-center text-sm"
            onClick={() => setIsExpanded(false)}
          >
            Continue Learning →
          </Link>
        </div>
      </div>
    </div>
  )
}

// Helper function to track course views (call this from course pages)
export function trackCourseView(courseSlug: string) {
  if (typeof window === 'undefined') return
  
  const savedStats = localStorage.getItem('learning-stats')
  if (savedStats) {
    const stats = JSON.parse(savedStats) as LearningStats
    if (!stats.coursesViewed.includes(courseSlug)) {
      stats.coursesViewed.push(courseSlug)
      localStorage.setItem('learning-stats', JSON.stringify(stats))
    }
  }
}

// Helper function to track lesson completion (call this from lesson pages)
export function trackLessonComplete(lessonSlug: string) {
  if (typeof window === 'undefined') return
  
  const completedKey = `lesson-completed-${lessonSlug}`
  if (localStorage.getItem(completedKey)) return // Already completed
  
  localStorage.setItem(completedKey, 'true')
  
  const savedStats = localStorage.getItem('learning-stats')
  if (savedStats) {
    const stats = JSON.parse(savedStats) as LearningStats
    stats.lessonsCompleted += 1
    localStorage.setItem('learning-stats', JSON.stringify(stats))
  }
}