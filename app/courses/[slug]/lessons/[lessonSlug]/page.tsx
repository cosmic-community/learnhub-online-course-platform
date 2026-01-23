// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface PageProps {
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Lesson Not Found - LearnHub' }
  }
  
  const lessons = course.metadata?.lessons || []
  const lesson = lessons.find((l: Lesson) => l.slug === lessonSlug)
  
  if (!lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }
  
  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.title} - LearnHub`,
    description: lesson.metadata?.description || '',
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  const lessonIndex = sortedLessons.findIndex((l) => l.slug === lessonSlug)
  const lesson = sortedLessons[lessonIndex]
  
  if (!lesson) {
    notFound()
  }

  const prevLesson = lessonIndex > 0 ? sortedLessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < sortedLessons.length - 1 ? sortedLessons[lessonIndex + 1] : null

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link href="/" className="text-navy-400 hover:text-primary-400">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-primary-400">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href={`/courses/${course.slug}`} className="text-navy-400 hover:text-primary-400">
                {course.title}
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4 px-2">Course Lessons</h3>
              <nav className="space-y-1">
                {sortedLessons.map((l, index) => (
                  <Link
                    key={l.id}
                    href={`/courses/${course.slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="line-clamp-2">{l.metadata?.title || l.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="text-sm text-navy-400 mb-2">
                Lesson {lessonIndex + 1} of {sortedLessons.length}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-lg text-navy-300">{lesson.metadata.description}</p>
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

            {/* Video */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <VideoEmbed url={lesson.metadata.video_url} title={lesson.metadata?.title || lesson.title} />
              </div>
            )}

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <div className="prose max-w-none">
                  <MarkdownContent content={lesson.metadata.content} />
                </div>
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="card p-8 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={lesson.metadata.code_example} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary"
                >
                  Next Lesson
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link href={`/courses/${course.slug}`} className="btn-primary">
                  Back to Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}