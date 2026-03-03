// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonCompletionButton from '@/components/LessonCompletionButton'
import LessonAccessTracker from '@/components/LessonAccessTracker'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.metadata?.title || lesson.title} in this lesson from ${course.metadata?.title || course.title}`,
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    notFound()
  }

  // Get all lessons from the course and sort by order
  const lessons = (course.metadata?.lessons || []) as Lesson[]
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  // Find current lesson index and adjacent lessons
  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
  const totalLessons = sortedLessons.length

  return (
    <div className="py-8">
      {/* Lesson Access Tracker - invisible component to track access */}
      <LessonAccessTracker
        lessonId={lesson.id}
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.metadata?.title || course.title}
        courseThumbnail={course.metadata?.thumbnail?.imgix_url}
        totalLessons={totalLessons}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
          <Link href="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors">
            {course.metadata?.title || course.title}
          </Link>
          <span>/</span>
          <span className="text-navy-200">
            {lesson.metadata?.title || lesson.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                {sortedLessons.map((l, index) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${course.slug}/lessons/${l.slug}`}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isActive ? 'bg-primary-500 text-white' : 'bg-navy-700 text-navy-300'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm truncate">
                          {l.metadata?.title || l.title}
                        </span>
                        {l.metadata?.duration_minutes && (
                          <span className="text-xs text-navy-500">
                            {l.metadata.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge bg-navy-700 text-navy-200">
                  Lesson {currentIndex + 1} of {totalLessons}
                </span>
                {lesson.metadata?.duration_minutes && (
                  <span className="text-navy-400 text-sm">
                    {lesson.metadata.duration_minutes} min
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-lg text-navy-300">
                  {lesson.metadata.description}
                </p>
              )}
            </div>

            {/* Video Player (if video_url exists) */}
            {lesson.metadata?.video_url && (
              <div className="aspect-video bg-navy-900 rounded-xl overflow-hidden mb-8">
                <iframe
                  src={lesson.metadata.video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Completion Button */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Ready for the next step?</h3>
                  <p className="text-navy-400 text-sm">Mark this lesson as complete to track your progress</p>
                </div>
                <LessonCompletionButton
                  lessonId={lesson.id}
                  courseId={course.id}
                  courseSlug={course.slug}
                  courseTitle={course.metadata?.title || course.title}
                  courseThumbnail={course.metadata?.thumbnail?.imgix_url}
                  totalLessons={totalLessons}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Next Lesson
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Back to Course
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}