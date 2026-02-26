'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LearningStats {
  streak: number
  lastVisit: string
  totalMinutes: number
  coursesViewed: string[]
}

const MOTIVATIONAL_MESSAGES = [
  { threshold: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { threshold: 1, message: "Great start! Keep the momentum going! 💪", emoji: "🔥" },
  { threshold: 3, message: "You're building a habit! Amazing dedication! 🌟", emoji: "⭐" },
  { threshold: 7, message: "One week strong! You're unstoppable! 🏆", emoji: "🏅" },
  { threshold: 14, message: "Two weeks of learning! You're a champion! 👑", emoji: "💎" },
  { threshold: 30, message: "30-day streak! You're a learning legend! 🦸", emoji: "🌈" },
  { threshold: 60, message: "Incredible dedication! You inspire others! ✨", emoji: "🎯" },
  { threshold: 100, message: "100+ days! You've mastered consistency! 🎓", emoji: "🏆" },
]

const STREAK_FLAMES = ['🔥', '🔥🔥', '🔥🔥🔥', '🔥🔥🔥🔥', '🔥🔥🔥🔥🔥']

function getMotivationalMessage(streak: number): { message: string; emoji: string } {
  const sorted = [...MOTIVATIONAL_MESSAGES].sort((a, b) => b.threshold - a.threshold)
  const found = sorted.find(m => streak >= m.threshold)
  return found || MOTIVATIONAL_MESSAGES[0]
}

function getStreakFlames(streak: number): string {
  if (streak === 0) return ''
  const index = Math.min(Math.floor(streak / 7), STREAK_FLAMES.length - 1)
  return STREAK_FLAMES[index]
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isYesterday(dateString: string): boolean {
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const storedStats = localStorage.getItem('learnhub-stats')
    const today = new Date().toISOString().split('T')[0]
    
    if (storedStats) {
      const parsed: LearningStats = JSON.parse(storedStats)
      
      // Check if we need to update the streak
      if (!isToday(parsed.lastVisit)) {
        if (isYesterday(parsed.lastVisit)) {
          // Consecutive day - increment streak
          parsed.streak += 1
        } else {
          // Streak broken
          parsed.streak = 1
        }
        parsed.lastVisit = today
        localStorage.setItem('learnhub-stats', JSON.stringify(parsed))
      }
      
      setStats(parsed)
    } else {
      // First visit
      const newStats: LearningStats = {
        streak: 1,
        lastVisit: today,
        totalMinutes: 0,
        coursesViewed: []
      }
      localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
      setStats(newStats)
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Track page visits and add estimated time
  useEffect(() => {
    if (!stats) return
    
    // Add some estimated reading time per visit (randomized 2-8 minutes)
    const addedTime = Math.floor(Math.random() * 7) + 2
    const updatedStats = {
      ...stats,
      totalMinutes: stats.totalMinutes + addedTime
    }
    
    // Only update occasionally to avoid too frequent writes
    const shouldUpdate = Math.random() > 0.5
    if (shouldUpdate) {
      localStorage.setItem('learnhub-stats', JSON.stringify(updatedStats))
    }
  }, [])

  if (!stats || !isVisible) return null

  const { message, emoji } = getMotivationalMessage(stats.streak)
  const flames = getStreakFlames(stats.streak)

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-5 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2"
      >
        <span className="text-lg">🔥</span>
        <span className="font-bold">{stats.streak}</span>
      </button>
    )
  }

  return (
    <div 
      className={`fixed bottom-24 right-5 z-40 w-72 transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with minimize button */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-3 flex items-center justify-between border-b border-navy-700/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <span className="text-white font-semibold text-sm">Your Progress</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-navy-400 hover:text-white transition-colors text-lg"
            aria-label="Minimize"
          >
            −
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Streak Counter */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl px-4 py-3 border border-orange-500/20">
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 text-transparent bg-clip-text">
                {stats.streak}
              </span>
              <div className="text-left">
                <div className="text-xs text-navy-400 uppercase tracking-wider">Day Streak</div>
                <div className="text-sm">{flames || '🌱'}</div>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <p className="text-center text-sm text-navy-300 italic">
            "{message}"
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-primary-400">
                {formatMinutes(stats.totalMinutes)}
              </div>
              <div className="text-xs text-navy-400">Time Learning</div>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-400">
                {Math.floor(stats.streak / 7)}
              </div>
              <div className="text-xs text-navy-400">Weeks Strong</div>
            </div>
          </div>

          {/* Quick Action */}
          <Link
            href="/courses"
            className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/25"
          >
            Continue Learning →
          </Link>

          {/* Achievement Hint */}
          {stats.streak > 0 && stats.streak < 7 && (
            <p className="text-center text-xs text-navy-500">
              🎯 {7 - stats.streak} more days until your first week badge!
            </p>
          )}
          {stats.streak >= 7 && stats.streak < 30 && (
            <p className="text-center text-xs text-navy-500">
              🏆 {30 - stats.streak} more days until 30-day legend status!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}