// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
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
  
  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  
  const { metadata } = lesson

  return (
    <div className="min-h-screen">
      {/* Lesson Tracker - tracks progress automatically */}
      <LessonTracker 
        lessonSlug={lessonSlug} 
        lessonTitle={metadata?.title || lesson.title} 
      />

      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
              Courses
            </Link>
            <span className="text-navy-600">/</span>
            <Link href={`/courses/${slug}`} className="text-navy-400 hover:text-primary-400 transition-colors">
              {course.metadata?.title || course.title}
            </Link>
            <span className="text-navy-600">/</span>
            <span className="text-navy-300">{metadata?.title || lesson.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-8">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <nav className="space-y-1">
                {lessons.map((l, index) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary-500/20 text-primary-400' 
                          : 'text-navy-300 hover:text-white hover:bg-navy-800'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isActive 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-navy-700 text-navy-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm line-clamp-1">
                        {l.metadata?.title || l.title}
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge badge-beginner">
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-lg text-navy-300">{metadata.description}</p>
              )}
            </div>

            {/* Video Player */}
            {metadata?.video_url && (
              <div className="card mb-8 overflow-hidden">
                <div className="aspect-video bg-navy-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎬</div>
                    <p className="text-navy-400">Video Player</p>
                    <a 
                      href={metadata.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Watch on external platform →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-6 md:p-8 mb-8">
                <MarkdownRenderer content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>💻</span>
                  Code Example
                </h2>
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
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  🎉 Complete Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}