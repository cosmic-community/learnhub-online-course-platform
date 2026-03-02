'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuickStatsProps {
  totalCourses: number
  totalCategories: number
  totalInstructors: number
}

interface UserStats {
  coursesViewed: string[]
  categoriesExplored: string[]
  lastViewedCourse: string | null
  favoriteCategory: string | null
}

export default function QuickStats({ totalCourses, totalCategories, totalInstructors }: QuickStatsProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Get time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Load user stats
    const stored = localStorage.getItem('learnhub-user-stats')
    if (stored) {
      setUserStats(JSON.parse(stored))
    }
  }, [])

  const motivationalQuotes = [
    { text: "Every expert was once a beginner.", emoji: "🌱" },
    { text: "The best time to start learning was yesterday. The next best time is now.", emoji: "⏰" },
    { text: "Small progress is still progress.", emoji: "📈" },
    { text: "Learning is a treasure that will follow its owner everywhere.", emoji: "💎" },
    { text: "The more you learn, the more you earn.", emoji: "💰" },
  ]

  const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])

  return (
    <section className="py-12 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting & Motivation */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {greeting}, learner! 👋
          </h2>
          <div className="flex items-center justify-center gap-2 text-navy-300">
            <span className="text-xl">{quote.emoji}</span>
            <p className="italic">&quot;{quote.text}&quot;</p>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="card p-6 group hover:border-primary-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📖
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Continue Learning</h3>
                <p className="text-navy-400 text-sm mb-3">
                  {userStats?.lastViewedCourse 
                    ? 'Pick up where you left off'
                    : `${totalCourses} courses waiting for you`
                  }
                </p>
                <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm font-medium inline-flex items-center gap-1">
                  Browse courses
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Explore Categories */}
          <div className="card p-6 group hover:border-green-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🗂️
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Find Your Path</h3>
                <p className="text-navy-400 text-sm mb-3">
                  Explore {totalCategories} learning categories
                </p>
                <Link href="/categories" className="text-green-400 hover:text-green-300 text-sm font-medium inline-flex items-center gap-1">
                  View categories
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Meet Instructors */}
          <div className="card p-6 group hover:border-purple-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                👨‍🏫
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Expert Instructors</h3>
                <p className="text-navy-400 text-sm mb-3">
                  Learn from {totalInstructors}+ industry experts
                </p>
                <Link href="/courses" className="text-purple-400 hover:text-purple-300 text-sm font-medium inline-flex items-center gap-1">
                  Start a course
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 bg-navy-900/50 rounded-2xl p-6 border border-navy-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Your Learning Journey</h3>
                <p className="text-navy-400 text-sm">Track your progress and unlock achievements</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{userStats?.coursesViewed?.length ?? 0}</div>
                <div className="text-xs text-navy-400">Courses Viewed</div>
              </div>
              <div className="w-px h-10 bg-navy-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{userStats?.categoriesExplored?.length ?? 0}</div>
                <div className="text-xs text-navy-400">Categories Explored</div>
              </div>
              <div className="w-px h-10 bg-navy-700 hidden md:block" />
              <Link 
                href="/courses" 
                className="hidden md:inline-flex btn-primary"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}