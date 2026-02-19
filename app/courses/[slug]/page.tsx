// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import MarkdownContent from '@/components/MarkdownContent'
import CourseProgressTracker from '@/components/CourseProgressTracker'

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

  // Calculate total duration
  const totalMinutes = lessons.reduce((sum, lesson) => sum + (lesson.metadata?.duration_minutes || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <div className="min-h-screen">
      {/* Progress Tracker (invisible, just tracks in localStorage) */}
      <CourseProgressTracker
        courseSlug={course.slug}
        courseTitle={course.title}
        courseThumbnail={metadata?.thumbnail?.imgix_url}
      />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-primary-400 transition-colors">Courses</Link>
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

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
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
                
                <span className="flex items-center gap-2 text-navy-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>

                {totalMinutes > 0 && (
                  <span className="flex items-center gap-2 text-navy-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {totalHours > 0 && `${totalHours}h `}{remainingMinutes}m
                  </span>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex -space-x-3">
                    {instructors.map((instructor) => (
                      <div key={instructor.id} className="relative">
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-10 h-10 rounded-full border-2 border-navy-900 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-navy-900 bg-navy-800 flex items-center justify-center">
                            👨‍🏫
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm text-navy-400">Taught by</div>
                    <div className="text-white">
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
                    </div>
                  </div>
                </div>
              )}

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
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden bg-navy-800 shadow-2xl">
                {metadata?.thumbnail ? (
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-700 to-navy-800">
                    <span className="text-8xl">📚</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
              {metadata?.description ? (
                <MarkdownContent content={metadata.description} />
              ) : (
                <p className="text-navy-300">No description available.</p>
              )}
            </div>

            {/* Lessons Sidebar */}
            <div>
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                <LessonList lessons={sortedLessons} courseSlug={course.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}