'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  progress: number
}

export default function QuickActions() {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Determine time of day
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setTimeOfDay('morning')
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon')
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening')
    else setTimeOfDay('night')

    // Load recent courses from localStorage
    const saved = localStorage.getItem('learnhub-recent-courses')
    if (saved) {
      setRecentCourses(JSON.parse(saved))
    }
  }, [])

  const greetings = {
    morning: { emoji: '🌅', text: 'Good morning!' },
    afternoon: { emoji: '☀️', text: 'Good afternoon!' },
    evening: { emoji: '🌆', text: 'Good evening!' },
    night: { emoji: '🌙', text: 'Good night!' },
  }

  const suggestions = {
    morning: 'Perfect time for focused learning. Tackle something challenging!',
    afternoon: 'Keep the momentum going with a quick lesson.',
    evening: 'Wind down with some light reading or review.',
    night: 'Night owl? Quick review sessions work great now.',
  }

  if (!mounted) {
    return null
  }

  const greeting = greetings[timeOfDay]

  return (
    <div className="card p-6 bg-gradient-to-br from-primary-500/5 to-navy-900/50">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{greeting.emoji}</span>
            <h3 className="text-xl font-semibold text-white">{greeting.text}</h3>
          </div>
          <p className="text-navy-400 text-sm max-w-md">
            {suggestions[timeOfDay]}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/courses"
          className="group flex items-center gap-3 p-4 bg-navy-800/30 hover:bg-navy-800/50 rounded-xl transition-all duration-300 border border-transparent hover:border-primary-500/30"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">📚</span>
          </div>
          <div>
            <div className="font-medium text-white text-sm">Browse Courses</div>
            <div className="text-xs text-navy-400">Find your next topic</div>
          </div>
        </Link>

        <Link
          href="/categories"
          className="group flex items-center gap-3 p-4 bg-navy-800/30 hover:bg-navy-800/50 rounded-xl transition-all duration-300 border border-transparent hover:border-primary-500/30"
        >
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">🏷️</span>
          </div>
          <div>
            <div className="font-medium text-white text-sm">Categories</div>
            <div className="text-xs text-navy-400">Explore by topic</div>
          </div>
        </Link>

        <Link
          href="/contact"
          className="group flex items-center gap-3 p-4 bg-navy-800/30 hover:bg-navy-800/50 rounded-xl transition-all duration-300 border border-transparent hover:border-primary-500/30"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">💬</span>
          </div>
          <div>
            <div className="font-medium text-white text-sm">Get Help</div>
            <div className="text-xs text-navy-400">We're here for you</div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      {recentCourses.length > 0 && (
        <div className="mt-6 pt-4 border-t border-navy-700/50">
          <h4 className="text-sm font-medium text-navy-300 mb-3">Continue Learning</h4>
          <div className="space-y-2">
            {recentCourses.slice(0, 2).map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-3 p-3 bg-navy-800/20 hover:bg-navy-800/40 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-navy-700 flex items-center justify-center overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">📖</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{course.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-navy-400">{course.progress}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}