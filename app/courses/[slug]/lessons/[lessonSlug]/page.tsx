// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonList from '@/components/LessonList'
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

  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  const { metadata } = currentLesson

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
              Courses
            </Link>
            <span className="text-navy-600">/</span>
            <Link href={`/courses/${slug}`} className="text-navy-400 hover:text-white transition-colors">
              {course.title}
            </Link>
            <span className="text-navy-600">/</span>
            <span className="text-navy-300">{currentLesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            {metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={metadata.video_url} title={metadata?.title || currentLesson.title} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-navy-800 text-navy-300 rounded-full text-sm">
                  Lesson {currentIndex + 1} of {lessons.length}
                </span>
                {metadata?.duration_minutes && (
                  <span className="flex items-center gap-1 text-navy-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} min
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                {metadata?.title || currentLesson.title}
              </h1>
              
              {metadata?.description && (
                <p className="text-navy-300 text-lg">{metadata.description}</p>
              )}
            </div>

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} />
              </div>
            )}

            {/* Mark Complete Button */}
            <div className="mb-8 p-6 bg-navy-900/50 rounded-2xl border border-navy-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Ready to move on?</h3>
                  <p className="text-navy-400 text-sm">Mark this lesson as complete to track your progress</p>
                </div>
                <LessonCompleteButton 
                  lessonSlug={lessonSlug} 
                  durationMinutes={metadata?.duration_minutes || 0} 
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="text-sm">{prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="text-sm">{nextLesson.title}</div>
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
                  Complete Course 🎉
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Course Content</h3>
              <LessonList 
                lessons={lessons} 
                courseSlug={slug} 
                currentLessonSlug={lessonSlug}
              />
              
              {/* Quick Course Info */}
              <div className="mt-6 p-4 bg-navy-900/50 rounded-xl border border-navy-800">
                <h4 className="text-sm font-semibold text-white mb-3">About this course</h4>
                <div className="space-y-2 text-sm text-navy-400">
                  <div className="flex items-center justify-between">
                    <span>Total Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
                  {course.metadata?.estimated_hours && (
                    <div className="flex items-center justify-between">
                      <span>Duration</span>
                      <span className="text-white">{course.metadata.estimated_hours}h</span>
                    </div>
                  )}
                  {course.metadata?.difficulty && (
                    <div className="flex items-center justify-between">
                      <span>Difficulty</span>
                      <span className="text-white">{course.metadata.difficulty.value}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}