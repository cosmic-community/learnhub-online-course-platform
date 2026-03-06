// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import MarkdownContent from '@/components/MarkdownContent'
import LessonTracker from '@/components/LessonTracker'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface PageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  const course = await getCourseBySlug(slug)
  
  if (!lesson || !course) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.title} in the ${course.title} course.`,
  }
}

export default async function LessonPage({ params }: PageProps) {
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
  const progress = lessons.length > 0 ? ((currentIndex + 1) / lessons.length) * 100 : 0

  return (
    <div className="py-8">
      {/* Track lesson view */}
      <LessonTracker lessonSlug={lessonSlug} />
      
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
            <li className="text-white">{lesson.metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-navy-400">Lesson {currentIndex + 1} of {lessons.length}</span>
                <span className="text-primary-400">{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
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
                  <span>{lesson.metadata.duration_minutes} minutes</span>
                </div>
              )}
            </div>

            {/* Video Embed */}
            {lesson.metadata?.video_url && (
              <div className="mb-8">
                <div className="aspect-video bg-navy-900 rounded-2xl overflow-hidden border border-navy-800">
                  <iframe
                    src={getEmbedUrl(lesson.metadata.video_url)}
                    title={lesson.metadata?.title || lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="card p-8 mb-8">
                <MarkdownContent content={lesson.metadata.content} />
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
                <CodeBlock 
                  code={lesson.metadata.code_example} 
                  language={detectLanguage(lesson.metadata.code_example)}
                />
              </div>
            )}

            {/* Lesson Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous: {prevLesson.metadata?.title || prevLesson.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-primary-400 transition-colors"
                >
                  <span>Next: {nextLesson.metadata?.title || nextLesson.title}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="btn-primary"
                >
                  🎉 Complete Course
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {lessons.map((l: Lesson, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'hover:bg-navy-800 text-navy-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < currentIndex
                        ? 'bg-green-500/20 text-green-400'
                        : l.slug === lessonSlug
                        ? 'bg-primary-500 text-white'
                        : 'bg-navy-700 text-navy-400'
                    }`}>
                      {index < currentIndex ? '✓' : index + 1}
                    </span>
                    <span className="text-sm truncate">{l.metadata?.title || l.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getEmbedUrl(url: string): string {
  // Convert YouTube URLs to embed format
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Convert Vimeo URLs to embed format
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return url
}

function detectLanguage(code: string): string {
  if (code.includes('import React') || code.includes('useState') || code.includes('useEffect')) {
    return 'jsx'
  }
  if (code.includes('interface ') || code.includes(': string') || code.includes(': number')) {
    return 'typescript'
  }
  if (code.includes('def ') || code.includes('import ') && code.includes(':')) {
    return 'python'
  }
  if (code.includes('<!DOCTYPE') || code.includes('<html')) {
    return 'html'
  }
  if (code.includes('SELECT ') || code.includes('FROM ')) {
    return 'sql'
  }
  if (code.includes('$ ') || code.includes('npm ') || code.includes('aws ')) {
    return 'bash'
  }
  return 'javascript'
}