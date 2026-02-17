'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LearningPath {
  id: string
  title: string
  emoji: string
  description: string
  courses: number
  hours: number
  color: string
}

const learningPaths: LearningPath[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    emoji: '🎨',
    description: 'Master HTML, CSS, JavaScript, and modern frameworks',
    courses: 5,
    hours: 40,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    emoji: '⚙️',
    description: 'Build APIs, databases, and server architecture',
    courses: 4,
    hours: 35,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    emoji: '🚀',
    description: 'Complete web development from start to deployment',
    courses: 8,
    hours: 60,
    color: 'from-primary-500 to-emerald-500'
  },
  {
    id: 'cloud',
    title: 'Cloud Engineer',
    emoji: '☁️',
    description: 'AWS, deployment, and cloud infrastructure',
    courses: 3,
    hours: 25,
    color: 'from-orange-500 to-amber-500'
  }
]

export default function LearningPathBanner() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  return (
    <section className="py-16 bg-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            New Feature
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Learning Path</h2>
          <p className="text-navy-400">Structured roadmaps to guide your learning journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningPaths.map((path) => (
            <Link
              key={path.id}
              href={`/courses?path=${path.id}`}
              onMouseEnter={() => setHoveredPath(path.id)}
              onMouseLeave={() => setHoveredPath(null)}
              className="group relative overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/50 p-6 transition-all duration-300 hover:border-navy-700 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1"
            >
              {/* Gradient Background on Hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 transition-opacity duration-300 ${hoveredPath === path.id ? 'opacity-5' : ''}`}
              />
              
              {/* Content */}
              <div className="relative">
                <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {path.emoji}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {path.title}
                </h3>
                <p className="text-navy-400 text-sm mb-4 line-clamp-2">
                  {path.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-navy-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {path.courses} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {path.hours}h
                  </span>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-6 right-0 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}