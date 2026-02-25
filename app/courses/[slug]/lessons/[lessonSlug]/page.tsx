// app/courses/[slug]/lessons/[lessonSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import CodeBlock from '@/components/CodeBlock'
import LessonComplete from '@/components/LessonComplete'
import ProgressBar from '@/components/ProgressBar'
import type { Lesson } from '@/types'

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>
}

// Helper function to render markdown-like content
function renderContent(content: string) {
  // Split content into lines for processing
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let inCodeBlock = false
  let codeContent = ''
  let codeLanguage = ''

  const flushList = () => {
    if (currentList.length > 0) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul'
      elements.push(
        <ListTag key={elements.length} className={listType === 'ol' ? 'list-decimal' : 'list-disc'}>
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ListTag>
      )
      currentList = []
      listType = null
    }
  }

  lines.forEach((line, index) => {
    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushList()
        inCodeBlock = true
        codeLanguage = line.slice(3).trim() || 'text'
        codeContent = ''
      } else {
        inCodeBlock = false
        elements.push(
          <CodeBlock key={elements.length} code={codeContent.trim()} language={codeLanguage} />
        )
      }
      return
    }

    if (inCodeBlock) {
      codeContent += line + '\n'
      return
    }

    // Handle headers
    if (line.startsWith('# ')) {
      flushList()
      elements.push(<h1 key={index}>{line.slice(2)}</h1>)
      return
    }
    if (line.startsWith('## ')) {
      flushList()
      elements.push(<h2 key={index}>{line.slice(3)}</h2>)
      return
    }
    if (line.startsWith('### ')) {
      flushList()
      elements.push(<h3 key={index}>{line.slice(4)}</h3>)
      return
    }

    // Handle list items
    if (line.match(/^[-*]\s/)) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      currentList.push(line.slice(2))
      return
    }
    if (line.match(/^\d+\.\s/)) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      currentList.push(line.replace(/^\d+\.\s/, ''))
      return
    }

    // Handle empty lines
    if (line.trim() === '') {
      flushList()
      return
    }

    // Handle regular paragraphs
    flushList()
    // Process inline formatting
    let processedLine = line
    // Bold
    processedLine = processedLine.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    processedLine = processedLine.replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    processedLine = processedLine.replace(/`(.+?)`/g, '<code>$1</code>')
    
    elements.push(
      <p key={index} dangerouslySetInnerHTML={{ __html: processedLine }} />
    )
  })

  flushList()
  return elements
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const lessons = course.metadata?.lessons || []
  const currentLessonIndex = lessons.findIndex((l: Lesson) => l.slug === lessonSlug)
  const lesson = lessons[currentLessonIndex]

  if (!lesson) {
    notFound()
  }

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy-900/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/courses/${slug}`}
                className="text-navy-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <Link 
                  href={`/courses/${slug}`}
                  className="text-navy-400 hover:text-primary-400 transition-colors text-sm"
                >
                  {course.metadata?.title || course.title}
                </Link>
                <h1 className="text-white font-semibold">
                  {lesson.metadata?.title || lesson.title}
                </h1>
              </div>
            </div>
            <div className="text-navy-400 text-sm">
              Lesson {currentLessonIndex + 1} of {lessons.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <ProgressBar courseSlug={slug} totalLessons={lessons.length} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="card p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Course Content</h3>
              <div className="space-y-2">
                {lessons.map((l: Lesson, index: number) => (
                  <Link
                    key={l.id}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      l.slug === lessonSlug
                        ? 'bg-primary-500/20 text-primary-400 font-medium'
                        : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span className="text-navy-500 mr-2">{index + 1}.</span>
                    {l.metadata?.title || l.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Video placeholder */}
            {lesson.metadata?.video_url && (
              <div className="card aspect-video mb-8 flex items-center justify-center bg-navy-800">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-navy-400">Video content</p>
                  <a 
                    href={lesson.metadata.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    Watch on external player →
                  </a>
                </div>
              </div>
            )}

            {/* Lesson Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                {lesson.metadata?.title || lesson.title}
              </h1>
              {lesson.metadata?.description && (
                <p className="text-navy-300 text-lg">{lesson.metadata.description}</p>
              )}
              {lesson.metadata?.duration_minutes && (
                <div className="flex items-center gap-2 mt-4 text-navy-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{lesson.metadata.duration_minutes} min</span>
                </div>
              )}
            </div>

            {/* Lesson Content */}
            {lesson.metadata?.content && (
              <div className="prose mb-8">
                {renderContent(lesson.metadata.content)}
              </div>
            )}

            {/* Code Example */}
            {lesson.metadata?.code_example && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Code Example</h3>
                <CodeBlock code={lesson.metadata.code_example} language="javascript" />
              </div>
            )}

            {/* Mark Complete Button */}
            <div className="my-8">
              <LessonComplete courseSlug={slug} lessonSlug={lessonSlug} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-navy-800">
              {prevLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${prevLesson.slug}`}
                  className="btn-secondary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="btn-primary"
                >
                  Next Lesson
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </div>
      </div>
    </div>
  )
}