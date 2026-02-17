import Link from 'next/link'

interface LearningPath {
  title: string
  description: string
  icon: string
  color: 'teal' | 'blue' | 'purple' | 'orange'
  courses: number
  hours: number
  href: string
}

interface LearningPathCardProps {
  path: LearningPath
}

const colorStyles = {
  teal: {
    bg: 'from-teal-500/10 to-teal-600/5',
    border: 'border-teal-500/20 hover:border-teal-500/40',
    icon: 'bg-teal-500/20 text-teal-400',
    badge: 'bg-teal-500/20 text-teal-300',
  },
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    icon: 'bg-blue-500/20 text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    icon: 'bg-purple-500/20 text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    icon: 'bg-orange-500/20 text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300',
  },
}

export default function LearningPathCard({ path }: LearningPathCardProps) {
  const styles = colorStyles[path.color]

  return (
    <Link
      href={path.href}
      className={`
        group block p-6 rounded-2xl border backdrop-blur-sm
        bg-gradient-to-br ${styles.bg} ${styles.border}
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl ${styles.icon} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {path.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors mb-1">
            {path.title}
          </h3>
          <p className="text-sm text-navy-400 line-clamp-2 mb-3">
            {path.description}
          </p>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full ${styles.badge}`}>
              {path.courses} courses
            </span>
            <span className="text-xs text-navy-500">
              ~{path.hours}h total
            </span>
          </div>
        </div>
        <svg 
          className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}