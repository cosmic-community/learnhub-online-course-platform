// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import type { Lesson } from '@/types'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
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
    getLessonBySlug(lessonSlug),
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

  const currentIndex = sortedLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
  const progress = Math.round(((currentIndex + 1) / sortedLessons.length) * 100)

  const { metadata } = lesson

  return (
    <div className="min-h-screen">
      {/* Progress Tracker Component */}
      <LessonProgressTracker 
        courseSlug={slug}
        courseTitle={course.title}
        lessonSlug={lessonSlug}
        lessonTitle={lesson.title}
        progress={progress}
        thumbnail={course.metadata?.thumbnail?.imgix_url}
      />
      
      {/* Breadcrumb & Progress */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav className="flex items-center gap-2 text-sm text-navy-400 overflow-x-auto">
              <Link href="/courses" className="hover:text-white whitespace-nowrap">
                Courses
              </Link>
              <span>/</span>
              <Link href={`/courses/${slug}`} className="hover:text-white whitespace-nowrap">
                {course.title}
              </Link>
              <span>/</span>
              <span className="text-white truncate">{lesson.title}</span>
            </nav>
            
            <div className="flex items-center gap-4">
              <span className="text-navy-400 text-sm whitespace-nowrap">
                Lesson {currentIndex + 1} of {sortedLessons.length}
              </span>
              <div className="w-32 h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-primary-400 font-medium">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-primary-500/20 text-primary-400">
              Lesson {currentIndex + 1}
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {metadata?.title || lesson.title}
          </h1>
          {metadata?.description && (
            <p className="text-navy-300 text-lg">{metadata.description}</p>
          )}
        </div>

        {/* Video */}
        {metadata?.video_url && (
          <div className="mb-8">
            <VideoEmbed url={metadata.video_url} title={lesson.title} />
          </div>
        )}

        {/* Content */}
        {metadata?.content && (
          <div className="mb-8">
            <MarkdownContent content={metadata.content} />
          </div>
        )}

        {/* Code Example */}
        {metadata?.code_example && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💻</span>
              Code Example
            </h2>
            <CodeBlock code={metadata.code_example} />
          </div>
        )}

        {/* Resources */}
        {metadata?.resources && metadata.resources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📎</span>
              Resources
            </h2>
            <div className="card p-4">
              <ul className="space-y-3">
                {metadata.resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-navy-300 hover:text-primary-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resource {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-navy-800">
          {prevLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${prevLesson.slug}`}
              className="btn-secondary group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Link>
          ) : (
            <div />
          )}
          
          {nextLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${nextLesson.slug}`}
              className="btn-primary group"
            >
              Next Lesson
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}`}
              className="btn-primary"
            >
              🎉 Complete Course
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}