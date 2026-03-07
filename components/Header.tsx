import Link from 'next/link'
import LearningStreak from './LearningStreak'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-lg border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              LearnHub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/courses" 
              className="text-navy-300 hover:text-white transition-colors font-medium"
            >
              Courses
            </Link>
            <Link 
              href="/categories" 
              className="text-navy-300 hover:text-white transition-colors font-medium"
            >
              Categories
            </Link>
            <Link 
              href="/contact" 
              className="text-navy-300 hover:text-white transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side - Streak + CTA */}
          <div className="flex items-center gap-4">
            <LearningStreak />
            <Link href="/courses" className="btn-primary hidden sm:inline-flex">
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}