// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonComplete from '@/components/LessonComplete'
import LessonTracker from '@/components/LessonTracker'

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
  const currentLesson = lessons.find((l) => l.slug === lessonSlug)
  
  if (!currentLesson) {
    notFound()
  }

  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Track this lesson view */}
      <LessonTracker 
        courseSlug={slug}
        lessonSlug={lessonSlug}
        courseTitle={course.metadata?.title || course.title}
        lessonTitle={currentLesson.metadata?.title || currentLesson.title}
      />
      
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
              Back to Course
            </Link>
            <span className="text-navy-600">|</span>
            <span className="text-navy-300">{course.metadata?.title || course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-8">
              <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider mb-4">
                Course Lessons
              </h3>
              <nav className="space-y-1">
                {lessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${slug}/lessons/${lesson.slug}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      lesson.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      lesson.slug === lessonSlug
                        ? 'bg-primary-500 text-white'
                        : 'bg-navy-700 text-navy-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm truncate">
                      {lesson.metadata?.title || lesson.title}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="card p-8">
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-navy-400 mb-2">
                  <span>Lesson {currentIndex + 1} of {lessons.length}</span>
                  {currentLesson.metadata?.duration_minutes && (
                    <>
                      <span>•</span>
                      <span>{currentLesson.metadata.duration_minutes} min</span>
                    </>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {currentLesson.metadata?.title || currentLesson.title}
                </h1>
                {currentLesson.metadata?.description && (
                  <p className="mt-2 text-navy-300">{currentLesson.metadata.description}</p>
                )}
              </div>

              {/* Video Placeholder */}
              {currentLesson.metadata?.video_url && (
                <div className="aspect-video bg-navy-800 rounded-xl mb-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-navy-400 text-sm">Video content available</p>
                    <a 
                      href={currentLesson.metadata.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm underline"
                    >
                      Watch on external platform
                    </a>
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              {currentLesson.metadata?.content && (
                <div className="prose max-w-none mb-8">
                  <MarkdownContent content={currentLesson.metadata.content} />
                </div>
              )}

              {/* Code Example */}
              {currentLesson.metadata?.code_example && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Code Example</h3>
                  <CodeBlock 
                    code={currentLesson.metadata.code_example}
                    language="javascript"
                  />
                </div>
              )}

              {/* Mark Complete Button */}
              <div className="mb-8 pt-6 border-t border-navy-700">
                <LessonComplete
                  lessonSlug={lessonSlug}
                  courseSlug={slug}
                  lessonTitle={currentLesson.metadata?.title || currentLesson.title}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-navy-700">
                {prevLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                    className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors group"
                  >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">
                      {prevLesson.metadata?.title || prevLesson.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                
                {nextLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors group"
                  >
                    <span className="text-sm">
                      {nextLesson.metadata?.title || nextLesson.title}
                    </span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${slug}`}
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <span className="text-sm">Complete Course</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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