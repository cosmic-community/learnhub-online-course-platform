// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import CourseProgressBar from '@/components/CourseProgressBar'
import type { Metadata } from 'next'
import type { Lesson, Instructor, Category } from '@/types'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
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
    return { title: 'Course Not Found' }
  }

  return {
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || 'Learn with LearnHub',
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a: Lesson, b: Lesson) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  // Calculate total duration
  const totalMinutes = sortedLessons.reduce((acc: number, lesson: Lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  // Get difficulty badge class
  const getDifficultyClass = (difficulty: string | { value?: string; key?: string } | undefined) => {
    const diffValue = typeof difficulty === 'object' ? (difficulty?.value || difficulty?.key) : difficulty
    const diffLower = (diffValue || '').toLowerCase()
    switch (diffLower) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'bg-navy-700 text-navy-200'
    }
  }

  const getDifficultyLabel = (difficulty: string | { value?: string; key?: string } | undefined) => {
    if (typeof difficulty === 'object') {
      return difficulty?.value || difficulty?.key || 'Beginner'
    }
    return difficulty || 'Beginner'
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-white">{metadata?.title || course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category: Category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge bg-navy-800 text-navy-200 hover:bg-navy-700 transition-colors"
                  >
                    {category.metadata?.icon} {category.metadata?.name || category.title}
                  </Link>
                ))}
                <span className={`badge ${getDifficultyClass(metadata?.difficulty)}`}>
                  {getDifficultyLabel(metadata?.difficulty)}
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{sortedLessons.length} lessons</span>
                </div>
                {totalMinutes > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {totalHours > 0 && `${totalHours}h `}
                      {remainingMinutes > 0 && `${remainingMinutes}m`}
                    </span>
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>~{metadata.estimated_hours} hours to complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <CourseProgressBar courseSlug={slug} totalLessons={sortedLessons.length} className="mb-8" />

            {/* Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                <div className="prose max-w-none">
                  <MarkdownRenderer content={metadata.description} />
                </div>
              </div>
            )}

            {/* Lessons */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
              <div className="space-y-4">
                {sortedLessons.map((lesson: Lesson, index: number) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${slug}/lessons/${lesson.slug}`}
                    className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl hover:bg-navy-800 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center text-navy-300 font-semibold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                        {lesson.metadata?.title || lesson.title}
                      </h3>
                      {lesson.metadata?.description && (
                        <p className="text-sm text-navy-400 mt-1 line-clamp-1">
                          {lesson.metadata.description}
                        </p>
                      )}
                    </div>
                    {lesson.metadata?.duration_minutes && (
                      <span className="text-sm text-navy-500">
                        {lesson.metadata.duration_minutes} min
                      </span>
                    )}
                    <svg
                      className="w-5 h-5 text-navy-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* CTA Card */}
              <div className="card p-6">
                {metadata?.is_free ? (
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-green-400">Free</span>
                  </div>
                ) : metadata?.price ? (
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-white">${metadata.price}</span>
                  </div>
                ) : null}

                {sortedLessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary w-full justify-center mb-4"
                  >
                    Start Learning
                  </Link>
                )}

                <div className="text-center text-sm text-navy-400">
                  {sortedLessons.length} lessons • Full lifetime access
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor: Instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center">
                            <span className="text-lg">👨‍🏫</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-sm text-navy-400 line-clamp-1">
                              {instructor.metadata.credentials}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}