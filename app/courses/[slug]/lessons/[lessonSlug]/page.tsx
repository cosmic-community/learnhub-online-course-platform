// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import LearningProgress from '@/components/LearningProgress'

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
  const currentLesson = lessons.find(l => l.slug === lessonSlug)
  
  if (!currentLesson) {
    notFound()
  }

  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-16 z-40 bg-navy-900/95 backdrop-blur-sm border-b border-navy-800">
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
                <span className="hidden sm:inline">Back to Course</span>
              </Link>
              <span className="text-navy-600">|</span>
              <span className="text-sm text-navy-300 truncate max-w-[200px] sm:max-w-none">
                {course.title}
              </span>
            </div>
            <LearningProgress courseSlug={slug} totalLessons={lessons.length} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="hidden lg:block">
            <div className="sticky top-40 card p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Course Lessons</h3>
              <nav className="space-y-1">
                {sortedLessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${slug}/lessons/${lesson.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      lesson.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-navy-400 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    <span className="text-navy-500 mr-2">{index + 1}.</span>
                    {lesson.metadata?.title || lesson.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            {currentLesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={currentLesson.metadata.video_url} title={currentLesson.title} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-2">
                <span>Lesson {currentIndex + 1} of {sortedLessons.length}</span>
                {currentLesson.metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{currentLesson.metadata.duration_minutes} min</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentLesson.metadata?.title || currentLesson.title}
              </h1>
              {currentLesson.metadata?.description && (
                <p className="text-navy-300 text-lg">
                  {currentLesson.metadata.description}
                </p>
              )}
            </div>

            {/* Lesson Content */}
            {currentLesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={currentLesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {currentLesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={currentLesson.metadata.code_example} />
              </div>
            )}

            {/* Mark Complete Button */}
            <div className="flex justify-center mb-8">
              <LessonCompleteButton courseSlug={slug} lessonSlug={lessonSlug} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="text-sm">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary"
                >
                  Finish Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}