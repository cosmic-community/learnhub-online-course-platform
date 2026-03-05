'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface LastCourse {
  slug: string
  title: string
  timestamp: number
}

export default function QuickStartButton() {
  const [lastCourse, setLastCourse] = useState<LastCourse | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('last-viewed-course')
    if (stored) {
      const data: LastCourse = JSON.parse(stored)
      // Only show if visited within last 7 days
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      if (data.timestamp > weekAgo) {
        setLastCourse(data)
        // Delay visibility for smooth entrance
        setTimeout(() => setIsVisible(true), 2000)
      }
    }
  }, [])

  if (!lastCourse || !isVisible) return null

  return (
    <div 
      className={`
        fixed bottom-24 right-5 z-40
        transition-all duration-500 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <Link
        href={`/courses/${lastCourse.slug}`}
        className="
          group flex items-center gap-3 
          bg-gradient-to-r from-primary-600 to-primary-500 
          hover:from-primary-500 hover:to-primary-400
          text-white px-4 py-3 rounded-xl
          shadow-lg shadow-primary-500/30
          hover:shadow-xl hover:shadow-primary-500/40
          transition-all duration-300
          hover:scale-105
        "
      >
        <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white/70 font-medium">Continue Learning</span>
          <span className="text-sm font-semibold truncate max-w-[150px]">
            {lastCourse.title}
          </span>
        </div>
        <svg 
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}