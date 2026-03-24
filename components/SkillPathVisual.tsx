'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SkillPathVisualProps {
  beginnerCount: number
  intermediateCount: number
  advancedCount: number
}

export default function SkillPathVisual({ beginnerCount, intermediateCount, advancedCount }: SkillPathVisualProps) {
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null)
  
  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      emoji: '🌱',
      color: 'green',
      count: beginnerCount,
      description: 'Start your journey with foundational concepts',
      skills: ['Core Concepts', 'Basic Syntax', 'First Projects']
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      emoji: '⚡',
      color: 'yellow',
      count: intermediateCount,
      description: 'Build on your knowledge with practical applications',
      skills: ['Advanced Patterns', 'Real Projects', 'Best Practices']
    },
    {
      id: 'advanced',
      title: 'Advanced',
      emoji: '🚀',
      color: 'red',
      count: advancedCount,
      description: 'Master complex topics and become an expert',
      skills: ['Architecture', 'Performance', 'Enterprise Patterns']
    }
  ]

  return (
    <div className="relative">
      {/* Connection Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30 -translate-y-1/2 hidden lg:block" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative">
        {levels.map((level, index) => (
          <div key={level.id} className="relative">
            {/* Animated connector dots - desktop only */}
            {index < levels.length - 1 && (
              <div className="absolute top-1/2 -right-4 lg:flex hidden items-center gap-1 -translate-y-1/2 z-10">
                <div className="w-2 h-2 rounded-full bg-navy-700 animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 rounded-full bg-navy-700 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-navy-700 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            
            <Link
              href={`/courses?difficulty=${level.id}`}
              className={`block card p-6 relative group cursor-pointer transition-all duration-300 ${
                hoveredLevel === level.id ? 'scale-105 shadow-2xl' : ''
              } ${
                level.color === 'green' ? 'hover:border-green-500/50 hover:shadow-green-500/10' :
                level.color === 'yellow' ? 'hover:border-yellow-500/50 hover:shadow-yellow-500/10' :
                'hover:border-red-500/50 hover:shadow-red-500/10'
              }`}
              onMouseEnter={() => setHoveredLevel(level.id)}
              onMouseLeave={() => setHoveredLevel(null)}
            >
              {/* Level Badge */}
              <div className="absolute -top-3 left-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                  level.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  level.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <span>Level {index + 1}</span>
                </span>
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{level.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{level.title}</h3>
                      <p className="text-sm text-navy-400">{level.count} courses</p>
                    </div>
                  </div>
                  <svg 
                    className={`w-6 h-6 transition-all duration-300 ${
                      hoveredLevel === level.id ? 'translate-x-1 opacity-100' : 'opacity-50'
                    } ${
                      level.color === 'green' ? 'text-green-400' :
                      level.color === 'yellow' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                
                <p className="text-navy-300 text-sm mb-4">{level.description}</p>
                
                {/* Skills Preview */}
                <div className="flex flex-wrap gap-2">
                  {level.skills.map((skill) => (
                    <span 
                      key={skill}
                      className={`text-xs px-2 py-1 rounded-full ${
                        level.color === 'green' ? 'bg-green-500/10 text-green-300' :
                        level.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-300' :
                        'bg-red-500/10 text-red-300'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-navy-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-400">Start here</span>
                    <span className={`font-medium ${
                      level.color === 'green' ? 'text-green-400' :
                      level.color === 'yellow' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <p className="text-navy-400 mb-4">Not sure where to start?</p>
        <Link href="/categories" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Take our skill assessment quiz
        </Link>
      </div>
    </div>
  )
}