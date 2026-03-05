// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonProgress from '@/components/LessonProgress'
import type { Lesson } from '@/types'

// Helper to get difficulty value
function getDifficultyValue(difficulty: unknown): string {
  if (!difficulty) return 'beginner'
  if (typeof difficulty === 'string') return difficulty
  if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
    return String((difficulty as { value: unknown }).value)
  }
  return 'beginner'
}

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ slug: string; lessonSlug: string }> 
}) {
  const { slug, lessonSlug } = await params
  
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug)
  ])
  
  if (!course || !lesson) {
    notFound()
  }

  const { metadata } = lesson
  const courseLessons = course.metadata?.lessons || []
  
  // Sort lessons by order
  const sortedLessons = [...courseLessons].sort((a: Lesson, b: Lesson) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  // Find current lesson index and adjacent lessons
  const currentIndex = sortedLessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  // Parse markdown content
  const content = metadata?.content || ''
  
  // Simple markdown to HTML conversion
  const renderMarkdown = (md: string) => {
    // Convert headers
    let html = md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Convert bold and italic
    html = html
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Convert lists
    html = html.replace(/^\- (.+)$/gim, '<li>$1</li>')
    
    // Wrap consecutive li elements in ul
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    
    // Convert paragraphs (lines that aren't already wrapped)
    html = html.replace(/^(?!<[hulo]|```)(.*\S.*)$/gim, '<p>$1</p>')
    
    return html
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-navy-400">
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors">
              {course.metadata?.title || course.title}
            </Link>
            <span>/</span>
            <span className="text-white">{metadata?.title || lesson.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Course Content</h3>
              <div className="space-y-2">
                {sortedLessons.map((l: Lesson, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${course.slug}/lessons/${l.slug}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 border border-primary-500/30'
                        : 'hover:bg-navy-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        l.slug === lessonSlug
                          ? 'bg-primary-500 text-white'
                          : 'bg-navy-700 text-navy-300'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <div className={`text-sm font-medium ${
                          l.slug === lessonSlug ? 'text-white' : 'text-navy-300'
                        }`}>
                          {l.metadata?.title || l.title}
                        </div>
                        {l.metadata?.duration_minutes && (
                          <div className="text-xs text-navy-500 mt-1">
                            {l.metadata.duration_minutes} min
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge badge-beginner">
                  Lesson {currentIndex + 1}
                </span>
                {metadata?.duration_minutes && (
                  <span className="text-navy-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} minutes
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-lg text-navy-300">
                  {metadata.description}
                </p>
              )}
            </div>

            {/* Video Player Placeholder */}
            {metadata?.video_url && (
              <div className="card p-8 mb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-navy-400 mb-4">Video content available</p>
                <a 
                  href={metadata.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Watch Video
                </a>
              </div>
            )}

            {/* Lesson Content */}
            {content && (
              <div className="card p-8 mb-8">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Lesson Progress Tracker */}
            <LessonProgress 
              lessonId={lesson.id} 
              lessonTitle={metadata?.title || lesson.title}
              courseSlug={course.slug}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link 
                  href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="btn-primary flex items-center gap-2"
                >
                  Next Lesson
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link 
                  href={`/courses/${course.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  Complete Course
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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