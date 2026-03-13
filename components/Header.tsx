import Link from 'next/link'
import QuickSearchWrapper from '@/components/QuickSearchWrapper'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-xl border-b border-navy-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
              LearnHub
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-navy-300 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/categories" className="text-navy-300 hover:text-white transition-colors">
              Categories
            </Link>
            <Link href="/contact" className="text-navy-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side - Quick Search */}
          <div className="flex items-center gap-4">
            <QuickSearchWrapper />
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-navy-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}