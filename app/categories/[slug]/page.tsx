// app/categories/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getCoursesByCategory, getCategories } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import JourneyTracker from '@/components/JourneyTracker'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const courses = await getCoursesByCategory(category.id)
  const { metadata } = category

  return (
    <div className="min-h-screen">
      {/* Track this page view */}
      <JourneyTracker 
        slug={slug} 
        title={metadata?.name || category.title} 
        type="category" 
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-primary-400 transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-navy-200">{metadata?.name || category.title}</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="text-6xl mb-6">{metadata?.icon || '📂'}</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {metadata?.name || category.title}
            </h1>
            {metadata?.description && (
              <p className="text-xl text-navy-300">{metadata.description}</p>
            )}
            <p className="mt-4 text-navy-400">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} available
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
              <p className="text-navy-400 mb-6">
                Check back soon for courses in this category!
              </p>
              <Link href="/courses" className="btn-primary">
                Browse All Courses
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}