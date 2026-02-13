// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import VideoEmbed from '@/components/VideoEmbed'
import CodeBlock from '@/components/CodeBlock'
import LessonCompleteButton from '@/components/LessonCompleteButton'
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
  const currentLesson = lessons.find((l: Lesson) => l.slug === lessonSlug)
  
  if (!currentLesson) {
    notFound()
  }

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a: Lesson, b: Lesson) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/courses/${slug}`}
              className="text-navy-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
            <span className="text-navy-600">|</span>
            <span className="text-navy-300 text-sm">
              Lesson {currentIndex + 1} of {sortedLessons.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video */}
            {currentLesson.metadata?.video_url && (
              <div className="card overflow-hidden">
                <VideoEmbed url={currentLesson.metadata.video_url} />
              </div>
            )}

            {/* Lesson Title and Info */}
            <div>
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-2">
                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full">
                  Lesson {currentIndex + 1}
                </span>
                {currentLesson.metadata?.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentLesson.metadata.duration_minutes} min
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentLesson.metadata?.title || currentLesson.title}
              </h1>
              {currentLesson.metadata?.description && (
                <p className="text-navy-300 text-lg">
                  {currentLesson.metadata.description}
                </p>
              )}
            </div>

            {/* Content */}
            {currentLesson.metadata?.content && (
              <div className="card p-8">
                <MarkdownContent content={currentLesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {currentLesson.metadata?.code_example && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Code Example
                </h2>
                <CodeBlock code={currentLesson.metadata.code_example} />
              </div>
            )}

            {/* Complete Button */}
            <div className="card p-6">
              <LessonCompleteButton 
                lessonId={currentLesson.id} 
                lessonTitle={currentLesson.metadata?.title || currentLesson.title}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
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
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Next Lesson
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Complete Course
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                Course Lessons
              </h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {sortedLessons.map((lesson: Lesson, index: number) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${slug}/lessons/${lesson.slug}`}
                    className={`block p-3 rounded-lg transition-all ${
                      lesson.slug === lessonSlug
                        ? 'bg-primary-500/20 border border-primary-500/30 text-white'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        lesson.slug === lessonSlug
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm line-clamp-2">
                        {lesson.metadata?.title || lesson.title}
                      </span>
                    </div>
                    {lesson.metadata?.duration_minutes && (
                      <div className="text-xs text-navy-500 mt-1 ml-9">
                        {lesson.metadata.duration_minutes} min
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}