// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import { getMetafieldValue } from '@/lib/utils'
import LearningProgress from '@/components/LearningProgress'
import ReactMarkdown from 'react-markdown'
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
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
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

  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalDuration = lessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const difficulty = getMetafieldValue(metadata?.difficulty)
  const difficultyClass = difficulty?.toLowerCase() === 'beginner' ? 'badge-beginner'
    : difficulty?.toLowerCase() === 'intermediate' ? 'badge-intermediate'
    : difficulty?.toLowerCase() === 'advanced' ? 'badge-advanced'
    : 'bg-navy-700 text-navy-200'

  // Get lesson slugs for progress tracking
  const lessonSlugs = sortedLessons.map(l => l.slug)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-white">{metadata?.title || course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
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

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className={`badge ${difficultyClass}`}>
                  {difficulty || 'All Levels'}
                </span>
                
                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : metadata?.price ? (
                  <span className="badge bg-navy-700 text-white font-bold">
                    ${metadata.price}
                  </span>
                ) : null}

                <span className="flex items-center gap-1 text-navy-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours
                </span>

                <span className="flex items-center gap-1 text-navy-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={metadata.title || course.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="prose mb-12">
                <ReactMarkdown>{metadata.description}</ReactMarkdown>
              </div>
            )}

            {/* Lessons List */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📖</span>
                Course Curriculum
              </h2>
              
              <div className="space-y-3">
                {sortedLessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                    className="card block p-4 hover:bg-navy-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-semibold text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 truncate mt-1">
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
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Learning Progress */}
              <LearningProgress 
                courseSlug={course.slug} 
                lessonSlugs={lessonSlugs}
              />

              {/* Start Learning CTA */}
              {sortedLessons.length > 0 && (
                <Link
                  href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                  className="btn-primary w-full text-center block"
                >
                  Start Learning
                </Link>
              )}

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Your Instructor' : 'Your Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </p>
                          {instructor.metadata?.credentials && (
                            <p className="text-sm text-navy-400 line-clamp-1">
                              {instructor.metadata.credentials}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Info */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Course Info</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Difficulty</dt>
                    <dd className="text-white">{difficulty || 'All Levels'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Total Duration</dt>
                    <dd className="text-white">{metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Lessons</dt>
                    <dd className="text-white">{lessons.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Price</dt>
                    <dd className="text-white">
                      {metadata?.is_free ? 'Free' : metadata?.price ? `$${metadata.price}` : 'Free'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}