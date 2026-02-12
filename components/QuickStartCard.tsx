'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QuickStartCardProps {
  totalCourses: number
}

export default function QuickStartCard({ totalCourses }: QuickStartCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const suggestions = [
    { title: 'Web Development', icon: '💻', href: '/categories/web-development', color: 'from-blue-500/20 to-cyan-500/20' },
    { title: 'Cloud Computing', icon: '☁️', href: '/categories/cloud-computing', color: 'from-purple-500/20 to-pink-500/20' },
    { title: 'Mobile Development', icon: '📱', href: '/categories/mobile-development', color: 'from-green-500/20 to-emerald-500/20' },
  ]

  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20 p-8 transition-all duration-300 hover:border-primary-400/40 hover:shadow-lg hover:shadow-primary-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated glow effect */}
      <div 
        className={`absolute -top-20 -right-20 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl transition-all duration-500 ${
          isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-50'
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎯</span>
          <h3 className="text-xl font-bold text-white">Quick Start</h3>
        </div>

        <p className="text-navy-300 mb-6">
          Not sure where to begin? Here are some popular paths to kickstart your learning journey!
        </p>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.title}
              href={suggestion.href}
              className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${suggestion.color} border border-white/5 hover:border-white/20 transition-all duration-300 hover:translate-x-2 group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{suggestion.icon}</span>
              <span className="text-white font-medium">{suggestion.title}</span>
              <svg 
                className="w-5 h-5 text-primary-400 ml-auto opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-navy-700">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors group"
          >
            Browse all {totalCourses} courses
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}