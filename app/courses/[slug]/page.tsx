// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import DifficultyBadge from '@/components/DifficultyBadge'
import MarkdownContent from '@/components/MarkdownContent'
import LessonList from '@/components/LessonList'
import CourseProgressBar from '@/components/CourseProgressBar'

interface CoursePageProps {
  params: Promise<{ slug: string }>
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

  const firstLesson = sortedLessons[0]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-navy-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-6">
                <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                  Courses
                </Link>
                <span className="text-navy-600">/</span>
                <span className="text-navy-300">{course.title}</span>
              </nav>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">
                  {metadata.tagline}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                
                <span className="flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>

                {metadata?.estimated_hours && (
                  <span className="flex items-center gap-2 text-navy-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours} hours
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <CourseProgressBar courseSlug={slug} totalLessons={lessons.length} />
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                {metadata?.is_free ? (
                  <span className="text-2xl font-bold text-green-400">Free</span>
                ) : (
                  <span className="text-2xl font-bold text-white">
                    ${metadata?.price || 0}
                  </span>
                )}
                
                {firstLesson && (
                  <Link
                    href={`/courses/${slug}/lessons/${firstLesson.slug}`}
                    className="btn-primary"
                  >
                    Start Learning
                  </Link>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="mt-8 pt-8 border-t border-navy-800">
                  <h3 className="text-sm text-navy-400 mb-4">Instructors</h3>
                  <div className="flex flex-wrap gap-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <div className="text-white group-hover:text-primary-400 transition-colors font-medium">
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

            {/* Course Thumbnail */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden border border-navy-800 shadow-2xl">
                {metadata?.thumbnail ? (
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                    alt={course.title}
                    width={600}
                    height={338}
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
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              {metadata?.description && (
                <div className="card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                  <div className="prose">
                    <MarkdownContent content={metadata.description} />
                  </div>
                </div>
              )}
            </div>

            {/* Lessons Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <LessonList lessons={sortedLessons} courseSlug={slug} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}