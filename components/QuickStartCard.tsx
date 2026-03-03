'use client'

import Link from 'next/link'
import { useState } from 'react'

interface QuickStartCardProps {
  title: string
  description: string
  href: string
  icon: string
  gradient: string
  delay?: number
}

export default function QuickStartCard({
  title,
  description,
  href,
  icon,
  gradient,
  delay = 0,
}: QuickStartCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105"
      style={{
        animationDelay: `${delay}ms`,
        background: `linear-gradient(135deg, ${gradient})`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
        
        {/* Arrow indicator */}
        <div className="mt-4 flex items-center gap-2 text-white/90 text-sm font-medium">
          <span>Get Started</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </Link>
  )
}