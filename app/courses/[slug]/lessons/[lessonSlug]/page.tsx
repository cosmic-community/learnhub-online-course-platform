// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import LessonTracker from '@/components/LessonTracker'

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

  const { metadata } = lesson
  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Track lesson view */}
      <LessonTracker />
      
      {/* Breadcrumb */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
              Courses
            </Link>
            <span className="text-navy-600">/</span>
            <Link 
              href={`/courses/${course.slug}`} 
              className="text-navy-400 hover:text-white transition-colors"
            >
              {course.metadata?.title || course.title}
            </Link>
            <span className="text-navy-600">/</span>
            <span className="text-white">{metadata?.title || lesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-8">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <div className="space-y-1">
                {lessons.map((l, index) => (
                  <Link
                    key={l.id}
                    href={`/courses/${course.slug}/lessons/${l.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-navy-400 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    <span className="text-navy-500 mr-2">{index + 1}.</span>
                    {l.metadata?.title || l.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm">
                  Lesson {currentIndex + 1} of {lessons.length}
                </span>
                {metadata?.duration_minutes && (
                  <span className="text-navy-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} min
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-navy-300 text-lg">{metadata.description}</p>
              )}
            </div>

            {/* Video (if available) */}
            {metadata?.video_url && (
              <div className="card mb-8 aspect-video">
                <iframe
                  src={metadata.video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                  title={metadata.title || lesson.title}
                />
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownRenderer content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Next Lesson
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Complete Course
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
  )
}