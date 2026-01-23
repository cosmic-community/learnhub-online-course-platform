// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getCoursesByCategory, getCategories } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return { title: 'Category Not Found - LearnHub' }
  }
  
  return {
    title: `${category.metadata?.name || category.title} Courses - LearnHub`,
    description: category.metadata?.description || `Browse ${category.metadata?.name || category.title} courses`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }

  const courses = await getCoursesByCategory(category.id)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-primary-400">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href="/categories" className="text-navy-400 hover:text-primary-400">
                Categories
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200">{category.metadata?.name || category.title}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            {category.metadata?.icon && (
              <span className="text-5xl">{category.metadata.icon}</span>
            )}
            <h1 className="text-4xl font-bold text-white">
              {category.metadata?.name || category.title}
            </h1>
          </div>
          {category.metadata?.description && (
            <p className="text-xl text-navy-300 max-w-3xl">
              {category.metadata.description}
            </p>
          )}
          <div className="mt-4 text-navy-400">
            {courses.length} {courses.length === 1 ? 'course' : 'courses'} available
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card">
            <p className="text-navy-400 text-lg mb-4">No courses in this category yet.</p>
            <Link href="/courses" className="btn-primary">
              Browse All Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}