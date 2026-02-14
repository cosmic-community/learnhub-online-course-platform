'use client'

import AnimatedCounter from './AnimatedCounter'

interface StatsSectionProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

export default function StatsSection({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount 
}: StatsSectionProps) {
  const stats = [
    { 
      value: coursesCount, 
      label: 'Courses', 
      suffix: '+',
      icon: '📚',
      gradient: 'from-primary-500/20 to-primary-600/20',
      iconBg: 'bg-primary-500/20'
    },
    { 
      value: instructorsCount, 
      label: 'Expert Instructors', 
      suffix: '+',
      icon: '👨‍🏫',
      gradient: 'from-blue-500/20 to-blue-600/20',
      iconBg: 'bg-blue-500/20'
    },
    { 
      value: categoriesCount, 
      label: 'Categories', 
      suffix: '',
      icon: '🏷️',
      gradient: 'from-purple-500/20 to-purple-600/20',
      iconBg: 'bg-purple-500/20'
    },
    { 
      value: 10000, 
      label: 'Happy Learners', 
      suffix: '+',
      icon: '🎓',
      gradient: 'from-orange-500/20 to-orange-600/20',
      iconBg: 'bg-orange-500/20'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`
            relative overflow-hidden rounded-2xl p-6 text-center
            bg-gradient-to-br ${stat.gradient}
            border border-white/5
            transform transition-all duration-300 hover:scale-105 hover:border-white/10
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background decoration */}
          <div className="absolute -top-4 -right-4 text-6xl opacity-10">
            {stat.icon}
          </div>
          
          <div className={`
            inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3
            ${stat.iconBg}
          `}>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          
          <AnimatedCounter 
            end={stat.value} 
            suffix={stat.suffix}
            duration={2000 + (index * 200)}
          />
          <div className="text-navy-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}