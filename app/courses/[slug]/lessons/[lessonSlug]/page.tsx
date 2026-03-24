// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import type { Lesson } from '@/types'
import CodeBlock from '@/components/CodeBlock'
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
    getLessonBySlug(lessonSlug)
  ])

  if (!course || !lesson) {
    notFound()
  }

  const { metadata } = lesson
  const courseLessons = course.metadata?.lessons as Lesson[] | undefined
  const sortedLessons = courseLessons
    ? [...courseLessons].sort((a, b) => (a.metadata?.order ?? 999) - (b.metadata?.order ?? 999))
    : []
  
  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm">
        <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
          Courses
        </Link>
        <span className="text-navy-600">/</span>
        <Link href={`/courses/${course.slug}`} className="text-navy-400 hover:text-primary-400 transition-colors">
          {course.metadata?.title ?? course.title}
        </Link>
        <span className="text-navy-600">/</span>
        <span className="text-white">{metadata?.title ?? lesson.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Lesson Header */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              {metadata?.order && (
                <span className="text-sm font-medium text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full">
                  Lesson {metadata.order}
                </span>
              )}
              {metadata?.duration_minutes && (
                <span className="text-sm text-navy-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata.duration_minutes} min
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {metadata?.title ?? lesson.title}
            </h1>
            {metadata?.description && (
              <p className="text-lg text-navy-300">{metadata.description}</p>
            )}
          </div>

          {/* Progress Tracker */}
          <LessonProgress 
            lessonSlug={lessonSlug} 
            lessonTitle={metadata?.title ?? lesson.title}
            durationMinutes={metadata?.duration_minutes}
          />

          {/* Video Player */}
          {metadata?.video_url && (
            <div className="aspect-video bg-navy-900 rounded-xl overflow-hidden">
              <iframe
                src={metadata.video_url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Lesson Content */}
          {metadata?.content && (
            <div className="card p-8">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: metadata.content
                    .replace(/^# /gm, '<h1>')
                    .replace(/^## /gm, '<h2>')
                    .replace(/^### /gm, '<h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^- /gm, '<li>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            </div>
          )}

          {/* Code Example */}
          {metadata?.code_example && (
            <div className="card p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">💻</span>
                Code Example
              </h2>
              <CodeBlock code={metadata.code_example} language="javascript" />
            </div>
          )}

          {/* Lesson Navigation */}
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
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
            <div className="space-y-2">
              {sortedLessons.map((l, index) => {
                const isActive = l.slug === lessonSlug
                return (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`block p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-500/20 border border-primary-500/50' 
                        : 'bg-navy-800/50 hover:bg-navy-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${
                        isActive ? 'bg-primary-500 text-white' : 'bg-navy-700 text-navy-300'
                      }`}>
                        {index + 1}
                      </span>
                      <span className={`text-sm ${isActive ? 'text-white' : 'text-navy-300'}`}>
                        {l.metadata?.title ?? l.title}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-navy-700">
              <Link 
                href={`/courses/${slug}`}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}