'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface DailyChallengeProps {
  courses: Course[]
}

export default function DailyChallenge({ courses }: DailyChallengeProps) {
  const [challenge, setChallenge] = useState<Course | null>(null)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (courses.length === 0) return

    // Use the day of year to consistently select a course
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedCourse = courses[dayOfYear % courses.length]
    setChallenge(selectedCourse ?? null)

    // Update countdown
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [courses])

  if (!mounted || !challenge) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const thumbnail = challenge.metadata?.thumbnail

  return (
    <div className="card overflow-hidden group">
      <div className="relative">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-x"></div>
        
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl animate-bounce">🎯</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                  Daily Challenge
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Complete Today&apos;s Featured Course
              </h3>
            </div>
            <div className="text-right">
              <div className="text-xs text-navy-400 mb-1">Resets in</div>
              <div className="font-mono text-lg text-primary-400 font-bold">
                {timeRemaining}
              </div>
            </div>
          </div>

          <Link href={`/courses/${challenge.slug}`} className="block">
            <div className="flex gap-4 p-4 bg-navy-900/50 rounded-xl border border-navy-800 hover:border-primary-500/50 transition-all">
              {thumbnail ? (
                <img
                  src={`${thumbnail.imgix_url}?w=200&h=120&fit=crop&auto=format,compress`}
                  alt={challenge.title}
                  className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-16 bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                  {challenge.title}
                </h4>
                <p className="text-sm text-navy-400 truncate">
                  {challenge.metadata?.tagline || 'Start learning today'}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-navy-500">
                    {challenge.metadata?.lessons?.length || 0} lessons
                  </span>
                  <span className="text-xs text-navy-500">
                    {challenge.metadata?.estimated_hours || 0}h
                  </span>
                  {challenge.metadata?.is_free && (
                    <span className="text-xs text-green-400 font-medium">FREE</span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⚡</span>
              <span className="text-sm text-navy-300">
                +50 XP for completing today!
              </span>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-navy-700 border-2 border-navy-900 flex items-center justify-center text-xs"
                >
                  {['👨‍💻', '👩‍💻', '🧑‍💻'][i - 1]}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-primary-500/20 border-2 border-navy-900 flex items-center justify-center text-xs text-primary-400">
                +12
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}