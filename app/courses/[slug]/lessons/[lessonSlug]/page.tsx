// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses, getLessonBySlug } from '@/lib/cosmic'
import LessonList from '@/components/LessonList'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import CourseProgressTracker from '@/components/CourseProgressTracker'

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

  // Find current lesson
  const currentLessonIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const lesson = sortedLessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < sortedLessons.length - 1 ? sortedLessons[currentLessonIndex + 1] : null

  const { metadata } = lesson

  return (
    <div className="min-h-screen">
      {/* Progress Tracker (invisible, just tracks in localStorage) */}
      <CourseProgressTracker
        courseSlug={course.slug}
        courseTitle={course.title}
        courseThumbnail={course.metadata?.thumbnail?.imgix_url}
        lessonSlug={lesson.slug}
        lessonTitle={lesson.title}
      />

      {/* Header */}
      <div className="bg-navy-900 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400">
            <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-primary-400 transition-colors">Courses</Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="hover:text-primary-400 transition-colors">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-navy-300 truncate">{lesson.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video */}
            {metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={metadata.video_url} title={lesson.title} />
              </div>
            )}

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge bg-primary-500/20 text-primary-400">
                  Lesson {currentLessonIndex + 1} of {sortedLessons.length}
                </span>
                {metadata?.duration_minutes && (
                  <span className="flex items-center gap-1 text-sm text-navy-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} min
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{lesson.title}</h1>
              {metadata?.description && (
                <p className="text-lg text-navy-300">{metadata.description}</p>
              )}
            </div>

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="mb-8">
                <MarkdownContent content={metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-navy-500">Previous</div>
                    <div className="text-sm">{prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="text-sm">{nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary"
                >
                  Complete Course ✓
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">Course Content</h2>
              <LessonList 
                lessons={sortedLessons} 
                courseSlug={course.slug} 
                currentLessonSlug={lessonSlug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}