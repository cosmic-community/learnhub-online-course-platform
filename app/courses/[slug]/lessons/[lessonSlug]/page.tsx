// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonCompletionTracker from '@/components/LessonCompletionTracker'

export async function generateStaticParams() {
  const courses = await getCourses()
  const params: { slug: string; lessonSlug: string }[] = []

  for (const course of courses) {
    const lessons = course.metadata?.lessons || []
    for (const lesson of lessons) {
      params.push({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })
    }
  }

  return params
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
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

  const currentIndex = sortedLessons.findIndex((l) => l.slug === lessonSlug)
  const lesson = sortedLessons[currentIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const { metadata } = lesson

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-lg border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <nav className="flex items-center gap-2 text-sm text-navy-400">
              <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {course.title}
              </Link>
            </nav>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-navy-400">
                Lesson {currentIndex + 1} of {sortedLessons.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wide mb-4">
                Course Content
              </h3>
              <nav className="space-y-1">
                {sortedLessons.map((l, index) => (
                  <Link
                    key={l.id}
                    href={`/courses/${course.slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500 text-white'
                        : 'bg-navy-700 text-navy-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="truncate">{l.metadata?.title || l.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-white">
                  {metadata?.title || lesson.title}
                </h1>
                <LessonCompletionTracker lessonSlug={lessonSlug} courseSlug={slug} />
              </div>
              
              {metadata?.description && (
                <p className="text-navy-300 text-lg">
                  {metadata.description}
                </p>
              )}

              {metadata?.duration_minutes && (
                <div className="flex items-center gap-2 mt-4 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{metadata.duration_minutes} minutes</span>
                </div>
              )}
            </div>

            {/* Video */}
            {metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={metadata.video_url} title={metadata?.title || lesson.title} />
              </div>
            )}

            {/* Main Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <div className="prose max-w-none">
                  <MarkdownContent content={metadata.content} />
                </div>
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="card p-8 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>💻</span> Code Example
                </h2>
                <CodeBlock code={metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="text-sm">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group text-right"
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
                  href={`/courses/${course.slug}`}
                  className="btn-primary"
                >
                  Complete Course 🎉
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}