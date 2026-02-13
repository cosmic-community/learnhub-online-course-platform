// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonCompletionButton from '@/components/LessonCompletionButton'

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

  const currentLessonIndex = sortedLessons.findIndex((l) => l.slug === lessonSlug)
  const currentLesson = sortedLessons[currentLessonIndex]

  if (!currentLesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < sortedLessons.length - 1 ? sortedLessons[currentLessonIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/courses/${course.slug}`}
                className="text-navy-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Course
              </Link>
              <span className="text-navy-600">|</span>
              <span className="text-navy-300">{course.title}</span>
            </div>
            <div className="text-navy-400 text-sm">
              Lesson {currentLessonIndex + 1} of {sortedLessons.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video */}
            {currentLesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={currentLesson.metadata.video_url} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentLesson.metadata?.title || currentLesson.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-navy-400">
                {currentLesson.metadata?.duration_minutes && (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentLesson.metadata.duration_minutes} min
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Lesson {currentLessonIndex + 1}
                </span>
              </div>
            </div>

            {/* Completion Button */}
            <div className="mb-8">
              <LessonCompletionButton 
                lessonSlug={currentLesson.slug}
                lessonTitle={currentLesson.metadata?.title || currentLesson.title}
              />
            </div>

            {/* Description */}
            {currentLesson.metadata?.description && (
              <div className="card p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">About this lesson</h2>
                <p className="text-navy-300">{currentLesson.metadata.description}</p>
              </div>
            )}

            {/* Content */}
            {currentLesson.metadata?.content && (
              <div className="card p-6 mb-8">
                <MarkdownContent content={currentLesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {currentLesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={currentLesson.metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
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
                  Complete Course 🎉
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Course Lessons</h3>
                <div className="space-y-2">
                  {sortedLessons.map((lesson, index) => {
                    const isActive = lesson.slug === lessonSlug
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg transition-all
                          ${isActive 
                            ? 'bg-primary-500/20 border border-primary-500/50' 
                            : 'hover:bg-navy-800/50'
                          }
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                          ${isActive 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-navy-700 text-navy-300'
                          }
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`
                            text-sm font-medium truncate
                            ${isActive ? 'text-primary-400' : 'text-navy-200'}
                          `}>
                            {lesson.metadata?.title || lesson.title}
                          </div>
                          {lesson.metadata?.duration_minutes && (
                            <div className="text-xs text-navy-500">
                              {lesson.metadata.duration_minutes} min
                            </div>
                          )}
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}