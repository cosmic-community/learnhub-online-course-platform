// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import LessonCheckbox from '@/components/LessonCheckbox'
import ProgressBar from '@/components/ProgressBar'
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
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in this comprehensive lesson`,
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

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const totalLessons = lessons.length

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
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
            <li className="text-navy-200">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="card p-4 mb-4">
                <h3 className="font-semibold text-white mb-3">Course Progress</h3>
                <ProgressBar courseId={course.id} size="md" />
              </div>
              
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-4">Lessons</h3>
                <nav className="space-y-2">
                  {lessons.map((l: Lesson, index: number) => {
                    const isActive = l.slug === lessonSlug
                    return (
                      <Link
                        key={l.id}
                        href={`/courses/${slug}/lessons/${l.slug}`}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isActive ? 'bg-primary-500 text-white' : 'bg-navy-700 text-navy-400'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-sm truncate">{l.metadata?.title || l.title}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-navy-400 text-sm mb-2">
                <span>Lesson {currentIndex + 1} of {totalLessons}</span>
                {lesson.metadata?.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{lesson.metadata.duration_minutes} min</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-lg text-navy-300">
                  {lesson.metadata.description}
                </p>
              )}
            </div>

            {/* Video Player */}
            {lesson.metadata?.video_url && (
              <div className="mb-8 rounded-2xl overflow-hidden bg-navy-900 aspect-video">
                <div className="w-full h-full flex items-center justify-center text-navy-400">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🎬</div>
                    <p>Video: {lesson.metadata.video_url}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownRenderer content={lesson.metadata.content} />
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
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Finished this lesson?
                  </h3>
                  <p className="text-sm text-navy-400">
                    Mark it complete to track your progress
                  </p>
                </div>
                <LessonCheckbox
                  courseId={course.id}
                  courseSlug={course.slug}
                  courseTitle={course.metadata?.title || course.title}
                  lessonId={lesson.id}
                  totalLessons={totalLessons}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="btn-primary flex items-center gap-2"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href={`/courses/${slug}`} className="btn-primary">
                  Back to Course
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}