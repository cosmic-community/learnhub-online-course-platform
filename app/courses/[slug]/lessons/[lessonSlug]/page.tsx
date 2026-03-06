// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface PageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  const course = await getCourseBySlug(slug)

  if (!lesson || !course) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in the ${course.title} course.`,
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    notFound()
  }

  const { metadata } = lesson
  const courseLessons = course.metadata?.lessons || []
  
  // Sort lessons by order
  const sortedLessons = [...courseLessons].sort((a: Lesson, b: Lesson) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <aside className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Course Lessons</h3>
              <nav className="space-y-2">
                {sortedLessons.map((l: Lesson, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${course.slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'hover:bg-navy-800 text-navy-300 hover:text-white'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500 text-white'
                        : 'bg-navy-700 text-navy-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm line-clamp-1">{l.metadata?.title || l.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-4">
                <span>Lesson {currentIndex + 1} of {sortedLessons.length}</span>
                {metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {metadata.duration_minutes} min
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{metadata?.title || lesson.title}</h1>
              {metadata?.description && (
                <p className="text-xl text-navy-300">{metadata.description}</p>
              )}
            </div>

            {/* Video */}
            {metadata?.video_url && (
              <div className="card p-6 mb-8">
                <div className="aspect-video bg-navy-800 rounded-lg overflow-hidden">
                  <iframe
                    src={metadata.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={metadata.title || lesson.title}
                  />
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownRenderer content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="card p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code Example
                </h3>
                <CodeBlock code={metadata.code_example} language="typescript" />
              </div>
            )}

            {/* Complete Lesson Button */}
            <div className="card p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Finished this lesson?</h3>
                <p className="text-navy-400 text-sm">Mark it complete to track your progress and build your streak! 🔥</p>
              </div>
              <LessonCompleteButton 
                lessonId={lesson.id} 
                lessonSlug={lessonSlug}
                courseSlug={slug}
              />
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
                  Previous
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
                  Complete Course
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