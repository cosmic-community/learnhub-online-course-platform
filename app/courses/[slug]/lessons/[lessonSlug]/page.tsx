// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getLessonBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LearningProgress from '@/components/LearningProgress'
import type { Lesson } from '@/types'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params
  const [course, lesson] = await Promise.all([
    getCourseBySlug(slug),
    getLessonBySlug(lessonSlug),
  ])

  if (!course || !lesson) {
    return { title: 'Lesson Not Found - LearnHub' }
  }

  return {
    title: `${lesson.metadata?.title || lesson.title} - ${course.metadata?.title || course.title} - LearnHub`,
    description: lesson.metadata?.description || `Learn ${lesson.metadata?.title || lesson.title} in this lesson`,
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

  const lessons = (course.metadata?.lessons as Lesson[]) || []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  const currentIndex = sortedLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const { metadata } = lesson

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeContent = ''
    let codeLanguage = ''

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim() || 'javascript'
          codeContent = ''
        } else {
          inCodeBlock = false
          elements.push(
            <CodeBlock key={`code-${index}`} code={codeContent.trim()} language={codeLanguage} />
          )
        }
        return
      }

      if (inCodeBlock) {
        codeContent += line + '\n'
        return
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{line.slice(4)}</h3>)
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-navy-200 ml-4 list-disc">{line.slice(2)}</li>
        )
      } else if (line.trim() === '') {
        elements.push(<br key={index} />)
      } else {
        // Handle inline formatting
        let formattedLine: React.ReactNode = line
        
        // Bold
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/g)
          formattedLine = parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
          )
        }
        
        elements.push(<p key={index} className="text-navy-200 mb-4">{formattedLine}</p>)
      }
    })

    return elements
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
            <li>/</li>
            <li><Link href={`/courses/${slug}`} className="hover:text-white">{course.metadata?.title || course.title}</Link></li>
            <li>/</li>
            <li className="text-white">{metadata?.title || lesson.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Content</h3>
              <nav className="space-y-1">
                {sortedLessons.map((l, index) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      l.slug === lessonSlug 
                        ? 'bg-primary-500/20 text-primary-400' 
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
                    <span className="flex-1 text-sm truncate">{l.metadata?.title || l.title}</span>
                    {l.metadata?.duration_minutes && (
                      <span className="text-xs text-navy-500">{l.metadata.duration_minutes}m</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            {/* Learning Progress */}
            <LearningProgress
              courseSlug={slug}
              lessonSlug={lessonSlug}
              totalLessons={sortedLessons.length}
              currentLessonIndex={currentIndex}
            />

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="badge bg-navy-700 text-navy-200">
                  Lesson {currentIndex + 1} of {sortedLessons.length}
                </span>
                {metadata?.duration_minutes && (
                  <span className="flex items-center gap-1 text-navy-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.duration_minutes} min
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {metadata?.title || lesson.title}
              </h1>
              {metadata?.description && (
                <p className="text-xl text-navy-300">{metadata.description}</p>
              )}
            </div>

            {/* Video */}
            {metadata?.video_url && (
              <div className="mb-8">
                <div className="card overflow-hidden">
                  <div className="aspect-video bg-navy-800 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-5xl mb-4">🎬</div>
                      <p className="text-navy-300 mb-4">Video content would be embedded here</p>
                      <a 
                        href={metadata.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            {metadata?.content && (
              <div className="card p-6 lg:p-8 mb-8">
                <div className="prose max-w-none">
                  {renderContent(metadata.content)}
                </div>
              </div>
            )}

            {/* Code Example */}
            {metadata?.code_example && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
                <CodeBlock code={metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors group"
                >
                  <div className="text-right">
                    <div className="text-xs text-navy-500">Next</div>
                    <div className="font-medium">{nextLesson.metadata?.title || nextLesson.title}</div>
                  </div>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </main>
        </div>
      </div>
    </div>
  )
}