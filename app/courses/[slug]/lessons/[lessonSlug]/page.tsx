// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '@/components/CodeBlock'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  const course = await getCourseBySlug(slug)
  
  if (!lesson || !course) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title ?? lesson.title} - ${course.metadata?.title ?? course.title} - LearnHub`,
    description: lesson.metadata?.description ?? `Learn ${lesson.title} in this comprehensive lesson.`,
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

  const lessons = course.metadata?.lessons ?? []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const lessonDuration = lesson.metadata?.duration_minutes ?? 0

  return (
    <div className="min-h-screen">
      {/* Lesson Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-navy-400 mb-4">
            <Link href="/courses" className="hover:text-primary-400 transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="hover:text-primary-400 transition-colors">
              {course.metadata?.title ?? course.title}
            </Link>
            <span>/</span>
            <span className="text-navy-300">Lesson {currentIndex + 1}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {lesson.metadata?.title ?? lesson.title}
              </h1>
              {lesson.metadata?.duration_minutes && (
                <p className="text-navy-400 mt-2 flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{lesson.metadata.duration_minutes} minutes</span>
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-navy-400">
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
            <div className="card p-4 sticky top-8">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>📚</span> Course Lessons
              </h3>
              <div className="space-y-1">
                {sortedLessons.map((l: Lesson, index: number) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${course.slug}/lessons/${l.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive 
                          ? 'bg-primary-500/20 text-primary-400' 
                          : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span className="mr-2">{index + 1}.</span>
                      {l.metadata?.title ?? l.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Video Player Placeholder */}
            {lesson.metadata?.video_url && (
              <div className="card mb-8 overflow-hidden">
                <div className="aspect-video bg-navy-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-navy-400">Video Player</p>
                    <a 
                      href={lesson.metadata.video_url}
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
            <div className="card p-8">
              {lesson.metadata?.description && (
                <p className="text-lg text-navy-300 mb-8 pb-8 border-b border-navy-700">
                  {lesson.metadata.description}
                </p>
              )}

              {/* Markdown Content */}
              {lesson.metadata?.content && (
                <div className="prose max-w-none mb-8">
                  <ReactMarkdown>{lesson.metadata.content}</ReactMarkdown>
                </div>
              )}

              {/* Code Example */}
              {lesson.metadata?.code_example && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>💻</span> Code Example
                  </h3>
                  <CodeBlock code={lesson.metadata.code_example} language="javascript" />
                </div>
              )}

              {/* Lesson Complete Button */}
              <LessonCompleteButton
                lessonSlug={lessonSlug}
                courseSlug={slug}
                lessonDuration={lessonDuration}
                nextLessonSlug={nextLesson?.slug ?? null}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-navy-700">
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <span>←</span>
                    <span className="hidden sm:inline">Previous Lesson</span>
                    <span className="sm:hidden">Prev</span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                    className="btn-primary flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Next Lesson</span>
                    <span className="sm:hidden">Next</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}