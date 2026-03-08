// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '@/components/CodeBlock'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface PageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug)
  ])

  if (!course || !lesson) {
    return {
      title: 'Lesson Not Found - LearnHub'
    }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in our ${course.title} course.`
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug)
  ])

  if (!course || !lesson) {
    notFound()
  }

  const { metadata } = lesson
  const courseMetadata = course.metadata
  const lessons = (courseMetadata?.lessons as Lesson[]) || []
  
  // Find current lesson index and get next lesson
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 
    ? lessons[currentIndex + 1] 
    : null
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-navy-400">
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                Courses
              </Link>
              <span>/</span>
              <Link href={`/courses/${slug}`} className="hover:text-primary-400 transition-colors">
                {courseMetadata?.title || course.title}
              </Link>
              <span>/</span>
              <span className="text-navy-200">{metadata?.title || lesson.title}</span>
            </nav>

            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
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
            </div>

            {/* Video Player Placeholder */}
            {metadata?.video_url && (
              <div className="mb-8 aspect-video bg-navy-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎬</div>
                  <p className="text-navy-300">Video Player</p>
                  <p className="text-sm text-navy-500">{metadata.video_url}</p>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <div className="prose max-w-none">
                  <ReactMarkdown>{metadata.content}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Lesson Complete Button - NEW! */}
            <div className="mb-8">
              <LessonCompleteButton
                lessonSlug={lessonSlug}
                lessonTitle={metadata?.title || lesson.title}
                courseSlug={slug}
                courseTitle={courseMetadata?.title || course.title}
                durationMinutes={metadata?.duration_minutes || 10}
                nextLessonSlug={nextLesson?.slug}
                nextLessonTitle={nextLesson?.metadata?.title || nextLesson?.title}
              />
            </div>

            {/* Lesson Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="text-xs text-navy-500">Previous</div>
                    <div>{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors text-right"
                >
                  <div>
                    <div className="text-xs text-navy-500">Next</div>
                    <div>{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <span>Back to Course</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <aside className="lg:w-80">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">Course Lessons</h2>
              <div className="space-y-2">
                {lessons.map((l: Lesson, index: number) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-navy-300 hover:bg-navy-800/50 hover:text-white'
                      }`}
                    >
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium ${
                        isActive ? 'bg-primary-500 text-white' : 'bg-navy-700 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm">{l.metadata?.title || l.title}</div>
                        {l.metadata?.duration_minutes && (
                          <div className="text-xs text-navy-500">{l.metadata.duration_minutes} min</div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}