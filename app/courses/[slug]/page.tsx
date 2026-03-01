// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import type { Metadata } from 'next'
import type { Lesson, Instructor, Category } from '@/types'
import MarkdownContent from '@/components/MarkdownContent'
import CourseProgressBar from '@/components/CourseProgressBar'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found' }
  }

  return {
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline,
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = (metadata?.lessons as Lesson[]) || []
  const instructors = (metadata?.instructors as Instructor[]) || []
  const categories = (metadata?.categories as Category[]) || []
  const difficulty = metadata?.difficulty?.value || 'Beginner'
  const lessonIds = lessons.map(l => l.id)

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalDuration = sortedLessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const difficultyColors: Record<string, string> = {
    'Beginner': 'badge-beginner',
    'Intermediate': 'badge-intermediate',
    'Advanced': 'badge-advanced',
  }

  return (
    <div className="py-12">
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
            <li className="text-navy-200">{metadata?.title || course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge bg-navy-800 text-navy-300 hover:bg-navy-700 transition-colors"
                  >
                    {category.metadata?.icon} {category.metadata?.name || category.title}
                  </Link>
                ))}
                <span className={`badge ${difficultyColors[difficulty] || 'badge-beginner'}`}>
                  {difficulty}
                </span>
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <CourseProgressBar courseSlug={slug} lessonIds={lessonIds} />
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{sortedLessons.length} lessons</span>
                </div>
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{Math.round(totalDuration / 60)} hours</span>
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>~{metadata.estimated_hours} hours to complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <MarkdownContent content={metadata.description} />
              </div>
            )}

            {/* Lessons List */}
            {sortedLessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {sortedLessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-xl transition-all group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 text-primary-400 rounded-lg flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 truncate">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <div className="flex-shrink-0 text-sm text-navy-500">
                          {lesson.metadata.duration_minutes} min
                        </div>
                      )}
                      <svg
                        className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors"
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
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
                    href={`/courses/${slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary w-full mb-4"
                  >
                    Start Learning
                  </Link>
                )}
                <div className="text-sm text-navy-400 text-center">
                  Full lifetime access
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-center gap-4">
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-sm text-navy-400 line-clamp-1">
                              {instructor.metadata.credentials}
                            </div>
                          )}
                        </div>
                      </div>
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