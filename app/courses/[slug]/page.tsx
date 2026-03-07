// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import { getMetafieldValue } from '@/lib/cosmic'
import LessonCard from '@/components/LessonCard'
import MarkdownContent from '@/components/MarkdownContent'
import CourseViewTracker from '@/components/CourseViewTracker'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found' }
  }

  return {
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || undefined,
  }
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const difficulty = getMetafieldValue(metadata?.difficulty)

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalDuration = sortedLessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const difficultyColors: Record<string, string> = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
  }

  return (
    <div className="py-12">
      {/* Track course view */}
      <CourseViewTracker courseSlug={slug} />
      
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
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {difficulty && (
                  <span className={`badge ${difficultyColors[difficulty] || 'bg-navy-700 text-navy-200'}`}>
                    {difficulty}
                  </span>
                )}
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {categories.length > 0 && categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="badge bg-navy-700 text-navy-200 hover:bg-navy-600 transition-colors"
                  >
                    {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <span>📖</span>
                  <span>{sortedLessons.length} lessons</span>
                </div>
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{Math.round(totalDuration / 60 * 10) / 10}h total</span>
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>~{metadata.estimated_hours}h to complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={metadata.title || course.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose">
                  <MarkdownContent content={metadata.description} />
                </div>
              </div>
            )}

            {/* Lessons */}
            {sortedLessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Content
                  <span className="text-lg font-normal text-navy-400 ml-2">
                    ({sortedLessons.length} lessons)
                  </span>
                </h2>
                <div className="space-y-4">
                  {sortedLessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      courseSlug={course.slug}
                      index={index + 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <div className="card p-6">
                <div className="text-center mb-6">
                  {metadata?.is_free ? (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  ) : metadata?.price ? (
                    <div className="text-3xl font-bold text-white">${metadata.price}</div>
                  ) : (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  )}
                </div>

                {sortedLessons.length > 0 && sortedLessons[0] && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary w-full mb-4"
                  >
                    Start Learning
                  </Link>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-navy-300">
                    <span>Lessons</span>
                    <span className="text-white">{sortedLessons.length}</span>
                  </div>
                  {totalDuration > 0 && (
                    <div className="flex items-center justify-between text-navy-300">
                      <span>Total Duration</span>
                      <span className="text-white">{Math.round(totalDuration / 60 * 10) / 10} hours</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-navy-300">
                    <span>Level</span>
                    <span className="text-white capitalize">{difficulty || 'All levels'}</span>
                  </div>
                  <div className="flex items-center justify-between text-navy-300">
                    <span>Access</span>
                    <span className="text-white">Lifetime</span>
                  </div>
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-4 group"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-lg">
                            👤
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