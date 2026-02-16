// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LearningProgress from '@/components/LearningProgress'
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

  const lessons = course.metadata?.lessons || []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentLessonIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const lesson = sortedLessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < sortedLessons.length - 1 ? sortedLessons[currentLessonIndex + 1] : null

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
            <Link href={`/courses/${slug}`} className="text-navy-400 hover:text-white transition-colors line-clamp-1">
              {course.title}
            </Link>
            <span className="text-navy-600">/</span>
            <span className="text-navy-300 line-clamp-1">{lesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Learning Progress Tracker */}
            <LearningProgress
              courseSlug={slug}
              lessonSlug={lessonSlug}
              totalLessons={sortedLessons.length}
              lessonIndex={currentLessonIndex}
            />

            {/* Video */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={lesson.metadata.video_url} title={lesson.title} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-primary-400 font-medium">
                  Lesson {currentLessonIndex + 1} of {sortedLessons.length}
                </span>
                {lesson.metadata?.duration_minutes && (
                  <>
                    <span className="text-navy-600">•</span>
                    <span className="flex items-center gap-1 text-sm text-navy-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {lesson.metadata.duration_minutes} min
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-lg text-navy-300">
                  {lesson.metadata.description}
                </p>
              )}
            </div>

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Code Example
                </h2>
                <CodeBlock code={lesson.metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="line-clamp-1">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors group text-right"
                >
                  <div>
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="line-clamp-1">{nextLesson.metadata?.title || nextLesson.title}</div>
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
                  🎉 Finish Course
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
                <nav className="space-y-1">
                  {sortedLessons.map((l, index) => {
                    const isActive = l.slug === lessonSlug
                    return (
                      <Link
                        key={l.id}
                        href={`/courses/${slug}/lessons/${l.slug}`}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                          ${isActive 
                            ? 'bg-primary-500/20 text-primary-400' 
                            : 'text-navy-400 hover:bg-navy-800 hover:text-white'
                          }
                        `}
                      >
                        <span className={`
                          flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                          ${isActive 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-navy-800 text-navy-400'
                          }
                        `}>
                          {index + 1}
                        </span>
                        <span className="line-clamp-2">{l.metadata?.title || l.title}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}