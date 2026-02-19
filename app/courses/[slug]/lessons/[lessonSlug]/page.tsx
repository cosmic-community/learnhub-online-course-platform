// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonList from '@/components/LessonList'
import LessonCompleteButton from '@/components/LessonCompleteButton'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  const currentLessonIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const lesson = sortedLessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < sortedLessons.length - 1 ? sortedLessons[currentLessonIndex + 1] : null

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
          <Link href="/courses" className="hover:text-primary-400 transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/courses/${slug}`} className="hover:text-primary-400 transition-colors">
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-white">{lesson.metadata?.title || lesson.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-4">Course Content</h3>
                <LessonList 
                  lessons={sortedLessons} 
                  courseSlug={slug}
                  currentLessonSlug={lessonSlug}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge bg-navy-800 text-navy-300">
                  Lesson {currentLessonIndex + 1} of {sortedLessons.length}
                </span>
                {lesson.metadata?.duration_minutes && (
                  <span className="flex items-center gap-1 text-sm text-navy-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.metadata.duration_minutes} min
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg">
                  {lesson.metadata.description}
                </p>
              )}
            </div>

            {/* Video */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={lesson.metadata.video_url} />
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
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>💻</span>
                  Code Example
                </h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Mark as Complete Button */}
            <div className="card p-6 mb-8 bg-gradient-to-r from-primary-500/10 to-primary-600/5 border-primary-500/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">Finished this lesson?</h3>
                  <p className="text-navy-400 text-sm">
                    Mark it complete to track your progress and earn achievements!
                  </p>
                </div>
                <LessonCompleteButton
                  courseSlug={slug}
                  lessonSlug={lessonSlug}
                  totalLessonsInCourse={sortedLessons.length}
                  estimatedMinutes={lesson.metadata?.duration_minutes || 10}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Next Lesson
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Back to Course
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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