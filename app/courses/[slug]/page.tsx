// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import ProgressTracker from '@/components/ProgressTracker'
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
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || 'Learn with LearnHub',
  }
}

// Helper function to get difficulty badge classes
function getDifficultyBadge(difficulty: string | { key?: string; value?: string } | undefined): { className: string; label: string } {
  const difficultyValue = typeof difficulty === 'object' ? (difficulty?.value || difficulty?.key || '') : (difficulty || '')
  const normalizedDifficulty = difficultyValue.toLowerCase()
  
  switch (normalizedDifficulty) {
    case 'beginner':
      return { className: 'badge-beginner', label: 'Beginner' }
    case 'intermediate':
      return { className: 'badge-intermediate', label: 'Intermediate' }
    case 'advanced':
      return { className: 'badge-advanced', label: 'Advanced' }
    default:
      return { className: 'bg-navy-700 text-navy-200', label: difficultyValue || 'All Levels' }
  }
}

// Helper function to render markdown-like content
function renderDescription(content: string): string {
  // Simple markdown-like rendering
  let html = content
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
  
  // Convert lists
  html = html.replace(/^\s*-\s+(.*)$/gim, '<li class="text-navy-300">$1</li>')
  html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc pl-6 mb-4 space-y-1">$&</ul>')
  
  // Convert paragraphs
  const paragraphs = html.split(/\n\n+/)
  html = paragraphs.map(p => {
    if (p.startsWith('<h') || p.startsWith('<ul')) {
      return p
    }
    return `<p class="text-navy-300 mb-4">${p}</p>`
  }).join('\n')
  
  return html
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
  const difficulty = getDifficultyBadge(metadata?.difficulty)
  
  // Calculate total duration
  const totalMinutes = lessons.reduce((acc, lesson) => acc + (lesson.metadata?.duration_minutes || 0), 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
          <Link href="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{metadata?.title || course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`badge ${difficulty.className}`}>
                  {difficulty.label}
                </span>
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {categories.map((cat) => (
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
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{lessons.length} lessons</span>
                </div>
                {totalMinutes > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m`}
                    </span>
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>~{metadata.estimated_hours} hours total</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="card aspect-video mb-8 overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Progress Tracker */}
            <ProgressTracker 
              courseId={course.id} 
              totalLessons={lessons.length}
            />

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderDescription(metadata.description) }}
                />
              </div>
            )}

            {/* Lessons List */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 hover:border-navy-600 transition-all group"
                  >
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                        {lesson.metadata?.title || lesson.title}
                      </h3>
                      {lesson.metadata?.description && (
                        <p className="text-sm text-navy-400 line-clamp-1 mt-0.5">
                          {lesson.metadata.description}
                        </p>
                      )}
                    </div>
                    {lesson.metadata?.duration_minutes && (
                      <span className="flex-shrink-0 text-sm text-navy-500">
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
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <div className="card p-6 mb-8 sticky top-8">
              {/* Price */}
              <div className="mb-6">
                {metadata?.is_free ? (
                  <div className="text-3xl font-bold text-white">Free</div>
                ) : metadata?.price ? (
                  <div className="text-3xl font-bold text-white">${metadata.price}</div>
                ) : (
                  <div className="text-3xl font-bold text-white">Free</div>
                )}
              </div>

              {/* CTA Button */}
              {lessons.length > 0 && (
                <Link
                  href={`/courses/${course.slug}/lessons/${lessons[0].slug}`}
                  className="btn-primary w-full text-center mb-4"
                >
                  Start Learning
                </Link>
              )}

              {/* Course Features */}
              <div className="space-y-3 pt-4 border-t border-navy-700">
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access on all devices</span>
                </div>
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track your progress</span>
                </div>
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Earn completion badges</span>
                </div>
              </div>
            </div>

            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">Instructors</h3>
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
                        <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-navy-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
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
  )
}