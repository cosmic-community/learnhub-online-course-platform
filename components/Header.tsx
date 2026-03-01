import Link from 'next/link'
import { getCourses, getCategories } from '@/lib/cosmic'
import QuickSearchWrapper from './QuickSearchWrapper'

export default async function Header() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories()
  ])

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-white">LearnHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/courses" 
              className="text-navy-300 hover:text-white transition-colors"
            >
              Courses
            </Link>
            <Link 
              href="/categories" 
              className="text-navy-300 hover:text-white transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/contact" 
              className="text-navy-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Quick Search & CTA */}
          <div className="flex items-center gap-4">
            <QuickSearchWrapper courses={courses} categories={categories} />
            <Link href="/courses" className="btn-primary text-sm hidden sm:inline-flex">
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}