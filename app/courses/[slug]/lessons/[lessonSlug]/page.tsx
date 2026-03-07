// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonTracker from '@/components/LessonTracker'

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
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in this comprehensive lesson.`,
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
  const courseLessons = course.metadata?.lessons || []
  const currentLessonIndex = courseLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentLessonIndex > 0 ? courseLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < courseLessons.length - 1 ? courseLessons[currentLessonIndex + 1] : null

  return (
    <div className="py-8">
      {/* Lesson Tracker - tracks viewing this lesson */}
      <LessonTracker 
        courseSlug={slug} 
        lessonSlug={lessonSlug}
        lessonTitle={metadata?.title || lesson.title}
        durationMinutes={metadata?.duration_minutes}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/courses/${slug}`} className="hover:text-primary-400 transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="card p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                  {currentLessonIndex + 1}
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {metadata?.title || lesson.title}
                  </h1>
                  {metadata?.duration_minutes && (
                    <span className="text-sm text-navy-400">
                      {metadata.duration_minutes} min
                    </span>
                  )}
                </div>
              </div>
              
              {metadata?.description && (
                <p className="text-navy-300">{metadata.description}</p>
              )}
            </div>

            {/* Video */}
            {metadata?.video_url && (
              <div className="card p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Video Lesson</h2>
                <div className="aspect-video bg-navy-800 rounded-lg flex items-center justify-center">
                  <p className="text-navy-400">Video: {metadata.video_url}</p>
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
              <div className="card p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href={`/courses/${slug}`} className="btn-primary">
                  Complete Course
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {courseLessons.map((l, index) => {
                  const isCurrentLesson = l.slug === lessonSlug
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${slug}/lessons/${l.slug}`}
                      className={`block p-3 rounded-lg transition-colors ${
                        isCurrentLesson
                          ? 'bg-primary-500/20 border border-primary-500/30'
                          : 'hover:bg-navy-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCurrentLesson
                            ? 'bg-primary-500 text-white'
                            : 'bg-navy-700 text-navy-300'
                        }`}>
                          {index + 1}
                        </span>
                        <span className={`text-sm line-clamp-1 ${
                          isCurrentLesson ? 'text-white font-medium' : 'text-navy-300'
                        }`}>
                          {l.metadata?.title || l.title}
                        </span>
                      </div>
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