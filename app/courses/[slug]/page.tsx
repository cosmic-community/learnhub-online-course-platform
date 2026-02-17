// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import MarkdownContent from '@/components/MarkdownContent'
import CourseViewTracker from '@/components/CourseViewTracker'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

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

  // Calculate total duration
  const totalMinutes = sortedLessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  return (
    <>
      {/* Client component to track course views */}
      <CourseViewTracker 
        slug={course.slug} 
        title={course.title}
        thumbnail={metadata?.thumbnail?.imgix_url}
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Course Info */}
              <div>
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                  <Link href="/" className="hover:text-primary-400">Home</Link>
                  <span>/</span>
                  <Link href="/courses" className="hover:text-primary-400">Courses</Link>
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
                        className="text-sm text-navy-400 hover:text-primary-400 transition-colors"
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

                {/* Meta badges */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  {metadata?.difficulty && (
                    <DifficultyBadge difficulty={metadata.difficulty} />
                  )}
                  
                  <span className="flex items-center gap-1 text-navy-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {sortedLessons.length} lessons
                  </span>

                  {totalMinutes > 0 && (
                    <span className="flex items-center gap-1 text-navy-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m
                    </span>
                  )}

                  {metadata?.estimated_hours && (
                    <span className="flex items-center gap-1 text-navy-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ~{metadata.estimated_hours}h total
                    </span>
                  )}
                </div>

                {/* Instructors */}
                {instructors.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-xs text-navy-400 line-clamp-1">
                              {instructor.metadata.credentials}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Course Card */}
              <div className="lg:sticky lg:top-24">
                <div className="card overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    {metadata?.thumbnail ? (
                      <img
                        src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                        alt={course.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                        <span className="text-6xl">📚</span>
                      </div>
                    )}
                    
                    {/* Play button overlay */}
                    {metadata?.preview_video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/50">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Price */}
                    <div className="flex items-center justify-between mb-6">
                      {metadata?.is_free ? (
                        <span className="text-3xl font-bold text-primary-400">Free</span>
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          ${metadata?.price || 0}
                        </span>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    {sortedLessons.length > 0 && sortedLessons[0] && (
                      <Link
                        href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                        className="btn-primary w-full text-center mb-4"
                      >
                        Start Learning
                      </Link>
                    )}

                    {/* Course includes */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-navy-300">
                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {sortedLessons.length} video lessons
                      </div>
                      <div className="flex items-center gap-3 text-navy-300">
                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Code examples included
                      </div>
                      <div className="flex items-center gap-3 text-navy-300">
                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Learn at your own pace
                      </div>
                      <div className="flex items-center gap-3 text-navy-300">
                        <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Lifetime access
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-16 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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

              {/* Lessons */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-white mb-6">Course Lessons</h2>
                <LessonList lessons={sortedLessons} courseSlug={course.slug} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}