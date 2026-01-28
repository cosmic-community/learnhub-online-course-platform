// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonList from '@/components/LessonList'
import LessonProgressTracker from '@/components/LessonProgressTracker'

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
    getLessonBySlug(lessonSlug)
  ])

  if (!course || !lesson) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
  const lessonNumber = currentIndex + 1

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="bg-navy-900/50 border-b border-navy-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
              <span className="text-navy-400">
                Lesson {lessonNumber} of {sortedLessons.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
                  title="Previous Lesson"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
                  title="Next Lesson"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={lesson.metadata.video_url} title={lesson.title} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-navy-400 text-sm mb-2">
                <span>📖 Lesson {lessonNumber}</span>
                {lesson.metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{lesson.metadata.duration_minutes} min</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg">
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
                  <span>💻</span> Code Example
                </h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Progress Tracker - Awards XP when completing lesson */}
            <LessonProgressTracker
              courseSlug={slug}
              courseTitle={course.title}
              courseThumbnail={course.metadata?.thumbnail?.imgix_url}
              lessonSlug={lessonSlug}
              lessonTitle={lesson.metadata?.title || lesson.title}
              lessonNumber={lessonNumber}
              totalLessons={sortedLessons.length}
              nextLessonSlug={nextLesson?.slug}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-3 text-navy-300 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-3 text-navy-300 hover:text-white transition-colors text-right group"
                >
                  <div>
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary"
                >
                  Complete Course
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📚</span> Course Content
                </h3>
                <LessonList
                  lessons={sortedLessons}
                  courseSlug={slug}
                  currentLessonSlug={lessonSlug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}