// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonComplete from '@/components/LessonComplete'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} | LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.metadata?.title || lesson.title} in our ${course.metadata?.title || course.title} course.`,
  }
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

  const lessons = (course.metadata?.lessons as Lesson[]) || []
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  const lessonTitle = lesson.metadata?.title || lesson.title
  const lessonContent = lesson.metadata?.content || ''
  const codeExample = lesson.metadata?.code_example || ''
  const durationMinutes = lesson.metadata?.duration_minutes

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href={`/courses/${slug}`}
              className="text-navy-400 hover:text-white transition-colors"
            >
              ← Back to Course
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-primary-400 text-sm mb-1">
                {course.metadata?.title || course.title}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {lessonTitle}
              </h1>
            </div>
            {durationMinutes && (
              <div className="flex items-center gap-2 text-navy-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{durationMinutes} min</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video placeholder */}
            {lesson.metadata?.video_url && (
              <div className="card aspect-video flex items-center justify-center bg-navy-800/50">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-navy-400">Video Player</p>
                  <a
                    href={lesson.metadata.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Watch on External Player →
                  </a>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lessonContent && (
              <div className="card p-8">
                <MarkdownContent content={lessonContent} />
              </div>
            )}

            {/* Code Example */}
            {codeExample && (
              <div className="card p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Code Example
                </h2>
                <CodeBlock code={codeExample} language="javascript" />
              </div>
            )}

            {/* Completion Section */}
            <LessonComplete 
              courseSlug={slug}
              lessonSlug={lessonSlug}
              nextLessonSlug={nextLesson?.slug}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary"
                >
                  ← Previous Lesson
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary"
                >
                  Next Lesson →
                </Link>
              ) : (
                <Link href={`/courses/${slug}`} className="btn-primary">
                  Complete Course 🎉
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {lessons.map((l, index) => {
                  const isCurrentLesson = l.slug === lessonSlug
                  const lTitle = l.metadata?.title || l.title
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`block p-3 rounded-lg transition-colors ${
                        isCurrentLesson
                          ? 'bg-primary-500/20 border border-primary-500/50 text-primary-400'
                          : 'hover:bg-navy-800 text-navy-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            isCurrentLesson
                              ? 'bg-primary-500 text-white'
                              : 'bg-navy-700 text-navy-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-sm line-clamp-1">{lTitle}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}