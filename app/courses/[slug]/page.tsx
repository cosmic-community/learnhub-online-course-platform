// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ProgressTracker from '@/components/ProgressTracker'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
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

  // Get lesson slugs for progress tracking
  const lessonSlugs = lessons.map((l: { slug: string }) => l.slug)

  // Calculate total duration
  const totalMinutes = lessons.reduce((total: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return total + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const getDifficultyBadge = (difficulty?: { value?: string }) => {
    const level = difficulty?.value?.toLowerCase() || 'beginner'
    const badges: Record<string, string> = {
      beginner: 'badge-beginner',
      intermediate: 'badge-intermediate',
      advanced: 'badge-advanced',
    }
    return badges[level] || 'badge-beginner'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-navy-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/courses" className="hover:text-white transition-colors">
                  Courses
                </Link>
                <span>/</span>
                <span className="text-white">{metadata?.title || course.title}</span>
              </nav>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((cat: { id: string; slug: string; metadata?: { name?: string; icon?: string } }) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-primary-400 hover:text-primary-300"
                    >
                      {cat.metadata?.icon} {cat.metadata?.name}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className={`badge ${getDifficultyBadge(metadata?.difficulty)}`}>
                  {metadata?.difficulty?.value || 'Beginner'}
                </span>
                
                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : metadata?.price ? (
                  <span className="text-2xl font-bold text-white">${metadata.price}</span>
                ) : null}

                <span className="text-navy-400">
                  {lessons.length} lessons
                </span>

                {totalMinutes > 0 && (
                  <span className="text-navy-400">
                    {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
                  </span>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-navy-400">Taught by:</span>
                  <div className="flex items-center gap-3">
                    {instructors.map((instructor: { id: string; slug: string; metadata?: { name?: string; photo?: { imgix_url?: string } } }) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors"
                      >
                        {instructor.metadata?.photo?.imgix_url && (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || ''}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span>{instructor.metadata?.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {lessons.length > 0 && (
                <Link
                  href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                  className="btn-primary text-lg inline-flex items-center gap-2"
                >
                  Start Learning
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Course Thumbnail */}
            <div className="relative">
              {metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="aspect-video bg-navy-800 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {metadata?.description && (
                <div className="card p-6 sm:p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                  <MarkdownRenderer content={metadata.description} />
                </div>
              )}

              {/* Lessons */}
              {lessons.length > 0 && (
                <div className="card p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Course Curriculum ({lessons.length} lessons)
                  </h2>
                  <div className="space-y-3">
                    {lessons.map((lesson: { id: string; slug: string; metadata?: { title?: string; description?: string; duration_minutes?: number }; title: string }, index: number) => (
                      <Link
                        key={lesson.id}
                        href={`/courses/${slug}/lessons/${lesson.slug}`}
                        className="flex items-start gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-xl transition-colors group"
                      >
                        <span className="w-8 h-8 bg-navy-700 group-hover:bg-primary-500 rounded-lg flex items-center justify-center text-sm font-medium text-white transition-colors">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {lesson.metadata?.title || lesson.title}
                          </h3>
                          {lesson.metadata?.description && (
                            <p className="text-sm text-navy-400 mt-1 line-clamp-2">
                              {lesson.metadata.description}
                            </p>
                          )}
                        </div>
                        {lesson.metadata?.duration_minutes && (
                          <span className="text-sm text-navy-500">
                            {lesson.metadata.duration_minutes} min
                          </span>
                        )}
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
                <ProgressTracker 
                  courseSlug={slug}
                  lessonSlugs={lessonSlugs}
                />

                {/* Quick Info Card */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Course Includes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-navy-300">
                      <span className="text-xl">📺</span>
                      {lessons.length} video lessons
                    </li>
                    {totalMinutes > 0 && (
                      <li className="flex items-center gap-3 text-navy-300">
                        <span className="text-xl">⏱️</span>
                        {hours > 0 ? `${hours} hours ` : ''}{minutes > 0 ? `${minutes} minutes` : ''} of content
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-navy-300">
                      <span className="text-xl">💻</span>
                      Code examples included
                    </li>
                    <li className="flex items-center gap-3 text-navy-300">
                      <span className="text-xl">📱</span>
                      Access on any device
                    </li>
                    <li className="flex items-center gap-3 text-navy-300">
                      <span className="text-xl">🏆</span>
                      Progress tracking
                    </li>
                  </ul>
                </div>

                {/* Instructor Cards */}
                {instructors.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Instructor{instructors.length > 1 ? 's' : ''}</h3>
                    <div className="space-y-4">
                      {instructors.map((instructor: { id: string; slug: string; metadata?: { name?: string; credentials?: string; photo?: { imgix_url?: string } } }) => (
                        <Link
                          key={instructor.id}
                          href={`/instructors/${instructor.slug}`}
                          className="flex items-center gap-3 group"
                        >
                          {instructor.metadata?.photo?.imgix_url ? (
                            <img
                              src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                              alt={instructor.metadata?.name || ''}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center">
                              <span className="text-xl">👨‍🏫</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                              {instructor.metadata?.name}
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
      </section>
    </div>
  )
}