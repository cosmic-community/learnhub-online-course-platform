// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import DifficultyBadge from '@/components/DifficultyBadge'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ProgressBar from '@/components/ProgressBar'
import type { Metadata } from 'next'
import type { Lesson, Instructor, Category } from '@/types'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }

  return {
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || 'Learn with LearnHub',
  }
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
  const difficulty = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li className="text-navy-200">{metadata?.title || course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {difficulty && <DifficultyBadge difficulty={difficulty} />}
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {categories.map((cat: Category) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="badge bg-navy-700 text-navy-200 hover:bg-navy-600 transition-colors"
                  >
                    {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">
                  {metadata.tagline}
                </p>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-navy-400">
                {lessons.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📖</span>
                    <span>{lessons.length} lessons</span>
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <span>{metadata.estimated_hours} hours</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <MarkdownRenderer content={metadata.description} />
              </div>
            )}

            {/* Lessons List */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
                  <span className="text-navy-400">{lessons.length} lessons</span>
                </div>
                
                {/* Progress Bar for the course */}
                <div className="mb-6">
                  <ProgressBar courseId={course.id} size="lg" />
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson: Lesson, index: number) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-xl transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-navy-700 group-hover:bg-primary-500/20 rounded-full flex items-center justify-center text-navy-400 group-hover:text-primary-400 font-medium transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 truncate mt-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <div className="flex-shrink-0 text-sm text-navy-500">
                          {lesson.metadata.duration_minutes} min
                        </div>
                      )}
                      <svg className="flex-shrink-0 w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {/* Pricing Card */}
              <div className="card p-6">
                <div className="mb-4">
                  {metadata?.is_free ? (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  ) : metadata?.price ? (
                    <div className="text-3xl font-bold text-white">${metadata.price}</div>
                  ) : (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  )}
                </div>

                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                    className="btn-primary w-full text-center mb-4"
                  >
                    Start Learning
                  </Link>
                )}

                <div className="text-sm text-navy-400 space-y-2">
                  <p>✓ Full lifetime access</p>
                  <p>✓ Access on all devices</p>
                  <p>✓ Certificate of completion</p>
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor: Instructor) => (
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
                            <div className="text-xs text-navy-400 truncate max-w-[180px]">
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