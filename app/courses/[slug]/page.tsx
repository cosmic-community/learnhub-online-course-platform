// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import LessonList from '@/components/LessonList'
import InstructorCard from '@/components/InstructorCard'
import CourseTracker from '@/components/CourseTracker'
import { getMetafieldValue } from '@/lib/utils'
import type { Metadata } from 'next'
import type { Instructor, Lesson, Category } from '@/types'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return {
      title: 'Course Not Found - LearnHub',
    }
  }

  return {
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const instructors = (metadata?.instructors || []) as Instructor[]
  const lessons = (metadata?.lessons || []) as Lesson[]
  const categories = (metadata?.categories || []) as Category[]
  
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalDuration = sortedLessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const difficultyValue = getMetafieldValue(metadata?.difficulty)
  const difficultyBadgeClass = 
    difficultyValue.toLowerCase() === 'beginner' ? 'badge-beginner' :
    difficultyValue.toLowerCase() === 'intermediate' ? 'badge-intermediate' :
    difficultyValue.toLowerCase() === 'advanced' ? 'badge-advanced' : ''

  return (
    <div className="py-12">
      {/* Track course view for Continue Learning feature */}
      <CourseTracker courseSlug={slug} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
            <li>/</li>
            <li className="text-white">{metadata?.title || course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge bg-navy-700 text-navy-200 hover:bg-navy-600 transition-colors"
                  >
                    {category.metadata?.icon} {category.metadata?.name || category.title}
                  </Link>
                ))}
                <span className={`badge ${difficultyBadgeClass}`}>
                  {difficultyValue || 'All Levels'}
                </span>
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>{sortedLessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours</span>
                </div>
                {instructors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span>👨‍🏫</span>
                    <span>{instructors.length} instructor{instructors.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: parseMarkdown(metadata.description) }} />
              </div>
            )}

            {/* Lessons */}
            {sortedLessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Content
                  <span className="text-lg font-normal text-navy-400 ml-2">
                    ({sortedLessons.length} lessons • {totalDuration} min)
                  </span>
                </h2>
                <LessonList lessons={sortedLessons} courseSlug={slug} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="card p-6 mb-8 sticky top-8">
              <div className="mb-6">
                {metadata?.is_free ? (
                  <div className="text-3xl font-bold text-primary-400">Free</div>
                ) : (
                  <div className="text-3xl font-bold text-white">
                    ${metadata?.price || 0}
                    <span className="text-lg font-normal text-navy-400"> USD</span>
                  </div>
                )}
              </div>
              
              {sortedLessons.length > 0 && sortedLessons[0] && (
                <Link
                  href={`/courses/${slug}/lessons/${sortedLessons[0].slug}`}
                  className="btn-primary w-full text-center mb-4"
                >
                  Start Learning
                </Link>
              )}
              
              <div className="border-t border-navy-700 pt-4 mt-4">
                <h3 className="font-semibold text-white mb-3">This course includes:</h3>
                <ul className="space-y-2 text-sm text-navy-300">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">✓</span>
                    {sortedLessons.length} lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">✓</span>
                    {metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours of content
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">✓</span>
                    Code examples included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">✓</span>
                    Lifetime access
                  </li>
                </ul>
              </div>
            </div>

            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {instructors.length === 1 ? 'Your Instructor' : 'Your Instructors'}
                </h3>
                <div className="space-y-4">
                  {instructors.map((instructor) => (
                    <InstructorCard key={instructor.id} instructor={instructor} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple markdown parser for description
function parseMarkdown(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hulo])(.+)$/gim, '<p>$1</p>')
}