// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
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
  
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="sticky top-16 z-40 bg-navy-950/95 backdrop-blur-sm border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href={`/courses/${slug}`}
              className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Course</span>
            </Link>
            
            <div className="text-sm text-navy-400">
              Lesson {currentIndex + 1} of {lessons.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={lesson.metadata.video_url} title={lesson.title} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-navy-400">
                {lesson.metadata?.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.metadata.duration_minutes} minutes
                  </span>
                )}
              </div>
            </div>

            {/* Mark Complete Button */}
            <div className="mb-8">
              <LessonCompleteButton lessonSlug={lessonSlug} courseSlug={slug} />
            </div>

            {/* Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="text-sm">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors group"
                >
                  <div>
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="text-sm">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="card p-4 sticky top-32">
              <h3 className="font-semibold text-white mb-4">Course Content</h3>
              <nav className="space-y-1">
                {lessons.map((l: Lesson, index: number) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-navy-400 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-800 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm line-clamp-2">
                        {l.metadata?.title || l.title}
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}