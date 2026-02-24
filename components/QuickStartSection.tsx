import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  beginnerCourse?: Course
  intermediateCourse?: Course
  advancedCourse?: Course
}

interface PathCardProps {
  level: 'beginner' | 'intermediate' | 'advanced'
  title: string
  description: string
  course?: Course
  icon: string
  gradient: string
  features: string[]
}

function PathCard({ level, title, description, course, icon, gradient, features }: PathCardProps) {
  const levelColors = {
    beginner: 'border-green-500/30 hover:border-green-500/50',
    intermediate: 'border-yellow-500/30 hover:border-yellow-500/50',
    advanced: 'border-red-500/30 hover:border-red-500/50',
  }

  const badgeColors = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className={`card p-6 border-2 ${levelColors[level]} transition-all duration-300 hover:scale-[1.02] group`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          {icon}
        </div>
        <span className={`badge ${badgeColors[level]} capitalize`}>
          {level}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-navy-400 text-sm mb-4">{description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-navy-300">
            <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Recommended Course */}
      {course && (
        <div className="pt-4 border-t border-navy-800">
          <p className="text-xs text-navy-500 uppercase tracking-wider mb-2">Recommended Course</p>
          <Link 
            href={`/courses/${course.slug}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors group/link"
          >
            {course.metadata?.thumbnail?.imgix_url && (
              <img 
                src={`${course.metadata.thumbnail.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                alt={course.metadata?.title || course.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover/link:text-primary-400 transition-colors">
                {course.metadata?.title || course.title}
              </p>
              <p className="text-xs text-navy-400">
                {course.metadata?.estimated_hours || 0}h • {course.metadata?.lessons?.length || 0} lessons
              </p>
            </div>
            <svg className="w-5 h-5 text-navy-500 group-hover/link:text-primary-400 group-hover/link:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* CTA */}
      <Link 
        href="/courses" 
        className="mt-4 w-full btn-secondary text-sm justify-center group-hover:bg-navy-700"
      >
        Explore All {level.charAt(0).toUpperCase() + level.slice(1)} Courses
      </Link>
    </div>
  )
}

export default function QuickStartSection({ 
  beginnerCourse, 
  intermediateCourse, 
  advancedCourse 
}: QuickStartSectionProps) {
  const paths: PathCardProps[] = [
    {
      level: 'beginner',
      title: 'Start Fresh',
      description: 'Perfect for those new to coding. Build a solid foundation.',
      course: beginnerCourse,
      icon: '🌱',
      gradient: 'from-green-500/20 to-green-600/20',
      features: [
        'Step-by-step guidance',
        'No prior experience needed',
        'Practical exercises',
        'Supportive community'
      ]
    },
    {
      level: 'intermediate',
      title: 'Level Up',
      description: 'Already know the basics? Time to expand your skills.',
      course: intermediateCourse,
      icon: '🚀',
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      features: [
        'Real-world projects',
        'Advanced concepts',
        'Best practices',
        'Code reviews'
      ]
    },
    {
      level: 'advanced',
      title: 'Master It',
      description: 'Push your expertise to the next level with advanced topics.',
      course: advancedCourse,
      icon: '⚡',
      gradient: 'from-red-500/20 to-red-600/20',
      features: [
        'Expert techniques',
        'System design',
        'Performance optimization',
        'Industry patterns'
      ]
    }
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
            <span className="text-xl">🎯</span>
            <span className="text-sm font-medium text-primary-400">Choose Your Path</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Quick Start Guide</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Not sure where to begin? Pick a learning path that matches your current skill level 
            and start making progress today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((path) => (
            <PathCard key={path.level} {...path} />
          ))}
        </div>
      </div>
    </section>
  )
}