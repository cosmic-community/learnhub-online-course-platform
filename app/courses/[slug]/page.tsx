// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import LessonList from '@/components/LessonList'
import DifficultyBadge from '@/components/DifficultyBadge'
import CourseProgressTracker from '@/components/CourseProgressTracker'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const thumbnail = metadata?.thumbnail
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
  const totalMinutes = lessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <div className="min-h-screen">
      {/* Progress Tracker Component */}
      <CourseProgressTracker 
        courseSlug={course.slug}
        courseTitle={course.title}
        thumbnail={thumbnail?.imgix_url}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-navy-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
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
                    {totalHours > 0 && `${totalHours}h `}{remainingMinutes}m total
                  </span>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex -space-x-2">
                    {instructors.map((instructor) => (
                      <div key={instructor.id} className="relative">
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border-2 border-navy-900"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center border-2 border-navy-900">
                            👨‍🏫
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {instructors.map((i) => i.metadata?.name || i.title).join(', ')}
                    </div>
                    {instructors[0]?.metadata?.credentials && (
                      <div className="text-sm text-navy-400">
                        {instructors[0].metadata.credentials}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                {metadata?.is_free ? (
                  <span className="text-2xl font-bold text-primary-400">Free</span>
                ) : (
                  <span className="text-2xl font-bold text-white">
                    ${metadata?.price || 0}
                  </span>
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
              <div className="aspect-video rounded-2xl overflow-hidden bg-navy-800">
                {thumbnail ? (
                  <img
                    src={`${thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                    alt={course.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
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

            {/* Sidebar - Lessons */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                {sortedLessons.length > 0 ? (
                  <LessonList 
                    lessons={sortedLessons} 
                    courseSlug={course.slug}
                  />
                ) : (
                  <div className="card p-6 text-center">
                    <span className="text-4xl mb-4 block">📝</span>
                    <p className="text-navy-400">No lessons available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}