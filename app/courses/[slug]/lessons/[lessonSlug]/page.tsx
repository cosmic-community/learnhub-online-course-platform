// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import MarkCompleteButton from '@/components/MarkCompleteButton'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found' }
  }

  const lessons = course.metadata?.lessons || []
  const lesson = lessons.find((l: Lesson) => l.slug === lessonSlug)

  if (!lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || 'Learn with LearnHub',
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = (course.metadata?.lessons || []) as Lesson[]
  const currentLessonIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const lesson = lessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  const metadata = lesson.metadata
  const totalMinutes = metadata?.duration_minutes || 0

  return (
    <div className="min-h-screen">
      {/* Lesson Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-4">
            <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
            <span>/</span>
            <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">
              {course.metadata?.title || course.title}
            </Link>
            <span>/</span>
            <span className="text-white">{metadata?.title || lesson.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-navy-300">{metadata.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {totalMinutes > 0 && (
                <div className="flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{totalMinutes} min</span>
                </div>
              )}
              <span className="text-navy-600">•</span>
              <span className="text-navy-400">
                Lesson {currentLessonIndex + 1} of {lessons.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-navy-400">Course Progress</span>
              <span className="text-sm text-primary-400 font-medium">
                {Math.round(((currentLessonIndex + 1) / lessons.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${((currentLessonIndex + 1) / lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video placeholder */}
            {metadata?.video_url && (
              <div className="aspect-video bg-navy-900 rounded-xl border border-navy-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-navy-400">Video Player</p>
                  <a 
                    href={metadata.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-flex items-center gap-1"
                  >
                    Watch on YouTube
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-8">
                <MarkdownContent content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Code Example
                </h3>
                <CodeBlock code={metadata.code_example} language="typescript" />
              </div>
            )}

            {/* Mark Complete Button */}
            <div className="flex justify-center pt-4">
              <MarkCompleteButton
                lessonTitle={metadata?.title || lesson.title}
                lessonSlug={lessonSlug}
                courseSlug={slug}
                nextLessonSlug={nextLesson?.slug}
                completedCount={currentLessonIndex}
                totalLessons={lessons.length}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-right">
                    <div className="text-sm text-navy-500">Previous</div>
                    <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
                >
                  <div>
                    <div className="text-sm text-navy-500">Next</div>
                    <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
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
                  Back to Course
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                {lessons.map((l: Lesson, index: number) => {
                  const isActive = l.slug === lessonSlug
                  const isPast = index < currentLessonIndex
                  
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                          : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isPast 
                          ? 'bg-green-500/20 text-green-400' 
                          : isActive 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-navy-700 text-navy-400'
                      }`}>
                        {isPast ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium">
                          {l.metadata?.title || l.title}
                        </div>
                        {l.metadata?.duration_minutes && (
                          <div className="text-xs text-navy-500">
                            {l.metadata.duration_minutes} min
                          </div>
                        )}
                      </div>
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