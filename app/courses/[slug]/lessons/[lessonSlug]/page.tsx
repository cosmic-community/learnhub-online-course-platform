// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonComplete from '@/components/LessonComplete'
import ReadingTime from '@/components/ReadingTime'
import { marked } from 'marked'
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

  const lessons = (course.metadata?.lessons as Lesson[]) || []
  const currentLessonIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const lesson = lessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  const contentHtml = lesson.metadata?.content
    ? await marked(lesson.metadata.content)
    : ''

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
            <Link
              href={`/courses/${slug}`}
              className="text-navy-400 hover:text-white transition-colors truncate max-w-[200px]"
            >
              {course.metadata?.title || course.title}
            </Link>
            <span className="text-navy-600">/</span>
            <span className="text-white truncate max-w-[200px]">
              {lesson.metadata?.title || lesson.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <aside className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                Course Content
              </h3>
              <nav className="space-y-2">
                {lessons.map((l, index) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="truncate text-sm">{l.metadata?.title || l.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="card p-8">
              {/* Lesson Header */}
              <header className="mb-8">
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full font-medium">
                    Lesson {currentLessonIndex + 1} of {lessons.length}
                  </span>
                  {lesson.metadata?.duration_minutes && (
                    <span className="text-navy-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {lesson.metadata.duration_minutes} min video
                    </span>
                  )}
                  {lesson.metadata?.content && (
                    <ReadingTime content={lesson.metadata.content} />
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {lesson.metadata?.title || lesson.title}
                </h1>
                {lesson.metadata?.description && (
                  <p className="text-lg text-navy-300">{lesson.metadata.description}</p>
                )}
              </header>

              {/* Video Placeholder */}
              {lesson.metadata?.video_url && (
                <div className="mb-8">
                  <div className="aspect-video bg-navy-800 rounded-xl flex items-center justify-center border border-navy-700">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-primary-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-navy-400 text-sm">Video lesson available</p>
                      <a
                        href={lesson.metadata.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 text-sm underline mt-1 inline-block"
                      >
                        Watch on external player →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              {contentHtml && (
                <div className="prose mb-8" dangerouslySetInnerHTML={{ __html: contentHtml }} />
              )}

              {/* Code Example */}
              {lesson.metadata?.code_example && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code Example
                  </h3>
                  <CodeBlock code={lesson.metadata.code_example} />
                </div>
              )}

              {/* Lesson Complete Widget */}
              <LessonComplete
                courseSlug={slug}
                lessonTitle={lesson.metadata?.title || lesson.title}
                nextLessonSlug={nextLesson?.slug}
                nextLessonTitle={nextLesson?.metadata?.title || nextLesson?.title}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-navy-700">
                {prevLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                    className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <div className="text-left">
                      <span className="text-xs text-navy-500 block">Previous</span>
                      <span className="text-sm">{prevLesson.metadata?.title || prevLesson.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                    className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors text-right"
                  >
                    <div>
                      <span className="text-xs text-navy-500 block">Next</span>
                      <span className="text-sm">{nextLesson.metadata?.title || nextLesson.title}</span>
                    </div>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${slug}`}
                    className="btn-primary"
                  >
                    Complete Course →
                  </Link>
                )}
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}