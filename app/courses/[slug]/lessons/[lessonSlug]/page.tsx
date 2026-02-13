// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import VideoEmbed from '@/components/VideoEmbed'
import CodeBlock from '@/components/CodeBlock'
import LessonList from '@/components/LessonList'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
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

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  
  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const currentLessonIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const lesson = sortedLessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson: Lesson | undefined = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : undefined
  const nextLesson: Lesson | undefined = currentLessonIndex < sortedLessons.length - 1 ? sortedLessons[currentLessonIndex + 1] : undefined

  const { metadata } = lesson

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-navy-900/50 border-b border-navy-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-navy-400 mb-4">
            <Link href="/courses" className="hover:text-primary-400 transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="hover:text-primary-400 transition-colors">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-navy-300">{lesson.title}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary-400 text-sm font-medium">
                Lesson {currentLessonIndex + 1} of {sortedLessons.length}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {metadata?.title || lesson.title}
              </h1>
            </div>

            {metadata?.duration_minutes && (
              <span className="flex items-center gap-2 text-navy-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.duration_minutes} min
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Lesson Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Video */}
              {metadata?.video_url && (
                <div className="card overflow-hidden">
                  <VideoEmbed url={metadata.video_url} title={lesson.title} />
                </div>
              )}

              {/* Description */}
              {metadata?.description && (
                <div className="card p-6">
                  <p className="text-navy-300 text-lg">{metadata.description}</p>
                </div>
              )}

              {/* Content */}
              {metadata?.content && (
                <div className="card p-8">
                  <MarkdownContent content={metadata.content} />
                </div>
              )}

              {/* Code Example */}
              {metadata?.code_example && (
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                  <CodeBlock code={metadata.code_example} />
                </div>
              )}

              {/* Lesson Complete Button */}
              <LessonCompleteButton 
                lessonSlug={lesson.slug}
                courseSlug={course.slug}
                lessonTitle={metadata?.title || lesson.title}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-navy-800">
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                    className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
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
                    href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                    className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
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
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <div className="text-right">
                      <div className="text-xs text-navy-500">Complete</div>
                      <div className="font-medium">Back to Course</div>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Course Lessons</h3>
                <LessonList 
                  lessons={sortedLessons} 
                  courseSlug={course.slug} 
                  currentLessonSlug={lessonSlug} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}