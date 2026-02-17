// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import MarkdownContent from '@/components/MarkdownContent'
import CourseViewTracker from '@/components/CourseViewTracker'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const lessons = metadata?.lessons || []

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalDuration = sortedLessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  return (
    <div className="min-h-screen">
      {/* Track course view for "Continue Learning" feature */}
      <CourseViewTracker slug={slug} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <span>/</span>
                <span className="text-navy-300 truncate">{course.title}</span>
              </nav>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-sm text-primary-400 hover:text-primary-300"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                <span className="flex items-center gap-2 text-navy-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {sortedLessons.length} lessons
                </span>
                {totalDuration > 0 && (
                  <span className="flex items-center gap-2 text-navy-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                )}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                {metadata?.is_free ? (
                  <span className="text-2xl font-bold text-primary-400">Free</span>
                ) : (
                  <span className="text-2xl font-bold text-white">${metadata?.price || 0}</span>
                )}
                {sortedLessons.length > 0 && sortedLessons[0] && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary"
                  >
                    Start Learning
                  </Link>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              {metadata?.thumbnail ? (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-8xl">📚</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {metadata?.description && (
                <div className="card p-8 mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">About This Course</h2>
                  <div className="prose">
                    <MarkdownContent content={metadata.description} />
                  </div>
                </div>
              )}

              {/* Lessons */}
              {sortedLessons.length > 0 && (
                <div className="card p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Course Content ({sortedLessons.length} lessons)
                  </h2>
                  <LessonList lessons={sortedLessons} courseSlug={course.slug} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-navy-800/50 transition-colors"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {instructor.metadata?.name || instructor.title}
                          </p>
                          {instructor.metadata?.credentials && (
                            <p className="text-navy-400 text-sm line-clamp-1">
                              {instructor.metadata.credentials}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Stats */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Course Details</h3>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Lessons</dt>
                    <dd className="text-white">{sortedLessons.length}</dd>
                  </div>
                  {metadata?.estimated_hours && (
                    <div className="flex justify-between">
                      <dt className="text-navy-400">Duration</dt>
                      <dd className="text-white">{metadata.estimated_hours} hours</dd>
                    </div>
                  )}
                  {metadata?.difficulty && (
                    <div className="flex justify-between">
                      <dt className="text-navy-400">Level</dt>
                      <dd className="text-white">{metadata.difficulty.value}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Price</dt>
                    <dd className="text-white">
                      {metadata?.is_free ? 'Free' : `$${metadata?.price || 0}`}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}