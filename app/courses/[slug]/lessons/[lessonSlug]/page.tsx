// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonList from '@/components/LessonList'
import LessonCompletionButton from '@/components/LessonCompletionButton'

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

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/courses/${slug}`}
              className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to Course</span>
            </Link>
            <div className="h-4 w-px bg-navy-700" />
            <span className="text-navy-300 truncate">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video */}
            {lesson.metadata?.video_url && (
              <VideoEmbed url={lesson.metadata.video_url} title={lesson.title} />
            )}

            {/* Lesson Header */}
            <div>
              <div className="flex items-center gap-3 text-navy-400 text-sm mb-2">
                <span>Lesson {currentIndex + 1} of {lessons.length}</span>
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

            {/* Completion Button */}
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-navy-900/50 rounded-xl border border-navy-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <p className="text-white font-medium">Track your progress</p>
                  <p className="text-navy-400 text-sm">Mark this lesson as complete when you&apos;re done</p>
                </div>
              </div>
              <LessonCompletionButton 
                courseSlug={slug}
                lessonSlug={lessonSlug}
                totalLessons={lessons.length}
              />
            </div>

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>💻</span>
                  Code Example
                </h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-3 text-navy-400 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="flex items-center gap-3 text-navy-400 hover:text-white transition-colors group text-right"
                >
                  <div>
                    <div className="text-xs text-navy-500">Next</div>
                    <div>{nextLesson.metadata?.title || nextLesson.title}</div>
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
                  Complete Course 🎉
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Course Content</h3>
              <LessonList 
                lessons={lessons} 
                courseSlug={slug}
                currentLessonSlug={lessonSlug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}