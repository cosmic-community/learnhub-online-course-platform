// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug, calculateReadingTime } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonProgress from '@/components/LessonProgress'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface PageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)
  
  if (!lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - LearnHub`,
    description: lesson.metadata?.description || 'Learn with this comprehensive lesson',
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

  // Get lessons from course and find current index
  const lessons = (course.metadata?.lessons || []) as Lesson[]
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const previousLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const metadata = lesson.metadata
  const readingTime = calculateReadingTime(metadata?.content || '')

  return (
    <div className="min-h-screen">
      {/* Lesson Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors">
              {course.metadata?.title || course.title}
            </Link>
            <span>/</span>
            <span className="text-navy-300">{metadata?.title || lesson.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-navy-300 text-lg">{metadata.description}</p>
              )}
            </div>
            
            {/* Reading time and Progress button */}
            <div className="flex flex-col gap-3 items-start md:items-end">
              <div className="flex items-center gap-4 text-sm text-navy-400">
                {metadata?.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} min video
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {readingTime} min read
                </span>
              </div>
              <LessonProgress lessonSlug={lessonSlug} courseSlug={slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video */}
            {metadata?.video_url && (
              <div className="aspect-video bg-navy-900 rounded-xl overflow-hidden">
                <iframe
                  src={metadata.video_url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Markdown Content */}
            {metadata?.content && (
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(metadata.content) }} />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span>💻</span> Code Example
                </h3>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📖</span> Lessons
                </h3>
                <nav className="space-y-1">
                  {sortedLessons.map((l, index) => (
                    <Link
                      key={l.id}
                      href={`/courses/${course.slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-300'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm truncate">{l.metadata?.title || l.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-navy-800">
          {previousLesson ? (
            <Link
              href={`/courses/${course.slug}/lessons/${previousLesson.slug}`}
              className="btn-secondary"
            >
              ← {previousLesson.metadata?.title || previousLesson.title}
            </Link>
          ) : (
            <div />
          )}
          
          {nextLesson ? (
            <Link
              href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
              className="btn-primary"
            >
              {nextLesson.metadata?.title || nextLesson.title} →
            </Link>
          ) : (
            <Link href={`/courses/${course.slug}`} className="btn-primary">
              🎉 Complete Course
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple markdown parser
function parseMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n/gim, '<br>')
}