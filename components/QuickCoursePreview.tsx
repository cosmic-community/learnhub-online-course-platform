'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickCoursePreviewProps {
  course: Course
}

export default function QuickCoursePreview({ course }: QuickCoursePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { metadata } = course
  const lessons = metadata?.lessons || []
  const firstThreeLessons = lessons.slice(0, 3)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Preview Popup */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 z-50 animate-fadeIn">
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 shadow-2xl">
            <div className="text-sm font-semibold text-white mb-2">
              Course Preview
            </div>
            <div className="space-y-2">
              {firstThreeLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-2 text-xs text-navy-300"
                >
                  <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="truncate">{lesson.metadata?.title || lesson.title}</span>
                </div>
              ))}
              {lessons.length > 3 && (
                <div className="text-xs text-navy-400 pl-7">
                  +{lessons.length - 3} more lessons
                </div>
              )}
            </div>
            <Link
              href={`/courses/${course.slug}`}
              className="mt-3 block text-center text-xs text-primary-400 hover:text-primary-300 font-medium"
            >
              View Full Course →
            </Link>
            {/* Arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-navy-800 border-r border-b border-navy-700 rotate-45" />
          </div>
        </div>
      )}
    </div>
  )
}