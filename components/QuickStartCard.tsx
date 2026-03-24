import Link from 'next/link'

interface QuickStartItem {
  emoji: string
  title: string
  description: string
  href: string
  color: string
}

const quickStartItems: QuickStartItem[] = [
  {
    emoji: '🚀',
    title: 'Start Learning',
    description: 'Browse courses and pick your first one',
    href: '/courses',
    color: 'from-primary-500 to-indigo-600'
  },
  {
    emoji: '🎯',
    title: 'By Category',
    description: 'Find courses in your area of interest',
    href: '/categories',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    emoji: '👨‍🏫',
    title: 'Meet Experts',
    description: 'Learn from industry professionals',
    href: '/instructors',
    color: 'from-amber-500 to-orange-600'
  },
  {
    emoji: '💬',
    title: 'Get in Touch',
    description: 'Questions? We\'re here to help',
    href: '/contact',
    color: 'from-pink-500 to-rose-600'
  }
]

export default function QuickStartCard() {
  return (
    <div className="card p-6 sm:p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">
          🎓 Quick Start
        </h3>
        <p className="text-navy-400 text-sm">
          Jump right in
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {quickStartItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 hover:border-navy-600 transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
            <div className="relative">
              <span className="text-2xl block mb-2">{item.emoji}</span>
              <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-primary-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-navy-400 line-clamp-2">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}