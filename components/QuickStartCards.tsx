'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QuickStartCard {
  title: string
  description: string
  icon: string
  href: string
  gradient: string
  delay: string
}

const quickStartOptions: QuickStartCard[] = [
  {
    title: "Web Development",
    description: "Build modern websites & apps",
    icon: "💻",
    href: "/categories/web-development",
    gradient: "from-blue-500/20 to-cyan-500/20",
    delay: "0ms"
  },
  {
    title: "Cloud Computing",
    description: "Master AWS & cloud services",
    icon: "☁️",
    href: "/categories/cloud-computing",
    gradient: "from-purple-500/20 to-pink-500/20",
    delay: "100ms"
  },
  {
    title: "All Courses",
    description: "Browse our full catalog",
    icon: "🎓",
    href: "/courses",
    gradient: "from-primary-500/20 to-emerald-500/20",
    delay: "200ms"
  },
  {
    title: "Get Help",
    description: "Contact our support team",
    icon: "💬",
    href: "/contact",
    gradient: "from-orange-500/20 to-amber-500/20",
    delay: "300ms"
  }
]

export default function QuickStartCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Quick Start</h2>
        <p className="text-navy-400">Jump right into learning</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStartOptions.map((option, index) => (
          <Link
            key={option.title}
            href={option.href}
            className={`
              relative group p-6 rounded-2xl border border-navy-700/50
              bg-gradient-to-br ${option.gradient}
              backdrop-blur-sm overflow-hidden
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:border-primary-500/50
              hover:shadow-xl hover:shadow-primary-500/10
            `}
            style={{ animationDelay: option.delay }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Animated background glow */}
            <div 
              className={`
                absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0
                transition-opacity duration-500
                ${hoveredIndex === index ? 'opacity-100 animate-shimmer' : 'opacity-0'}
              `}
            />
            
            <div className="relative z-10">
              <div className={`
                text-4xl mb-3 transition-transform duration-300
                ${hoveredIndex === index ? 'scale-110 animate-wiggle' : ''}
              `}>
                {option.icon}
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                {option.title}
              </h3>
              <p className="text-sm text-navy-400 group-hover:text-navy-300 transition-colors">
                {option.description}
              </p>
              
              {/* Arrow indicator */}
              <div className={`
                absolute bottom-4 right-4 text-primary-400
                transition-all duration-300
                ${hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
              `}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}