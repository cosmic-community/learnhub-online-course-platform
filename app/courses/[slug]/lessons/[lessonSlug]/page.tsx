// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import ReactMarkdown from 'react-markdown'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
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
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <div className="border-b border-navy-800 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/courses/${slug}`}
              className="text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <p className="text-navy-400 text-sm">{course.metadata?.title}</p>
              <h1 className="text-xl font-bold text-white">{metadata?.title || lesson.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video Player Placeholder */}
            {metadata?.video_url && (
              <div className="aspect-video bg-navy-900 rounded-2xl flex items-center justify-center border border-navy-800">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-navy-400">Video Player</p>
                  <a
                    href={metadata.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                {metadata?.duration_minutes && (
                  <span className="badge bg-navy-800 text-navy-300">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} min
                  </span>
                )}
                <span className="badge bg-navy-800 text-navy-300">
                  Lesson {currentIndex + 1} of {lessons.length}
                </span>
              </div>

              {metadata?.description && (
                <p className="text-navy-300 text-lg mb-8">{metadata.description}</p>
              )}

              {metadata?.content && (
                <div className="prose max-w-none">
                  <ReactMarkdown>{metadata.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="card p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code Example
                </h2>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Complete Button */}
            <div className="card p-6">
              <LessonCompleteButton 
                lessonSlug={lessonSlug} 
                durationMinutes={metadata?.duration_minutes || 15} 
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="btn-primary"
                >
                  Next Lesson
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href={`/courses/${slug}`} className="btn-primary">
                  Complete Course
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Content</h3>
              <nav className="space-y-2">
                {lessons.map((l, index) => {
                  const isActive = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`block p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary-500/20 border border-primary-500/50 text-white'
                          : 'bg-navy-800/50 hover:bg-navy-800 text-navy-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isActive ? 'bg-primary-500 text-white' : 'bg-navy-700 text-navy-400'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {l.metadata?.title || l.title}
                          </p>
                          {l.metadata?.duration_minutes && (
                            <p className="text-xs text-navy-500 mt-0.5">
                              {l.metadata.duration_minutes} min
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}