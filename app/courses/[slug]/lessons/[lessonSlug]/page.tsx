// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '@/components/CodeBlock'
import LessonProgressTracker from '@/components/LessonProgressTracker'
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
  const lessonIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const lesson = lessons[lessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href={`/courses/${slug}`} className="text-navy-400 hover:text-primary-400 transition-colors">
                {course.metadata?.title || course.title}
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-navy-400 mb-2">
                <span>Lesson {lessonIndex + 1} of {lessons.length}</span>
                {lesson.metadata?.duration_minutes && (
                  <>
                    <span className="text-navy-600">•</span>
                    <span>{lesson.metadata.duration_minutes} min</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-xl text-navy-300">
                  {lesson.metadata.description}
                </p>
              )}
            </div>

            {/* Video Player Placeholder */}
            {lesson.metadata?.video_url && (
              <div className="aspect-video bg-navy-800 rounded-2xl mb-8 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🎬</span>
                  <p className="text-navy-400">Video Player</p>
                  <a 
                    href={lesson.metadata.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Open Video →
                  </a>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <div className="prose max-w-none">
                  <ReactMarkdown>{lesson.metadata.content}</ReactMarkdown>
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

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link 
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
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
                  className="group flex items-center gap-3 text-navy-400 hover:text-white transition-colors text-right"
                >
                  <div>
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link 
                  href={`/courses/${slug}`}
                  className="btn-primary"
                >
                  Complete Course 🎉
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Progress Tracker */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <LessonProgressTracker 
                courseSlug={slug}
                lessons={lessons}
                currentLessonSlug={lessonSlug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}