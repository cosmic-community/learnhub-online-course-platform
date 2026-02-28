// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import ProgressTracker from '@/components/ProgressTracker'
import LessonProgress from '@/components/LessonProgress'

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
  const lessonSlugs = lessons.map(l => l.slug)

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-16 z-30 bg-navy-950/90 backdrop-blur-lg border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link 
              href={`/courses/${course.slug}`}
              className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">{course.metadata?.title || course.title}</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                  title="Previous lesson"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
              <span className="text-sm text-navy-500">
                {currentIndex + 1} / {lessons.length}
              </span>
              {nextLesson && (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                  title="Next lesson"
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="card p-8">
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-navy-400 mb-3">
                  <span>Lesson {currentIndex + 1}</span>
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
                  <p className="text-lg text-navy-300">
                    {lesson.metadata.description}
                  </p>
                )}
              </div>

              {/* Video Player Placeholder */}
              {lesson.metadata?.video_url && (
                <div className="aspect-video bg-navy-800 rounded-xl mb-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-navy-400">Video: {lesson.metadata.video_url}</p>
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              {lesson.metadata?.content && (
                <div className="prose max-w-none mb-8">
                  <MarkdownContent content={lesson.metadata.content} />
                </div>
              )}

              {/* Code Example */}
              {lesson.metadata?.code_example && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                  <CodeBlock code={lesson.metadata.code_example} language="javascript" />
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-navy-800">
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                    className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-navy-500">Previous</div>
                      <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                    className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors text-right"
                  >
                    <div>
                      <div className="text-xs text-navy-500">Next</div>
                      <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${course.slug}`}
                    className="btn-primary"
                  >
                    Complete Course 🎉
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker 
              courseSlug={course.slug}
              lessonSlugs={lessonSlugs}
              currentLessonSlug={lessonSlug}
            />

            {/* Lesson List */}
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-white mb-4 px-3">Course Lessons</h3>
              <LessonProgress 
                courseSlug={course.slug}
                lessons={lessons}
                currentLessonSlug={lessonSlug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}