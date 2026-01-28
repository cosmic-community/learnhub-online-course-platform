// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import VideoEmbed from '@/components/VideoEmbed'
import CodeBlock from '@/components/CodeBlock'
import LessonList from '@/components/LessonList'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import LessonProgressTracker from '@/components/LessonProgressTracker'
import type { Lesson } from '@/types'

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
  
  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  // Find current lesson
  const currentLessonIndex = sortedLessons.findIndex((l) => l.slug === lessonSlug)
  const lesson = sortedLessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < sortedLessons.length - 1 ? sortedLessons[currentLessonIndex + 1] : null
  
  // Get the course thumbnail URL for progress tracking
  const courseThumbnail = course.metadata?.thumbnail?.imgix_url

  return (
    <div className="min-h-screen">
      {/* Progress Tracker - Invisible component that tracks lesson access */}
      <LessonProgressTracker
        courseSlug={slug}
        courseTitle={course.title}
        lessonSlug={lessonSlug}
        lessonTitle={lesson.metadata?.title || lesson.title}
        totalLessons={sortedLessons.length}
        courseThumbnail={courseThumbnail}
      />
      
      {/* Breadcrumb */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
              Courses
            </Link>
            <span className="text-navy-600">/</span>
            <Link 
              href={`/courses/${slug}`} 
              className="text-navy-400 hover:text-primary-400 transition-colors truncate max-w-[200px]"
            >
              {course.title}
            </Link>
            <span className="text-navy-600">/</span>
            <span className="text-white truncate max-w-[200px]">
              {lesson.metadata?.title || lesson.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lesson Header */}
            <div>
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-4">
                <span>Lesson {currentLessonIndex + 1} of {sortedLessons.length}</span>
                {lesson.metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {lesson.metadata.duration_minutes} min
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg">{lesson.metadata.description}</p>
              )}
            </div>

            {/* Video */}
            {lesson.metadata?.video_url && (
              <VideoEmbed url={lesson.metadata.video_url} title={lesson.title} />
            )}

            {/* Content */}
            {lesson.metadata?.content && (
              <div className="card p-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code Example
                </h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Lesson Completion */}
            <LessonCompleteButton
              courseSlug={slug}
              lessonSlug={lessonSlug}
              nextLessonUrl={nextLesson ? `/courses/${slug}/lessons/${nextLesson.slug}` : null}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors text-right"
                >
                  <div>
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary"
                >
                  Back to Course
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LessonList
                lessons={sortedLessons}
                courseSlug={slug}
                currentLessonSlug={lessonSlug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}