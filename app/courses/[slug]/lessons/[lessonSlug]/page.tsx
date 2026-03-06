// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonSidebar from '@/components/LessonSidebar'
import LearningProgress from '@/components/LearningProgress'
import ReactMarkdown from 'react-markdown'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || '',
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

  const courseMetadata = course.metadata
  const lessonMetadata = lesson.metadata

  // Get all lessons from course for navigation
  const allLessons = (courseMetadata?.lessons || []) as Lesson[]
  const sortedLessons = [...allLessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  // Find current lesson index
  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  // Get lesson slugs for progress tracking
  const lessonSlugs = sortedLessons.map(l => l.slug)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          <span>/</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors">
            {courseMetadata?.title || course.title}
          </Link>
          <span>/</span>
          <span className="text-white">{lessonMetadata?.title || lesson.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 space-y-6">
              <LessonSidebar 
                courseSlug={course.slug} 
                lessons={sortedLessons} 
                currentLessonSlug={lessonSlug} 
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Lesson {currentIndex + 1} of {sortedLessons.length}
                </span>
                {lessonMetadata?.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lessonMetadata.duration_minutes} min
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {lessonMetadata?.title || lesson.title}
              </h1>

              {lessonMetadata?.description && (
                <p className="text-lg text-navy-300">{lessonMetadata.description}</p>
              )}
            </div>

            {/* Learning Progress with Complete Button */}
            <LearningProgress 
              courseSlug={course.slug} 
              lessonSlugs={lessonSlugs}
              currentLessonSlug={lessonSlug}
            />

            {/* Video Player Placeholder */}
            {lessonMetadata?.video_url && (
              <div className="mb-8 rounded-xl overflow-hidden bg-navy-900 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎬</div>
                  <p className="text-navy-400 mb-4">Video: {lessonMetadata.video_url}</p>
                  <a
                    href={lessonMetadata.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Video
                  </a>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lessonMetadata?.content && (
              <div className="prose mb-12">
                <ReactMarkdown>{lessonMetadata.content}</ReactMarkdown>
              </div>
            )}

            {/* Code Example */}
            {lessonMetadata?.code_example && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>💻</span>
                  Code Example
                </h2>
                <CodeBlock code={lessonMetadata.code_example} />
              </div>
            )}

            {/* Lesson Navigation */}
            <div className="border-t border-navy-800 pt-8 mt-8">
              <div className="flex items-center justify-between gap-4">
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                    className="flex items-center gap-3 text-navy-300 hover:text-white transition-colors group"
                  >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <div className="text-right">
                      <p className="text-sm text-navy-500">Previous</p>
                      <p className="font-medium">{prevLesson.metadata?.title || prevLesson.title}</p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                    className="flex items-center gap-3 text-navy-300 hover:text-white transition-colors group"
                  >
                    <div>
                      <p className="text-sm text-navy-500">Next</p>
                      <p className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</p>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-3 text-primary-400 hover:text-primary-300 transition-colors group"
                  >
                    <div>
                      <p className="text-sm text-navy-500">Finished!</p>
                      <p className="font-medium">Back to Course</p>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}