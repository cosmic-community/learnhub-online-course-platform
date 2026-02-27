'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QuickStartCardProps {
  totalCourses: number
}

export default function QuickStartCard({ totalCourses }: QuickStartCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900/80 to-navy-900/40 border border-navy-800 p-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 transition-transform duration-1000 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}
      />
      
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to start your learning journey?
          </h3>
          <p className="text-navy-300 mb-4">
            Explore {totalCourses} expert-led courses and build the skills that matter. 
            New courses added weekly!
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link 
              href="/courses" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Learning
            </Link>
            <Link 
              href="/categories" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-white font-medium rounded-lg transition-colors border border-navy-700"
            >
              Browse Topics
            </Link>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="hidden lg:block absolute -right-4 -bottom-4 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      </div>
    </div>
  )
}