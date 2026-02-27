// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  const course = await getCourseBySlug(slug)
  
  if (!lesson || !course) {
    return { title: 'Lesson Not Found - LearnHub' }
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

  const lessons = course.metadata?.lessons || []
  const currentIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href={`/courses/${slug}`} className="text-navy-400 hover:text-white transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-white">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <nav className="space-y-2">
                {lessons.map((l: Lesson, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500 text-white'
                        : 'bg-navy-700 text-navy-300'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm line-clamp-1">{l.metadata?.title || l.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="card p-8">
              {/* Lesson Header */}
              <div className="mb-8 pb-8 border-b border-navy-800">
                <div className="flex items-center gap-2 text-sm text-navy-400 mb-4">
                  <span className="bg-navy-700 px-3 py-1 rounded-full">
                    Lesson {currentIndex + 1} of {lessons.length}
                  </span>
                  {lesson.metadata?.duration_minutes && (
                    <span>• {lesson.metadata.duration_minutes} min</span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  {lesson.metadata?.title || lesson.title}
                </h1>
                {lesson.metadata?.description && (
                  <p className="text-navy-300 text-lg">
                    {lesson.metadata.description}
                  </p>
                )}
              </div>

              {/* Video Embed */}
              {lesson.metadata?.video_url && (
                <div className="mb-8">
                  <div className="aspect-video bg-navy-800 rounded-xl overflow-hidden">
                    {lesson.metadata.video_url.includes('youtube') ? (
                      <iframe
                        src={lesson.metadata.video_url.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                        title={lesson.metadata?.title || lesson.title}
                      />
                    ) : (
                      <video
                        src={lesson.metadata.video_url}
                        controls
                        className="w-full h-full"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              {lesson.metadata?.content && (
                <div className="prose mb-8">
                  <MarkdownContent content={lesson.metadata.content} />
                </div>
              )}

              {/* Code Example */}
              {lesson.metadata?.code_example && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                  <CodeBlock code={lesson.metadata.code_example} />
                </div>
              )}

              {/* Mark Complete Button */}
              <div className="py-6 border-t border-navy-800">
                <div className="flex items-center justify-between">
                  <p className="text-navy-400 text-sm">
                    Track your progress by marking lessons complete
                  </p>
                  <LessonCompleteButton 
                    courseId={course.id}
                    lessonId={lesson.id}
                    lessonTitle={lesson.metadata?.title || lesson.title}
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-navy-800 mt-8">
                {prevLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                    className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-navy-500">Previous</div>
                      <div className="text-sm">{prevLesson.metadata?.title || prevLesson.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                    className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
                  >
                    <div className="text-right">
                      <div className="text-xs text-navy-500">Next</div>
                      <div className="text-sm">{nextLesson.metadata?.title || nextLesson.title}</div>
                    </div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </main>
        </div>
      </div>
    </div>
  )
}