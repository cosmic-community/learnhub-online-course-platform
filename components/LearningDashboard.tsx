'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningDashboardProps {
  courses: Course[]
  totalLessons: number
}

export default function LearningDashboard({ courses, totalLessons }: LearningDashboardProps) {
  const [streak, setStreak] = useState(0)
  const [greeting, setGreeting] = useState('')
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)

  useEffect(() => {
    // Animate in
    setIsVisible(true)

    // Get/set streak from localStorage
    const lastVisit = localStorage.getItem('learnhub_last_visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub_streak') || '0', 10)
    const today = new Date().toDateString()

    if (lastVisit === today) {
      setStreak(currentStreak)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub_streak', newStreak.toString())
      } else {
        setStreak(1)
        localStorage.setItem('learnhub_streak', '1')
      }
    } else {
      setStreak(1)
      localStorage.setItem('learnhub_streak', '1')
    }

    localStorage.setItem('learnhub_last_visit', today)

    // Set time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Good morning')
      setMotivationalMessage('Start your day with learning! 🌅')
    } else if (hour < 17) {
      setGreeting('Good afternoon')
      setMotivationalMessage('Perfect time to pick up a new skill! ☀️')
    } else if (hour < 21) {
      setGreeting('Good evening')
      setMotivationalMessage('Wind down with some learning! 🌙')
    } else {
      setGreeting('Burning the midnight oil?')
      setMotivationalMessage('Night owls learn best! 🦉')
    }

    // Set recommended course (random for demo, but could be smarter)
    if (courses.length > 0) {
      const randomIndex = Math.floor(Math.random() * courses.length)
      setRecommendedCourse(courses[randomIndex] || null)
    }
  }, [courses])

  const getStreakEmoji = (days: number) => {
    if (days >= 30) return '🏆'
    if (days >= 14) return '🔥'
    if (days >= 7) return '⭐'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (days: number) => {
    if (days >= 30) return "Legendary learner!"
    if (days >= 14) return "You're on fire!"
    if (days >= 7) return "One week strong!"
    if (days >= 3) return "Building momentum!"
    return "Great start!"
  }

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{greeting}! 👋</h3>
            <p className="text-navy-300">{motivationalMessage}</p>
          </div>
          
          {/* Streak Badge */}
          <div className="flex flex-col items-center bg-navy-800/50 rounded-xl p-3 min-w-[100px]">
            <span className="text-3xl mb-1">{getStreakEmoji(streak)}</span>
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-xs text-navy-400">day streak</span>
            <span className="text-xs text-primary-400 mt-1">{getStreakMessage(streak)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Courses Progress Ring */}
          <div className="flex flex-col items-center p-4 bg-navy-800/30 rounded-xl">
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-navy-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.93}
                  strokeDashoffset={175.93 - (175.93 * Math.min(courses.length / 20, 1))}
                  className="text-primary-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {courses.length}
              </span>
            </div>
            <span className="text-sm text-navy-300">Courses</span>
          </div>

          {/* Lessons Progress Ring */}
          <div className="flex flex-col items-center p-4 bg-navy-800/30 rounded-xl">
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-navy-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.93}
                  strokeDashoffset={175.93 - (175.93 * Math.min(totalLessons / 50, 1))}
                  className="text-green-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {totalLessons}
              </span>
            </div>
            <span className="text-sm text-navy-300">Lessons</span>
          </div>

          {/* Hours Progress Ring */}
          <div className="flex flex-col items-center p-4 bg-navy-800/30 rounded-xl">
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-navy-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.93}
                  strokeDashoffset={175.93 - (175.93 * Math.min(
                    courses.reduce((sum, c) => sum + (c.metadata?.estimated_hours || 0), 0) / 100, 
                    1
                  ))}
                  className="text-yellow-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {courses.reduce((sum, c) => sum + (c.metadata?.estimated_hours || 0), 0)}h
              </span>
            </div>
            <span className="text-sm text-navy-300">Content</span>
          </div>
        </div>

        {/* Recommended Course */}
        {recommendedCourse && (
          <div className="border-t border-navy-700 pt-4">
            <h4 className="text-sm text-navy-400 mb-3 flex items-center gap-2">
              <span className="animate-pulse">✨</span> Recommended for you
            </h4>
            <Link
              href={`/courses/${recommendedCourse.slug}`}
              className="flex items-center gap-4 p-3 bg-navy-800/30 rounded-xl hover:bg-navy-800/50 transition-colors group"
            >
              {recommendedCourse.metadata?.thumbnail ? (
                <img
                  src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                  alt={recommendedCourse.title}
                  className="w-20 h-14 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-14 rounded-lg bg-navy-700 flex items-center justify-center">
                  📚
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                  {recommendedCourse.title}
                </h5>
                <p className="text-sm text-navy-400 truncate">
                  {recommendedCourse.metadata?.tagline || 'Start learning today'}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* Motivational Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-navy-500">
            🎯 Keep your streak alive! Come back tomorrow to continue learning.
          </p>
        </div>
      </div>
    </div>
  )
}