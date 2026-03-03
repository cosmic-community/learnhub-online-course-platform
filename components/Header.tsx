import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import QuickSearch from './QuickSearch'

export default async function Header() {
  // Fetch data for quick search
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const searchCourses = courses.map(c => ({
    type: 'course' as const,
    title: c.metadata?.title || c.title,
    slug: c.slug,
    description: c.metadata?.tagline,
    icon: '📚',
  }))

  const searchCategories = categories.map(c => ({
    type: 'category' as const,
    title: c.metadata?.name || c.title,
    slug: c.slug,
    description: c.metadata?.description,
    icon: c.metadata?.icon || '🏷️',
  }))

  const searchInstructors = instructors.map(i => ({
    type: 'instructor' as const,
    title: i.metadata?.name || i.title,
    slug: i.slug,
    description: i.metadata?.credentials,
    icon: '👨‍🏫',
  }))

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-navy-950/80 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transform group-hover:rotate-12 transition-transform duration-300">📚</span>
            <span className="text-xl font-bold text-white">
              Learn<span className="text-primary-400">Hub</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
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

          {/* Quick Search + CTA */}
          <div className="flex items-center gap-4">
            <QuickSearch 
              courses={searchCourses}
              categories={searchCategories}
              instructors={searchInstructors}
            />
            <Link href="/courses" className="btn-primary text-sm hidden sm:inline-flex">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}