'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  progress: number
}

export default function QuickActions() {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')

  useEffect(() => {
    // Determine time of day for greeting
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 18) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')

    // Get recent courses from localStorage
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (stored) {
      setRecentCourses(JSON.parse(stored).slice(0, 3))
    }
  }, [])

  const greetings = {
    morning: { text: 'Good morning', emoji: '☀️' },
    afternoon: { text: 'Good afternoon', emoji: '🌤️' },
    evening: { text: 'Good evening', emoji: '🌙' },
  }

  const greeting = greetings[timeOfDay]

  return (
    <div className="card p-6">
      {/* Personalized Greeting */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">{greeting.emoji}</span>
        <h3 className="text-xl font-semibold text-white">{greeting.text}!</h3>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/courses"
          className="flex items-center gap-3 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-lg transition-all group"
        >
          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">📚</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">Browse</div>
            <div className="text-navy-400 text-xs">All Courses</div>
          </div>
        </Link>

        <Link
          href="/categories"
          className="flex items-center gap-3 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-lg transition-all group"
        >
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">🏷️</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">Explore</div>
            <div className="text-navy-400 text-xs">Categories</div>
          </div>
        </Link>

        <Link
          href="/contact"
          className="flex items-center gap-3 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-lg transition-all group"
        >
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">💬</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">Get Help</div>
            <div className="text-navy-400 text-xs">Contact Us</div>
          </div>
        </Link>

        <button
          onClick={() => {
            // Scroll to featured courses
            document.getElementById('featured-courses')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex items-center gap-3 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-lg transition-all group text-left"
        >
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">⭐</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">Featured</div>
            <div className="text-navy-400 text-xs">Top Picks</div>
          </div>
        </button>
      </div>

      {/* Continue Learning Section */}
      {recentCourses.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-navy-400 mb-3">Continue Learning</h4>
          <div className="space-y-2">
            {recentCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-3 p-3 bg-navy-800/30 hover:bg-navy-800/50 rounded-lg transition-all group"
              >
                <div className="w-12 h-12 bg-navy-700 rounded-lg overflow-hidden flex-shrink-0">
                  {course.thumbnail ? (
                    <img
                      src={`${course.thumbnail}?w=96&h=96&fit=crop&auto=format`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📖</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-navy-400">{course.progress}%</span>
                  </div>
                </div>
                <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recentCourses.length === 0 && (
        <div className="text-center py-4">
          <p className="text-navy-400 text-sm">Start a course to track your progress here!</p>
        </div>
      )}
    </div>
  )
}