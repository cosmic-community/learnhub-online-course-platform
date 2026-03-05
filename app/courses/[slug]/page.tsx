// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import type { Lesson, Instructor, Category } from '@/types'
import CourseProgressBanner from '@/components/CourseProgressBanner'

// Helper to get difficulty value
function getDifficultyValue(difficulty: unknown): string {
  if (!difficulty) return 'beginner'
  if (typeof difficulty === 'string') return difficulty
  if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
    return String((difficulty as { value: unknown }).value)
  }
  return 'beginner'
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const difficulty = getDifficultyValue(metadata?.difficulty)

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a: Lesson, b: Lesson) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  // Calculate total duration
  const totalMinutes = sortedLessons.reduce((sum: number, lesson: Lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  // Parse markdown description
  const description = metadata?.description || ''
  
  // Simple markdown to HTML conversion for description
  const renderMarkdown = (md: string) => {
    let html = md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    html = html
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    html = html.replace(/^\- (.+)$/gim, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    html = html.replace(/^(?!<[hulo]|```)(.*\S.*)$/gim, '<p>$1</p>')
    
    return html
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-900/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/courses" className="hover:text-white transition-colors">
                  Courses
                </Link>
                <span>/</span>
                <span className="text-white">{metadata?.title || course.title}</span>
              </div>

              {/* Categories & Difficulty */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge badge-${difficulty.toLowerCase()}`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {categories.map((category: Category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge bg-navy-700 text-navy-200 hover:bg-navy-600 transition-colors"
                  >
                    {category.metadata?.icon} {category.metadata?.name || category.title}
                  </Link>
                ))}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-navy-400 mb-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {sortedLessons.length} lessons
                </div>
                {totalMinutes > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    ~{metadata.estimated_hours} hours total
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                {sortedLessons.length > 0 && sortedLessons[0] && (
                  <Link 
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary"
                  >
                    Start Learning
                  </Link>
                )}
                {!metadata?.is_free && metadata?.price && (
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-2xl font-bold">${metadata.price}</span>
                    <span className="text-navy-400">USD</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              {metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-navy-800 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
              {metadata?.preview_video_url && (
                <a
                  href={metadata.preview_video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Progress Banner */}
      <CourseProgressBanner 
        courseId={course.id}
        totalLessons={sortedLessons.length}
        lessonIds={sortedLessons.map((l: Lesson) => l.id)}
      />

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {description && (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(description) }}
                  />
                </div>
              )}

              {/* Lessons */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                <div className="space-y-3">
                  {sortedLessons.map((lesson: Lesson, index: number) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-sm font-medium text-navy-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 truncate">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor: Instructor) => (
                      <div key={instructor.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-navy-700">
                          {instructor.metadata?.photo?.imgix_url ? (
                            <img
                              src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                              alt={instructor.metadata?.name || instructor.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              👨‍🏫
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">
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

              {/* Quick Stats */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white font-medium">{sortedLessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400">Duration</span>
                    <span className="text-white font-medium">
                      {metadata?.estimated_hours ? `${metadata.estimated_hours} hours` : `${Math.ceil(totalMinutes / 60)} hours`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400">Difficulty</span>
                    <span className="text-white font-medium capitalize">{difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400">Price</span>
                    <span className="text-white font-medium">
                      {metadata?.is_free ? 'Free' : `$${metadata?.price || 0}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}