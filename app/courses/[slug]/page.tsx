// app/courses/[slug]/page.tsx
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MarkdownContent from '@/components/MarkdownContent'
import LearningProgress from '@/components/LearningProgress'
import type { Metadata } from 'next'
import type { Lesson, Instructor, Category } from '@/types'

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
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || 'Learn new skills with LearnHub',
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
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const lessonIds = lessons.map((l: Lesson) => l.id)

  const difficultyColors: Record<string, string> = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
  }

  const difficultyValue = metadata?.difficulty?.value?.toLowerCase() || 'beginner'

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-white">{metadata?.title || course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="card p-8 mb-8">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category: Category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-xs bg-navy-700 text-navy-300 px-3 py-1 rounded-full hover:bg-navy-600 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">
                  {metadata.tagline}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`badge ${difficultyColors[difficultyValue] || 'badge-beginner'}`}>
                  {metadata?.difficulty?.value || 'Beginner'}
                </span>
                {metadata?.estimated_hours && (
                  <span className="text-navy-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours} hours
                  </span>
                )}
                <span className="text-navy-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>
              </div>

              {/* Thumbnail */}
              {metadata?.thumbnail?.imgix_url && (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full rounded-xl mb-6"
                />
              )}

              {/* Description */}
              {metadata?.description && (
                <div className="prose">
                  <MarkdownContent content={metadata.description} />
                </div>
              )}
            </div>

            {/* Lessons List */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {lessons.map((lesson: Lesson, index: number) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl hover:bg-navy-800 transition-colors group"
                    >
                      <span className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center text-navy-300 font-medium group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 line-clamp-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-500">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="sticky top-24 space-y-6">
              {/* Progress Tracker */}
              <LearningProgress 
                courseId={course.id}
                courseName={metadata?.title || course.title}
                totalLessons={lessons.length}
                lessonIds={lessonIds}
              />

              {/* Pricing Card */}
              <div className="card p-6">
                {metadata?.is_free ? (
                  <div className="text-center">
                    <span className="badge badge-free text-lg mb-4">Free Course</span>
                    <Link
                      href={lessons.length > 0 ? `/courses/${slug}/lessons/${lessons[0].slug}` : '#'}
                      className="btn-primary w-full"
                    >
                      Start Learning
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${metadata?.price || 0}
                    </div>
                    <p className="text-navy-400 text-sm mb-4">One-time purchase</p>
                    <Link
                      href={lessons.length > 0 ? `/courses/${slug}/lessons/${lessons[0].slug}` : '#'}
                      className="btn-primary w-full mb-3"
                    >
                      Start Learning
                    </Link>
                    <p className="text-xs text-navy-500">30-day money-back guarantee</p>
                  </div>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">Instructors</h3>
                  <div className="space-y-4">
                    {instructors.map((instructor: Instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo?.imgix_url && (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </p>
                          {instructor.metadata?.credentials && (
                            <p className="text-xs text-navy-400 line-clamp-1">
                              {instructor.metadata.credentials}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Includes */}
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">This course includes</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-navy-300 text-sm">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {lessons.length} video lessons
                  </li>
                  <li className="flex items-center gap-3 text-navy-300 text-sm">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata?.estimated_hours || 'Several'} hours of content
                  </li>
                  <li className="flex items-center gap-3 text-navy-300 text-sm">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Progress tracking
                  </li>
                  <li className="flex items-center gap-3 text-navy-300 text-sm">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code examples
                  </li>
                  <li className="flex items-center gap-3 text-navy-300 text-sm">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}