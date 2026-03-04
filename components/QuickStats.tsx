'use client'

import AnimatedCounter from './AnimatedCounter'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: QuickStatsProps) {
  const stats = [
    { 
      value: coursesCount, 
      label: 'Courses', 
      icon: '📚',
      color: 'from-cyan-500/20 to-cyan-500/5'
    },
    { 
      value: lessonsCount, 
      label: 'Lessons', 
      icon: '📖',
      color: 'from-purple-500/20 to-purple-500/5'
    },
    { 
      value: instructorsCount, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      color: 'from-pink-500/20 to-pink-500/5'
    },
    { 
      value: categoriesCount, 
      label: 'Categories', 
      icon: '🏷️',
      color: 'from-emerald-500/20 to-emerald-500/5'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="card p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </span>
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter value={stat.value} suffix="+" />
            </div>
            <div className="text-sm text-navy-400">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}