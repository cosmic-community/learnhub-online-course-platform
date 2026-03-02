// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import type { Metadata } from 'next'
import type { Lesson, Instructor, Category } from '@/types'
import CourseViewTracker from '@/components/CourseViewTracker'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }
  
  return {
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
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
  const lessons = (metadata?.lessons || []) as Lesson[]
  const instructors = (metadata?.instructors || []) as Instructor[]
  const categories = (metadata?.categories || []) as Category[]

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalDuration = sortedLessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
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

  return (
    <div className="py-12">
      {/* Track course view for Continue Learning */}
      <CourseViewTracker course={course} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
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
            {/* Header */}
            <div className="mb-8">
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
              
              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {metadata?.difficulty?.value && (
                  <span className={`badge ${getDifficultyColor(metadata.difficulty.value)}`}>
                    {metadata.difficulty.value}
                  </span>
                )}
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                <span className="text-navy-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata?.estimated_hours || Math.round(totalDuration / 60)} hours
                </span>
                <span className="text-navy-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {sortedLessons.length} lessons
                </span>
              </div>
            </div>

            {/* Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={metadata.title || course.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                <div className="prose max-w-none">
                  {metadata.description.split('\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={idx}>{paragraph.slice(2)}</h1>
                    }
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={idx}>{paragraph.slice(3)}</h2>
                    }
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={idx}>{paragraph.slice(4)}</h3>
                    }
                    if (paragraph.startsWith('- ')) {
                      return <li key={idx}>{paragraph.slice(2)}</li>
                    }
                    if (paragraph.trim() === '') {
                      return null
                    }
                    return <p key={idx}>{paragraph}</p>
                  })}
                </div>
              </div>
            )}

            {/* Lessons */}
            {sortedLessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                <div className="space-y-3">
                  {sortedLessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl hover:bg-navy-800 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 truncate">{lesson.metadata.description}</p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-400 flex items-center gap-1 shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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
                    <div className="text-3xl font-bold text-green-400">Free</div>
                  ) : (
                    <div className="text-3xl font-bold text-white">
                      ${metadata?.price || 0}
                    </div>
                  )}
                </div>
                
                {sortedLessons.length > 0 && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0]?.slug}`}
                    className="btn-primary w-full mb-4 group"
                  >
                    Start Learning
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-navy-300">
                    <span>Lessons</span>
                    <span className="text-white">{sortedLessons.length}</span>
                  </div>
                  <div className="flex justify-between text-navy-300">
                    <span>Duration</span>
                    <span className="text-white">{metadata?.estimated_hours || Math.round(totalDuration / 60)} hours</span>
                  </div>
                  <div className="flex justify-between text-navy-300">
                    <span>Level</span>
                    <span className="text-white capitalize">{metadata?.difficulty?.value || 'All levels'}</span>
                  </div>
                </div>
              </div>

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
                            src={`${instructor.metadata.photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                            👨‍🏫
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