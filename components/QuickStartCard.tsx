'use client'

import Link from 'next/link'
import { useState } from 'react'

interface QuickStartCardProps {
  href: string
  icon: string
  title: string
  description: string
  color: 'primary' | 'green' | 'purple' | 'orange'
}

const colorClasses = {
  primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30 hover:border-primary-500/50',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50',
  orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50',
}

export default function QuickStartCard({ 
  href, 
  icon, 
  title, 
  description, 
  color 
}: QuickStartCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link 
      href={href}
      className={`block p-6 rounded-xl bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`text-4xl mb-3 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-navy-400 text-sm">{description}</p>
      <div className={`mt-3 flex items-center gap-1 text-sm font-medium text-primary-400 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
        Get Started
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}