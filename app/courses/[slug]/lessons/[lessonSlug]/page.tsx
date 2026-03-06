// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonProgress from '@/components/LessonProgress'
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

  const { metadata } = lesson
  
  // Get sorted lessons from course
  const courseLessons = (course.metadata?.lessons || []).sort((a: Lesson, b: Lesson) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  // Find current lesson index and next/previous
  const currentIndex = courseLessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
              <span className="text-navy-400 text-sm">
                Lesson {currentIndex + 1} of {courseLessons.length}
              </span>
            </div>
            
            {/* Lesson Progress Button */}
            <LessonProgress lessonSlug={lessonSlug} courseSlug={slug} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-4">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <nav className="space-y-1">
                {courseLessons.map((l: Lesson, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span className="truncate">{l.metadata?.title || l.title}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <article>
              {/* Lesson Header */}
              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {metadata?.title || lesson.title}
                </h1>
                {metadata?.description && (
                  <p className="text-lg text-navy-300">{metadata.description}</p>
                )}
                {metadata?.duration_minutes && (
                  <div className="mt-4 flex items-center gap-2 text-navy-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{metadata.duration_minutes} minutes</span>
                  </div>
                )}
              </header>

              {/* Video (if available) */}
              {metadata?.video_url && (
                <div className="mb-8">
                  <div className="aspect-video bg-navy-800 rounded-xl overflow-hidden">
                    <iframe
                      src={metadata.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              {metadata?.content && (
                <div className="card p-8 mb-8">
                  <MarkdownContent content={metadata.content} />
                </div>
              )}

              {/* Code Example */}
              {metadata?.code_example && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
                  <CodeBlock code={metadata.code_example} />
                </div>
              )}

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}