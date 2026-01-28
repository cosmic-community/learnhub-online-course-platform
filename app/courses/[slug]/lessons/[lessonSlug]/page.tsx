// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import LessonList from '@/components/LessonList'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonCompletionTracker from '@/components/LessonCompletionTracker'

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

  const courseLessons = course.metadata?.lessons || []
  const currentIndex = courseLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  const sortedLessons = [...courseLessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-navy-900/30 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
              Courses
            </Link>
            <span className="text-navy-600">/</span>
            <Link 
              href={`/courses/${course.slug}`} 
              className="text-navy-400 hover:text-white transition-colors truncate max-w-[200px]"
            >
              {course.title}
            </Link>
            <span className="text-navy-600">/</span>
            <span className="text-white truncate max-w-[200px]">{lesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Course Content</h2>
              <LessonList 
                lessons={sortedLessons} 
                courseSlug={course.slug}
                currentLessonSlug={lessonSlug}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Video */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={lesson.metadata.video_url} title={lesson.title} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {lesson.metadata?.duration_minutes && (
                  <span className="flex items-center gap-1 text-sm text-navy-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.metadata.duration_minutes} min
                  </span>
                )}
                <span className="text-sm text-navy-400">
                  Lesson {currentIndex + 1} of {courseLessons.length}
                </span>
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
              <div className="mb-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Resources */}
            {lesson.metadata?.resources && lesson.metadata.resources.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Resources</h2>
                <div className="space-y-2">
                  {lesson.metadata.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-navy-900/50 border border-navy-800 rounded-lg hover:border-primary-500/50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-navy-200 hover:text-white">Download Resource {index + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Tracker */}
            <LessonCompletionTracker 
              lessonSlug={lessonSlug}
              courseSlug={slug}
              totalLessons={courseLessons.length}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="text-sm">{prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="text-sm">{nextLesson.title}</div>
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
                  Complete Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}