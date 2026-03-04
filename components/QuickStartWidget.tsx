'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartWidgetProps {
  courses: Course[]
}

export default function QuickStartWidget({ courses }: QuickStartWidgetProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (courses.length === 0) return null

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-primary-500/5 to-green-500/5 rounded-2xl blur-xl" />
      
      <div className="relative card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Quick Start</h3>
            <p className="text-navy-400 text-sm">Perfect for beginners - jump right in!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group relative overflow-hidden rounded-xl p-4 bg-navy-800/50 border border-navy-700 hover:border-green-500/50 transition-all duration-300"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Progress ring indicator */}
              <div className="absolute top-3 right-3">
                <ProgressRing 
                  progress={0} 
                  size={32} 
                  strokeWidth={3}
                  isHovered={hoveredIndex === index}
                />
              </div>

              <div className="flex items-start gap-3">
                {course.metadata?.thumbnail?.imgix_url ? (
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={course.metadata?.title || course.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📚</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm group-hover:text-green-400 transition-colors line-clamp-2">
                    {course.metadata?.title || course.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-beginner text-xs py-0.5 px-2">
                      Beginner
                    </span>
                    {course.metadata?.estimated_hours && (
                      <span className="text-xs text-navy-500">
                        {course.metadata.estimated_hours}h
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-green-500/10 to-primary-500/10 transition-opacity duration-300 ${
                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
              }`} />
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/courses?difficulty=beginner" 
            className="text-green-400 hover:text-green-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
          >
            View all beginner courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface ProgressRingProps {
  progress: number
  size: number
  strokeWidth: number
  isHovered?: boolean
}

function ProgressRing({ progress, size, strokeWidth, isHovered }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-navy-700"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`transition-all duration-500 ${isHovered ? 'text-green-400' : 'text-navy-600'}`}
      />
      {/* Center dot */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={2}
        fill="currentColor"
        className={`transition-colors duration-300 ${isHovered ? 'text-green-400' : 'text-navy-500'}`}
        transform={`rotate(90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}