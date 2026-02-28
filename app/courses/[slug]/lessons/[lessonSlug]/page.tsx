// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonComplete from '@/components/LessonComplete'
import ReactMarkdown from 'react-markdown'
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
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.metadata?.title || lesson.title} in this lesson.`,
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
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
          <Link href="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">
            {course.metadata?.title || course.title}
          </Link>
          <span>/</span>
          <span className="text-navy-200">{lesson.metadata?.title || lesson.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg mb-6">
                  {lesson.metadata.description}
                </p>
              )}

              {/* Duration */}
              {lesson.metadata?.duration_minutes && (
                <div className="flex items-center gap-2 text-navy-400 text-sm mb-8">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{lesson.metadata.duration_minutes} minutes</span>
                </div>
              )}

              {/* Video */}
              {lesson.metadata?.video_url && (
                <div className="aspect-video bg-navy-800 rounded-xl mb-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <p className="text-navy-400">Video Player</p>
                    <a 
                      href={lesson.metadata.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              )}

              {/* Content */}
              {lesson.metadata?.content && (
                <div className="prose max-w-none mb-8">
                  <ReactMarkdown>{lesson.metadata.content}</ReactMarkdown>
                </div>
              )}

              {/* Code Example */}
              {lesson.metadata?.code_example && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Code Example</h3>
                  <CodeBlock code={lesson.metadata.code_example} />
                </div>
              )}

              {/* Lesson Complete Button */}
              <LessonComplete 
                courseSlug={slug}
                nextLessonSlug={nextLesson?.slug}
                nextLessonTitle={nextLesson?.metadata?.title || nextLesson?.title}
              />

              {/* Navigation */}
              <div className="mt-8 pt-8 border-t border-navy-700 flex items-center justify-between">
                {prevLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                    className="group flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-navy-500">Previous</div>
                      <div className="text-sm">{prevLesson.metadata?.title || prevLesson.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                    className="group flex items-center gap-2 text-navy-400 hover:text-white transition-colors text-right"
                  >
                    <div>
                      <div className="text-xs text-navy-500">Next</div>
                      <div className="text-sm">{nextLesson.metadata?.title || nextLesson.title}</div>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Lessons</h3>
              <nav className="space-y-1">
                {lessons.map((l: Lesson, index: number) => {
                  const isCurrentLesson = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        isCurrentLesson
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-navy-400 hover:text-white hover:bg-navy-800'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isCurrentLesson
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm truncate">{l.metadata?.title || l.title}</span>
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