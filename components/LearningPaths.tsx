'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Category } from '@/types'

interface LearningPathsProps {
  categories: Category[]
}

interface LearningPath {
  id: string
  title: string
  description: string
  icon: string
  color: string
  gradient: string
  skills: string[]
  duration: string
  categorySlug?: string
}

const learningPaths: LearningPath[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Master the art of building beautiful, interactive user interfaces',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'TypeScript'],
    duration: '4-6 months',
    categorySlug: 'web-development'
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Build robust APIs and server-side applications that scale',
    icon: '⚙️',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    skills: ['Node.js', 'Databases', 'APIs', 'Security', 'DevOps'],
    duration: '5-7 months',
    categorySlug: 'web-development'
  },
  {
    id: 'cloud',
    title: 'Cloud Engineer',
    description: 'Deploy and manage applications on cloud infrastructure',
    icon: '☁️',
    color: 'from-orange-500 to-amber-500',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-amber-500/20',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
    duration: '4-5 months',
    categorySlug: 'cloud-computing'
  },
  {
    id: 'mobile',
    title: 'Mobile Developer',
    description: 'Create native and cross-platform mobile applications',
    icon: '📱',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
    skills: ['React Native', 'iOS', 'Android', 'Flutter', 'App Store'],
    duration: '4-6 months',
    categorySlug: 'mobile-development'
  }
]

export default function LearningPaths({ categories }: LearningPathsProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  // Map learning paths to actual categories if they exist
  const pathsWithLinks = learningPaths.map(path => {
    const matchingCategory = categories.find(cat => cat.slug === path.categorySlug)
    return {
      ...path,
      hasCategory: !!matchingCategory,
      link: matchingCategory ? `/categories/${matchingCategory.slug}` : '/courses'
    }
  })

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Structured Learning
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Learning Path</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Follow our curated learning paths to go from beginner to job-ready. Each path includes carefully selected courses and hands-on projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pathsWithLinks.map((path) => (
            <Link
              key={path.id}
              href={path.link}
              className="group relative"
              onMouseEnter={() => setHoveredPath(path.id)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <div className={`card p-6 h-full transition-all duration-300 ${
                hoveredPath === path.id ? 'border-primary-500/50 scale-[1.02]' : ''
              }`}>
                {/* Background gradient */}
                <div className={`absolute inset-0 ${path.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {path.icon}
                    </div>
                    <div className="flex items-center gap-1 text-navy-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {path.duration}
                    </div>
                  </div>

                  {/* Title and description */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-navy-400 text-sm mb-4">
                    {path.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 bg-navy-800 text-navy-300 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-primary-400 text-sm font-medium group-hover:text-primary-300">
                    <span>Explore Path</span>
                    <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Progress indicator decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-800 rounded-b-2xl overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${path.color} w-0 group-hover:w-full transition-all duration-500`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-navy-400 mb-4">Not sure which path is right for you?</p>
          <Link href="/courses" className="btn-secondary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Browse All Courses
          </Link>
        </div>
      </div>
    </section>
  )
}