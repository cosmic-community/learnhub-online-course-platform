'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const { metadata } = course

  useEffect(() => {
    setMounted(true)
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      
      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      }
    }

    setTimeLeft(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  const getDifficultyClass = (difficulty: string | undefined) => {
    const value = difficulty?.toLowerCase() || 'beginner'
    switch (value) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'bg-navy-700 text-navy-200'
    }
  }

  return (
    <div className="relative">
      {/* Spotlight effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-yellow-500/20 to-primary-500/20 rounded-3xl blur-xl animate-pulse" />
      
      <div className="relative card p-8 md:p-12 bg-gradient-to-br from-navy-900/90 to-navy-800/90 backdrop-blur-lg border-2 border-primary-500/30">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Course Image */}
          <div className="relative w-full md:w-1/3 aspect-video rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-yellow-500/20 z-10" />
            {metadata?.thumbnail?.imgix_url ? (
              <img
                src={`${metadata.thumbnail.imgix_url}?w=600&h=340&fit=crop&auto=format,compress`}
                alt={metadata?.title || course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-navy-800 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            )}
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                ⭐ Course of the Day
              </span>
            </div>
          </div>

          {/* Course Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <span className={`badge ${getDifficultyClass(metadata?.difficulty?.value)}`}>
                {metadata?.difficulty?.value || 'Beginner'}
              </span>
              {metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
              {metadata?.estimated_hours && (
                <span className="badge bg-navy-700 text-navy-200">
                  ⏱️ {metadata.estimated_hours}h
                </span>
              )}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
              {metadata?.title || course.title}
            </h3>

            <p className="text-navy-300 mb-6 line-clamp-2">
              {metadata?.tagline || 'Start your learning journey with this amazing course'}
            </p>

            {/* Countdown Timer */}
            <div className="mb-6">
              <p className="text-sm text-navy-400 mb-2">Featured for:</p>
              <div className="flex gap-3 justify-center md:justify-start">
                <div className="bg-navy-800/80 rounded-lg px-4 py-2 text-center min-w-[60px]">
                  <div className="text-2xl font-bold text-primary-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-navy-500">Hours</div>
                </div>
                <div className="bg-navy-800/80 rounded-lg px-4 py-2 text-center min-w-[60px]">
                  <div className="text-2xl font-bold text-primary-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-navy-500">Mins</div>
                </div>
                <div className="bg-navy-800/80 rounded-lg px-4 py-2 text-center min-w-[60px]">
                  <div className="text-2xl font-bold text-primary-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-navy-500">Secs</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href={`/courses/${course.slug}`} className="btn-primary group">
                Start Learning
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
              {metadata?.price && !metadata?.is_free && (
                <span className="inline-flex items-center justify-center px-4 py-2 text-xl font-bold text-white">
                  ${metadata.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}