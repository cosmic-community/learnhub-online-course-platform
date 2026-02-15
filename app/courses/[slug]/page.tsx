// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import StudyTimeCalculator from '@/components/StudyTimeCalculator'

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-navy-900/50 to-navy-950">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Course Info */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/courses" className="hover:text-primary-400 transition-colors">
                  Courses
                </Link>
                <span>/</span>
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

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">
                  {metadata.tagline}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                <span className="flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {sortedLessons.length} lessons
                </span>
                {totalDuration > 0 && (
                  <span className="flex items-center gap-2 text-navy-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex -space-x-2">
                    {instructors.map((instructor) => (
                      instructor.metadata?.photo ? (
                        <img
                          key={instructor.id}
                          src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                          alt={instructor.metadata?.name || instructor.title}
                          className="w-10 h-10 rounded-full border-2 border-navy-900 object-cover"
                        />
                      ) : (
                        <div
                          key={instructor.id}
                          className="w-10 h-10 rounded-full border-2 border-navy-900 bg-navy-700 flex items-center justify-center text-lg"
                        >
                          👨‍🏫
                        </div>
                      )
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="text-navy-400">Taught by </span>
                    <span className="text-white">
                      {instructors.map((i, idx) => (
                        <span key={i.id}>
                          <Link
                            href={`/instructors/${i.slug}`}
                            className="hover:text-primary-400 transition-colors"
                          >
                            {i.metadata?.name || i.title}
                          </Link>
                          {idx < instructors.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {sortedLessons[0] && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary text-lg"
                  >
                    Start Learning
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  {metadata?.is_free ? (
                    <span className="badge badge-free text-lg px-4 py-2">Free Course</span>
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      ${metadata?.price || 0}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail & Calculator */}
            <div className="space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10">
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
              
              {/* Study Time Calculator */}
              {metadata?.estimated_hours && metadata.estimated_hours > 0 && (
                <StudyTimeCalculator totalHours={metadata.estimated_hours} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
              {metadata?.description ? (
                <div className="prose">
                  <MarkdownContent content={metadata.description} />
                </div>
              ) : (
                <p className="text-navy-400">No description available.</p>
              )}
            </div>

            {/* Lessons Sidebar */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
              <LessonList lessons={sortedLessons} courseSlug={course.slug} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}