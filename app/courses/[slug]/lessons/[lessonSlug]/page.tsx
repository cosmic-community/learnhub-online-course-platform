// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
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

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
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
                Back to Course
              </Link>
              <span className="text-navy-600">|</span>
              <span className="text-navy-400">{course.metadata?.title || course.title}</span>
            </div>
            <div className="text-navy-400 text-sm">
              Lesson {currentIndex + 1} of {lessons.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Lesson Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {lesson.metadata?.title || lesson.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-navy-400">
            {lesson.metadata?.duration_minutes && (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lesson.metadata.duration_minutes} minutes
              </span>
            )}
            {lesson.metadata?.description && (
              <p className="text-navy-300">{lesson.metadata.description}</p>
            )}
          </div>
        </div>

        {/* Video (if available) */}
        {lesson.metadata?.video_url && (
          <div className="mb-8 aspect-video bg-navy-900 rounded-xl overflow-hidden">
            <iframe
              src={lesson.metadata.video_url.replace('watch?v=', 'embed/')}
              title={lesson.metadata?.title || lesson.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {/* Lesson Content */}
        {lesson.metadata?.content && (
          <div className="card p-8 mb-8">
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

        {/* Mark Complete Button */}
        <div className="flex items-center justify-between mb-8 p-4 bg-navy-900/50 rounded-xl border border-navy-800">
          <div>
            <p className="text-white font-medium">Finished this lesson?</p>
            <p className="text-navy-400 text-sm">Mark it complete to track your progress</p>
          </div>
          <LessonProgress 
            lessonSlug={lessonSlug} 
            durationMinutes={lesson.metadata?.duration_minutes || 0} 
          />
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
                <div className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</div>
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
                <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
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
              Complete Course 🎉
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}