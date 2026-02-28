// app/categories/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getCoursesByCategory, getCategories } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import ProgressTracker from '@/components/ProgressTracker'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return { title: 'Category Not Found - LearnHub' }
  }

  return {
    title: `${category.metadata?.name || category.title} Courses - LearnHub`,
    description: category.metadata?.description || `Browse all ${category.metadata?.name} courses`,
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const courses = await getCoursesByCategory(category.id)
  const { metadata } = category

  return (
    <div className="py-12">
      {/* Progress Tracker - tracks when user explores this category */}
      <ProgressTracker type="category" id={category.id} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li>/</li>
            <li className="text-white">{metadata?.name || category.title}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{metadata?.icon || '📂'}</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {metadata?.name || category.title}
          </h1>
          {metadata?.description && (
            <p className="text-xl text-navy-300 max-w-2xl mx-auto">
              {metadata.description}
            </p>
          )}
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📭</div>
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