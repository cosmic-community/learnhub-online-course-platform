// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ProgressTracker from '@/components/ProgressTracker'

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
  const courseLessons = course.metadata?.lessons || []
  
  // Get lesson slugs for progress tracking
  const lessonSlugs = courseLessons.map((l: { slug: string }) => l.slug)
  
  // Find current lesson index and get prev/next
  const currentIndex = courseLessons.findIndex((l: { slug: string }) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-navy-400">
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link href={`/courses/${slug}`} className="hover:text-white transition-colors">
              {course.metadata?.title || course.title}
            </Link>
            <span>/</span>
            <span className="text-white">{metadata?.title || lesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-4">
                <span>Lesson {currentIndex + 1} of {courseLessons.length}</span>
                {metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{metadata.duration_minutes} min</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-lg text-navy-300">{metadata.description}</p>
              )}
            </div>

            {/* Video Player Placeholder */}
            {metadata?.video_url && (
              <div className="mb-8">
                <div className="aspect-video bg-navy-800 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <p className="text-navy-400">Video Player</p>
                    <a 
                      href={metadata.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Watch on external player →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-6 sm:p-8 mb-8">
                <MarkdownRenderer content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                <CodeBlock code={metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
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
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Next Lesson
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href={`/courses/${slug}`} className="btn-primary flex items-center gap-2">
                  Complete Course
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress Tracker */}
              <ProgressTracker 
                courseSlug={slug}
                lessonSlugs={lessonSlugs}
                currentLessonSlug={lessonSlug}
              />

              {/* Lesson List */}
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
                <div className="space-y-2">
                  {courseLessons.map((l: { slug: string; metadata?: { title?: string; duration_minutes?: number }; title: string }, index: number) => (
                    <Link
                      key={l.slug}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-800 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm truncate">
                        {l.metadata?.title || l.title}
                      </span>
                      {l.metadata?.duration_minutes && (
                        <span className="text-xs text-navy-500">
                          {l.metadata.duration_minutes}m
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}