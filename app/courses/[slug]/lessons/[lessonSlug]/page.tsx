// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import LessonList from '@/components/LessonList'
import LessonCompleteButton from '@/components/LessonCompleteButton'

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
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
  const currentIndex = lessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="sticky top-16 z-40 bg-navy-950/90 backdrop-blur-lg border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link
              href={`/courses/${course.slug}`}
              className="text-navy-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {course.title}
            </Link>
            
            <div className="text-sm text-navy-400">
              Lesson {currentIndex + 1} of {lessons.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video */}
            {lesson.metadata?.video_url && (
              <VideoEmbed url={lesson.metadata.video_url} title={lesson.title} />
            )}

            {/* Lesson Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg">
                  {lesson.metadata.description}
                </p>
              )}
              {lesson.metadata?.duration_minutes && (
                <div className="mt-4 flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.metadata.duration_minutes} minutes
                </div>
              )}
            </div>

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-6 sm:p-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>💻</span> Code Example
                </h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Complete Button */}
            <div className="pt-4">
              <LessonCompleteButton 
                lessonTitle={lesson.metadata?.title || lesson.title}
                totalLessonsInCourse={lessons.length}
                currentLessonIndex={currentIndex}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
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
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Finish Course
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Course Content</h3>
                <LessonList
                  lessons={lessons}
                  courseSlug={course.slug}
                  currentLessonSlug={lessonSlug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}