// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import LessonProgress from '@/components/LessonProgress'
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
  
  if (!lesson) {
    return {
      title: 'Lesson Not Found - LearnHub',
    }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - LearnHub`,
    description: lesson.metadata?.description || 'Learn with this lesson',
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

  const courseLessons = (course.metadata?.lessons || []) as Lesson[]
  const currentLessonIndex = courseLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentLessonIndex > 0 ? courseLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < courseLessons.length - 1 ? courseLessons[currentLessonIndex + 1] : null

  const { metadata } = lesson
  const durationMinutes = metadata?.duration_minutes || 0

  return (
    <div className="min-h-screen">
      {/* Progress Tracker Component */}
      <LessonProgress 
        courseSlug={slug}
        courseTitle={course.title}
        lessonSlug={lessonSlug}
        totalLessons={courseLessons.length}
        currentLessonIndex={currentLessonIndex}
      />
      
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge bg-primary-500/20 text-primary-400">
                  Lesson {currentLessonIndex + 1} of {courseLessons.length}
                </span>
                {durationMinutes > 0 && (
                  <span className="text-navy-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {durationMinutes} min
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
            </div>

            {/* Video Player Placeholder */}
            {metadata?.video_url && (
              <div className="mb-8">
                <div className="aspect-video bg-navy-800 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary-600 transition-colors">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-navy-400">Video: {metadata.video_url}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Sidebar - Course Outline */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Course Outline</h3>
              <div className="space-y-2">
                {courseLessons.map((l, index) => {
                  const isActive = l.slug === lessonSlug
                  const isPast = index < currentLessonIndex
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary-500/20 text-primary-400' 
                          : 'hover:bg-navy-800 text-navy-300 hover:text-white'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        isActive 
                          ? 'bg-primary-500 text-white' 
                          : isPast
                            ? 'bg-green-500 text-white'
                            : 'bg-navy-700 text-navy-400'
                      }`}>
                        {isPast ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="truncate text-sm">{l.metadata?.title || l.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}