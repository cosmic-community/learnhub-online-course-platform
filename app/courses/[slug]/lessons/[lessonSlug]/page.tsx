// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import LessonSidebar from '@/components/LessonSidebar'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  const params: { slug: string; lessonSlug: string }[] = []

  for (const course of courses) {
    const lessons = course.metadata?.lessons || []
    for (const lesson of lessons) {
      params.push({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found' }
  }

  const lesson = course.metadata?.lessons?.find((l: Lesson) => l.slug === lessonSlug)
  
  if (!lesson) {
    return { title: 'Lesson Not Found' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.metadata?.title || lesson.title}`,
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const sortedLessons = [...lessons].sort((a: Lesson, b: Lesson) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentIndex = sortedLessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const lesson = sortedLessons[currentIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
  const totalLessons = sortedLessons.length

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <LessonSidebar course={course} currentLessonSlug={lessonSlug} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-navy-400 mb-3">
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
                <p className="text-lg text-navy-300">{lesson.metadata.description}</p>
              )}
            </div>

            {/* Video Placeholder */}
            {lesson.metadata?.video_url && (
              <div className="mb-8 aspect-video bg-navy-800 rounded-xl flex items-center justify-center border border-navy-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-navy-400">Video content coming soon</p>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <div className="prose max-w-none">
                  <MarkdownRenderer content={lesson.metadata.content} />
                </div>
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={lesson.metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Mark Complete Button */}
            <div className="mb-8">
              <LessonCompleteButton
                courseSlug={slug}
                courseName={course.metadata?.title || course.title}
                lessonSlug={lessonSlug}
                totalLessons={totalLessons}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
                >
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
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
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
                >
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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
          </main>
        </div>
      </div>
    </div>
  )
}