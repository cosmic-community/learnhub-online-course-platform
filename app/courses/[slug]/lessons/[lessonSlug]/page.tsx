// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons ?? []
  const currentLessonIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const lesson = lessons[currentLessonIndex] as Lesson | undefined

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  const lessonMetadata = lesson.metadata

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/courses" className="hover:text-primary-400 transition-colors">
          Courses
        </Link>
        <span>/</span>
        <Link href={`/courses/${course.slug}`} className="hover:text-primary-400 transition-colors">
          {course.metadata?.title ?? course.title}
        </Link>
        <span>/</span>
        <span className="text-navy-200">{lessonMetadata?.title ?? lesson.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lesson Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="card p-4 sticky top-24">
            <h3 className="font-semibold text-white mb-4">Course Content</h3>
            <div className="space-y-2">
              {lessons.map((l: Lesson, index: number) => {
                const isActive = l.slug === lessonSlug
                const lessonTitle = l.metadata?.title ?? l.title
                return (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'hover:bg-navy-800 text-navy-300 hover:text-white'
                    }`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                      isActive ? 'bg-primary-500 text-white' : 'bg-navy-700 text-navy-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="truncate text-sm">{lessonTitle}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="card p-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge badge-beginner">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </span>
                {lessonMetadata?.duration_minutes && (
                  <span className="text-navy-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lessonMetadata.duration_minutes} min
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {lessonMetadata?.title ?? lesson.title}
              </h1>
              {lessonMetadata?.description && (
                <p className="text-navy-300 text-lg">{lessonMetadata.description}</p>
              )}
            </div>

            {/* Video Player */}
            {lessonMetadata?.video_url && (
              <div className="mb-8 aspect-video bg-navy-800 rounded-xl overflow-hidden">
                <iframe
                  src={getEmbedUrl(lessonMetadata.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}

            {/* Lesson Content */}
            {lessonMetadata?.content && (
              <div className="prose mb-8">
                <MarkdownContent content={lessonMetadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lessonMetadata?.code_example && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                <CodeBlock code={lessonMetadata.code_example} language="javascript" />
              </div>
            )}

            {/* Lesson Complete Button - NEW! */}
            <div className="mb-8">
              <LessonCompleteButton
                courseSlug={slug}
                courseTitle={course.metadata?.title ?? course.title}
                lessonSlug={lessonSlug}
                lessonTitle={lessonMetadata?.title ?? lesson.title}
                courseThumbnail={course.metadata?.thumbnail?.imgix_url}
                durationMinutes={lessonMetadata?.duration_minutes ?? 0}
                nextLessonSlug={nextLesson?.slug}
                nextLessonTitle={nextLesson?.metadata?.title ?? nextLesson?.title}
              />
            </div>

            {/* Lesson Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
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
                  Next Lesson
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Complete Course
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getEmbedUrl(url: string): string {
  // Convert YouTube URLs to embed format
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  // Convert Vimeo URLs to embed format
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    return `https://player.vimeo.com/video/${videoId}`
  }
  return url
}