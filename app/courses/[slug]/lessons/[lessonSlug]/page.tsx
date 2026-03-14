// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { marked } from 'marked'
import CodeBlock from '@/components/CodeBlock'
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
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.metadata?.title || lesson.title}`,
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
  const courseLessons = (course.metadata?.lessons || []) as Lesson[]
  
  // Sort lessons by order
  const sortedLessons = [...courseLessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  // Parse markdown content
  const htmlContent = metadata?.content ? marked(metadata.content) : ''

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
          <Link href="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors">
            {course.metadata?.title || course.title}
          </Link>
          <span>/</span>
          <span className="text-white">{metadata?.title || lesson.title}</span>
        </nav>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {metadata?.order && (
              <span className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
                {metadata.order}
              </span>
            )}
            <h1 className="text-3xl font-bold text-white">
              {metadata?.title || lesson.title}
            </h1>
          </div>
          
          {metadata?.description && (
            <p className="text-xl text-navy-300">{metadata.description}</p>
          )}

          {metadata?.duration_minutes && (
            <div className="flex items-center gap-2 mt-4 text-navy-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{metadata.duration_minutes} minutes</span>
            </div>
          )}
        </div>

        {/* Video Player */}
        {metadata?.video_url && (
          <div className="mb-8">
            <div className="aspect-video bg-navy-800 rounded-xl overflow-hidden">
              {metadata.video_url.includes('youtube.com') || metadata.video_url.includes('youtu.be') ? (
                <iframe
                  src={metadata.video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video src={metadata.video_url} controls className="w-full h-full" />
              )}
            </div>
          </div>
        )}

        {/* Lesson Content */}
        {htmlContent && (
          <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}

        {/* Code Example */}
        {metadata?.code_example && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
            <CodeBlock code={metadata.code_example} language="javascript" />
          </div>
        )}

        {/* Complete Lesson Button */}
        <div className="mb-12">
          <LessonCompleteButton 
            durationMinutes={metadata?.duration_minutes || 15} 
            lessonTitle={metadata?.title || lesson.title}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-navy-800">
          {prevLesson ? (
            <Link
              href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
              className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <div className="text-sm">Previous</div>
                <div className="font-medium text-white">{prevLesson.metadata?.title || prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
              className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors text-right"
            >
              <div>
                <div className="text-sm">Next</div>
                <div className="font-medium text-white">{nextLesson.metadata?.title || nextLesson.title}</div>
              </div>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="btn-primary"
            >
              Back to Course
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}