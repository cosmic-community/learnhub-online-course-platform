// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  const course = await getCourseBySlug(slug)
  
  if (!lesson || !course) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} | LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in the ${course.title} course`,
  }
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
  
  // Find current lesson index and adjacent lessons
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-navy-900/80 backdrop-blur-md border-b border-navy-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
              <span className="text-navy-400 text-sm">
                Lesson {currentIndex + 1} of {lessons.length}
              </span>
            </div>
            
            {/* Lesson Navigation */}
            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                  title={`Previous: ${prevLesson.metadata?.title || prevLesson.title}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                  title={`Next: ${nextLesson.metadata?.title || nextLesson.title}`}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Lesson Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge bg-primary-500/20 text-primary-400">
              Lesson {currentIndex + 1}
            </span>
            {metadata?.duration_minutes && (
              <span className="badge bg-navy-700 text-navy-300">
                {metadata.duration_minutes} min
              </span>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {metadata?.title || lesson.title}
          </h1>
          
          {metadata?.description && (
            <p className="text-xl text-navy-300">
              {metadata.description}
            </p>
          )}
        </header>

        {/* Video Section */}
        {metadata?.video_url && (
          <div className="mb-12">
            <div className="aspect-video bg-navy-800 rounded-xl overflow-hidden">
              {metadata.video_url.includes('youtube.com') || metadata.video_url.includes('youtu.be') ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(metadata.video_url)}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={metadata.video_url}
                  controls
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        )}

        {/* Lesson Content */}
        {metadata?.content && (
          <div className="mb-12">
            <MarkdownContent content={metadata.content} />
          </div>
        )}

        {/* Code Example */}
        {metadata?.code_example && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Code Example</h2>
            <CodeBlock code={metadata.code_example} language="javascript" />
          </div>
        )}

        {/* Complete Button */}
        <div className="mb-12 py-8 border-t border-b border-navy-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Finished this lesson?</h3>
              <p className="text-navy-400 text-sm">Mark it complete to track your progress and earn your streak!</p>
            </div>
            <LessonCompleteButton 
              lessonId={lesson.id} 
              lessonSlug={lessonSlug}
              courseSlug={slug}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-navy-800">
          {prevLesson ? (
            <Link
              href={`/courses/${slug}/lessons/${prevLesson.slug}`}
              className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
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
              className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors text-right"
            >
              <div>
                <div className="text-xs text-navy-500">Next</div>
                <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
              </div>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}`}
              className="btn-primary"
            >
              Complete Course
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function getYouTubeId(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : ''
}