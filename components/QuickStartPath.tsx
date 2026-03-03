'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QuickStartPathProps {
  beginnerCount: number
  intermediateCount: number
  advancedCount: number
}

const paths = [
  {
    level: 'beginner',
    title: 'Beginner',
    subtitle: 'Start from scratch',
    icon: '🌱',
    color: 'green',
    description: 'Perfect for those new to programming or wanting to learn a new technology from the ground up.',
    benefits: ['No prior experience needed', 'Step-by-step guidance', 'Foundational concepts']
  },
  {
    level: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Level up your skills',
    icon: '🚀',
    color: 'yellow',
    description: 'For developers who know the basics and want to deepen their expertise.',
    benefits: ['Build on fundamentals', 'Real-world projects', 'Best practices']
  },
  {
    level: 'advanced',
    title: 'Advanced',
    subtitle: 'Master complex topics',
    icon: '⚡',
    color: 'red',
    description: 'Challenge yourself with advanced concepts and cutting-edge techniques.',
    benefits: ['Expert-level content', 'Architecture patterns', 'Performance optimization']
  },
]

export default function QuickStartPath({ beginnerCount, intermediateCount, advancedCount }: QuickStartPathProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  const getCounts = (level: string) => {
    switch (level) {
      case 'beginner': return beginnerCount
      case 'intermediate': return intermediateCount
      case 'advanced': return advancedCount
      default: return 0
    }
  }

  const getColorClasses = (color: string, isSelected: boolean, isHovered: boolean) => {
    const active = isSelected || isHovered
    switch (color) {
      case 'green':
        return {
          bg: active ? 'bg-green-500/20' : 'bg-navy-800/50',
          border: active ? 'border-green-500/50' : 'border-navy-700',
          badge: 'bg-green-500/20 text-green-400',
          glow: active ? 'shadow-green-500/20' : ''
        }
      case 'yellow':
        return {
          bg: active ? 'bg-yellow-500/20' : 'bg-navy-800/50',
          border: active ? 'border-yellow-500/50' : 'border-navy-700',
          badge: 'bg-yellow-500/20 text-yellow-400',
          glow: active ? 'shadow-yellow-500/20' : ''
        }
      case 'red':
        return {
          bg: active ? 'bg-red-500/20' : 'bg-navy-800/50',
          border: active ? 'border-red-500/50' : 'border-navy-700',
          badge: 'bg-red-500/20 text-red-400',
          glow: active ? 'shadow-red-500/20' : ''
        }
      default:
        return {
          bg: 'bg-navy-800/50',
          border: 'border-navy-700',
          badge: 'bg-navy-700 text-navy-300',
          glow: ''
        }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paths.map((path) => {
          const count = getCounts(path.level)
          const isSelected = selectedPath === path.level
          const isHovered = hoveredPath === path.level
          const colors = getColorClasses(path.color, isSelected, isHovered)
          
          return (
            <button
              key={path.level}
              onClick={() => setSelectedPath(isSelected ? null : path.level)}
              onMouseEnter={() => setHoveredPath(path.level)}
              onMouseLeave={() => setHoveredPath(null)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                ${colors.bg} ${colors.border}
                ${isSelected || isHovered ? `shadow-xl ${colors.glow}` : ''}
                hover:transform hover:scale-[1.02]
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{path.icon}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                  {count} {count === 1 ? 'course' : 'courses'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{path.title}</h3>
              <p className="text-navy-400 text-sm">{path.subtitle}</p>
              
              {/* Selection indicator */}
              <div className={`
                absolute bottom-3 right-3 w-6 h-6 rounded-full border-2 transition-all duration-200
                flex items-center justify-center
                ${isSelected ? `${colors.border} ${colors.bg}` : 'border-navy-600'}
              `}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Expanded info panel */}
      {selectedPath && (
        <div className="animate-slide-up bg-navy-800/50 border border-navy-700 rounded-xl p-6">
          {paths.filter(p => p.level === selectedPath).map((path) => (
            <div key={path.level} className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-2">{path.description}</h4>
                <ul className="space-y-2">
                  {path.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-navy-300">
                      <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0">
                <Link 
                  href={`/courses?difficulty=${selectedPath}`}
                  className="btn-primary inline-flex items-center gap-2 group"
                >
                  <span>Browse {path.title} Courses</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}