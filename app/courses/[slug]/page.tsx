// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }
  
  return {
    title: course.metadata?.seo_title || `${course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
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
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalDuration = lessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-primary-400">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-primary-400">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200">{course.title}</li>
          </ol>
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
                      className="badge bg-navy-800 text-navy-200 hover:bg-navy-700 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}
              
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                
                {metadata?.estimated_hours && (
                  <span className="text-navy-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours} hours
                  </span>
                )}
                
                <span className="text-navy-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>
              </div>
            </div>

            {/* Thumbnail */}
            {thumbnail && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={course.title}
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            )}

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
                  <span className="text-base font-normal text-navy-400 ml-3">
                    {lessons.length} lessons • {totalDuration} min total
                  </span>
                </h2>
                <LessonList lessons={sortedLessons} courseSlug={course.slug} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Pricing Card */}
              <div className="card p-6 mb-6">
                <div className="mb-6">
                  {metadata?.is_free ? (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  ) : (
                    <div className="text-3xl font-bold text-white">
                      ${metadata?.price || 0}
                    </div>
                  )}
                </div>
                
                <button className="btn-primary w-full mb-4">
                  {metadata?.is_free ? 'Start Learning' : 'Enroll Now'}
                </button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full lifetime access
                  </div>
                  <div className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access on mobile and desktop
                  </div>
                  <div className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Certificate of completion
                  </div>
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
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-4 group"
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
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center">
                            <span className="text-xl">👨‍🏫</span>
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
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