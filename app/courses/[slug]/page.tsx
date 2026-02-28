// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import LessonCard from '@/components/LessonCard'
import MarkdownContent from '@/components/MarkdownContent'
import CourseViewTracker from '@/components/CourseViewTracker'

interface CoursePageProps {
  params: Promise<{ slug: string }>
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

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const difficultyValue = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty

  return (
    <div className="min-h-screen">
      {/* Track course view for streak */}
      <CourseViewTracker courseSlug={slug} />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-navy-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="badge badge-free"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {difficultyValue && (
                  <span className={`badge badge-${difficultyValue.toLowerCase()}`}>
                    {difficultyValue}
                  </span>
                )}
                {metadata?.estimated_hours && (
                  <span className="text-navy-400">
                    ⏱️ {metadata.estimated_hours} hours
                  </span>
                )}
                {sortedLessons.length > 0 && (
                  <span className="text-navy-400">
                    📚 {sortedLessons.length} lessons
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                {metadata?.is_free ? (
                  <span className="text-3xl font-bold text-primary-400">Free</span>
                ) : metadata?.price ? (
                  <span className="text-3xl font-bold text-white">${metadata.price}</span>
                ) : null}
                
                {sortedLessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary"
                  >
                    Start Learning
                  </Link>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-navy-400">Taught by:</span>
                  <div className="flex -space-x-2">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="relative group"
                      >
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-10 h-10 rounded-full border-2 border-navy-900 object-cover group-hover:border-primary-500 transition-colors"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-navy-900 bg-navy-800 flex items-center justify-center text-sm font-medium text-white">
                            {(instructor.metadata?.name || instructor.title).charAt(0)}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                  <span className="text-white font-medium">
                    {instructors.map(i => i.metadata?.name || i.title).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Course Thumbnail */}
            <div className="relative">
              {metadata?.thumbnail?.imgix_url ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                    alt={metadata?.title || course.title}
                    className="w-full h-full object-cover"
                  />
                  {metadata?.preview_video_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-navy-950/50">
                      <a
                        href={metadata.preview_video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition-colors"
                      >
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
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
              {metadata?.description && (
                <div className="card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                  <MarkdownContent content={metadata.description} />
                </div>
              )}

              {/* Lessons */}
              {sortedLessons.length > 0 && (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Course Curriculum ({sortedLessons.length} lessons)
                  </h2>
                  <div className="space-y-4">
                    {sortedLessons.map((lesson, index) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        courseSlug={slug}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Info Card */}
              <div className="card p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-white mb-4">Course Info</h3>
                <div className="space-y-4">
                  {difficultyValue && (
                    <div className="flex justify-between">
                      <span className="text-navy-400">Level</span>
                      <span className="text-white">{difficultyValue}</span>
                    </div>
                  )}
                  {metadata?.estimated_hours && (
                    <div className="flex justify-between">
                      <span className="text-navy-400">Duration</span>
                      <span className="text-white">{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  {sortedLessons.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-navy-400">Lessons</span>
                      <span className="text-white">{sortedLessons.length}</span>
                    </div>
                  )}
                  {categories.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-navy-400">Categories</span>
                      <span className="text-white">{categories.length}</span>
                    </div>
                  )}
                </div>

                {sortedLessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary w-full mt-6"
                  >
                    Start Course
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