// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
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
  const currentLessonIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const lesson = lessons[currentLessonIndex] as Lesson | undefined

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 text-sm text-navy-400">
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors line-clamp-1">
              {course.metadata?.title || course.title}
            </Link>
            <span>/</span>
            <span className="text-white line-clamp-1">
              {lesson.metadata?.title || lesson.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Content</h3>
              <div className="space-y-2">
                {lessons.map((l: Lesson, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${course.slug}/lessons/${l.slug}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'hover:bg-navy-800 text-navy-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-2">
                          {l.metadata?.title || l.title}
                        </div>
                        {l.metadata?.duration_minutes && (
                          <div className="text-xs text-navy-500 mt-1">
                            {l.metadata.duration_minutes} min
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-primary-400 text-sm mb-2">
                <span>Lesson {currentLessonIndex + 1} of {lessons.length}</span>
                {lesson.metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{lesson.metadata.duration_minutes} minutes</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg">
                  {lesson.metadata.description}
                </p>
              )}
            </div>

            {/* Video Player Placeholder */}
            {lesson.metadata?.video_url && (
              <div className="card mb-8 overflow-hidden">
                <div className="aspect-video bg-navy-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎥</div>
                    <p className="text-navy-300 mb-4">Video Lesson</p>
                    <a
                      href={lesson.metadata.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Watch on External Player
                    </a>
                  </div>
                </div>
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
                <h2 className="text-xl font-semibold text-white mb-4">💻 Code Example</h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Mark Complete Button */}
            <div className="card p-6 mb-8">
              <LessonCompleteButton 
                lessonSlug={lessonSlug}
                courseSlug={slug}
                lessonTitle={lesson.metadata?.title || lesson.title}
              />
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-navy-400">Previous</div>
                    <div className="line-clamp-1">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  <div className="text-right">
                    <div className="text-xs text-primary-200">Next</div>
                    <div className="line-clamp-1">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  <div className="text-right">
                    <div className="text-xs text-primary-200">Completed!</div>
                    <div>Back to Course</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}