// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import LessonList from '@/components/LessonList'
import DifficultyBadge from '@/components/DifficultyBadge'
import CourseViewTracker from '@/components/CourseViewTracker'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
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
  const totalMinutes = lessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <div className="min-h-screen">
      {/* Track course view */}
      <CourseViewTracker courseSlug={slug} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-900/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div>
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
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
                      className="badge bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
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
                    {totalHours > 0 && `${totalHours}h `}{remainingMinutes > 0 && `${remainingMinutes}m`}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                {metadata?.is_free ? (
                  <span className="text-3xl font-bold text-green-400">Free</span>
                ) : (
                  <span className="text-3xl font-bold text-white">${metadata?.price || 0}</span>
                )}
              </div>

              {/* CTA Buttons */}
              {sortedLessons.length > 0 && sortedLessons[0] && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary text-lg"
                  >
                    Start Learning
                  </Link>
                </div>
              )}

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="mt-8 pt-8 border-t border-navy-800">
                  <h3 className="text-sm font-medium text-navy-400 mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
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
                          <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-sm text-navy-400 truncate max-w-[200px]">
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
              {metadata?.thumbnail ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                    alt={course.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-8xl">📚</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
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
                  <LessonList lessons={sortedLessons} courseSlug={course.slug} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Course Details</h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </li>
                  {totalMinutes > 0 && (
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-navy-400">Duration</span>
                      <span className="text-white">
                        {totalHours > 0 && `${totalHours}h `}{remainingMinutes > 0 && `${remainingMinutes}m`}
                      </span>
                    </li>
                  )}
                  {metadata?.difficulty && (
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-navy-400">Difficulty</span>
                      <DifficultyBadge difficulty={metadata.difficulty} size="small" />
                    </li>
                  )}
                  {metadata?.estimated_hours && (
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-navy-400">Est. Completion</span>
                      <span className="text-white">{metadata.estimated_hours} hours</span>
                    </li>
                  )}
                </ul>

                {sortedLessons.length > 0 && sortedLessons[0] && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary w-full mt-6 text-center"
                  >
                    Start Learning
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}