// app/courses/[slug]/page.tsx
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import CourseTracker from '@/components/CourseTracker'

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

  const totalDuration = sortedLessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const getDifficultyBadge = (difficulty?: { value?: string } | string) => {
    const value = typeof difficulty === 'object' ? difficulty?.value : difficulty
    switch (value?.toLowerCase()) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'badge-beginner'
    }
  }

  const getDifficultyLabel = (difficulty?: { value?: string } | string) => {
    const value = typeof difficulty === 'object' ? difficulty?.value : difficulty
    return value || 'Beginner'
  }

  return (
    <div className="min-h-screen">
      {/* Track course view */}
      <CourseTracker />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-navy-900 to-navy-950 border-b border-navy-800">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Course Info */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-6">
                <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                  Courses
                </Link>
                <span className="text-navy-600">/</span>
                <span className="text-white">{metadata?.title || course.title}</span>
              </nav>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge ${getDifficultyBadge(metadata?.difficulty)}`}>
                  {getDifficultyLabel(metadata?.difficulty)}
                </span>
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {categories[0]?.metadata?.name && (
                  <span className="badge bg-navy-700 text-navy-200">
                    {categories[0].metadata.icon} {categories[0].metadata.name}
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-navy-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {sortedLessons.length} lessons
                </div>
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2 text-navy-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2 text-navy-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours}h estimated
                  </div>
                )}
              </div>

              {/* CTA */}
              {sortedLessons.length > 0 && (
                <Link
                  href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                  className="btn-primary text-lg inline-flex items-center gap-2"
                >
                  Start Learning
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Right Column - Thumbnail */}
            <div className="relative">
              {metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                  alt={metadata.title || course.title}
                  className="w-full aspect-video object-cover rounded-2xl border border-navy-700 shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-video bg-navy-800 rounded-2xl border border-navy-700 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-navy-900/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-navy-700">
                {metadata?.is_free ? (
                  <span className="text-primary-400 font-bold text-xl">Free</span>
                ) : (
                  <span className="text-white font-bold text-xl">
                    ${metadata?.price || 0}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description & Lessons */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {metadata?.description && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose">
                  <MarkdownRenderer content={metadata.description} />
                </div>
              </div>
            )}

            {/* Lessons */}
            {sortedLessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Curriculum
                  <span className="text-navy-400 text-base font-normal ml-2">
                    ({sortedLessons.length} lessons)
                  </span>
                </h2>
                <div className="space-y-2">
                  {sortedLessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/30 hover:bg-navy-800 border border-transparent hover:border-navy-700 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-navy-400 text-sm truncate">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-navy-400 text-sm shrink-0">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg 
                        className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors shrink-0" 
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
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">
                  {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                </h3>
                <div className="space-y-4">
                  {instructors.map((instructor) => (
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
                        <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center">
                          <span className="text-xl">👨‍🏫</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {instructor.metadata?.name || instructor.title}
                        </div>
                        {instructor.metadata?.credentials && (
                          <div className="text-navy-400 text-sm line-clamp-1">
                            {instructor.metadata.credentials}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-navy-800 hover:bg-navy-700 text-navy-200 rounded-lg transition-colors text-sm"
                    >
                      <span>{category.metadata?.icon || '📂'}</span>
                      {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="card p-6">
              <h3 className="font-semibold text-white mb-4">Share This Course</h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 bg-navy-800 hover:bg-navy-700 rounded-lg text-navy-200 transition-colors text-sm">
                  Twitter
                </button>
                <button className="flex-1 py-2 px-4 bg-navy-800 hover:bg-navy-700 rounded-lg text-navy-200 transition-colors text-sm">
                  LinkedIn
                </button>
                <button className="flex-1 py-2 px-4 bg-navy-800 hover:bg-navy-700 rounded-lg text-navy-200 transition-colors text-sm">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}