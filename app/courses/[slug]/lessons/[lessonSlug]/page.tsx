// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LearningProgressBar from '@/components/LearningProgressBar'
import LessonCompletionButton from '@/components/LessonCompletionButton'
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

  // Calculate total duration for course
  const totalDuration = sortedLessons.reduce((acc: number, l: Lesson) => {
    return acc + (l.metadata?.duration_minutes || 0)
  }, 0)

  return (
    <>
      <LearningProgressBar lessonSlug={lessonSlug} courseSlug={slug} />
      
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-navy-400">
              <li>
                <Link href="/courses" className="hover:text-primary-400 transition-colors">
                  Courses
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/courses/${slug}`} className="hover:text-primary-400 transition-colors">
                  {course.metadata?.title || course.title}
                </Link>
              </li>
              <li>/</li>
              <li className="text-white">{metadata?.title || lesson.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Lesson List */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="card p-4 sticky top-24">
                <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
                <div className="text-sm text-navy-400 mb-4">
                  {sortedLessons.length} lessons • {totalDuration} min total
                </div>
                <ul className="space-y-2">
                  {sortedLessons.map((l: Lesson, index: number) => (
                    <li key={l.id}>
                      <Link
                        href={`/courses/${slug}/lessons/${l.slug}`}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          l.slug === lessonSlug
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'hover:bg-navy-800 text-navy-300'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          l.slug === lessonSlug
                            ? 'bg-primary-500 text-white'
                            : 'bg-navy-700 text-navy-400'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="flex-1 truncate text-sm">
                          {l.metadata?.title || l.title}
                        </span>
                        {l.metadata?.duration_minutes && (
                          <span className="text-xs text-navy-500">
                            {l.metadata.duration_minutes}m
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3 order-1 lg:order-2">
              <div className="card p-8">
                {/* Lesson Header */}
                <header className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="badge badge-beginner">
                      Lesson {currentIndex + 1} of {sortedLessons.length}
                    </span>
                    {metadata?.duration_minutes && (
                      <span className="text-navy-400 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {metadata.duration_minutes} min
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {metadata?.title || lesson.title}
                  </h1>
                  {metadata?.description && (
                    <p className="text-navy-300 text-lg">{metadata.description}</p>
                  )}
                </header>

                {/* Video Section */}
                {metadata?.video_url && (
                  <div className="mb-8">
                    <div className="aspect-video bg-navy-800 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎬</div>
                        <p className="text-navy-400">Video Player</p>
                        <a 
                          href={metadata.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:underline text-sm"
                        >
                          Watch on external player →
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesson Content */}
                {metadata?.content && (
                  <div className="prose max-w-none mb-8">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: metadata.content
                          .replace(/^# .+$/gm, match => `<h1>${match.substring(2)}</h1>`)
                          .replace(/^## .+$/gm, match => `<h2>${match.substring(3)}</h2>`)
                          .replace(/^### .+$/gm, match => `<h3>${match.substring(4)}</h3>`)
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em>$1</em>')
                          .replace(/^- .+$/gm, match => `<li>${match.substring(2)}</li>`)
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/^/g, '<p>')
                          .replace(/$/g, '</p>')
                      }} 
                    />
                  </div>
                )}

                {/* Code Example */}
                {metadata?.code_example && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                    <CodeBlock code={metadata.code_example} language="javascript" />
                  </div>
                )}

                {/* Lesson Completion & Navigation */}
                <LessonCompletionButton 
                  lessonSlug={lessonSlug}
                  courseSlug={slug}
                  nextLessonSlug={nextLesson?.slug}
                />

                {/* Prev/Next Navigation */}
                <div className="flex justify-between mt-8 pt-8 border-t border-navy-800">
                  {prevLesson ? (
                    <Link
                      href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                      className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors"
                    >
                      <span>←</span>
                      <div>
                        <div className="text-xs uppercase tracking-wide">Previous</div>
                        <div className="text-white">{prevLesson.metadata?.title || prevLesson.title}</div>
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
                        <div className="text-xs uppercase tracking-wide">Next</div>
                        <div className="text-white">{nextLesson.metadata?.title || nextLesson.title}</div>
                      </div>
                      <span>→</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${slug}`}
                      className="flex items-center gap-2 text-navy-400 hover:text-primary-400 transition-colors"
                    >
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wide">Complete!</div>
                        <div className="text-white">Back to Course</div>
                      </div>
                      <span>🎉</span>
                    </Link>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}